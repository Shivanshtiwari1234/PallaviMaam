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
