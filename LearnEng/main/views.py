"""Compatibility layer for legacy imports.

Route handlers were moved to the `core`, `accounts`, and `lessons` apps.
"""

from accounts.views import login_view, logout_view, register_view
from core.views import index
from lessons.views import lessons_view, manage_lessons

__all__ = [
    "index",
    "register_view",
    "login_view",
    "logout_view",
    "lessons_view",
    "manage_lessons",
]
