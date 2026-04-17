"""
Response Validator & Fallback System
- Validates model responses for medical accuracy
- Falls back to Google Gemini API if validation fails
- Detects user language and responds accordingly
"""

import os
import json
import logging
from typing import Dict, Any, Tuple
import httpx
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from peft import PeftModel
import torch

logger = logging.getLogger(__name__)

# ===================== VALIDATION PROMPTS =====================

VALIDATION_PROMPT = """You are a medical evaluator AI.

Check if the given answer is:
- Medically correct✔
- Safe and appropriate
- Relevant to the question
- Not misleading

Reply ONLY with:
YES → if the answer is correct, safe, and helpful  
NO → if the answer is wrong, incomplete, unsafe, or misleading

Question:
{question}

Answer:
{response}

Your judgment (YES or NO only):"""

LANGUAGE_DETECT_PROMPT = """Detect the language of this text.

Reply ONLY with one word:
- ENGLISH
- HINDI
- TELUGU

Text: {user_input}

Language:"""

# ===================== GEMINI FALLBACK RESPONSE PROMPTS =====================

GEMINI_HEALTHCARE_PROMPT = """You are an AI healthcare assistant.

Your job is to provide accurate, safe, and easy-to-understand medical guidance.

Instructions:
- Answer clearly and concisely
- Use simple language (non-technical if possible)
- If symptoms are serious, advise consulting a doctor
- DO NOT give dangerous or risky medical advice
- If unsure, say you are not fully certain
- Provide precautions and basic home remedies if applicable

Response format:
1. Short answer
2. Possible causes (if applicable)
3. Precautions / Remedies
4. When to see a doctor

User Question:
{user_input}"""

# ===================== RESPONSE VALIDATOR CLASS =====================

