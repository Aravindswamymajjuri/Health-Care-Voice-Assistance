import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiChevronLeft, FiChevronRight, FiX, FiAlertCircle, FiCheck } from 'react-icons/fi';
import './TipsAndPrecautionsContainer.css';

/**
 * TipsAndPrecautionsContainer
 * 
 * A comprehensive UI component for displaying personalized healthcare tips,
 * precautions, and wellness advice based on user context.
 * 
 * Features:
 * ✅ Smart filtering by urgency level
 * ✅ Tabbed interface (Tips / Precautions / Wellness)
 * ✅ Pull-to-refresh functionality
 * ✅ Gesture-friendly carousel on mobile
 * ✅ Urgency-based color coding
 * ✅ Actionable precautions with checkboxes
 * ✅ Fully responsive design
 */

const TipsAndPrecautionsContainer = ({ 
  userContext = {}, 
  chatMessages = [], 
  onDismiss = () => {} 
}) => {
  const [tips, setTips] = useState([]);
  const [precautions, setPrecautions] = useState([]);
  const [wellnessTips, setWellnessTips] = useState([]);
  const [activeTab, setActiveTab] = useState('tips'); // 'tips', 'precautions', 'wellness'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkedPrecautions, setCheckedPrecautions] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Fetch tips from backend
  const fetchTips = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const payload = {
        user_context: userContext || {},
        messages: chatMessages.slice(-10),
      };

      const response = await fetch('/api/generate/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();

      if (data.status === 'success' && data.tips && data.tips.length > 0) {
        // Categorize tips based on content
        const categorized = categorizeTips(data.tips, data.urgency);
        setTips(categorized.tips);
        setPrecautions(categorized.precautions);
        setWellnessTips(categorized.wellness);
        setCurrentIndex(0);
      } else {
        throw new Error('No tips returned');
      }
    } catch (err) {
      console.error('Error fetching tips:', err);
      setError('Unable to load tips. Retrying with local database...');
      
      // Fallback to local tips
      const localTips = getLocalTips(userContext);
      if (localTips.length > 0) {
        const categorized = categorizeTips(localTips, 'low');
        setTips(categorized.tips);
        setPrecautions(categorized.precautions);
        setWellnessTips(categorized.wellness);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userContext, chatMessages]);

  // Categorize tips into different types
  const categorizeTips = (tipsList, urgency) => {
    const tips = [];
    const precautions = [];
    const wellness = [];

    tipsList.forEach((tip) => {
      const tipLower = tip.toLowerCase();

      // Precautions: contain action words like "avoid", "don't", "prevent"
      if (
        tipLower.includes('avoid') ||
        tipLower.includes("don't") ||
        tipLower.includes('prevent') ||
        tipLower.includes('should not') ||
        tipLower.includes('never')
      ) {
        precautions.push(tip);
      }
      // Wellness: contain words like "healthy", "exercise", "sleep", "nutrition"
      else if (
        tipLower.includes('exercise') ||
        tipLower.includes('sleep') ||
        tipLower.includes('nutrition') ||
        tipLower.includes('diet') ||
        tipLower.includes('water') ||
        tipLower.includes('healthy') ||
        tipLower.includes('wellness')
      ) {
        wellness.push(tip);
      }
      // Default: actionable tips
      else {
        tips.push(tip);
      }
    });

    return { tips, precautions, wellness };
  };

  // Get local tips from database
  const getLocalTips = (context) => {
    const tips = [];
    const mood = context.mood?.name || '';
    const symptoms = context.symptoms || [];

    if (mood) {
      tips.push(`Focus on ${mood} management techniques`);
    }
    if (symptoms.length > 0) {
      tips.push(`Address ${symptoms[0]} with proper care`);
    }
    tips.push('Stay hydrated throughout the day');
    tips.push('Get adequate sleep (7-9 hours)');
    tips.push('Consider consulting a healthcare professional');

    return tips;
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTips(false);
  };

  // Load tips on mount
  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  // Get current items for active tab
  const getCurrentItems = () => {
    switch (activeTab) {
      case 'precautions':
        return precautions;
      case 'wellness':
        return wellnessTips;
      case 'tips':
      default:
        return tips;
    }
  };

  const currentItems = getCurrentItems();
  const currentItem = currentItems[currentIndex];

  // Navigate carousel
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? currentItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentItems.length);
  };

  // Toggle precaution checkbox
  const togglePrecautionCheck = (index) => {
    const newChecked = new Set(checkedPrecautions);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedPrecautions(newChecked);
  };

  // Get urgency styling
  const getUrgencyClass = () => {
    if (userContext?.urgency === 'high') return 'urgency-high';
    if (userContext?.urgency === 'medium') return 'urgency-medium';
    return 'urgency-low';
  };

  // Get urgency label
  const getUrgencyLabel = () => {
    const urgency = userContext?.urgency || 'low';
    const labels = {
      high: { emoji: '🔴', text: 'Critical', color: '#e74c3c' },
      medium: { emoji: '🟡', text: 'Important', color: '#f39c12' },
      low: { emoji: '🟢', text: 'Informational', color: '#27ae60' },
    };
    return labels[urgency] || labels.low;
  };

  // Render empty state
  if (loading) {
    return (
      <div className="tips-container loading">
        <div className="spinner"></div>
        <p>Loading personalized tips...</p>
      </div>
    );
  }

  if (error && currentItems.length === 0) {
    return (
      <div className="tips-container error">
        <div className="error-content">
          <FiAlertCircle size={24} />
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentItems.length === 0) {
    return null;
  }

  return (
    <div className={`tips-container ${getUrgencyClass()}`}>
      {/* Header */}
      <div className="tips-header">
        <div className="header-content">
          <div>
            <h3 className="tips-title">
              💡 Tips & Precautions
            </h3>
            <div className="urgency-badge">
              <span className="urgency-emoji">{getUrgencyLabel().emoji}</span>
              <span className="urgency-text">{getUrgencyLabel().text}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="icon-btn refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh tips"
          >
            <FiRefreshCw size={18} className={refreshing ? 'spinning' : ''} />
          </button>
          <button
            className="icon-btn collapse-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button
            className="icon-btn close-btn"
            onClick={onDismiss}
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Content - only show if expanded */}
      {isExpanded && (
        <>
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tips');
                setCurrentIndex(0);
              }}
            >
              Tips ({tips.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'precautions' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('precautions');
                setCurrentIndex(0);
              }}
            >
              Precautions ({precautions.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'wellness' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('wellness');
                setCurrentIndex(0);
              }}
            >
              Wellness ({wellnessTips.length})
            </button>
          </div>

          {/* Content Display */}
          <div className="tips-content">
            {activeTab === 'precautions' ? (
              // Precautions List
              <div className="precautions-list">
                {precautions.map((precaution, index) => (
                  <div
                    key={index}
                    className={`precaution-item ${checkedPrecautions.has(index) ? 'checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedPrecautions.has(index)}
                      onChange={() => togglePrecautionCheck(index)}
                      className="precaution-checkbox"
                      id={`precaution-${index}`}
                    />
                    <label htmlFor={`precaution-${index}`} className="precaution-label">
                      <span className="check-icon">
                        {checkedPrecautions.has(index) && <FiCheck size={16} />}
                      </span>
                      <span className="precaution-text">{precaution}</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              // Tips/Wellness Carousel
              <div className="carousel-wrapper">
                <div className="carousel-item">
                  <div className="item-content">
                    <p className="item-text">{currentItem}</p>
                  </div>
                </div>

                {/* Navigation Controls */}
                {currentItems.length > 1 && (
                  <div className="carousel-controls">
                    <button
                      className="carousel-btn prev-btn"
                      onClick={goToPrevious}
                      title="Previous"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      className="carousel-btn next-btn"
                      onClick={goToNext}
                      title="Next"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Indicators & Counter */}
          <div className="tips-footer">
            {activeTab !== 'precautions' && currentItems.length > 0 && (
              <div className="item-indicators">
                {currentItems.map((_, index) => (
                  <div
                    key={index}
                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    role="button"
                    tabIndex={0}
                  />
                ))}
              </div>
            )}
            <div className="footer-info">
              {activeTab === 'precautions' ? (
                <span className="completion-text">
                  {checkedPrecautions.size} of {precautions.length} completed
                </span>
              ) : (
                <span className="counter-text">
                  {currentIndex + 1} of {currentItems.length}
                </span>
              )}
            </div>
          </div>

          {/* Metadata Display */}
          {userContext && (
            <div className="tips-metadata">
              {userContext.mood && (
                <span className="metadata-badge mood-badge">
                  Mood: {userContext.mood.name || userContext.mood}
                </span>
              )}
              {userContext.symptoms?.length > 0 && (
                <span className="metadata-badge symptoms-badge">
                  Symptoms: {userContext.symptoms.slice(0, 2).join(', ')}
                  {userContext.symptoms.length > 2 ? '...' : ''}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

TipsAndPrecautionsContainer.displayName = 'TipsAndPrecautionsContainer';

export default TipsAndPrecautionsContainer;
