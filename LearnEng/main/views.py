from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import redirect, render

from .forms import LessonForm, LoginForm, RegisterForm
from .models import Lesson


def index(request):
    return render(request, "main/index.html")


def register_view(request):
    if request.user.is_authenticated:
        return redirect("lessons")

    form = RegisterForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)
        return redirect("lessons")

    return render(request, "main/register.html", {"form": form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect("lessons")

    form = LoginForm(request, data=request.POST or None)
    if request.method == "POST" and form.is_valid():
        login(request, form.get_user())
        return redirect("lessons")

    return render(request, "main/login.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("index")


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
