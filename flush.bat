@echo off

.venv\Scripts\activate

cd LearnEng
python manage.py flush --noinput

deactivate
