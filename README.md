# Riff Planner

AI Trip Planner powered by Gemini 2.5 — Ideas, Timeline, Real Places.

## Project layout
- `backend/`: FastAPI service that calls Gemini with Google Search enabled.
- `frontend/`: Next.js 14 app that proxies `/api/*` to the backend and exposes a chat UI.

## Running locally
1. **Backend**
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env  # then edit GOOGLE_API_KEY
   export $(cat .env | xargs)  # or use your preferred env loader
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # optional; defaults still work locally
   # point Next.js to the FastAPI server (defaults to http://localhost:8000)
   BACKEND_URL=http://localhost:8000 npm run dev
   ```

   - `BACKEND_URL` controls the Next.js rewrite that proxies `/api/*` to the FastAPI server.
   - `NEXT_PUBLIC_BACKEND_URL` (optional) lets the browser call the backend directly instead of the proxy.

Then visit http://localhost:3000 to chat with Gemini + Google Search.
