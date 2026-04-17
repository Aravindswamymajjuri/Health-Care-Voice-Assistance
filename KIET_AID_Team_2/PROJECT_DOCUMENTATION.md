# KIET AID Team 2 - Healthcare Chatbot Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [AI Model Details](#ai-model-details)
6. [Workflow & Data Flow](#workflow--data-flow)
7. [Project Structure](#project-structure)
8. [Backend Architecture](#backend-architecture)
9. [Frontend Architecture](#frontend-architecture)
10. [API Endpoints](#api-endpoints)
11. [Setup & Installation](#setup--installation)
12. [Database Schema](#database-schema)

---

## Project Overview

**Project Name:** KIET AID Team 2 - Healthcare Chatbot  
**Type:** AI-Powered Healthcare Assistant Web Application  
**Purpose:** Provide users with an intelligent healthcare assistant that can answer medical questions, track health metrics, and provide emergency support  
**Status:** Production-Ready with Voice Support

The KIET AID Team 2 Healthcare Chatbot is an advanced web-based medical assistant that combines Natural Language Processing (NLP), voice processing, and a fine-tuned AI model to deliver personalized healthcare guidance. It supports both text and voice interactions, mood tracking, emergency detection, and personalized health tips.

---

## Key Features

### 1. **AI-Powered Healthcare Chatbot**
- **Text-Based Conversation:** Users can ask medical questions in natural language
- **Voice Input:** Convert speech to text using Web Speech API
- **Voice Output:** Text-to-speech responses for audio feedback
- **Context-Aware Responses:** Maintains conversation history for better understanding
- **Personalized Responses:** Tailored answers based on user history and health context

### 2. **Voice & Audio Support**
- **Voice Recording:** Microphone input with real-time recording indicators
- **Speech Recognition:** Convert spoken words to text using SpeechRecognition library
- **Audio Playback:** Responses can be read aloud to users
- **Multiple Audio Formats:** Support for WAV, MP3, FLAC, OGG, WebM
- **Voice Assistant Mode:** Google Assistant-like continuous voice interaction

### 3. **Emergency Detection & Response**
- **Real-Time Emergency Keywords Detection:** Identifies critical keywords like "chest pain", "heart attack", "stroke", etc.
- **Emergency Banner Alerts:** Visual alerts when emergency is detected
- **Quick Emergency Contacts:** Direct links to 911 (US), 108 (India), and other emergency services
- **Emergency Email Notifications:** Auto-sends alerts to emergency contacts
- **Location Sharing:** Option to share user location with emergency contacts

### 4. **Personalized Pro Tips**
- **AI-Generated Health Tips:** Uses Gemini API to generate personalized healthcare advice
- **Context-Based Suggestions:** Tips tailored to user's mood, symptoms, and health history
- **Urgency Levels:** Tips marked as low, medium, or high urgency based on context
- **Refreshable Tips:** Users can refresh tips to get new suggestions
- **Carousel Display:** Multiple tips displayed sequentially

### 5. **Health Dashboard**
- **Conversation Statistics:** Track total messages, voice queries, questions asked
- **Topic Analysis:** Identify most frequently discussed health topics
- **Message Breakdown:** See ratio of user messages vs bot replies
- **Trending Topics:** Visual representation of health concerns discussed

### 6. **User Authentication & Profiles**
- **User Registration:** Sign up with email, username, password, and health info
- **User Login:** Secure login with session management
- **Profile Management:** Store and update:
  - Full name, age, gender
  - Medical allergies
  - Emergency contact information
  - Auto-send emergency email preference
- **Session Persistence:** 30-day session expiry with secure tokens

### 7. **Chat Management**
- **Conversation History:** Save and retrieve past conversations
- **Chat Export:** Download conversations as files
- **Multiple Conversations:** Support for multiple parallel conversation threads
- **Message Timestamps:** Track when each message was sent
- **Conversation Sidebar:** Easy navigation between conversations

### 8. **Responsive & Accessible UI**
- **Mobile-Friendly Design:** Optimized for all screen sizes
- **Accessibility:** WCAG compliant components
- **Dark/Light Mode Support:** User preference saving
- **Toast Notifications:** Real-time user feedback
- **Loading States:** Clear indication of processing

---

## Technology Stack

### **Backend Technologies**
| Component | Technology | Version |
|-----------|-----------|---------|
| **Web Framework** | FastAPI | 0.104.1 |
| **Web Server** | Uvicorn | 0.24.0 |
| **Production Server** | Gunicorn | 21.2.0 |
| **Database** | MongoDB Atlas | Latest |
| **Machine Learning** | PyTorch | 2.1.0 |
| **NLP Model** | Hugging Face Transformers | 4.35.0 |
| **LoRA Fine-tuning** | PEFT (Parameter-Efficient Fine-Tuning) | 0.7.1 |
| **Speech Recognition** | SpeechRecognition | 3.10.0 |
| **Audio Processing** | PyDub, Librosa | 0.25.1, 0.10.0 |
| **API Integration** | Google Gemini API | v1 |
| **Email Service** | FastAPI-Mail | Latest |
| **HTTP Client** | HTTPX | 0.29.4 |
| **Environment Management** | Python-dotenv | 1.0.0 |

### **Frontend Technologies**
| Component | Technology | Version |
|-----------|-----------|---------|
| **UI Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.2.4 |
| **HTTP Client** | Axios | 1.13.2 |
| **Icons** | React Icons | 5.5.0 |
| **Notifications** | React Toastify | 11.0.5 |
| **Code Quality** | ESLint | 9.39.1 |
| **CSS Compilation** | Babel, PostCSS | Via Vite |

### **Infrastructure & DevOps**
- **Development:** Python 3.8+, Node.js 16+
- **Version Control:** Git
- **API Documentation:** Swagger/OpenAPI (FastAPI built-in)
- **Logging:** Python logging module
- **Performance:** Async/await with FastAPI

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Browser)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                                   │   │
│  │  - HealthcareChatbot.jsx (Main Component)                │   │
│  │  - Voice Input/Output Module                             │   │
│  │  - ProTips Component                                     │   │
│  │  - Emergency SOS Component                               │   │
│  │  - Health Dashboard                                      │   │
│  │  - Authentication (Login/Signup)                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↕                                       │
│              REST API + WebSocket Communication                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (FastAPI Backend)                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FastAPI Server (app.py)                                 │   │
│  │  - REST Endpoints                                        │   │
│  │  - WebSocket Handler                                     │   │
│  │  - CORS Middleware                                       │   │
│  │  - Authentication Manager                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Core Modules                                            │   │
│  │  - auth.py: User authentication & session management     │   │
│  │  - database.py: MongoDB connection & queries             │   │
│  │  - email_utils.py: Emergency email notifications         │   │
│  │  - gemini_integration.py: Gemini API integration         │   │
│  │  - audio_processing.py: Voice input processing           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ML Inference Engine                                     │   │
│  │  - Model Loader (Transformers + PEFT)                    │   │
│  │  - Tokenizer                                             │   │
│  │  - Response Generation                                   │   │
│  │  - Device: GPU (CUDA) or CPU                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES & DATA STORAGE                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  MongoDB Atlas   │  │  Google Gemini   │  │  Email SMTP  │   │
│  │  (User Data)     │  │  (Pro Tips Gen)  │  │  (Alerts)    │   │
│  │  - Users         │  │  - API Key req'd │  │              │   │
│  │  - Sessions      │  │  - Async calls   │  │  FastAPI-Mail│   │
│  │  - Chat Logs     │  │  - JSON Parsing  │  │  or Fallback │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## AI Model Details

### **Base Model: Google FLAN-T5-Base**

**Model Type:** Sequence-to-Sequence (Seq2Seq) with Fine-tuning  
**Architecture:** Transformer-based encoder-decoder  
**Base Size:** ~250M parameters  

#### **Model Capabilities:**
- Text-to-text tasks (question answering, summarization, translation)
- Instruction-following using natural language
- Long-context understanding
- Efficient inference on CPU/GPU

### **Fine-Tuning Approach: LoRA (Low-Rank Adaptation)**

**Why LoRA?**
- Parameter-Efficient: Only ~0.8% of parameters are trainable
- Fast Training: Reduces GPU memory requirements
- Easy Deployment: Lightweight adapter files
- Better Generalization: Prevents overfitting on healthcare data

**LoRA Configuration:**
```python
LoRA Rank (r): 8
LoRA Alpha (α): 16
Target Modules: Query, Value, Output layers
Dropout: 0.05
```

### **Training Data**
- **Dataset:** Healthcare Q&A dataset with medical terminology
- **Size:** Large-scale healthcare queries
- **Domain:** General medical information, symptom checking, health guidance
- **Topics:** Common diseases, treatments, preventive care

### **Model Output:**
- Generates healthcare responses in natural language
- Limited to 256 tokens (~200 words per response)
- Configurable temperature for response creativity

### **Integration Pipeline:**

```
User Input (Text/Voice)
    ↓
Tokenization (Sentence Piece)
    ↓
Embeddings (Base Model)
    ↓
LoRA Adapter Application
    ↓
Inference (Transformers + PEFT)
    ↓
Token Decoding
    ↓
Output Text (Formatted Response)
```

---

## Workflow & Data Flow

### **1. User Registration & Authentication Flow**

```
User Input (Registration Form)
    ↓
Validation (Email format, password strength)
    ↓
Password Hashing (SHA-256 + Salt)
    ↓
MongoDB Insert (Users collection)
    ↓
Session Token Generation (UUID + Secrets)
    ↓
User Profile Created
    ↓
Redirect to Login
```

**Stored User Data:**
- username (unique)
- email (unique)
- password_hash
- full_name
- age, gender
- allergies
- emergency_contact
- emergency_auto_send (boolean)
- created_at timestamp
- last_login timestamp

### **2. Text-Based Chat Flow**

```
User Types Question
    ↓
Frontend Validation
    ↓
API Call: /chat/text (POST)
    │
    ├─→ Backend Receives Request
    │   ├─→ User Authentication Check
    │   ├─→ Message Validation
    │   ├─→ Store in MongoDB (chat_logs collection)
    │   ├─→ Build User Context (mood, symptoms, history)
    │   ├─→ Load Fine-tuned Model
    │   │   ├─→ Tokenize Input
    │   │   ├─→ Apply LoRA Adapter
    │   │   ├─→ Generate Response
    │   │   └─→ Decode Tokens to Text
    │   ├─→ Format Response with Context
    │   └─→ Return JSON Response
    │
    ↓
Frontend Receives Response
    ↓
Display Response in Chat
    ↓
User Sees Answer
```

### **3. Voice Input Flow (Speech-to-Text)**

```
User Clicks Microphone Icon
    ↓
Browser Requests Microphone Access
    ↓
frontend: recordAudio() -> WebAPI MediaRecorder
    ↓
User Speaks (Recording Indicator Shows)
    ↓
User Clicks Stop or Auto-detects Silence
    ↓
Audio Blob Created (WAV Format)
    ↓
API Call: /chat/voice (POST with multipart/form-data)
    │
    ├─→ Backend Receives Audio File
    │   ├─→ Validate File Size (<25MB)
    │   ├─→ Convert to Supported Format (if needed)
    │   ├─→ Speech Recognition Library
    │   │   └─→ Extract Text from Audio
    │   ├─→ Proceed as Text-Based Flow (above)
    │   └─→ Return Text + Voice Response
    │
    ↓
Frontend Receives Response + Audio URL
    ↓
Display Text Response
    ↓
Play Audio Response (Optional)
```

### **4. Emergency Detection Flow**

```
User Message Received
    ↓
Frontend: Check for Emergency Keywords
├─→ Keywords: "chest pain", "heart attack", "stroke", "911", etc.
    ↓
IF Emergency Detected:
    │
    ├─→ Show Emergency Banner
    ├─→ Display 911/108/999/112 Links
    ├─→ Check User Settings (emergencyAutoSend)
    │
    ├─→IF Auto-Send Enabled:
    │   │
    │   ├─→ Fetch Emergency Contact Email
    │   ├─→ Fetch User Location (if granted)
    │   ├─→ API Call: /emergency/send-alert (POST)
    │   │   │
    │   │   ├─→ Backend:
    │   │   │   ├─→ Validate Request
    │   │   │   ├─→ Build Emergency Email
    │   │   │   ├─→ Include User Info + Location
    │   │   │   ├─→ Send via FastAPI-Mail
    │   │   │   └─→ Log Emergency Event
    │   │   │
    │   ├─→ Show Confirmation to User
    │
    └─→ ELSE: Just show banner (manual action only)
```

### **5. Pro Tips Generation Flow**

```
User's Latest Message + Context Available
    ↓
Trigger: Manual Refresh or Auto-refresh After Response
    ↓
Prepare Data:
├─→ Last 10 messages from chat history
├─→ User health context (mood, symptoms, topics)
├─→ User profile info (age, allergies, etc.)
    ↓
API Call: /tips/generate (POST)
    │
    ├─→ Backend Receives Request
    │   ├─→ Validate User Authentication
    │   ├─→ Fetch User Context
    │   ├─→ Prepare Prompt for Gemini:
    │   │   ├─→ System prompt (professional healthcare assistant)
    │   │   ├─→ User health context
    │   │   ├─→ Recent chat messages
    │   │   └─→ Instruction: Return JSON with tips + urgency
    │   │
    │   ├─→ Call Gemini API (generateContent)
    │   │   ├─→ Set Temperature: 0.2 (deterministic)
    │   │   ├─→ Max Tokens: 250
    │   │   └─→ Parse JSON Response
    │   │
    │   ├─→ Validate Response Format
    │   ├─→ Extract: tips (array), urgency (low|medium|high)
    │   └─→ Return Formatted Tips Response
    │
    ↓
Frontend Receives Tips
    ↓
ProTips Component:
├─→ Display Urgency Badge
├─→ Show Tips in Carousel
├─→ Allow Manual Refresh
└─→ Store Refresh Timestamp
    ↓
User Sees Personalized Health Tips
```

### **6. Health Dashboard Analytics Flow**

```
User Opens Health Dashboard
    ↓
Fetch All User's Messages from MongoDB
    ↓
Analyze Message Data:
├─→ Count total messages
├─→ Separate user vs bot messages
├─→ Count voice queries (isVoice flag)
├─→ Identify questions (ending with ?)
├─→ Extract topic keywords
│   ├─→ Search for: diabetes, heart, covid, allergy, headache, etc.
│   └─→ Count occurrences per topic
├─→ Sort topics by frequency
└─→ Prepare stats object
    ↓
Display Dashboard:
├─→ Total conversations stat
├─→ Voice queries stat
├─→ Questions asked stat
├─→ Top 5 topics with bar chart
└─→ Message ratio pie chart
```

---

## Project Structure

```
KIET_AID_Team_2/
│
├── README.md                           # Project overview
├── PROJECT_DOCUMENTATION.md            # THIS FILE
│
├── Backend/
│   ├── app.py                          # Main FastAPI application (450+ lines)
│   ├── auth.py                         # Authentication & user management
│   ├── database.py                     # MongoDB connection & queries
│   ├── email_utils.py                  # Email sending utilities
│   ├── gemini_integration.py           # Gemini API integration
│   ├── requirements.txt                # Python dependencies
│   ├── .env                            # Environment variables (not in repo)
│   │
│   ├── users.json                      # User data (fallback storage)
│   ├── chat_logs.json                  # Chat history (fallback storage)
│   │
│   ├── check_gemini.py                 # Gemini API testing script
│   ├── check_mongodb.py                # MongoDB connection test
│   ├── mongodb_status.py               # MongoDB status checker
│   ├── list_users.py                   # List stored users
│   ├── show_email_index.py             # Email index viewer
│   ├── test_integration.py             # Integration tests
│   ├── test_mongodb.py                 # MongoDB tests
│   │
│   ├── model/
│   │   ├── adapter_config.json         # LoRA adapter configuration
│   │   └── adapter_model.safetensors   # Trained LoRA weights
│   │
│   ├── merged_model/                   # Optional: Fully merged model
│   │
│   └── training/
│       └── models/
│           ├── training.py             # Training script (Google Colab)
│           └── interferance.py         # Inference script
│
├── frontend/Healthcare/
│   ├── package.json                    # Node dependencies
│   ├── vite.config.js                  # Vite configuration
│   ├── index.html                      # HTML entry point
│   ├── eslint.config.js                # ESLint configuration
│   ├── README.md                       # Frontend guide
│   │
│   ├── public/                         # Static assets
│   │
│   └── src/
│       ├── main.jsx                    # React entry point
│       ├── App.jsx                     # Main App component
│       ├── App.css                     # Global styles
│       ├── index.css                   # Base styles
│       │
│       ├── assets/                     # Images, icons, media
│       │
│       ├── constants/                  # Constants & config
│       │
│       ├── hooks/                      # Custom React hooks
│       │
│       ├── utils/                      # Utility functions
│       │
│       ├── compontents/
│       │   ├── Home.jsx                # Home page
│       │   ├── Home.css
│       │   ├── HealthcareChatbot.jsx   # Main chatbot component
│       │   ├── HealthcareChatbot.css
│       │   ├── Login.jsx               # Login form
│       │   ├── Signup.jsx              # Registration form
│       │   ├── Profile.jsx             # User profile
│       │   ├── Footer.jsx              # Footer component
│       │   │
│       │   ├── Auth.css                # Authentication styles
│       │   ├── Footer.css
│       │   ├── Profile.css
│       │   │
│       │   ├── chatbot/                # Chatbot sub-components
│       │   │
│       │   └── features/               # Advanced features
│       │       ├── index.js            # Feature exports
│       │       ├── ProTips.jsx         # AI-generated health tips
│       │       ├── ProTips.css
│       │       ├── EmergencySOS.jsx    # Emergency button & detection
│       │       ├── EmergencySOS.css
│       │       ├── HealthDashboard.jsx # Analytics dashboard
│       │       ├── HealthDashboard.css
│       │       ├── HealthTips.jsx      # Static health tips
│       │       ├── HealthTips.css
│       │       ├── SymptomBodyMap.jsx  # Body symptom selector (deprecated)
│       │       ├── MoodTracker.jsx     # Mood tracking (deprecated)
│       │       ├── ChatExport.jsx      # Export conversations
│       │       ├── Toolbar.jsx         # Feature toolbar
│       │       ├── Toolbar.css
│       │       │
│       │       ├── contextBuilder.js   # Build user context from messages
│       │       ├── featureUtils.js     # Utility functions for features
│       │       ├── responseEnhancer.js # Enhance responses with context
│       │       ├── tipsDatabase.js     # Static tips database
│       │       │
│       │       ├── PRO_TIPS_GUIDE.md   # Pro Tips documentation
│       │       ├── TIPS_CAROUSEL_GUIDE.md
│       │       ├── CSS_CHANGES_DETAILED.md
│       │       └── TIPS_CAROUSEL_SUMMARY.md
```

---

## Backend Architecture

### **FastAPI Application Structure (app.py)**

```python
# 1. INITIALIZATION
├── Import all required libraries
├── Setup logging
├── Load environment variables
└── Initialize FastAPI app

# 2. MIDDLEWARE & CONFIGURATION
├── CORS middleware (allow all origins in dev)
├── Device selection (CUDA/CPU)
└── Model path configuration

# 3. PYDANTIC MODELS (Data Validation)
├── TextInput: { text, user_id, conversation_id }
├── VoiceResponse: { status, transcription, response, audio_url }
├── ChatResponse: { message_id, type, text, timestamp }
├── ProfileUpdateRequest: User profile fields
└── (Many more request/response models)

# 4. MODEL LOADING (Lazy Loading on First Request)
├── Load Tokenizer (Sentence Piece)
├── Load Base Model (FLAN-T5-Base)
├── Load LoRA Adapter (PEFT)
├── Move to Device (GPU/CPU)
└── Cache in memory for subsequent requests

# 5. CORE ENDPOINTS

## Authentication Endpoints
├── POST /auth/register
│   └── Create new user with validation
├── POST /auth/login
│   └── Validate credentials, return session token
├── POST /auth/logout
│   └── Invalidate session
└── POST /auth/verify
    └── Check valid session token

## Chat Endpoints
├── POST /chat/text
│   ├── Receive text message
│   ├── Load model
│   ├── Generate response
│   └── Return text response
├── POST /chat/voice
│   ├── Receive audio file
│   ├── Speech-to-text conversion
│   ├── Process like /chat/text
│   └── Return text + audio response
└── WebSocket /ws
    └── Real-time two-way communication

## User Management Endpoints
├── GET /user/profile
│   └── Fetch user profile data
├── PUT /user/profile
│   └── Update user information
├── GET /user/conversations
│   └── List all user conversations
├── DELETE /user/conversation/{id}
│   └── Delete conversation
└── GET /user/chat-history
    └── Fetch chat history with pagination

## Tips & Features Endpoints
├── POST /tips/generate
│   ├── Prepare context
│   ├── Call Gemini API
│   └── Return tips + urgency
└── GET /health-tips
    └── Return static health tips

## Emergency Endpoints
├── POST /emergency/send-alert
│   ├── Validate emergency
│   ├── Get emergency contacts
│   ├── Send email notification
│   └── Return confirmation
└── POST /emergency/call-handler
    └── Log emergency call

## System Endpoints
├── GET /health
│   └── Check API status
├── GET /docs
│   └── Swagger documentation
└── GET /redoc
    └── ReDoc documentation

# 6. HELPER FUNCTIONS
├── generate_response(text, tokenizer, model)
├── process_audio_file(file, format)
├── build_context(user_id)
├── send_emergency_email(recipient, context)
├── rate_limit_check(user_id)
└── cache_management()

# 7. ERROR HANDLING & LOGGING
├── HTTP Exception handlers
├── Validation error handlers
├── Logging for all operations
└── Error response formatting
```

### **Authentication Module (auth.py)**

**Key Features:**
- User registration with validation
- Secure password hashing (SHA-256 + salt)
- Session token generation & validation
- 30-day session expiry
- MongoDB integration with JSON fallback

**Data Model:**
```json
{
  "user_id": "uuid",
  "username": "string (unique)",
  "email": "string (unique)",
  "password_hash": "string",
  "full_name": "string",
  "age": "integer",
  "gender": "string",
  "allergies": "string",
  "emergency_contact": "string",
  "emergency_auto_send": "boolean",
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

### **Database Module (database.py)**

**MongoDB Collections:**

1. **users**
   - Stores user profiles & authentication
   - Unique indexes: username, email
   - Fields: All user registration data

2. **chat_logs**
   - Stores conversation messages
   - Fields: user_id, conversation_id, sender, message, timestamp, is_voice
   - Index: user_id for fast retrieval

3. **sessions**
   - Stores active sessions
   - Fields: user_id, token, created_at, expires_at
   - TTL index: auto-delete after 30 days

4. **conversations**
   - Stores conversation metadata
   - Fields: user_id, title, created_at, updated_at, message_count
   - Indexed: user_id for fast retrieval

### **Gemini Integration Module (gemini_integration.py)**

```python
async def generate_tips_via_gemini(user_context, messages):
    """
    Args:
        user_context: { moodEmoji, mood, symptoms[], topics{} }
        messages: Last 10 chat messages
    
    Returns:
        { "tips": [...], "urgency": "low|medium|high" }
    
    Process:
    1. Build prompt with user context
    2. Call Gemini API (v1/generativeLanguage)
    3. Parse JSON response
    4. Validate tips format
    5. Return structured response
    """
```

**Configuration:**
- API Key: from `GEMINI_API_KEY` environment variable
- Endpoint: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`
- Temperature: 0.2 (deterministic)
- Max Tokens: 250
- Async HTTP client: HTTPX

---

## Frontend Architecture

### **React Component Hierarchy**

```
App (Root)
├── Router / Navigation
├── Home
│   └── Hero, Features, CTA
├── Login
│   └── Login form with validation
├── Signup
│   ├── Registration form
│   └── Health info collection
├── HealthcareChatbot (Main)
│   ├── Header
│   │   ├── User Profile Menu
│   │   ├── Settings
│   │   └── Logout
│   │
│   ├── Main Chat Area
│   │   ├── Messages Display
│   │   │   └── Message Component (user/bot)
│   │   ├── Input Area
│   │   │   ├── Text Input Field
│   │   │   ├── Send Button
│   │   │   └── Voice Record Button
│   │   └── Voice Assistant Panel (optional)
│   │
│   ├── Sidebar
│   │   ├── Conversation List
│   │   ├── New Conversation Button
│   │   └── Settings
│   │
│   └── Features (Modular)
│       ├── ProTips Component
│       │   ├── Tips Display
│       │   ├── Refresh Button
│       │   └── Urgency Indicator
│       ├── EmergencySOS Component
│       │   ├── Emergency Banner
│       │   ├── Hotline Links
│       │   └── Alert Email Sender
│       ├── HealthDashboard Component
│       │   ├── Statistics
│       │   ├── Topic Analysis
│       │   └── Charts
│       ├── HealthTips Component
│       │   └── Static Tips Display
│       ├── ChatExport Component
│       │   └── Download Conversation
│       └── Toolbar Component
│           └── Feature Buttons
│
├── Profile
│   ├── User Info Display
│   ├── Edit Forms
│   └── Settings
│
└── Footer
    └── Links, Copyright
```

### **State Management (HealthcareChatbot.jsx)**

```javascript
// Messages & Conversation
const [messages, setMessages] = useState([]); // All chat messages
const [conversations, setConversations] = useState([]); // Conversation list
const [activeConversationId, setActiveConversationId] = useState(null);

// UI State
const [sidebarOpen, setSidebarOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [inputText, setInputText] = useState('');

// Voice State
const [isRecording, setIsRecording] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const [voiceSupported, setVoiceSupported] = useState(true);
const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);
const [assistantState, setAssistantState] = useState('idle'); // idle|listening|processing|speaking

// User Context (for Pro Tips)
const [userContext, setUserContext] = useState({});

// Voice Configuration
const [autoSpeak, setAutoSpeak] = useState(true); // Auto-read responses
const [continuousMode, setContinuousMode] = useState(true); // Auto-listen after response
const [selectedVoice, setSelectedVoice] = useState(null);
```

### **Key Features Implementation**

#### **1. Voice Recording (Web Audio API)**
```javascript
recordAudio() {
  // 1. Get microphone access via getUserMedia
  // 2. Create MediaRecorder instance
  // 3. Collect audio chunks
  // 4. Stop on user click or silence detection
  // 5. Create Blob from chunks
  // 6. Send to backend
}
```

#### **2. Message Sending**
```javascript
async sendMessage() {
  // 1. Validate input
  // 2. Add message to UI (optimistic)
  // 3. POST to /chat/text or /chat/voice
  // 4. Show loading state
  // 5. Append response message
  // 6. Trigger ProTips refresh
  // 7. Check for Emergency keywords
}
```

#### **3. Voice Output (Text-to-Speech)**
```javascript
speakResponse(text) {
  // 1. Create SpeechSynthesisUtterance
  // 2. Select voice (if specified)
  // 3. Set rate, pitch, volume
  // 4. Trigger synthesis
  // 5. Handle completion
}
```

#### **4. Pro Tips Generation**
```javascript
async fetchProTips() {
  // 1. Collect last 10 messages
  // 2. Build context from user data
  // 3. POST to /tips/generate
  // 4. Parse response (tips[], urgency)
  // 5. Update UI carousel
  // 6. Set refresh timestamp
}
```

---

## API Endpoints

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| POST | `/auth/register` | Create new user | - | `UserCreate` | `{user_id, username, token}` |
| POST | `/auth/login` | User login | - | `UserLogin` | `{user_id, username, token}` |
| POST | `/auth/logout` | Invalidate session | ✓ | - | `{status: "success"}` |
| GET | `/auth/verify` | Check session | ✓ | - | `{valid: true, user_id}` |

### **Chat Endpoints**

| Method | Endpoint | Description | Auth | Content-Type | Response |
|--------|----------|-------------|------|------|----------|
| POST | `/chat/text` | Send text message | ✓ | application/json | `{response_id, text, timestamp}` |
| POST | `/chat/voice` | Send audio file | ✓ | multipart/form-data | `{text, response_text}` |
| WebSocket | `/ws` | Real-time chat | ✓ | - | Real-time messages |
| GET | `/chat-history` | Get past messages | ✓ | - | `{messages: [...]}` |

### **User Profile Endpoints**

| Method | Endpoint | Description | Auth | Response |
|--------|----------|-------------|------|----------|
| GET | `/user/profile` | Fetch user data | ✓ | UserResponse |
| PUT | `/user/profile` | Update profile | ✓ | `{status, user}` |
| GET | `/user/conversations` | List conversations | ✓ | `{conversations: [...]}` |
| POST | `/user/conversation` | Create new | ✓ | `{conversation_id}` |
| DELETE | `/user/conversation/{id}` | Delete conversation | ✓ | `{status}` |

### **Features Endpoints**

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| POST | `/tips/generate` | Generate Pro Tips | `{tips: [...], urgency}` |
| GET | `/health-tips` | Static tips | `{tips: [...]}` |
| POST | `/emergency/send-alert` | Send emergency email | `{status, sent_to}` |

### **System Endpoints**

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/health` | API status | `{status: "operational"}` |
| GET | `/docs` | Swagger UI | HTML |
| GET | `/openapi.json` | OpenAPI spec | JSON |

---

## Setup & Installation

### **Prerequisites**

```
Python 3.8+
Node.js 16+
MongoDB Atlas account (free tier available)
Google Gemini API key
SMTP credentials for email (optional, for emergency alerts)
```

### **Backend Setup**

```bash
# 1. Navigate to Backend directory
cd Backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file with configuration
cat > .env << EOF
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro

# Email (Optional)
EMAIL_BACKEND=fastapi_mail
FASTAPI_MAIL_SERVER=smtp.gmail.com
FASTAPI_MAIL_PORT=587
FASTAPI_MAIL_USERNAME=your_email@gmail.com
FASTAPI_MAIL_PASSWORD=your_app_password
FASTAPI_MAIL_FROM=your_email@gmail.com
FASTAPI_MAIL_TLS=true

# Model
MODEL_PATH=./model
DEVICE=cuda  # or 'cpu'
EOF

# 6. Verify MongoDB connection
python check_mongodb.py

# 7. Verify Gemini API
python check_gemini.py

# 8. Run the FastAPI server
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Server will be at: http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

### **Frontend Setup**

```bash
# 1. Navigate to frontend directory
cd frontend/Healthcare

# 2. Install Node dependencies
npm install

# 3. Create .env file
cat > .env.local << EOF
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000
EOF

# 4. Start development server
npm run dev

# 5. Frontend will be at: http://localhost:5173
```

### **Production Deployment**

**Backend (Gunicorn + Uvicorn):**
```bash
pip install gunicorn

gunicorn app:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

**Frontend (Build + Serve):**
```bash
npm run build  # Creates dist/ folder
npm run preview  # Test production build locally

# Deploy dist/ folder to static hosting (Vercel, Netlify, etc.)
```

---

## Database Schema

### **Users Collection**

```json
{
  "_id": ObjectId,
  "user_id": "uuid-string",
  "username": "string (unique, indexed)",
  "email": "string (unique, indexed)",
  "password_hash": "string",
  "full_name": "string",
  "age": "integer",
  "gender": "string (M/F/Other)",
  "allergies": "string",
  "emergency_contact": "string",
  "emergency_auto_send": "boolean",
  "created_at": "ISO DateTime",
  "last_login": "ISO DateTime",
  "is_active": "boolean"
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)
- `created_at` (for sorting)

### **ChatLogs Collection**

```json
{
  "_id": ObjectId,
  "message_id": "uuid-string",
  "user_id": "uuid-string (indexed)",
  "conversation_id": "uuid-string (indexed)",
  "sender": "string (user/bot)",
  "text": "string",
  "is_voice": "boolean",
  "timestamp": "ISO DateTime",
  "metadata": {
    "source": "text|voice|api",
    "response_time_ms": "integer",
    "model_used": "string"
  }
}
```

**Indexes:**
- `user_id` (for user's chat retrieval)
- `conversation_id` (for conversation retrieval)
- `timestamp` (for sorting)

### **Conversations Collection**

```json
{
  "_id": ObjectId,
  "conversation_id": "uuid-string",
  "user_id": "uuid-string (indexed)",
  "title": "string",
  "created_at": "ISO DateTime",
  "updated_at": "ISO DateTime",
  "message_count": "integer",
  "last_message_preview": "string (first 100 chars)",
  "is_archived": "boolean"
}
```

**Indexes:**
- `user_id` (for user's conversations)
- `updated_at` (for sorting/filtering)

### **Sessions Collection**

```json
{
  "_id": ObjectId,
  "session_token": "string (unique, indexed)",
  "user_id": "uuid-string (indexed)",
  "created_at": "ISO DateTime",
  "expires_at": "ISO DateTime",
  "is_active": "boolean",
  "ip_address": "string",
  "user_agent": "string"
}
```

**Indexes:**
- `session_token` (unique)
- `user_id` (for user's sessions)
- `expires_at` (TTL index: auto-delete after 30 days)

### **TipGenerationLogs Collection** (Optional)

```json
{
  "_id": ObjectId,
  "user_id": "uuid-string",
  "generated_at": "ISO DateTime",
  "tips": ["string"],
  "urgency": "string (low|medium|high)",
  "context_used": { "symptoms": [], "mood": "string" },
  "gemini_tokens_used": "integer"
}
```

---

## Key Technologies Explained

### **FLAN-T5 Model**
- **Why:** Instruction-following capability, efficient on consumer hardware
- **Advantage:** Can be fine-tuned with LoRA without requiring massive GPU
- **Size:** ~250M parameters (manageable for deployment)

### **LoRA Fine-Tuning**
- **Why:** Reduces parameters from 250M to ~2M trainable
- **Advantage:** Fast training, small deployment size (~5MB)
- **Result:** ~90% effective compared to full fine-tuning

### **MongoDB**
- **Why:** Flexible schema for JSON documents
- **Advantage:** Easy scaling, good for chat data
- **Cost:** Free tier available (Atlas)

### **FastAPI**
- **Why:** Modern async framework, automatic API documentation
- **Advantage:** High performance, easy WebSocket support
- **Feature:** Built-in Swagger/OpenAPI

### **React**
- **Why:** Component-based, fast rendering, large ecosystem
- **Advantage:** Real-time chat UI updates
- **Tools:** Vite for fast development

### **WebSocket**
- **Why:** Real-time two-way communication
- **Advantage:** Low latency chat experience
- **Use:** Live message streaming, voice input

---

## Summary

This healthcare chatbot is a **production-ready full-stack application** that combines:
- **AI/ML:** Fine-tuned FLAN-T5 model with LoRA
- **Backend:** FastAPI with MongoDB & Gemini integration
- **Frontend:** React with real-time voice support
- **Features:** Emergency detection, personalized tips, health dashboard

The architecture is **scalable, secure, and maintainable**, with clear separation of concerns and proper error handling throughout.

---

**Document Version:** 1.0  
**Last Updated:** April 15, 2026  
**Maintained By:** KIET AID Team 2
