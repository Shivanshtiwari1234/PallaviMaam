# macOS Installation Guide — LearnEng

---

## 1️⃣ Install Python (via Homebrew)

```bash
brew install python
```

---

## 2️⃣ Clone Repo

```bash
git clone https://github.com/Shivanshtiwari1234/PallaviMaam.git
cd PallaviMaam/LearnEng
```

---

## 3️⃣ Setup Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 4️⃣ Install Requirements

```bash
pip install -r requirements.txt
```

---

## 5️⃣ Migrate DB

```bash
python manage.py migrate
```

---

## 6️⃣ Run Server

```bash
python manage.py runserver
```
