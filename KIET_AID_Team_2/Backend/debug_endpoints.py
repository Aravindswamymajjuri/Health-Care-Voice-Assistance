"""
Diagnostic endpoints for debugging Gemini API configuration

Add these endpoints to your FastAPI app for debugging:
- GET /debug/gemini-config - Show current Gemini configuration
- GET /health/gemini - Check if Gemini API is accessible
"""

import os
import json
import httpx
from fastapi import APIRouter, JSONResponse
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/gemini-config")
async def debug_gemini_config() -> Dict[str, Any]:
    """
    Debug endpoint: Show current Gemini configuration
    
    Returns:
    {
        "api_key_set": true/false,
        "api_key_length": 42,
        "api_key_preview": "AIza...xyz",
        "model": "gemini-1.5-flash",
        "api_url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=...",
        "custom_url_set": false,
        "environment_vars": {...}
    }
    """
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    custom_url = os.getenv("GEMINI_API_URL")
    
    # Build expected URL
    if custom_url:
        api_url = custom_url
    else:
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    config = {
        "status": "configured" if api_key else "missing_api_key",
        "api_key_set": bool(api_key),
        "api_key_length": len(api_key) if api_key else 0,
        "api_key_preview": f"{api_key[:10]}...{api_key[-4:]}" if api_key else "NOT SET",
        "model": model,
        "api_url": api_url,
        "custom_url_set": bool(custom_url),
        "environment_vars": {
            "GEMINI_API_KEY": "SET" if api_key else "NOT SET",
            "GEMINI_MODEL": model,
            "GEMINI_API_URL": custom_url or "NOT SET (using default)"
        },
        "timestamp": str(__import__('datetime').datetime.now())
    }
    
    logger.info(f"📋 Gemini config queried: {json.dumps(config, indent=2)}")
    
    return config


@router.get("/gemini-health")
async def debug_gemini_health() -> Dict[str, Any]:
    """
    Debug endpoint: Test if Gemini API is accessible
    
    Makes a simple test request to verify:
    - API key is valid
    - Model exists
    - Network connectivity
    - API is responding
    
    Returns:
    {
        "status": "healthy",
        "model": "gemini-1.5-flash",
        "latency_ms": 1234,
        "error": null
    }
    """
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    if not api_key:
        return JSONResponse({
            "status": "error",
            "error": "GEMINI_API_KEY not set",
            "message": "Set GEMINI_API_KEY environment variable"
        }, status_code=400)
    
    custom_url = os.getenv("GEMINI_API_URL")
    if custom_url:
        api_url = custom_url
    else:
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    # Make a simple test request
    import time
    start = time.time()
    
    try:
        url_with_key = f"{api_url}?key={api_key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": "Say 'OK' in one word."}]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 10
            }
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            logger.info(f"🧪 Testing Gemini API: {api_url}")
            response = await client.post(
                url_with_key,
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            elapsed = (time.time() - start) * 1000  # Convert to ms
            
            if response.status_code == 200:
                logger.info(f"✅ Gemini API healthy (latency: {elapsed:.0f}ms)")
                return {
                    "status": "healthy",
                    "model": model,
                    "latency_ms": round(elapsed, 0),
                    "http_status": 200,
                    "error": None
                }
            else:
                logger.warning(f"⚠️ Gemini API error: HTTP {response.status_code}")
                return JSONResponse({
                    "status": "error",
                    "model": model,
                    "http_status": response.status_code,
                    "error": response.text[:200],
                    "latency_ms": round(elapsed, 0)
                }, status_code=400)
    
    except httpx.TimeoutException:
        elapsed = (time.time() - start) * 1000
        logger.error(f"❌ Gemini API timeout (latency: {elapsed:.0f}ms)")
        return JSONResponse({
            "status": "error",
            "error": "API timeout after 10 seconds",
            "latency_ms": round(elapsed, 0)
        }, status_code=408)
    
    except Exception as e:
        elapsed = (time.time() - start) * 1000
        logger.error(f"❌ Gemini API connection error: {e}")
        return JSONResponse({
            "status": "error",
            "error": str(e),
            "latency_ms": round(elapsed, 0)
        }, status_code=500)


@router.get("/env-vars")
async def debug_env_vars() -> Dict[str, Any]:
    """
    Debug endpoint: Show ALL environment variables (sensitive data masked)
    
    WARNING: This exposes environment variables. Only use in development!
    Remove this endpoint before deploying to production.
    """
    env_vars = {}
    
    # List of env vars to show
    important_vars = [
        "GEMINI_API_KEY",
        "GEMINI_MODEL", 
        "GEMINI_API_URL",
        "ENVIRONMENT",
        "DEBUG",
        "PORT",
        "MONGODB_URI",
        "JWT_SECRET"
    ]
    
    for var_name in important_vars:
        value = os.getenv(var_name)
        if var_name in ["GEMINI_API_KEY", "JWT_SECRET", "MONGODB_URI"] and value:
            # Mask sensitive values
            env_vars[var_name] = f"{value[:10]}...{value[-4:]}"
        else:
            env_vars[var_name] = value or "NOT SET"
    
    logger.warning(f"⚠️ Environment variables exposed via /debug/env-vars")
    
    return {
        "warning": "This endpoint exposes environment data. Remove before production!",
        "environment_variables": env_vars
    }
