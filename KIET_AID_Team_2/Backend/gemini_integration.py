"""Gemini API Integration - Healthcare Chatbot

Minimal module for future healthcare AI integrations.
Tips generation has been removed as per requirements.

Environment Variables:
- GEMINI_API_KEY: Required. API key from aistudio.google.com
- GEMINI_MODEL: Default: gemini-1.5-flash. Options: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash
"""
import os
import logging

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
