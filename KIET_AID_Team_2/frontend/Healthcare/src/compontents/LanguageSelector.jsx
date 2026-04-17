import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, changeLanguage, languages, languageNames, t } = useLanguage();

  return (
    <div className="language-selector">
      <label htmlFor="lang-select" className="lang-label">
        {t('language')}:
      </label>
      <select
        id="lang-select"
        className="lang-select"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
