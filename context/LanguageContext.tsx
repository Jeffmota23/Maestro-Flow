
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en-US');

  useEffect(() => {
    const saved = localStorage.getItem('maestro_lang') as Language;
    if (saved && Object.keys(TRANSLATIONS).includes(saved)) {
      setLanguage(saved);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('pt-BR')) setLanguage('pt-BR');
      else if (browserLang.startsWith('pt')) setLanguage('pt-PT');
      else if (browserLang.startsWith('es')) setLanguage('es-ES');
      else setLanguage('en-US');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('maestro_lang', lang);
  };

  const t = (key: string) => {
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
