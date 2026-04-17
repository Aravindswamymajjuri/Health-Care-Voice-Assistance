import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ProTipsCarousel.css';

/**
 * ProTipsCarousel - Professional Healthcare Tips & Precautions Carousel
 * 
 * Custom-built carousel with smooth animations, risk level badges, and full responsiveness.
 * Built with plain CSS (no external UI libraries).
 * 
 * Features:
 * - Dual-category carousel (Tips & Precautions)
 * - Risk level badges with color-coded styling
 * - Auto-play with pause on hover
 * - Keyboard and touch navigation
 * - Smooth CSS transitions
 * - Fully responsive design
 */

const ProTipsCarousel = ({
  tips = [],
  precautions = [],
  riskLevel = 'low',
  onRefresh = null,
  autoPlayInterval = 5000,
}) => {
  const [activeTab, setActiveTab] = useState('tips');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Combine tips and precautions into categorized data
  const categoryData = {
    tips: tips.map((tip, idx) => ({
      id: `tip-${idx}`,
      content: tip,
      category: 'tips',
      emoji: getTipEmoji(tip, idx),
    })),
    precautions: precautions.map((precaution, idx) => ({
      id: `precaution-${idx}`,
      content: precaution,
      category: 'precautions',
      emoji: getPrecautionEmoji(precaution, idx),
    })),
  };

  const currentSlides = categoryData[activeTab] || [];
  const currentSlide = currentSlides[currentIndex] || null;

  // Risk level configuration
  const riskConfig = {
    low: { label: 'Low', color: 'risk-low', icon: '✓' },
    medium: { label: 'Medium', color: 'risk-medium', icon: '⚠' },
    high: { label: 'High', color: 'risk-high', icon: '!' },
  };

  const currentRisk = riskConfig[riskLevel] || riskConfig.low;

  /**
   * Auto-play effect
   */
  useEffect(() => {
    if (!isAutoPlay || currentSlides.length <= 1) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentSlides.length);
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, currentSlides.length, autoPlayInterval]);

  /**
   * Handle next slide
   */
  const goNext = useCallback(() => {
    if (currentSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % currentSlides.length);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlay(true), 10000);
  }, [currentSlides.length]);

  /**
   * Handle previous slide
   */
  const goPrev = useCallback(() => {
    if (currentSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlay(true), 10000);
  }, [currentSlides.length]);

  /**
   * Go to specific slide
   */
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  }, []);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  /**
   * Handle touch swipe
   */
  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe(touchStart, e.changedTouches[0].clientX);
  };

  const handleSwipe = (start, end) => {
    if (!start || !end) return;
    const distance = start - end;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();
  };

  /**
   * Handle tab change
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentIndex(0);
    setIsAutoPlay(true);
  };

  /**
   * Handle hover - pause autoplay
   */
  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  // Empty state
  if (currentSlides.length === 0) {
    return (
      <div className={`carousel-container carousel-${activeTab}`}>
        <div className="carousel-empty">
          <div className="empty-icon">
            {activeTab === 'tips' ? '💡' : '⚠️'}
          </div>
          <p className="empty-text">No {activeTab} available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      {/* Progress Bar */}
      <div className="carousel-progress-bar">
        <div 
          className="progress-fill" 
          style={{
            animation: isAutoPlay && currentSlides.length > 1 
              ? `progress ${autoPlayInterval}ms linear forwards` 
              : 'none',
            width: isAutoPlay && currentSlides.length > 1 ? '100%' : '0%'
          }}
        />
      </div>

      {/* Header */}
      <div className="carousel-header">
        <div className="header-content">
          <h2 className="carousel-title">💡 Pro Tips & Precautions</h2>
          <p className="carousel-subtitle">Healthcare recommendations tailored for you</p>
        </div>

        {/* Risk Badge */}
        <div className={`risk-badge ${currentRisk.color}`}>
          <span className="risk-icon">{currentRisk.icon}</span>
          <span className="risk-text">Risk: {currentRisk.label}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav-container">
        <button
          className={`tab-button ${activeTab === 'tips' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('tips')}
          aria-label="Show tips"
          aria-current={activeTab === 'tips' ? 'page' : undefined}
        >
          💡 Tips
          <span className="tab-count">({categoryData.tips.length})</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'precautions' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('precautions')}
          aria-label="Show precautions"
          aria-current={activeTab === 'precautions' ? 'page' : undefined}
        >
          ⚠️ Precautions
          <span className="tab-count">({categoryData.precautions.length})</span>
        </button>
      </div>

      {/* Carousel Container */}
      <div
        className={`carousel-container carousel-${activeTab}`}
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slide Wrapper with Animation */}
        <div className="carousel-slide-wrapper">
          <div className="carousel-slide">
            <div className="slide-icon">{currentSlide?.emoji}</div>
            <div className="slide-content">
              <p className="slide-text">{currentSlide?.content}</p>
              <div className="slide-badge">
                {activeTab === 'tips' ? '✓ TIP' : '⚠️ CAUTION'}
              </div>
            </div>
            <div className="slide-counter">
              {currentIndex + 1} / {currentSlides.length}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Footer */}
      <div className="carousel-footer">
        {/* Previous Button */}
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={goPrev}
          aria-label="Previous slide"
          disabled={currentSlides.length <= 1}
        >
          ‹
        </button>

        {/* Pagination Dots */}
        <div className="pagination-dots">
          {currentSlides.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? 'dot-active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          className="carousel-btn carousel-btn-next"
          onClick={goNext}
          aria-label="Next slide"
          disabled={currentSlides.length <= 1}
        >
          ›
        </button>

        {/* Refresh Button */}
        {onRefresh && (
          <button className="refresh-button" onClick={onRefresh}>
            🔄 Refresh
          </button>
        )}
      </div>

      {/* Accessibility Info */}
      <div className="carousel-a11y-info">
        Use arrow keys (← →) or swipe to navigate
      </div>
    </div>
  );
};

/**
 * Helper functions to determine emojis based on content
 */
function getTipEmoji(tip, index) {
  const tipLower = tip.toLowerCase();
  const emojiMap = [
    { keywords: ['water', 'hydrat', 'drink'], emoji: '💧' },
    { keywords: ['sleep', 'rest', 'relaxation'], emoji: '😴' },
    { keywords: ['eat', 'food', 'nutrition', 'meal'], emoji: '🍎' },
    { keywords: ['exercise', 'walk', 'activity', 'movement'], emoji: '🏃' },
    { keywords: ['stretch', 'yoga', 'meditation'], emoji: '🧘' },
    { keywords: ['medicine', 'medication'], emoji: '💊' },
  ];

  for (let item of emojiMap) {
    if (item.keywords.some((kw) => tipLower.includes(kw))) {
      return item.emoji;
    }
  }

  const defaults = ['✓', '💡', '🌟', '👍'];
  return defaults[index % defaults.length];
}

function getPrecautionEmoji(precaution, index) {
  const precautionLower = precaution.toLowerCase();
  const emojiMap = [
    { keywords: ['avoid', 'do not', 'dont', 'never'], emoji: '🚫' },
    { keywords: ['warm', 'cold', 'temperature'], emoji: '🌡️' },
    { keywords: ['check', 'monitor', 'test'], emoji: '✅' },
    { keywords: ['consult', 'doctor', 'medical'], emoji: '👨‍⚕️' },
    { keywords: ['emergency', 'urgent', 'severe'], emoji: '🚨' },
  ];

  for (let item of emojiMap) {
    if (item.keywords.some((kw) => precautionLower.includes(kw))) {
      return item.emoji;
    }
  }

  const defaults = ['⚠️', '🛑', '⛔', '📋'];
  return defaults[index % defaults.length];
}

export default ProTipsCarousel;
