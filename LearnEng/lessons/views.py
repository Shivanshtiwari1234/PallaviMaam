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
        form.save()
        messages.success(request, "Lesson added successfully.")
        return redirect("manage_lessons")

    lessons = Lesson.objects.all()
    return render(request, "main/manage_lessons.html", {"form": form, "lessons": lessons})
