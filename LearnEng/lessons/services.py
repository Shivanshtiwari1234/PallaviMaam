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


def latest_lesson_payload_from_session(session):
    latest_lesson_id = session.pop("latest_lesson_id", None)
    if not latest_lesson_id:
        return None

    latest_lesson = Lesson.objects.filter(id=latest_lesson_id).first()
    if not latest_lesson:
        return None

    return lesson_payload(latest_lesson)

