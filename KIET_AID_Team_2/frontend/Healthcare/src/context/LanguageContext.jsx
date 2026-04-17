import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../constants/translations';

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem('appLanguage');
    return savedLanguage || 'en';
  });

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    // Get translation string by key
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key if translation not found
        return key;
      }
    }

    return value || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    languages: ['en', 'hi', 'te'],
    languageNames: {
      en: 'English',
      hi: 'हिंदी',
      te: 'తెలుగు',
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook to use Language Context
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export default LanguageContext;
