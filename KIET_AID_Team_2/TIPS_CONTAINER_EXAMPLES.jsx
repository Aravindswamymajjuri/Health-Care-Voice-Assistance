/**
 * TIPS & PRECAUTIONS CONTAINER - QUICK INTEGRATION EXAMPLES
 * 
 * Copy-paste these examples into your HealthcareChatbot component
 */

// =====================================================================
// EXAMPLE 1: BASIC INTEGRATION (Add to HealthcareChatbot.jsx)
// =====================================================================

import { TipsAndPrecautionsContainer } from './features';

function HealthcareChatbot() {
  const [userContext, setUserContext] = useState({});
  const [messages, setMessages] = useState([]);

  return (
    <div className="chatbot-wrapper">
      {/* ADD THIS: Tips Container */}
      <TipsAndPrecautionsContainer
        userContext={userContext}
        chatMessages={messages}
        onDismiss={() => console.log('Tips dismissed')}
      />

      {/* Your existing chat UI */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.type}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// EXAMPLE 2: CONDITIONAL RENDERING (Show only with mood/symptoms)
// =====================================================================

function HealthcareChatbot() {
  const [userContext, setUserContext] = useState({});

  // Only show tips when we have context
  const shouldShowTips = userContext?.mood || userContext?.symptoms?.length > 0;

  return (
    <div className="chatbot-wrapper">
      {shouldShowTips && (
        <TipsAndPrecautionsContainer
          userContext={userContext}
          chatMessages={messages}
        />
      )}
    </div>
  );
}

// =====================================================================
// EXAMPLE 3: WITH STATE TOGGLING (Show/Hide)
// =====================================================================

function HealthcareChatbot() {
  const [userContext, setUserContext] = useState({});
  const [showTips, setShowTips] = useState(true);

  return (
    <div className="chatbot-wrapper">
      <button onClick={() => setShowTips(!showTips)}>
        {showTips ? 'Hide' : 'Show'} Tips
      </button>

      {showTips && (
        <TipsAndPrecautionsContainer
          userContext={userContext}
          chatMessages={messages}
          onDismiss={() => setShowTips(false)}
        />
      )}
    </div>
  );
}

// =====================================================================
// EXAMPLE 4: POSITION VARIANTS (Different layouts)
// =====================================================================

// Top Position (Above chat)
<div className="chatbot-layout">
  <TipsAndPrecautionsContainer ... />  {/* Tips at top */}
  <div className="chat-area">
    <ChatMessages />
  </div>
</div>

// Side Position (Left sidebar)
<div className="chatbot-layout sidebar">
  <aside className="sidebar-tips">
    <TipsAndPrecautionsContainer ... />
  </aside>
  <main className="chat-area">
    <ChatMessages />
  </main>
</div>

// Bottom Position (Below chat)
<div className="chatbot-layout">
  <div className="chat-area">
    <ChatMessages />
  </div>
  <TipsAndPrecautionsContainer ... />  {/* Tips at bottom */}
</div>

// =====================================================================
// EXAMPLE 5: UPDATING USER CONTEXT (From chat or mood tracker)
// =====================================================================

function HealthcareChatbot() {
  const [userContext, setUserContext] = useState({});

  // Update context when user selects mood
  const handleMoodChange = (mood) => {
    setUserContext(prev => ({
      ...prev,
      mood: { name: mood, emoji: getMoodEmoji(mood) }
    }));
  };

  // Update context when symptoms are added
  const handleAddSymptom = (symptom) => {
    setUserContext(prev => ({
      ...prev,
      symptoms: [...(prev.symptoms || []), symptom]
    }));
  };

  return (
    <div>
      {/* Mood Selector */}
      <MoodSelector onChange={handleMoodChange} />

      {/* Symptom Selector */}
      <SymptomSelector onChange={handleAddSymptom} />

      {/* Tips Container automatically uses updated context */}
      <TipsAndPrecautionsContainer
        userContext={userContext}
        chatMessages={messages}
      />
    </div>
  );
}

// =====================================================================
// EXAMPLE 6: WITH CONTEXT PROVIDER (Advanced state management)
// =====================================================================

// Create ChatContext.js
const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [userContext, setUserContext] = useState({});
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider value={{ userContext, messages, setUserContext, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

// Use in component
function HealthcareChatbot() {
  const { userContext, messages } = useContext(ChatContext);

  return (
    <TipsAndPrecautionsContainer
      userContext={userContext}
      chatMessages={messages}
    />
  );
}

// =====================================================================
// EXAMPLE 7: CSS LAYOUT - SIDE BY SIDE
// =====================================================================

/* CSS for sidebar layout */
.chatbot-layout {
  display: grid;
  grid-template-columns: 350px 1fr;  /* Tips container on left */
  gap: 16px;
  height: 100vh;
}

.tips-sidebar {
  overflow-y: auto;
  border-right: 1px solid #eee;
}

.chat-area {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Mobile: stack vertically */
@media (max-width: 768px) {
  .chatbot-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .tips-sidebar {
    border-right: none;
    border-bottom: 1px solid #eee;
    max-height: 30vh;
  }
}

// =====================================================================
// EXAMPLE 8: CSS LAYOUT - TOP POSITION
// =====================================================================

.chatbot-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 16px;
  padding: 16px;
}

.tips-container-wrapper {
  max-height: 300px;  /* Fixed height */
  overflow-y: auto;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
}

// =====================================================================
// EXAMPLE 9: WITH ANIMATION
// =====================================================================

function HealthcareChatbot() {
  const [showTips, setShowTips] = useState(false);

  return (
    <div>
      {showTips && (
        <div className="tips-slide-in">
          <TipsAndPrecautionsContainer
            onDismiss={() => setShowTips(false)}
            userContext={userContext}
            chatMessages={messages}
          />
        </div>
      )}
    </div>
  );
}

/* CSS Animation */
.tips-slide-in {
  animation: slideIn 0.4s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// =====================================================================
// EXAMPLE 10: FULL INTEGRATION EXAMPLE
// =====================================================================

import React, { useState, useCallback } from 'react';
import { TipsAndPrecautionsContainer, MoodTracker, SymptomSelector } from './features';

export default function HealthcareChatbot() {
  // State
  const [userContext, setUserContext] = useState({
    mood: null,
    symptoms: [],
    topics: {},
    urgency: 'low'
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');

  // Handle mood change
  const handleMoodChange = useCallback((mood) => {
    setUserContext(prev => ({
      ...prev,
      mood: { name: mood, emoji: getMoodEmoji(mood) }
    }));
  }, []);

  // Handle symptom selection
  const handleAddSymptom = useCallback((symptom) => {
    setUserContext(prev => ({
      ...prev,
      symptoms: [...(prev.symptoms || []), symptom]
    }));
  }, []);

  // Send message
  const handleSendMessage = useCallback((text) => {
    // Add user message
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    }]);

    // API call to get response
    // ...

    setInputText('');
  }, []);

  return (
    <div className="healthcare-chatbot">
      {/* Header */}
      <div className="chatbot-header">
        <h1>Healthcare Assistant</h1>
        <p>Tell me how you're feeling</p>
      </div>

      {/* Mood & Symptom Selection */}
      <div className="context-selection">
        <MoodTracker onChange={handleMoodChange} />
        <SymptomSelector onChange={handleAddSymptom} />
      </div>

      {/* Tips Container - Main UI */}
      <div className="tips-section">
        <TipsAndPrecautionsContainer
          userContext={userContext}
          chatMessages={chatMessages}
          onDismiss={() => {
            // Optional: hide tips
          }}
        />
      </div>

      {/* Chat Area */}
      <div className="chat-section">
        <div className="chat-messages">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`message message-${msg.type}`}>
              <p>{msg.text}</p>
              <time>{msg.timestamp.toLocaleTimeString()}</time>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="chat-input">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputText);
            }}
            placeholder="Type your message..."
          />
          <button onClick={() => handleSendMessage(inputText)}>
            Send
          </button>
          <button onClick={() => setIsRecording(!isRecording)}>
            🎤 Voice
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function
function getMoodEmoji(mood) {
  const emojis = {
    anxious: '😰',
    sad: '😢',
    tired: '😴',
    happy: '😊',
    neutral: '😐',
    stressed: '😰'
  };
  return emojis[mood] || '😐';
}

// =====================================================================
// STYLING - Main Layout
// =====================================================================

.healthcare-chatbot {
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 0;
  background: #f5f7fa;
}

.chatbot-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.context-selection {
  padding: 16px 20px;
  background: white;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
}

.tips-section {
  padding: 0 20px;
  max-height: 35vh;
  overflow-y: auto;
  background: white;
}

.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-user {
  align-self: flex-end;
  max-width: 70%;
  background: #667eea;
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
}

.message-bot {
  align-self: flex-start;
  max-width: 70%;
  background: #f0f0f0;
  color: #333;
  padding: 12px 16px;
  border-radius: 12px;
}

.chat-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.chat-input button {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

// =====================================================================
// SUMMARY
// =====================================================================

/*
Use TipsAndPrecautionsContainer by:

1. Importing:
   import { TipsAndPrecautionsContainer } from './features';

2. Adding to JSX:
   <TipsAndPrecautionsContainer
     userContext={userContext}
     chatMessages={messages}
     onDismiss={() => {...}}
   />

3. Updating userContext:
   setUserContext(prev => ({
     ...prev,
     mood: { name: 'anxious' },
     symptoms: ['stress', 'headache'],
     urgency: 'medium'
   }))

4. The component handles:
   ✅ Auto-fetch tips from API
   ✅ Categorize into Tips/Precautions/Wellness
   ✅ Display with carousel navigation
   ✅ Track precaution completion
   ✅ Show metadata (mood/symptoms)
   ✅ Responsive mobile design
   ✅ Error handling & fallback

That's it! ✨
*/
