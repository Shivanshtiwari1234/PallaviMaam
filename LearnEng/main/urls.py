# main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # Authentication & registration
    path("register/", views.register_view, name="register"),
    path("verify/", views.verify_email_view, name="verify_email"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    # Trial system
    path("trial/", views.trial_register_view, name="trial_register"),
    # Lessons
    path("lessons/", views.lessons_view, name="lessons"),
    path("manage-lessons/", views.manage_lessons, name="manage_lessons"),
]
