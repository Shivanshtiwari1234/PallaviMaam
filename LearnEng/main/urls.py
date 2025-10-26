# main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Home page
    path('register/', views.register_view, name='register'),  # Registration
    path('login/', views.login_view, name='login'),  # Login
    path('logout/', views.logout_view, name='logout'),  # Logout
    path('lessons/', views.lessons_view, name='lessons'),  # Lessons page (login required)
    path('manage-lessons/', views.manage_lessons, name='manage_lessons'),  # Admin only
]
