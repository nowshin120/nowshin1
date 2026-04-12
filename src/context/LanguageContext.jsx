import { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import bn from '../i18n/bn.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translations = language === 'en' ? en : bn;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    translations,
    t: (key) => {
      const keys = key.split('.');
      let result = translations;
      for (const k of keys) {
        result = result?.[k];
      }
      return result || key;
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
