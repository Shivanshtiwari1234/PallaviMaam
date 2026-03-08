from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import redirect, render

from .forms import LessonForm
from .services import create_lesson, latest_lesson_payload_from_session, list_lessons


@login_required
def lessons_view(request):
    lessons = list_lessons()
    return render(request, "main/lessons.html", {"lessons": lessons})


def is_admin(user):
    return user.is_staff


@login_required
@user_passes_test(is_admin)
def manage_lessons(request):
    form = LessonForm(request.POST or None, request.FILES or None)
    if request.method == "POST" and form.is_valid():
        lesson = create_lesson(form)
        request.session["latest_lesson_id"] = lesson.id
        messages.success(request, "Lesson added successfully.")
        return redirect("manage_lessons")

    latest_lesson_payload = None
    latest_lesson_signature = None
    latest_from_session = latest_lesson_payload_from_session(request.session)
    if latest_from_session:
        latest_lesson_payload, latest_lesson_signature = latest_from_session
    lessons = list_lessons()
    return render(
        request,
        "main/manage_lessons.html",
        {
            "form": form,
            "lessons": lessons,
            "latest_lesson_payload": latest_lesson_payload,
            "latest_lesson_signature": latest_lesson_signature,
        },
    )
