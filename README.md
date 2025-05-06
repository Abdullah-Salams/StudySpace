# StudySpace 📚

*A full‑stack study‑room booking platform powered by **Flask + MongoDB** on the back‑end and **React 18** on the front‑end.*

---

## Features

- **JWT Authentication** – register / log in with 5‑minute tokens  
- **Room Availability** – browse free rooms by floor, date, and time  
- **Bookings API** – create · view · delete bookings (max 4 per user per day)  
- **Admin View** – list every booking in the system  
- Built‑in CORS proxy for smooth React ↔ Flask development

---

## Quick Start (TL;DR)

```bash
# 1 · Clone
git clone https://github.com/Abdullah-Salams/StudySpace.git
cd StudySpace

# 2 · Back‑end
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt # installs necessary packages

cp .env.example .env # add your own MONGODB_URI + SECRET_KEY
python app.py # → http://localhost:5000

# 3 · Front‑end  (in a second terminal)
cd frontend
npm ci
npm start
```

Open `http://localhost:3000`, create an account, and start booking!

---

## Prerequisites

| Tool                | Version tested |
|---------------------|----------------|
| Python              | 3.9 – 3.13     |
| Node.js / npm       | ≥ 20 / 10      |
| MongoDB (Atlas or local) | 6.x |

> **Cloud first:** a MongoDB Atlas URI works out of the box.  
> **Local users:** set `MONGODB_URI=mongodb://localhost:27017`.

---

## Installation & Setup

### 1. Back‑end

1. **Create** a virtual environment.  
2. **Install dependencies** (listed in `requirements.txt`):

3. **Configure secrets**

   ```dotenv
   # .env.example → copy to .env
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   SECRET_KEY=change‑me
   ```

4. **Run the server**

   ```bash
   python app.py
   ```

   The root route `/` replies **“Connected to MongoDB!”** if the connection succeeds.

---

### 2. Front‑end

The React client lives in **`/frontend`** and was boot‑strapped with *Create React App*.

```bash
cd frontend
npm ci # or npm install
npm start # http://localhost:3000 (auto‑opens)
```

A `"proxy": "http://localhost:5000"` line in `package.json` forwards all `/api` calls to the Flask server during development—no extra CORS config required.

---

## Environment Variables

| Key            | Description                                           |
|----------------|-------------------------------------------------------|
| `MONGODB_URI`  | Standard connection string (Atlas or local)           |
| `SECRET_KEY`   | Used to sign / verify JWTs (`HS256`)                  |
| `PORT` (opt.)  | Custom port for Flask; defaults to `5000`             |

---

## Common Tasks

| Task                               | Command                                                         |
|------------------------------------|-----------------------------------------------------------------|
| Run Flask in production            | `gunicorn -w 4 -b 0.0.0.0:8000 app:app`                         |
| Freeze an exact lock‑file          | `pip freeze > requirements.lock`                                |
| Lint Python code                   | `pip install ruff && ruff check app.py`                         |
| Create React build                 | `npm run build` (output in `frontend/build`)                    |

---

## License

Released under the **MIT License** – see [`LICENSE`](LICENSE) for full text.