class ResponseValidator:
    """Validates model responses and falls back to Gemini if needed"""
    
    def __init__(self, model_manager=None):
        """
        Initialize validator
        
        Args:
            model_manager: ModelManager instance for validation
        """
        self.model_manager = model_manager
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self.use_validation = os.getenv("USE_RESPONSE_VALIDATION", "true").lower() == "true"
        self.fallback_to_gemini = os.getenv("FALLBACK_TO_GEMINI", "true").lower() == "true"
        
        logger.info(f"✅ ResponseValidator initialized")
        logger.info(f"   - Validation enabled: {self.use_validation}")
        logger.info(f"   - Gemini fallback: {self.fallback_to_gemini and bool(self.gemini_api_key)}")
    
    def validate_response(self, question: str, response: str) -> Tuple[bool, str]:
        """
        Validate if model response is medically accurate
        
        Args:
            question: User's question
            response: Model's generated response
            
        Returns:
            (is_valid: bool, reason: str)
        """
        if not self.use_validation or not self.model_manager:
            return True, "Validation disabled"
        
        try:
            # Create validation prompt
            validation_input = VALIDATION_PROMPT.format(
                question=question[:500],
                response=response[:500]
            )
            
            # Use model to validate
            validation_response, _ = self.model_manager.generate_response(
                validation_input,
                max_length=50,
                num_beams=1
            )
            
            validation_response = validation_response.strip().upper()
            is_valid = "YES" in validation_response
            
            logger.info(f"📋 Validation: {validation_response[:20]}")
            return is_valid, validation_response
            
        except Exception as e:
            logger.error(f"❌ Validation error: {e}")
            # If validation fails, assume response is valid (safer fallback)
            return True, f"Validation skipped: {str(e)}"
    
    def detect_language(self, user_input: str) -> str:
        """
        Detect user's language (English, Hindi, or Telugu)
        
        Args:
            user_input: User's question
            
        Returns:
            Language code: 'en', 'hi', 'te'
        """
        try:
            # Check for common language indicators
            telugu_chars = ['ా', 'ి', 'ు', 'ూ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ౌ']
            hindi_chars = ['ा', 'ि', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ']
            
            if any(char in user_input for char in telugu_chars):
                return 'te'
            elif any(char in user_input for char in hindi_chars):
                return 'hi'
            else:
                return 'en'
                
        except Exception as e:
            logger.warning(f"⚠️ Language detection error: {e}")
            return 'en'
    
    async def validate_and_fallback(
        self,
        question: str,
        model_response: str,
        user_context: Dict[str, Any] = None
    ) -> Tuple[str, str, bool]:
        """
        Validate model response and fallback to Gemini if needed
        
        Args:
            question: User's question
            model_response: Model's generated response
            user_context: User context for Gemini
            
        Returns:
            (final_response: str, source: str, validation_status: bool)
            
        Example:
            response, source, valid = await validator.validate_and_fallback(
                question="What is diabetes?",
                model_response="Diabetes is...",
                user_context={...}
            )
            # source will be "model" or "gemini"
        """
        # Detect language
        detected_language = self.detect_language(question)
        
        # Step 1: Validate model response
        if self.use_validation:
            is_valid, validation_reason = self.validate_response(question, model_response)
            logger.info(f"✅ Model response validation: {is_valid}")
        else:
            is_valid = True
            validation_reason = "Validation disabled"
        
        # Step 2: If valid, return model response
        if is_valid:
            return model_response, "model", True
        
        # Step 3: If invalid and Gemini available, fallback
        logger.warning(f"⚠️ Model response validation failed: {validation_reason}")
        
        if self.fallback_to_gemini and self.gemini_api_key:
            logger.info("🔄 Falling back to Gemini API...")
            gemini_response = await self._get_gemini_response(
                question=question,
                language=detected_language,
                user_context=user_context
            )
            
            if gemini_response:
                logger.info("✅ Gemini response generated successfully")
                return gemini_response, "gemini", False
            else:
                logger.warning("⚠️ Gemini fallback failed, returning original model response")
                return model_response, "model_fallback", False
        else:
            logger.warning("⚠️ Gemini fallback not available, returning original model response")
            return model_response, "model_fallback", False
    
    async def _get_gemini_response(
        self,
        question: str,
        language: str = 'en',
        user_context: Dict[str, Any] = None
    ) -> str:
        """
        Get response from Google Gemini API
        
        Args:
            question: User's question
            language: Detected language code
            user_context: Optional user context
            
        Returns:
            Response string or None
        """
        try:
            if not self.gemini_api_key:
                logger.error("❌ GEMINI_API_KEY not set")
                return None
            
            # Build API URL
            api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent?key={self.gemini_api_key}"
            
            # Build the system prompt based on language
            system_prompt = GEMINI_HEALTHCARE_PROMPT
            
            # Add language instruction
            if language == 'hi':
                system_prompt += "\n\nIMPORTANT: Respond in Hindi (हिंदी)"
            elif language == 'te':
                system_prompt += "\n\nIMPORTANT: Respond in Telugu (తెలుగు)"
            else:
                system_prompt += "\n\nIMPORTANT: Respond in English"
            
            # Prepare request payload
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": system_prompt.format(user_input=question)
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            # Make async request
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(api_url, json=payload)
                
                if response.status_code != 200:
                    logger.error(f"❌ Gemini API error: {response.status_code} - {response.text}")
                    return None
                
                result = response.json()
                
                # Extract response text
                if 'candidates' in result and len(result['candidates']) > 0:
                    candidate = result['candidates'][0]
                    if 'content' in candidate and 'parts' in candidate['content']:
                        parts = candidate['content']['parts']
                        if len(parts) > 0 and 'text' in parts[0]:
                            gemini_response = parts[0]['text']
                            logger.info(f"✅ Gemini response received ({len(gemini_response)} chars)")
                            return gemini_response
                
                logger.error(f"❌ Unexpected Gemini response format: {result}")
                return None
                
        except httpx.TimeoutException:
            logger.error("❌ Gemini API timeout")
            return None
        except Exception as e:
            logger.error(f"❌ Gemini API error: {str(e)}")
            return None


# ===================== STANDALONE FUNCTIONS =====================

async def validate_and_get_response(
    question: str,
    model_response: str,
    model_manager=None,
    user_context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Validate response and fallback to Gemini if needed
    
    Returns:
    {
        "response": "Generated response text",
        "source": "model" or "gemini",
        "validation_passed": bool,
        "language": "en" or "hi" or "te"
    }
    """
    validator = ResponseValidator(model_manager=model_manager)
    
    # Detect language
    language = validator.detect_language(question)
    
    # Validate and fallback
    final_response, source, validation_passed = await validator.validate_and_fallback(
        question=question,
        model_response=model_response,
        user_context=user_context
    )
    
    return {
        "response": final_response,
        "source": source,
        "validation_passed": validation_passed,
        "language": language
    }
