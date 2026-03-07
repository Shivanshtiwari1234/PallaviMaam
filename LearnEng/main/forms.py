from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User

from .models import Lesson


class StyledFieldsMixin:
    default_widget_class = "w-full p-2 rounded border"

    def _apply_widget_classes(self):
        for field in self.fields.values():
            css = field.widget.attrs.get("class", "")
            field.widget.attrs["class"] = f"{css} {self.default_widget_class}".strip()


class RegisterForm(StyledFieldsMixin, UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "password1", "password2")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._apply_widget_classes()


class LoginForm(StyledFieldsMixin, AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._apply_widget_classes()


class LessonForm(StyledFieldsMixin, forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ["title", "description", "video"]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}),
            "video": forms.FileInput(attrs={"accept": "video/*"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._apply_widget_classes()
