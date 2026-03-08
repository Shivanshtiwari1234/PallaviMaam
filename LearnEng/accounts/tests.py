from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse


class TestAuthFlow(TestCase):
    def test_register_creates_user_and_logs_in(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "alice",
                "email": "alice@example.com",
                "password1": "StrongPass123",
                "password2": "StrongPass123",
            },
        )

        self.assertRedirects(response, reverse("lessons"))
        self.assertTrue(User.objects.filter(username="alice").exists())

    def test_login_rejects_invalid_credentials(self):
        response = self.client.post(
            reverse("login"),
            {"username": "missing", "password": "wrong"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Please enter a correct username and password")

    def test_register_with_mismatched_passwords_shows_error(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "alice2",
                "email": "alice2@example.com",
                "password1": "StrongPass123",
                "password2": "StrongPass124",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(username="alice2").exists())
        form = response.context["form"]
        self.assertIn("password2", form.errors)

    def test_authenticated_user_redirected_from_login_and_register(self):
        user = User.objects.create_user(
            username="bob",
            email="bob@example.com",
            password="StrongPass123",
        )
        self.client.force_login(user)

        login_response = self.client.get(reverse("login"))
        register_response = self.client.get(reverse("register"))

        self.assertRedirects(login_response, reverse("lessons"))
        self.assertRedirects(register_response, reverse("lessons"))

    def test_logout_post_redirects_to_index(self):
        user = User.objects.create_user(
            username="charlie",
            email="charlie@example.com",
            password="StrongPass123",
        )
        self.client.force_login(user)

        response = self.client.post(reverse("logout"))
        self.assertRedirects(response, reverse("index"))

    def test_logout_get_is_not_allowed(self):
        user = User.objects.create_user(
            username="delta",
            email="delta@example.com",
            password="StrongPass123",
        )
        self.client.force_login(user)

        response = self.client.get(reverse("logout"))
        self.assertEqual(response.status_code, 405)
