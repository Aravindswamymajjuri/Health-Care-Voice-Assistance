"""
Test script for Response Validation & Fallback System
Tests the validation flow and Gemini API integration
"""

import asyncio
import os
import json
from typing import Dict, Any
from response_validator import ResponseValidator, validate_and_get_response

# Mock ModelManager for testing
class MockModelManager:
    def __init__(self):
        self.is_loaded = True
    
    def generate_response(self, input_text: str, **kwargs):
        # Return test responses
        test_responses = {
            "diabetes": "Diabetes is a chronic condition affecting blood sugar levels. It requires proper diet and medication.",
            "fever": "Fever is a sign of infection. Take paracetamol and see a doctor.",
            "headache": "Headache pain pain pain",  # Intentionally inadequate response
            "invalid": "Lorem ipsum dolor sit amet",  # Invalid medical response
        }
        
        for keyword, response in test_responses.items():
            if keyword.lower() in input_text.lower():
                return response, 1.2
        
        return "Please consult a healthcare professional.", 1.5


# Test Cases
TEST_CASES = [
    {
        "name": "Valid Medical Response (English)",
        "question": "What is diabetes?",
        "language": "en",
        "should_pass": True
    },
    {
        "name": "Invalid Medical Response",
        "question": "What causes fever?",
        "language": "en",
        "should_pass": False
    },
    {
        "name": "Irrelevant Response",
        "question": "Tell me about headaches",
        "language": "en",
        "should_pass": False
    },
    {
        "name": "Hindi Language Detection",
        "question": "मधुमेह क्या है?",  # "What is diabetes?" in Hindi
        "language": "hi",
        "should_pass": True
    },
    {
        "name": "Telugu Language Detection",
        "question": "జ్వరం అంటే ఏమిటి?",  # "What is fever?" in Telugu
        "language": "te",
        "should_pass": True
    },
]


async def run_tests():
    """Run all validation and fallback tests"""
    
    print("=" * 70)
    print("🧪 Response Validation & Fallback System - Test Suite")
    print("=" * 70)
    print()
    
    # Initialize
    model_manager = MockModelManager()
    validator = ResponseValidator(model_manager=model_manager)
    
    # Check API key
    if not validator.gemini_api_key:
        print("⚠️  WARNING: GEMINI_API_KEY not set in environment")
        print("   Some tests will skip Gemini fallback testing")
        print()
    else:
        print(f"✅ Gemini API Key: {validator.gemini_api_key[:10]}...")
        print(f"✅ Gemini Model: {validator.gemini_model}")
        print()
    
    results = []
    
    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"\n{'─' * 70}")
        print(f"Test #{i}: {test_case['name']}")
        print(f"{'─' * 70}")
        
        question = test_case['question']
        language = test_case['language']
        
        print(f"Question: {question}")
        print(f"Expected Language: {language}")
        
        try:
            # Generate model response
            model_response, inference_time = model_manager.generate_response(question)
            print(f"Model Response: {model_response[:60]}...")
            
            # Validate and fallback
            result = await validate_and_get_response(
                question=question,
                model_response=model_response,
                model_manager=model_manager,
                user_context={
                    "test_case": test_case['name'],
                    "timestamp": "2026-04-18"
                }
            )
            
            # Display results
            print(f"\n✅ Validation Result:")
            print(f"   - Source: {result['source']}")
            print(f"   - Validation Passed: {result['validation_passed']}")
            print(f"   - Detected Language: {result['language']}")
            print(f"   - Response: {result['response'][:60]}...")
            
            # Check if result matches expected
            test_passed = (result['language'] == language)
            if test_case['should_pass']:
                test_passed = test_passed and result['validation_passed']
            
            results.append({
                "test": test_case['name'],
                "passed": test_passed,
                "source": result['source'],
                "language": result['language']
            })
            
            print(f"\n📊 Test Status: {'✅ PASSED' if test_passed else '❌ FAILED'}")
            
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            results.append({
                "test": test_case['name'],
                "passed": False,
                "error": str(e)
            })
    
    # Summary
    print(f"\n\n{'=' * 70}")
    print("📋 Test Summary")
    print(f"{'=' * 70}\n")
    
    passed = sum(1 for r in results if r['passed'])
    total = len(results)
    
    for result in results:
        status = "✅" if result['passed'] else "❌"
        print(f"{status} {result['test']}")
        if 'source' in result:
            print(f"   Source: {result['source']}, Language: {result['language']}")
        elif 'error' in result:
            print(f"   Error: {result['error']}")
    
    print(f"\n{'─' * 70}")
    print(f"Total: {passed}/{total} tests passed ({int(passed/total*100)}%)")
    print(f"{'─' * 70}\n")
    
    # Recommendations
    if passed == total:
        print("🎉 All tests passed! System is working correctly.")
    else:
        print("⚠️  Some tests failed. Check logs above for details.")
        print("\nCommon issues:")
        print("1. Gemini API Key not set → Set GEMINI_API_KEY in .env")
        print("2. Model responses too short → Improve model training")
        print("3. Language detection failing → Check language character support")


async def test_fallback_flow():
    """Test the specific fallback flow"""
    
    print("\n" + "=" * 70)
    print("🔄 Testing Fallback Flow (Model → Validation → Gemini)")
    print("=" * 70 + "\n")
    
    if not os.getenv("GEMINI_API_KEY"):
        print("⚠️  GEMINI_API_KEY not set - skipping fallback test")
        return
    
    validator = ResponseValidator(model_manager=MockModelManager())
    
    # Test case: Invalid response that should trigger fallback
    question = "What is fever?"
    model_response = "Headache pain pain pain"  # Intentionally bad
    
    print(f"Question: {question}")
    print(f"Model Response: {model_response}")
    print(f"\nInitiating validation and fallback...\n")
    
    result = await validate_and_get_response(
        question=question,
        model_response=model_response,
        model_manager=MockModelManager(),
        user_context={}
    )
    
    print(f"Response Source: {result['source']}")
    if result['source'] == 'gemini':
        print("✅ Successfully fell back to Gemini API!")
        print(f"\nGemini Response:\n{result['response']}")
    else:
        print("ℹ️  Response from:", result['source'])


if __name__ == "__main__":
    print("\n🚀 Starting Response Validation Test Suite...\n")
    
    # Run main tests
    asyncio.run(run_tests())
    
    # Run fallback test
    asyncio.run(test_fallback_flow())
    
    print("\n✅ Test suite complete!\n")
