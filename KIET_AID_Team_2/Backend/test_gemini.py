"""
Test script for Gemini API setup
Run this to verify your API key and model configuration work correctly

Usage:
    python test_gemini.py
"""

import os
import sys
import json
import asyncio
import httpx
from typing import Dict, Any

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_status(status: str, message: str):
    """Print colored status message"""
    if status == "✓":
        print(f"{Colors.GREEN}✓ {message}{Colors.END}")
    elif status == "✗":
        print(f"{Colors.RED}✗ {message}{Colors.END}")
    elif status == "⚠":
        print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")
    elif status == "→":
        print(f"{Colors.BLUE}→ {message}{Colors.END}")
    else:
        print(f"  {message}")

async def test_gemini_api():
    """Test Gemini API with your configuration"""
    
    print(f"\n{Colors.BLUE}=== GEMINI API TEST SUITE ==={Colors.END}\n")
    
    # Step 1: Check environment variables
    print_status("→", "Step 1: Checking environment variables...")
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    if not api_key:
        print_status("✗", "GEMINI_API_KEY not set!")
        print("  Set it with: export GEMINI_API_KEY='your-key-here'")
        return False
    
    print_status("✓", f"GEMINI_API_KEY is set (length: {len(api_key)} chars)")
    print_status("✓", f"GEMINI_MODEL: {model}")
    
    # Step 2: Verify API URL
    print(f"\n{Colors.BLUE}Step 2: Verifying API URL...{Colors.END}")
    api_url = f"https://generativelanguage.googleapis.com/v1/models/{model}:generateContent"
    print_status("→", f"URL: {api_url}")
    
    # Step 3: Test API connection
    print(f"\n{Colors.BLUE}Step 3: Testing API connection...{Colors.END}")
    
    test_payload = {
        "contents": [
            {
                "parts": [
                    {"text": "Say 'Healthcare tips working!' in one sentence."}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 100
        }
    }
    
    url_with_key = f"{api_url}?key={api_key}"
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            print_status("→", "Sending request to Gemini API...")
            response = await client.post(
                url_with_key,
                json=test_payload,
                headers={"Content-Type": "application/json"}
            )
            
            # Check status code
            if response.status_code == 200:
                print_status("✓", f"API Response: HTTP {response.status_code}")
                
                # Parse response
                data = response.json()
                
                # Extract text
                if "candidates" in data and data["candidates"]:
                    candidate = data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        text = candidate["content"]["parts"][0].get("text", "")
                        print_status("✓", f"Generated text: '{text}'")
                else:
                    print_status("⚠", "Unexpected response format")
                    print_status("→", f"Full response: {json.dumps(data, indent=2)}")
                
                return True
            
            else:
                print_status("✗", f"API Error: HTTP {response.status_code}")
                print_status("→", f"Response: {response.text[:300]}")
                
                # Provide helpful error messages
                if response.status_code == 404:
                    print_status("⚠", "Model not found. Try: export GEMINI_MODEL=gemini-1.5-flash")
                elif response.status_code == 401:
                    print_status("⚠", "Invalid API key. Check your key at aistudio.google.com")
                elif response.status_code == 403:
                    print_status("⚠", "Access forbidden. Verify API key has access to this model.")
                
                return False
    
    except httpx.TimeoutException:
        print_status("✗", "Request timeout (30 seconds). Check your internet connection.")
        return False
    
    except Exception as e:
        print_status("✗", f"Error: {str(e)}")
        return False

async def test_tips_endpoint():
    """Test your FastAPI /api/generate/tips endpoint"""
    
    print(f"\n{Colors.BLUE}=== TESTING FASTAPI ENDPOINT ==={Colors.END}\n")
    
    api_url = "http://localhost:8000/api/generate/tips"
    
    test_payload = {
        "user_context": {
            "mood": "anxious",
            "symptoms": ["headache", "insomnia"],
            "age": 25,
            "gender": "M",
            "allergies": []
        },
        "messages": [
            {
                "type": "user",
                "text": "I'm feeling anxious and can't sleep due to a headache"
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            print_status("→", f"Testing endpoint: {api_url}")
            response = await client.post(api_url, json=test_payload)
            
            if response.status_code == 200:
                data = response.json()
                print_status("✓", "Endpoint responded successfully")
                
                if "tips" in data:
                    tips = data["tips"]
                    print_status("✓", f"Generated {len(tips)} tips:")
                    for i, tip in enumerate(tips, 1):
                        print(f"    {i}. {tip}")
                
                if "urgency" in data:
                    print_status("✓", f"Urgency level: {data['urgency']}")
                
                return True
            else:
                print_status("✗", f"Endpoint error: HTTP {response.status_code}")
                print_status("→", response.text[:300])
                return False
    
    except httpx.ConnectError:
        print_status("⚠", "Could not connect to localhost:8000")
        print_status("→", "Make sure FastAPI server is running: uvicorn app:app --reload")
        return False
    
    except Exception as e:
        print_status("⚠", f"Error: {str(e)}")
        return False

async def main():
    """Run all tests"""
    
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}  GEMINI API & FASTAPI TEST SUITE{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    # Test Gemini API
    gemini_ok = await test_gemini_api()
    
    print(f"\n{Colors.BLUE}{'-'*60}{Colors.END}\n")
    
    # Test FastAPI endpoint
    endpoint_ok = await test_tips_endpoint()
    
    # Summary
    print(f"\n{Colors.BLUE}{'-'*60}{Colors.END}")
    print(f"\n{Colors.BLUE}=== TEST SUMMARY ==={Colors.END}\n")
    
    if gemini_ok and endpoint_ok:
        print_status("✓", "All tests passed! Your setup is working correctly.")
        return 0
    elif gemini_ok:
        print_status("⚠", "Gemini API works but FastAPI endpoint failed. Check server status.")
        return 1
    else:
        print_status("✗", "Gemini API test failed. Fix configuration before running FastAPI.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
