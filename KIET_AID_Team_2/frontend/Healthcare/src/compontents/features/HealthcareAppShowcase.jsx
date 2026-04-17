import React, { useState } from 'react';
import { ProTipsCarousel } from './index';
import './HealthcareAppShowcase.css';

/**
 * HealthcareAppShowcase - Modern Healthcare Web App Interface
 * 
 * A premium SaaS-style healthcare dashboard featuring:
 * - Pro Tips & Precautions carousel
 * - AI chatbot interface
 * - Real-time messaging
 * - Modern glassmorphism design
 */

const HealthcareAppShowcase = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: 'How to treat fever at home?',
      timestamp: '08:56 pm',
    },
    {
      id: 2,
      type: 'bot',
      text: 'Stay hydrated by drinking water, warm tea, or broth. Rest adequately and use fever-reducing medications like paracetamol. Monitor your temperature regularly.',
      timestamp: '08:56 pm',
    },
  ]);

  const [inputValue, setInputValue] = useState('');

  // Sample tips and precautions
  const tips = [
    'Stay hydrated and drink plenty of fluids.',
    'Get adequate rest and sleep 7-8 hours daily.',
    'Eat balanced meals rich in vitamins and minerals.',
    'Exercise regularly for at least 30 minutes.',
  ];

  const precautions = [
    'Avoid smoking and secondhand smoke exposure.',
    'Wash hands frequently to prevent infections.',
    'Keep wounds clean and covered.',
    'Maintain proper hygiene practices.',
  ];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: 'Based on our healthcare guidelines, this is an important health concern. Please refer to our Pro Tips section and consult with a healthcare professional for personalized advice.',
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 800);
    }
  };

  return (
    <div className="healthcare-app-showcase">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <h1 className="app-title">Healthcare Assistant</h1>
          </div>
          <p className="header-subtitle">Voice & Text Support with AI Model</p>
        </div>
        <div className="user-profile">
          <div className="avatar">A</div>
          <span className="username">Aravind</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Left Sidebar - Info Panel */}
        <aside className="info-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">💚 Health Status</h3>
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className="status-value healthy">Healthy</span>
            </div>
            <div className="status-item">
              <span className="status-label">Last Check-up:</span>
              <span className="status-value">Today</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">⚡ Quick Stats</h3>
            <div className="stat-item">
              <span className="stat-name">Consultations</span>
              <span className="stat-number">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-name">Tips Read</span>
              <span className="stat-number">48</span>
            </div>
          </div>
        </aside>

        {/* Center - Chat & Carousel */}
        <section className="chat-section">
          {/* Pro Tips Carousel */}
          <div className="carousel-container-wrapper">
            <ProTipsCarousel 
              tips={tips}
              precautions={precautions}
              riskLevel="low"
              autoPlayInterval={6000}
            />
          </div>

          {/* Chat Messages Area */}
          <div className="chat-messages-area">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message-bubble message-${msg.type}`}
              >
                <div className="message-content">
                  <p className="message-text">{msg.text}</p>
                </div>
                <span className="message-timestamp">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Chat Input Area */}
          <div className="chat-input-area">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Ask me anything about your health..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="chat-input"
              />
              <button 
                className="send-button"
                onClick={handleSendMessage}
                aria-label="Send message"
              >
                <span className="send-icon">→</span>
              </button>
            </div>
            <div className="input-actions">
              <button className="action-button" title="Voice message">
                <span>🎤</span>
              </button>
              <button className="action-button" title="Attach file">
                <span>📎</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Features */}
        <aside className="features-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">🎯 Quick Access</h3>
            <div className="feature-list">
              <button className="feature-item">
                <span className="feature-icon">🩺</span>
                <span className="feature-name">Symptoms Check</span>
              </button>
              <button className="feature-item">
                <span className="feature-icon">💊</span>
                <span className="feature-name">Medications</span>
              </button>
              <button className="feature-item">
                <span className="feature-icon">📋</span>
                <span className="feature-name">Reports</span>
              </button>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">📞 Support</h3>
            <p className="sidebar-text">
              Need immediate help? Our healthcare specialists are available 24/7.
            </p>
            <button className="contact-button">
              Contact Specialist
            </button>
          </div>
        </aside>
      </main>

      {/* Floating Action Button */}
      <button className="fab-button" title="Voice assistant">
        🎙️
      </button>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 Healthcare Assistant. Your health, our priority.</p>
      </footer>
    </div>
  );
};

export default HealthcareAppShowcase;
