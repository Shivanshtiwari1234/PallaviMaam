from django import forms
from django.contrib.auth.models import User
from .models import Lesson, TrialUser
from django.utils import timezone


# =============================
# 🧍 USER REGISTRATION FORM
# =============================
class RegisterForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Enter your password"}),
        label="Password",
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Confirm password"}),
        label="Confirm Password",
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def clean_email(self):
        email = self.cleaned_data.get("email").lower()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("An account with this email already exists.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data


# =============================
# 🎥 LESSON FORM
# =============================
class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ["title", "video"]
        widgets = {
            "title": forms.TextInput(
                attrs={"placeholder": "Lesson title", "class": "form-control"}
            ),
        }


# =============================
# 🧪 TRIAL REGISTRATION FORM
# =============================
class TrialRegisterForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Create a password"}),
        label="Password",
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()

            # Create TrialUser record (7 days trial)
            TrialUser.objects.create(
                user=user,
                email=user.email,
                expiry_date=timezone.now() + timezone.timedelta(days=7),
            )
        return user
