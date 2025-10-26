# main/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import RegisterForm, LessonForm
from .models import Lesson


# Home page
def index(request):
    return render(request, 'main/index.html')


# Registration
def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            login(request, user)
            return redirect('lessons')
    else:
        form = RegisterForm()
    return render(request, 'main/register.html', {'form': form})


# Login
def login_view(request):
    error = False
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('lessons')
        else:
            error = True
    return render(request, 'main/login.html', {'error': error})


# Logout
def logout_view(request):
    logout(request)
    return redirect('index')


# Lessons (for logged-in users)
@login_required
def lessons_view(request):
    lessons = Lesson.objects.all()
    return render(request, 'main/lessons.html', {'lessons': lessons})


# Check if user is admin
def is_admin(user):
    return user.is_superuser


# Manage lessons (admin only)
@user_passes_test(is_admin)
def manage_lessons(request):
    if request.method == 'POST':
        form = LessonForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
    else:
        form = LessonForm()
    lessons = Lesson.objects.all()
    return render(request, 'main/manage_lessons.html', {'form': form, 'lessons': lessons})
