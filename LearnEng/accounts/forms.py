from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User

from common.forms import StyledFieldsMixin


class RegisterForm(StyledFieldsMixin, UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "password1", "password2")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs.update(
            {"autocomplete": "username", "autocapitalize": "none", "spellcheck": "false"}
        )
        self.fields["email"].widget.attrs.update(
            {"autocomplete": "email", "inputmode": "email", "autocapitalize": "none"}
        )
        self.fields["password1"].widget.attrs.update({"autocomplete": "new-password"})
        self.fields["password2"].widget.attrs.update({"autocomplete": "new-password"})
        self._apply_widget_classes()


class LoginForm(StyledFieldsMixin, AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs.update(
            {"autocomplete": "username", "autocapitalize": "none", "spellcheck": "false"}
        )
        self.fields["password"].widget.attrs.update({"autocomplete": "current-password"})
        self._apply_widget_classes()
