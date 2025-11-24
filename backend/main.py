from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from google import genai
import httpx
import os, json, logging

# ============================================================
# Load .env manually (no external deps)
# ============================================================
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            if "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")


# ============================================================
# Logging
# ============================================================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ============================================================
# Load Gemini + Google Search Keys
# ============================================================
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")

if GOOGLE_API_KEY:
    client = genai.Client(api_key=GOOGLE_API_KEY)
    logger.info("Gemini initialized")
else:
    client = None
    logger.warning("⚠ No GOOGLE_API_KEY — AI disabled, using sample output.")


# ============================================================
# FastAPI setup
# ============================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ============================================================
# Google Image Search
# ============================================================
async def fetch_google_image(query: str) -> Optional[str]:

    if not GOOGLE_API_KEY or not GOOGLE_CSE_ID:
        return None

    url = "https://www.googleapis.com/customsearch/v1"

    params = {
        "key": GOOGLE_API_KEY,
        "cx": GOOGLE_CSE_ID,
        "q": query,
        "searchType": "image",
        "num": 1,
        "safe": "active"
    }

    try:
        async with httpx.AsyncClient() as http:
            r = await http.get(url, params=params)
            data = r.json()

            items = data.get("items")
            if items:
                return items[0].get("link")

    except Exception as e:
        logger.error(f"Image search failed: {e}")

    return None


# ============================================================
# Google Maps Link
# ============================================================
def make_map_link(title: str) -> str:
    q = title.replace(" ", "+")
    return f"https://www.google.com/maps/search/?api=1&query={q}"


# ============================================================
# Sample fallback
# ============================================================
def _sample(query=""):
    return {
        "ideas": [
            {
                "title": "Sample Trip",
                "description": "AI disabled — sample idea.",
                "image": "https://images.unsplash.com/photo-1504674900947-0f7a2d9ae446?w=400",
                "link": make_map_link("Sample Trip")
            }
        ],
        "timeline": [
            {
                "time": "Day 1, 9:00 AM",
                "title": "Sample Event",
                "description": "Timeline sample event.",
                "image": "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400",
                "link": make_map_link("Sample Event")
            }
        ]
    }


# ============================================================
# Pydantic Models
# ============================================================
class GenerateRequest(BaseModel):
    query: str
    date: str


class Plan(BaseModel):
    title: str
    description: str
    image: Optional[str] = ""
    link: Optional[str] = ""


class TimelineEvent(BaseModel):
    time: str
    title: str
    description: str
    image: Optional[str] = ""
    link: Optional[str] = ""


class GenerateResponse(BaseModel):
    ideas: List[Plan]
    timeline: List[TimelineEvent]


# ============================================================
# /generate endpoint
# ============================================================
@app.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):

    # No AI → fallback
    if not client:
        return _sample(req.query)

    # Prompt for Gemini
    prompt = f"""
Return ONLY valid JSON. No markdown.

User Query: {req.query}
Date: {req.date}

JSON Format:
{{
  "ideas": [
    {{
      "title": "",
      "description": "",
      "image": "",
      "link": ""
    }}
  ],
  "timeline": [
    {{
      "time": "",
      "title": "",
      "description": "",
      "image": "",
      "link": ""
    }}
  ]
}}
"""

    # Gemini call
    try:
        ai = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        raw = ai.candidates[0].content.parts[0].text
    except Exception as e:
        logger.error(f"Gemini failed: {e}")
        return _sample(req.query)

    cleaned = raw.replace("```json", "").replace("```", "").strip()

    # Extract JSON
    try:
        json_str = cleaned[cleaned.index("{"): cleaned.rindex("}") + 1]
        data = json.loads(json_str)
    except Exception as e:
        logger.error(f"Parse error: {e}")
        return _sample(req.query)

    # ========================================================
    # Add Google Images + Google Maps Links
    # ========================================================
    # Ideas
    for idea in data.get("ideas", []):
        if not idea.get("image"):
            idea["image"] = await fetch_google_image(idea["title"]) or ""
        idea["link"] = make_map_link(idea["title"])

    # Timeline
    for item in data.get("timeline", []):
        if not item.get("image"):
            item["image"] = await fetch_google_image(item["title"]) or ""
        item["link"] = make_map_link(item["title"])

    return data
