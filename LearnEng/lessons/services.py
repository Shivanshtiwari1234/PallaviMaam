import hashlib
import hmac
import json
import os

from main.models import Lesson


def list_lessons():
    return Lesson.objects.all()


def create_lesson(form):
    return form.save()


def lesson_payload(lesson):
    return {
        "id": lesson.id,
        "title": lesson.title,
        "description": lesson.description,
        "video_url": lesson.video.url if lesson.video else "",
    }


def sign_lesson_payload(payload):
    secret = os.getenv("SOCKET_EVENT_SECRET") or os.getenv("SECRET_KEY")
    if not secret:
        return None

    canonical_payload = json.dumps(payload, separators=(",", ":"))
    return hmac.new(secret.encode("utf-8"), canonical_payload.encode("utf-8"), hashlib.sha256).hexdigest()


def latest_lesson_payload_from_session(session):
    latest_lesson_id = session.pop("latest_lesson_id", None)
    if not latest_lesson_id:
        return None

    latest_lesson = Lesson.objects.filter(id=latest_lesson_id).first()
    if not latest_lesson:
        return None

    payload = lesson_payload(latest_lesson)
    return payload, sign_lesson_payload(payload)
