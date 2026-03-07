from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from main.models import Lesson


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
