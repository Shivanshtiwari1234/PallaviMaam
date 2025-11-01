import random
import string
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.mail import EmailMessage
from django.conf import settings
from django.db import models
from django.utils.crypto import get_random_string
from django.contrib.auth.decorators import login_required

# --- Custom Model for verification ---
from .models import EmailVerification, TrialUser


# --- Helper ---
def send_verification_email(user, email_code):
    """Send a verification code email."""
    subject = "Verify your Learn English account"
    message = (
        f"Hi {user.username},\n\n"
        f"Your verification code is: {email_code}\n\n"
        "Please enter this code on the verification page to activate your account.\n\n"
        "If you did not request this, please ignore this email."
    )
    email = EmailMessage(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
    email.send(fail_silently=True)


# ============================================================
# Registration View
# ============================================================


def register(request):
    if request.method == "POST":
        username = request.POST["username"].strip()
        email = request.POST["email"].strip()
        password1 = request.POST["password1"]
        password2 = request.POST["password2"]

        if password1 != password2:
            messages.error(request, "Passwords do not match.")
            return redirect("register")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect("register")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered.")
            return redirect("register")

        user = User.objects.create_user(
            username=username, email=email, password=password1
        )
        user.is_active = False  # Require verification
        user.save()

        # Create verification code
        code = get_random_string(length=6, allowed_chars=string.digits)
        EmailVerification.objects.create(
            user=user, code=code, expires_at=timezone.now() + timedelta(minutes=10)
        )

        send_verification_email(user, code)
        request.session["pending_user_id"] = user.id

        return redirect("verify_email")

    return render(request, "main/register.html")


# ============================================================
# Email Verification View
# ============================================================


def verify_email(request):
    user_id = request.session.get("pending_user_id")
    if not user_id:
        messages.error(request, "Session expired. Please register again.")
        return redirect("register")

    user = User.objects.get(id=user_id)
    email_obj = EmailVerification.objects.filter(user=user).last()

    if request.method == "POST":
        code_entered = request.POST["code"].strip()

        if (
            email_obj
            and email_obj.code == code_entered
            and email_obj.expires_at > timezone.now()
        ):
            user.is_active = True
            user.save()
            email_obj.delete()
            del request.session["pending_user_id"]
            messages.success(
                request, "Email verified successfully. You can now log in."
            )
            return redirect("login")
        else:
            messages.error(request, "Invalid or expired verification code.")

    return render(request, "main/verify_email.html", {"email": user.email})


# ============================================================
# Login View
# ============================================================


def login_user(request):
    if request.method == "POST":
        username = request.POST["username"].strip()
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if not user.is_active:
                messages.warning(request, "Please verify your email before logging in.")
                return redirect("login")
            login(request, user)
            return redirect("dashboard")
        else:
            messages.error(request, "Invalid credentials.")
            return redirect("login")

    return render(request, "main/login.html")


# ============================================================
# Trial Registration (No Verification)
# ============================================================


def trial_register(request):
    if request.method == "POST":
        username = request.POST["username"].strip()
        email = request.POST["email"].strip()
        password = request.POST["password"]

        # Check if user had a trial recently
        recent_trial = (
            TrialUser.objects.filter(email=email).order_by("-created_at").first()
        )
        if recent_trial and timezone.now() - recent_trial.created_at < timedelta(
            days=30
        ):
            messages.warning(request, "You can only use a trial once every month.")
            return redirect("trial")

        user = User.objects.create_user(
            username=username, email=email, password=password
        )
        user.is_active = True
        user.save()

        # Mark trial expiry
        TrialUser.objects.create(
            user=user, email=email, expires_at=timezone.now() + timedelta(days=7)
        )

        login(request, user)
        messages.success(request, "Trial account activated! Valid for 7 days.")
        return redirect("dashboard")

    return render(request, "main/trial_register.html")


# ============================================================
# Dashboard (Protected)
# ============================================================


@login_required
def dashboard(request):
    # Auto-expire trial accounts
    trial = TrialUser.objects.filter(user=request.user).first()
    if trial and trial.expires_at < timezone.now():
        user = request.user
        logout(request)
        user.delete()
        messages.error(
            request, "Your trial has expired. Please register for a full account."
        )
        return redirect("register")

    return render(request, "main/dashboard.html")
