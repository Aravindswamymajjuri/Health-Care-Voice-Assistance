import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, changeLanguage, languages, languageNames } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-container">
      <button
        className="language-selector-icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select language (Current: ${languageNames[language]})`}
        aria-expanded={isOpen}
        title={languageNames[language]}
      >
        <Globe size={20} className="lang-icon" />
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`language-option ${lang === language ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang)}
              role="menuitem"
            >
              <span className="option-text">{languageNames[lang]}</span>
              {lang === language && <Check size={16} className="check-icon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
