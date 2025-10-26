# main/forms.py
from django import forms
from django.contrib.auth.models import User
from .models import Lesson

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'w-full p-2 rounded border'}))
    password_confirm = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'w-full p-2 rounded border'}))

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'w-full p-2 rounded border'}),
            'email': forms.EmailInput(attrs={'class': 'w-full p-2 rounded border'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm")
        if password != password_confirm:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data

class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ['title', 'description', 'video']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'w-full p-2 rounded border'}),
            'description': forms.Textarea(attrs={'class': 'w-full p-2 rounded border'}),
            'video': forms.FileInput(attrs={'class': 'w-full p-2 rounded border'}),
        }
