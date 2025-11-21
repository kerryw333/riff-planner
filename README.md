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
   export GOOGLE_API_KEY=YOUR_KEY
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   # point Next.js to the FastAPI server (defaults to http://localhost:8000)
   BACKEND_URL=http://localhost:8000 npm run dev
   ```

Then visit http://localhost:3000 to chat with Gemini + Google Search.
