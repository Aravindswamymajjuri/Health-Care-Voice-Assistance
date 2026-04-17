import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProTips.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * ProTips Component
 * 
 * Generates personalized pro tips and precautions based on the current chat context.
 * Uses Gemini API to analyze user's health concerns and provide AI-generated advice.
 * 
 * Props:
 *   - messages: Array of chat messages (user + assistant)
 *   - userContext: Object with mood, symptoms, health data
 *   - triggerRefresh: External trigger to refresh tips (number)
 */
const ProTips = ({ messages = [], userContext = {}, triggerRefresh = 0, onTipsUpdate }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [urgency, setUrgency] = useState('low');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Fetch pro tips from backend
  const fetchProTips = async () => {
    if (!messages || messages.length === 0) {
      setTips([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare messages for API (last 10 messages for context)
      const recentMessages = messages.slice(-10).map(m => ({
        type: m.type || 'user',
        text: m.text || '',
        content: m.content || '',
        timestamp: m.timestamp,
        role: m.role || m.type || 'user'
      }));

      // Build user context
      const contextPayload = {
        mood: userContext.mood || userContext.moodState || 'neutral',
        moodEmoji: userContext.moodEmoji || '',
        symptoms: userContext.symptoms || [],
        topics: userContext.topics || {},
        age: userContext.age,
        gender: userContext.gender,
        allergies: userContext.allergies
      };

      // Call backend endpoint
      const response = await axios.post(`${API_BASE_URL}/api/generate/tips`, {
        user_context: contextPayload,
        messages: recentMessages
      }, {
        timeout: 15000 // 15 second timeout for Gemini API
      });

      if (response.data && response.data.status === 'success') {
        const fetchedTips = response.data.tips || [];
        const fetchedUrgency = response.data.urgency || 'low';

        setTips(fetchedTips);
        setUrgency(fetchedUrgency);
        setLastUpdated(new Date());
        setError(null);

        // Notify parent component if callback provided
        if (onTipsUpdate) {
          onTipsUpdate({ tips: fetchedTips, urgency: fetchedUrgency });
        }

        console.log('✅ Pro tips generated:', fetchedTips);
      }
    } catch (err) {
      console.error('❌ Error fetching pro tips:', err.message);
      setError(`Failed to generate tips: ${err.message}`);
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh tips when messages change or trigger is updated
  useEffect(() => {
    // Debounce API calls - only fetch if last message is different
    const timer = setTimeout(() => {
      fetchProTips();
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timer);
  }, [triggerRefresh, messages.length]);

  // Get urgency color
  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high':
        return '#d32f2f'; // Red
      case 'medium':
        return '#f57c00'; // Orange
      case 'low':
      default:
        return '#388e3c'; // Green
    }
  };

  // Get urgency icon
  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
      default:
        return '✅';
    }
  };

  // Carousel handlers
  const nextTip = () => {
    if (tips.length > 0) {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }
  };

  const prevTip = () => {
    if (tips.length > 0) {
      setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
    }
  };

  const goToTip = (index) => {
    setCurrentTipIndex(index);
  };

  return (
    <div className="pro-tips-container">
      {/* Header with Urgency Badge */}
      <div className="tips-header">
        <div className="tips-title-section">
          <h3 className="tips-title">💡 Pro Tips & Precautions</h3>
          {loading && <span className="tips-loading-spinner">⏳</span>}
        </div>

        {/* Urgency Badge */}
        {tips.length > 0 && (
          <div 
            className="urgency-badge" 
            style={{ borderColor: getUrgencyColor(urgency) }}
          >
            <span>{getUrgencyIcon(urgency)}</span>
            <span className="urgency-label">{urgency.toUpperCase()} PRIORITY</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="tips-error">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && tips.length === 0 && (
        <div className="tips-loading">
          <div className="loading-spinner"></div>
          <p>Generating personalized tips...</p>
        </div>
      )}

      {/* Tips Carousel */}
      {tips.length > 0 && (
        <div className="tips-carousel-container">
          {/* Main Carousel */}
          <div className="carousel-main">
            <button className="carousel-btn prev-btn" onClick={prevTip} title="Previous tip">
              ❮
            </button>

            <div className="carousel-slide">
              <div className="tip-card">
                <div className="tip-number">Tip {currentTipIndex + 1} of {tips.length}</div>
                <div className="tip-text-large">
                  {tips[currentTipIndex]}
                </div>
                <div className="tip-urgency" style={{ backgroundColor: getUrgencyColor(urgency) }}>
                  {getUrgencyIcon(urgency)} {urgency.toUpperCase()}
                </div>
              </div>
            </div>

            <button className="carousel-btn next-btn" onClick={nextTip} title="Next tip">
              ❯
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {tips.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentTipIndex === index ? 'active' : ''}`}
                onClick={() => goToTip(index)}
                title={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Tips State */}
      {!loading && tips.length === 0 && !error && (
        <div className="tips-empty">
          <p>💬 Start a conversation about your health concerns to get personalized pro tips!</p>
        </div>
      )}

      {/* Refresh Info */}
      {lastUpdated && tips.length > 0 && (
        <div className="tips-footer">
          <small>
            🔄 Updated {new Date(lastUpdated).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </small>
        </div>
      )}

      {/* Manual Refresh Button */}
      {tips.length > 0 && (
        <button 
          className="refresh-tips-btn"
          onClick={fetchProTips}
          disabled={loading}
          title="Refresh pro tips"
        >
          {loading ? '⏳ Refreshing...' : '🔄 Refresh Tips'}
        </button>
      )}
    </div>
  );
};

export default ProTips;
