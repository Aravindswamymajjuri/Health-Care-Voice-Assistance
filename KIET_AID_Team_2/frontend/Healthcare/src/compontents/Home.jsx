import React, { useEffect, useRef, useState } from 'react';
import { FiUserPlus, FiLogIn, FiMic, FiMessageSquare, FiShield, FiBarChart2 } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './Home.css';

const Home = ({ onSwitchToLogin, onSwitchToSignup }) => {
  const { t } = useLanguage();
  
  const slides = [
    {
      id: 'how-to',
      content: (
        <section className="how-to card">
          <h2>{t('howToUse')}</h2>
          <ol>
            <li>{t('step1')}</li>
            <li>{t('step2')}</li>
            <li>{t('step3')}</li>
            <li>{t('step4')}</li>
          </ol>
        </section>
      )
    },
    {
      id: 'features',
      content: (
        <section className="features card">
          <h2>{t('features')}</h2>
          <ul className="features-list">
            <li><FiMic className="feature-icon" /> {t('textAndVoiceInput')}</li>
            <li><FiMessageSquare className="feature-icon" /> {t('persistentChatHistory')}</li>
            <li><FiShield className="feature-icon" /> {t('secureAccounts')}</li>
            <li><FiBarChart2 className="feature-icon" /> {t('exportableLogs')}</li>
          </ul>
        </section>
      )
    },
    {
      id: 'contact',
      content: (
        <section className="contact card">
          <h2>{t('contactUs')}</h2>
          <p>{t('feedbackMessage')} <a href="mailto:aravindswamymajjuri143@gmail.com">{t('team4')}</a></p>
        </section>
      )
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [disableTransition, setDisableTransition] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide(prev => prev + 1);
    }, 4500);
    return () => clearInterval(intervalId);
  }, []);

  const handleTrackTransitionEnd = () => {
    if (currentSlide !== slides.length) return;
    setDisableTransition(true);
    setCurrentSlide(0);

    // Re-enable transition on the next paint so the reset is not visible
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableTransition(false);
      });
    });
  };

  return (
    <div className="home-container">
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        <LanguageSelector />
      </div>
      <header className="home-hero">
        <div className="hero-inner">
          <h1 className="home-title">{t('welcomeTitle')}</h1>
          <p className="lead">{t('homeSubtitle')}</p>
          <div className="hero-actions">
            <button className="btn primary" onClick={onSwitchToSignup}><FiUserPlus style={{marginRight: '0.5rem'}} />{t('createAccount')}</button>
            <button className="btn outline" onClick={onSwitchToLogin}><FiLogIn style={{marginRight: '0.5rem'}} />{t('signIn')}</button>
          </div>
        </div>
      </header>

      <main className="home-main home-slider-main">
        <div className="home-slider">
          <div
            ref={trackRef}
            className={`home-slider-track ${disableTransition ? 'no-transition' : ''}`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {[...slides, slides[0]].map((slide, index) => (
              <div className="home-slide" key={slide.id}>
                {slide.content}
              </div>
            ))}
          </div>
          <div className="home-slider-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                className={`home-slider-dot ${index === (currentSlide % slides.length) ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;