"""Compatibility layer for legacy imports.

Form classes were moved to the `accounts` and `lessons` apps.
"""

from accounts.forms import LoginForm, RegisterForm
from lessons.forms import LessonForm

__all__ = ["RegisterForm", "LoginForm", "LessonForm"]
