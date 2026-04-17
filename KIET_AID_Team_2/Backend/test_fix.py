#!/usr/bin/env python3
"""Test that the Gemini URL is now using v1beta"""
import sys
sys.path.insert(0, ".")
from gemini_integration import build_gemini_url

url = build_gemini_url("gemini-1.5-flash")
print(f"URL: {url}")
print(f"✓ Has v1beta: {'v1beta' in url}")
print(f"✗ Has v1 (old): {'v1/models' in url}")
assert "v1beta" in url, "URL should contain v1beta"
assert "v1/models" not in url, "URL should NOT contain v1/models"
print("\n✅ Fix verified - URL is correct!")
