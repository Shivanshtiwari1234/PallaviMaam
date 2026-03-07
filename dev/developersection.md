# Developer Documentation - LearnEng

## Development Setup

```bash
git clone https://github.com/Shivanshtiwari1234/PallaviMaam.git
cd PallaviMaam/LearnEng
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
```

## Branching Strategy

```
main            # stable
dev             # development
feature/...     # new features
fix/...         # bug fixes
docs/...        # documentation
```

## Coding Conventions

- PEP8
- black and isort
- class-based views preferred
- templates in `/templates/app/`
- static files in `/static/app/`

## Running Tests

```bash
python manage.py test
```

## Adding Dependencies

```bash
pip install package
pip freeze > requirements.txt
```

## Maintainer

**Shivansh Tiwari**
GitHub: https://github.com/Shivanshtiwari1234
