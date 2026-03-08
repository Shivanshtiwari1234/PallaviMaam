# AGENTS.md

## Purpose
This repository hosts a Django app (`LearnEng`) with a Node helper runtime for local tunnel and Socket.IO live updates.

## Tech Stack
- Python 3 + Django
- SQLite (default in development)
- Node.js for runtime helpers (`scripts/runserver.js`, `scripts/socket-server.js`)
- Socket.IO client/server for realtime lesson updates

## Repository Layout
- `LearnEng/` Django project root (`manage.py`, apps, templates, static)
- `LearnEng/core/` Core views and runtime context processor
- `LearnEng/accounts/` Authentication forms/views/routes
- `LearnEng/lessons/` Lesson CRUD/listing views/forms/routes
- `LearnEng/main/` Compatibility layer and shared templates/static assets
- `LearnEng/main/static/main/css/` Modular CSS files (`tokens`, `base`, `layout`, `components`, `pages`)
- `scripts/runserver.js` Starts Django + Socket.IO server + localtunnel
- `scripts/socket-server.js` Socket.IO relay server
- `scripts/flush.js` Runs `manage.py flush --noinput`
- `scripts/su.js` Runs `manage.py createsuperuser`

## Local Setup
1. Create/activate virtual environment (if needed).
2. Install Python dependencies:
   - `.\.venv\Scripts\python.exe -m pip install -r requirements.txt`
3. Install Node dependencies:
   - `npm install`

## Run Commands
- Django only:
  - `.\.venv\Scripts\python.exe LearnEng\manage.py runserver`
- Full local runtime (Django + Socket.IO + lt):
  - `node scripts/runserver.js`
- Flush development DB:
  - `node scripts/flush.js`
- Create superuser:
  - `node scripts/su.js`
- Django checks:
  - `.\.venv\Scripts\python.exe LearnEng\manage.py check`

## Environment Variables
- `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`
- `SOCKET_IO_URL` (Django template runtime config; default `http://127.0.0.1:5050`)
- `SOCKET_PORT` (Node Socket.IO server port; default `5050`)
- `PORT`, `HOST` (Django bind for `scripts/runserver.js`; defaults `8000`, `127.0.0.1`)
- `LT_SUBDOMAIN` (optional localtunnel subdomain)

## Realtime Design Notes
- Client script: `LearnEng/main/static/main/realtime.js`
- Socket server: `scripts/socket-server.js`
- `manage_lessons` stores the most recently created lesson in session and emits payload on page load.
- Lessons pages listen for `lesson:created` and prepend new items without reload.

## Frontend Conventions
- Avoid inline styles in templates; prefer reusable classes in modular CSS files.
- Keep motion subtle and performant.
- Respect reduced motion (`prefers-reduced-motion`).

## Backend Conventions
- Keep route handlers in app-specific modules (`core`, `accounts`, `lessons`).
- `main/views.py` is a compatibility import layer; avoid adding new logic there.
- Preserve existing URL names (`index`, `login`, `register`, `lessons`, `manage_lessons`) to avoid template regressions.

## Testing and Validation
Before committing:
1. Run `manage.py check`.
2. If frontend/runtime changed, run:
   - `node --check scripts/runserver.js`
   - `node --check scripts/socket-server.js`
3. Verify no accidental binary/cache artifacts are staged.

## Git Hygiene
- Do not commit `node_modules/` or `__pycache__/`.
- Avoid staging unrelated generated files (`*.pyc`, local DB noise) unless explicitly required.
- Keep commits focused and descriptive.
