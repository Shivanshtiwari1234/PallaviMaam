from django.conf import settings


def runtime_config(request):
    return {
        "SOCKET_IO_URL": settings.SOCKET_IO_URL,
    }

