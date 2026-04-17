"""Gemini API Integration - Production Ready

Calls Google Gemini API to generate personalized healthcare tips.

Environment Variables:
- GEMINI_API_KEY: Required. API key from aistudio.google.com
- GEMINI_MODEL: Default: gemini-1.5-flash. Options: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash
- GEMINI_API_URL: Optional. Override full endpoint URL
"""
import os
import json
import httpx
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


def get_gemini_config() -> tuple[str, str]:
    """Read Gemini config from environment at CALL TIME (not import time)."""
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    return api_key, model


def build_gemini_url(model: str) -> str:
    """Construct Gemini API URL from model name. Built at REQUEST TIME."""
    base_url = "https://generativelanguage.googleapis.com/v1beta/models"
    endpoint = "generateContent"
    return f"{base_url}/{model}:{endpoint}"

async def generate_tips_via_gemini(
    user_context: Dict[str, Any],
    messages: List[Dict[str, Any]],
    max_output_tokens: int = 250
) -> Dict[str, Any]:
    """Generate healthcare tips using Gemini API."""
    
    # READ CONFIG AT CALL TIME
    api_key, model = get_gemini_config()
    
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")
    
    # BUILD URL AT CALL TIME FROM MODEL VARIABLE
    api_url = build_gemini_url(model)
    
    # DEBUG: Log exact configuration
    logger.info(f"🔵 GEMINI CONFIG: model={model}")
    logger.info(f"🔵 GEMINI URL: {api_url}")
    
    # Build prompt
    prompt_lines = [
        "You are a professional, empathetic healthcare assistant.",
        "Based on the provided user context and recent chat messages, produce up to 5 concise, prioritized, evidence-based healthcare tips tailored to the user's mood and symptoms. Return the output strictly as a JSON object with keys: tips (array of strings), urgency (low|medium|high). Do NOT include any extra commentary outside JSON."
    ]
    
    mood_emoji = user_context.get("moodEmoji") or user_context.get("mood") or ""
    mood_name = user_context.get("mood", {}).get("name") if isinstance(user_context.get("mood"), dict) else user_context.get("mood_state") or "unknown"
    prompt_lines.append(f"Mood: {mood_emoji} ({mood_name})")
    
    symptoms = user_context.get("symptoms", [])
    if symptoms:
        prompt_lines.append("Symptoms: " + ", ".join(symptoms))
    
    topics = user_context.get("topics") or {}
    if isinstance(topics, dict) and topics:
        top_keys = ", ".join(sorted(topics.keys(), key=lambda k: -topics[k]))
        prompt_lines.append("Top topics: " + top_keys)
    
    recent_texts = []
    for m in messages[-10:]:
        who = m.get("type") or m.get("role") or "user"
        txt = (m.get("text") or m.get("content") or "").strip()
        if txt:
            recent_texts.append(f"{who}: {txt}")
    if recent_texts:
        prompt_lines.append("Recent messages:\n" + "\n".join(recent_texts))
    
    prompt_lines.append("Tone: empathetic, concise. Output format: JSON only. Max 5 tips.")
    
    prompt = "\n\n".join(prompt_lines)
    
    # Construct request
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": max_output_tokens
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    # CRITICAL: Append key to URL
    api_url_with_key = f"{api_url}?key={api_key}"
    
    # DEBUG: Log final request URL before sending
    logger.info(f"🔵 SENDING TO: {api_url_with_key[:100]}...")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(api_url_with_key, headers=headers, json=payload)
        
        logger.info(f"🔵 RESPONSE STATUS: {resp.status_code}")
        
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            error_text = resp.text or ""
            status_code = resp.status_code
            
            if status_code == 404:
                raise RuntimeError(
                    f"Gemini API 404 - Model or endpoint not found\n"
                    f"URL: {api_url}\n"
                    f"Model: {model}\n"
                    f"Response: {error_text[:200]}"
                )
            elif status_code == 401 or status_code == 403:
                raise RuntimeError(
                    f"Gemini API {status_code} - Invalid API key or access denied\n"
                    f"Verify GEMINI_API_KEY is correct"
                )
            elif status_code == 400:
                raise RuntimeError(
                    f"Gemini API 400 - Bad request\n"
                    f"Response: {error_text[:200]}"
                )
            else:
                raise RuntimeError(
                    f"Gemini API Error {status_code}: {e}\n"
                    f"Response: {error_text[:300]}"
                )
        
        data = resp.json()
    
    # Parse response
    raw_text = ""
    if isinstance(data, dict) and "candidates" in data and data["candidates"]:
        cand = data["candidates"][0]
        if "content" in cand and isinstance(cand["content"], dict):
            if "parts" in cand["content"] and isinstance(cand["content"]["parts"], list) and cand["content"]["parts"]:
                raw_text = cand["content"]["parts"][0].get("text", "")
    
    # Extract tips
    tips = []
    urgency = "low"
    try:
        parsed = json.loads(raw_text)
        if isinstance(parsed, dict):
            tips = parsed.get("tips") or parsed.get("suggestions") or []
            urgency = parsed.get("urgency") or parsed.get("priority") or urgency
    except Exception:
        lines = [ln.strip().lstrip("-• ") for ln in raw_text.splitlines() if ln.strip()]
        extracted = []
        for ln in lines:
            if len(extracted) >= 5:
                break
            if not any(ln.lower().startswith(x) for x in ["mood:", "symptoms:", "tone:", "recent"]):
                extracted.append(ln)
        tips = extracted
    
    tips_clean = []
    for t in tips:
        if isinstance(t, str):
            s = t.strip()
            if s and s not in tips_clean:
                tips_clean.append(s)
    
    return {"tips": tips_clean, "raw": raw_text, "urgency": urgency}
