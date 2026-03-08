from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import redirect, render

from main.models import Lesson

from .forms import LessonForm


@login_required
def lessons_view(request):
    lessons = Lesson.objects.all()
    return render(request, "main/lessons.html", {"lessons": lessons})


def is_admin(user):
    return user.is_staff


@login_required
@user_passes_test(is_admin)
def manage_lessons(request):
    form = LessonForm(request.POST or None, request.FILES or None)
    if request.method == "POST" and form.is_valid():
        lesson = form.save()
        request.session["latest_lesson_id"] = lesson.id
        messages.success(request, "Lesson added successfully.")
        return redirect("manage_lessons")

    latest_lesson_payload = None
    latest_lesson_id = request.session.pop("latest_lesson_id", None)
    if latest_lesson_id:
        latest_lesson = Lesson.objects.filter(id=latest_lesson_id).first()
        if latest_lesson:
            latest_lesson_payload = {
                "id": latest_lesson.id,
                "title": latest_lesson.title,
                "description": latest_lesson.description,
                "video_url": latest_lesson.video.url if latest_lesson.video else "",
            }

    lessons = Lesson.objects.all()
    return render(
        request,
        "main/manage_lessons.html",
        {"form": form, "lessons": lessons, "latest_lesson_payload": latest_lesson_payload},
    )
