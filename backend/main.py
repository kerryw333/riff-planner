import json
import logging
import os
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from google import genai

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    client = genai.Client(api_key=api_key)
    logger.info("Gemini client initialized.")
else:
    client = None
    logger.warning("GOOGLE_API_KEY not found. Set it to enable Gemini search.")

app = FastAPI(title="Riff Planner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    query: str


class SearchReference(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    snippet: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    references: List[SearchReference] = Field(default_factory=list)


def _call_gemini_with_search(prompt: str) -> Dict[str, Any]:
    """Run Gemini with Google Search enabled, falling back to text-only if needed."""
    if not client:
        raise RuntimeError("Gemini client unavailable; set GOOGLE_API_KEY.")

    # First, attempt with Google Search enabled
    try:
        response = client.responses.generate(
            model="gemini-2.0-flash",
            contents=[{"role": "user", "parts": [{"text": prompt}]}],
            tools=[{"google_search": {}}],
        )
        return response
    except Exception as err:  # pragma: no cover - defensive fallback
        logger.warning("Gemini search call failed, retrying without tools: %s", err)

    # Fallback without tools to at least deliver an answer
    return client.responses.generate(
        model="gemini-2.0-flash",
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
    )


def _extract_references(response: Any) -> List[SearchReference]:
    references: List[SearchReference] = []

    candidate = getattr(response, "candidates", None) or []
    grounding = None
    if candidate:
        grounding = getattr(candidate[0], "grounding_metadata", None)

    if grounding:
        search_results = getattr(grounding, "search_queries", None) or []
        for result in search_results:
            snippet = getattr(result, "snippet", None)
            url = getattr(result, "url", None)
            title = getattr(result, "title", None)
            references.append(SearchReference(title=title, url=url, snippet=snippet))

    return references


@app.post("/generate", response_model=ChatResponse)
async def generate(req: GenerateRequest) -> ChatResponse:
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query must not be empty.")

    prompt = (
        "You are a helpful travel planner. Use Google Search for fresh info and facts. "
        "Keep the answer concise, under 200 words. Include clear suggestions."\
    )
    prompt += f"\nUser question: {req.query.strip()}"

    try:
        result = _call_gemini_with_search(prompt)
    except RuntimeError as err:
        logger.error("Gemini unavailable: %s", err)
        raise HTTPException(status_code=503, detail=str(err))

    answer = getattr(result, "output_text", "") or ""  # type: ignore[attr-defined]
    if not answer and getattr(result, "candidates", None):
        parts = result.candidates[0].content.parts  # type: ignore[index]
        answer = " ".join(getattr(part, "text", "") for part in parts)

    references = _extract_references(result)

    if not answer:
        raise HTTPException(status_code=502, detail="Gemini returned an empty response.")

    return ChatResponse(answer=answer.strip(), references=references)


@app.get("/health")
async def health():
    return {"status": "ok", "gemini": bool(client)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
