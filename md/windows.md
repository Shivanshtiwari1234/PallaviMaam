# Windows Installation Guide — LearnEng

---

## 1️⃣ Install Python

Download from:
https://www.python.org/downloads/windows/

✔ Check **Add Python to PATH**

---

## 2️⃣ Clone the Repository

```bash
git clone https://github.com/Shivanshtiwari1234/PallaviMaam.git
cd PallaviMaam/LearnEng
```

---

## 3️⃣ Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

---

## 4️⃣ Install Requirements

```bash
pip install -r requirements.txt
```

---

## 5️⃣ Apply Migrations

```bash
python manage.py migrate
```

---

## 6️⃣ Run Server

```bash
python manage.py runserver
```

Open in browser:
http://127.0.0.1:8000/
