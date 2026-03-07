from django.urls import path

from .views import lessons_view, manage_lessons

urlpatterns = [
    path("lessons/", lessons_view, name="lessons"),
    path("manage-lessons/", manage_lessons, name="manage_lessons"),
]
