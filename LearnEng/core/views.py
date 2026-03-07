from django.shortcuts import render
from django.http import JsonResponse


def index(request):
    return render(request, "main/index.html")


def health(request):
    return JsonResponse({"status": "ok"})
