from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register/", views.register_view, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("lessons/", views.lessons_view, name="lessons"),
    path("manage-lessons/", views.manage_lessons, name="manage_lessons"),
]
