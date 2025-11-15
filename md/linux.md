# Linux Installation Guide — LearnEng

---

## 1️⃣ Install Python & Git

### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip git
```

### Arch:

```bash
sudo pacman -S python python-pip git
```

### Fedora:

```bash
sudo dnf install python3 python3-pip git
```

---

## 2️⃣ Clone Repository

```bash
git clone https://github.com/Shivanshtiwari1234/PallaviMaam.git
cd PallaviMaam/LearnEng
```

---

## 3️⃣ Create Virtual Environment

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

## 5️⃣ Run Migrations & Server

```bash
python manage.py migrate
python manage.py runserver
```
