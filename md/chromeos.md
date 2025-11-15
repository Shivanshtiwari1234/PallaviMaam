# ChromeOS Installation Guide — LearnEng

---

## 1️⃣ Enable Linux (Beta)

ChromeOS Settings → Developers → **Turn On Linux**

---

## 2️⃣ Install Python Tools

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv git
```

---

## 3️⃣ Clone Repo

```bash
git clone https://github.com/Shivanshtiwari1234/PallaviMaam.git
cd PallaviMaam/LearnEng
```

---

## 4️⃣ Setup Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 5️⃣ Install Requirements

```bash
pip install -r requirements.txt
```

---

## 6️⃣ Run App

```bash
python manage.py migrate
python manage.py runserver
```

Access site at:
http://127.0.0.1:8000/
