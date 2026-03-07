# LearnEng - Django-Based English Learning Platform

LearnEng (PallaviMaam Project) is a beginner-friendly Django web application designed to help users learn English through structured lessons and simple practice modules.

## Features

- Clean Django structure
- Cross-platform support (Windows, macOS, Linux, ChromeOS)
- Beginner-friendly
- Easy to expand with new lessons and modules
- Developer-oriented architecture

## OS Installation Guides

- **[Windows Guide](./md/windows.md)**
- **[macOS Guide](./md/macos.md)**
- **[Linux Guide](./md/linux.md)**
- **[ChromeOS Guide](./md/chromeos.md)**

## Developer Documentation

- **[Developer Section](./dev/developersection.md)**

## Basic Commands

```bash
python manage.py runserver
python manage.py migrate
python manage.py makemigrations
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Application URL:

```text
http://localhost:8000
```

Health endpoint:

```text
http://localhost:8000/health/
```

## Production Notes

- `DEBUG` must be `False`.
- `SECRET_KEY` must be set in `.env`.
- Set real values for `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`.
- The container runs `collectstatic` and `migrate` at startup.
- Default `docker-compose.yml` includes PostgreSQL and a web health check.

## Contributing

Feel free to open issues and submit PRs.

## License

MIT License
