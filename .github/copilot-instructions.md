## Quick context

This is a small Django app named `LearnEng` with a single app `main`. It's a classic monolithic Django project (sqlite DB, server-rendered templates, file uploads for lesson videos).

Key artifacts to inspect before changing behavior:
- `LearnEng/settings.py` — DB, STATIC and MEDIA settings, DEBUG=True in repo.
- `LearnEng/urls.py` — includes `main.urls` and serves `MEDIA_URL` in DEBUG.
- `main/models.py` — `Lesson` model (title, video, uploaded_by, created_at).
- `main/forms.py` — `RegisterForm` and `LessonForm` (widgets include Tailwind classes).
- `main/views.py` and `main/urls.py` — function-based views; authentication via `django.contrib.auth`.
- templates under `main/templates/main/` — use Tailwind CDN and CSS variables.

## Run & dev workflow (PowerShell on Windows)
- Activate project venv (provided in repo):
  - `& .\PallaviMaam\Scripts\Activate.ps1`
- Run migrations (sqlite DB is at project root `db.sqlite3`):
  - `python LearnEng\manage.py migrate`
- Create admin / test user:
  - `python LearnEng\manage.py createsuperuser`
- Run local dev server:
  - `python LearnEng\manage.py runserver`

Notes: STATICFILES_DIRS includes `BASE_DIR / 'static'` and templates are loaded from `BASE_DIR / 'templates'` plus app templates via `APP_DIRS=True`.

## Project-specific patterns & conventions for the agent
- Uses function-based views in `main/views.py` (not Class-Based Views). Implement new views following this style unless converting everything at once.
- Authentication: uses `login`, `logout`, `authenticate`, `login_required`, and `user_passes_test(is_admin)` for admin-only pages (see `manage_lessons`). Prefer these decorators when gating pages.
- Forms: forms use Tailwind-friendly widget attributes in `main/forms.py`. When adding fields, wire widget `attrs` to match existing classes to keep consistent UI.
- File uploads: `Lesson.video` is a `FileField` (uploads saved to `MEDIA_ROOT/videos/`). In templates use `lesson.video.url` to reference the uploaded file; `MEDIA_URL` is served in DEBUG by `LearnEng/urls.py`.

## Important gotchas & discovered inconsistencies (be cautious!)
- Template ↔ Model mismatch: `main/templates/main/lessons.html` references `lesson.description` and `lesson.video_url`, but `main/models.py` defines only `title`, `video`, `uploaded_by`, `created_at`. Either:
  - Update templates to use `{{ lesson.video.url }}` and remove/replace `lesson.description`; or
  - Add fields (`description`, `video_url` or a property) to the `Lesson` model and create migrations.
- Deletion flow missing: `manage_lessons.html` renders a form to POST a `lesson_id` for deletion, but `manage_lessons` view in `main/views.py` does not implement deletion handling. If you implement deletion, ensure CSRF + permission checks (only superuser) and redirect after POST.

## Typical changes an AI agent may be asked to make (how to implement safely)
- Add a model field: create migration, run `python LearnEng\manage.py makemigrations` and `migrate`. Confirm templates updated. Keep changes small and run tests.
- Fix template field usage: change `lesson.video_url` → `lesson.video.url` and `lesson.description` → `lesson.description|default:''` or add model field.
- Implement deletion endpoint in `main/views.py`: check `request.POST.get('lesson_id')`, verify `user.is_superuser`, call `lesson.delete()` and optionally remove file from disk (`lesson.video.delete()`), then redirect.

## Examples (concrete snippets to use)
- Reference uploaded video in template (preferred minimal change):

  Use: `{{ lesson.video.url }}` instead of `{{ lesson.video_url }}`.

- Safe deletion pattern in `main/views.py` (follow current view style):

  - Check POST for `lesson_id`, fetch Lesson, call `lesson.video.delete(save=False)` then `lesson.delete()`, then redirect to `'manage_lessons'`.

## Testing & verification
- Quick manual checks after edits:
  1. Run migrations if models changed: `python LearnEng\manage.py migrate`.
  2. Start dev server and visit `/manage-lessons/` as superuser to test upload and deletion flows.
  3. Ensure uploaded files appear under `media/videos/` and served when DEBUG=True.

## Notes for the agent about code style and UI
- Keep function-based views and simple redirects consistent with existing code.
- UI uses Tailwind via CDN and custom CSS variables in templates; when changing forms, preserve the widgets in `main/forms.py` or update templates accordingly.

If anything above is unclear or you want me to merge an existing instruction file into this, tell me what to prioritize (fix templates vs. extend model vs. implement deletion) and I will iterate.
