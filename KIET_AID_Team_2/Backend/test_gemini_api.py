#!/usr/bin/env python3
"""Direct test of Gemini API v1beta endpoint"""
import os
import json
import subprocess
import sys

# Get API key from env
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ GEMINI_API_KEY not set in environment")
    sys.exit(1)

model = "gemini-1.5-flash"
url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

print(f"Testing Gemini API v1beta endpoint...")
print(f"URL: {url[:80]}...")
print(f"Model: {model}")
print()

# Create minimal test payload
payload = {
    "contents": [
        {
            "parts": [
                {"text": "Say 'Hello' in one word"}
            ]
        }
    ],
    "generationConfig": {
        "temperature": 0.7,
        "maxOutputTokens": 10
    }
}

# Use curl/Invoke-WebRequest to test
print("Sending request...")
try:
    result = subprocess.run(
        [
            "powershell",
            "-Command",
            f"""
$response = Invoke-WebRequest -Uri '{url}' -Method POST -ContentType 'application/json' -Body ('{json.dumps(payload)}' | ConvertTo-Json -Compress) -ErrorAction Stop
Write-Host "Status: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
"""
        ],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
    print(f"Exit code: {result.returncode}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nAlternative: Test with curl directly:")
    print(f"""
curl -X POST "{url}" \\
  -H "Content-Type: application/json" \\
  -d '{json.dumps(payload)}'
""")
