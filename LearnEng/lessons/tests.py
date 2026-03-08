from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from main.models import Lesson
from lessons.services import latest_lesson_payload_from_session, sign_lesson_payload


class TestLessonAccess(TestCase):
    def test_lessons_requires_login(self):
        response = self.client.get(reverse("lessons"))
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("login"), response.url)


class TestLessonManagement(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="StrongPass123",
            is_staff=True,
        )
        self.user = User.objects.create_user(
            username="student",
            email="student@example.com",
            password="StrongPass123",
        )

    def test_manage_lessons_denies_non_admin(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse("manage_lessons"))
        self.assertEqual(response.status_code, 302)

    def test_admin_can_create_lesson(self):
        self.client.force_login(self.admin)
        video = SimpleUploadedFile(
            "intro.mp4",
            b"fake-video-content",
            content_type="video/mp4",
        )

        response = self.client.post(
            reverse("manage_lessons"),
            {
                "title": "Intro",
                "description": "Welcome lesson",
                "video": video,
            },
        )

        self.assertRedirects(response, reverse("manage_lessons"))
        self.assertTrue(Lesson.objects.filter(title="Intro").exists())

    def test_lessons_page_renders_existing_lesson(self):
        self.client.force_login(self.user)
        Lesson.objects.create(
            title="Grammar Basics",
            description="Nouns and verbs",
            video=SimpleUploadedFile("grammar.mp4", b"x", content_type="video/mp4"),
        )

        response = self.client.get(reverse("lessons"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Grammar Basics")

    def test_manage_lessons_includes_signed_latest_payload_after_create(self):
        self.client.force_login(self.admin)
        video = SimpleUploadedFile("intro.mp4", b"x", content_type="video/mp4")

        self.client.post(
            reverse("manage_lessons"),
            {"title": "Intro", "description": "Welcome lesson", "video": video},
        )
        response = self.client.get(reverse("manage_lessons"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "latest-lesson-payload")
        self.assertContains(response, "latest-lesson-signature")


class TestLessonServices(TestCase):
    def test_sign_lesson_payload_returns_stable_signature(self):
        payload = {
            "id": 1,
            "title": "Intro",
            "description": "Welcome",
            "video_url": "/media/videos/intro.mp4",
        }

        signature_one = sign_lesson_payload(payload)
        signature_two = sign_lesson_payload(payload)

        self.assertIsNotNone(signature_one)
        self.assertEqual(signature_one, signature_two)
        self.assertEqual(len(signature_one), 64)

    def test_latest_lesson_payload_from_session_returns_payload_and_signature(self):
        lesson = Lesson.objects.create(
            title="Grammar Basics",
            description="Nouns and verbs",
            video=SimpleUploadedFile("grammar.mp4", b"x", content_type="video/mp4"),
        )
        session = self.client.session
        session["latest_lesson_id"] = lesson.id
        session.save()

        result = latest_lesson_payload_from_session(session)

        self.assertIsNotNone(result)
        payload, signature = result
        self.assertEqual(payload["id"], lesson.id)
        self.assertEqual(payload["title"], "Grammar Basics")
        self.assertTrue(signature)
        self.assertNotIn("latest_lesson_id", session)
