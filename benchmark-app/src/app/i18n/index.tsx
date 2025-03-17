'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Dil dosyaları
import tr from './locales/tr.json';
import en from './locales/en.json';

// Desteklenen diller
export const languages = {
  tr: 'Türkçe',
  en: 'English'
};

// Dil dosyaları
const resources = {
  tr,
  en
};

// Varsayılan dil
const defaultLanguage = 'tr';

// Dil bağlamı
interface I18nContextType {
  language: string;
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType>({
  language: defaultLanguage,
  t: () => '',
  changeLanguage: () => {}
});

// Dil sağlayıcısı
interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  // Tarayıcı dilini veya localStorage'dan dil tercihini al
  const getBrowserLanguage = () => {
    if (typeof window === 'undefined') return defaultLanguage;
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && Object.keys(languages).includes(savedLanguage)) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return Object.keys(languages).includes(browserLang) ? browserLang : defaultLanguage;
  };
  
  const [language, setLanguage] = useState(defaultLanguage);
  
  useEffect(() => {
    setLanguage(getBrowserLanguage());
  }, []);
  
  // Dil değiştirme fonksiyonu
  const changeLanguage = (lang: string) => {
    if (Object.keys(languages).includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  };
  
  // Çeviri fonksiyonu
  const t = (key: string) => {
    const keys = key.split('.');
    let currentValue: any = resources[language as keyof typeof resources];
    
    for (const k of keys) {
      if (currentValue && typeof currentValue === 'object' && k in currentValue) {
        currentValue = currentValue[k as keyof typeof currentValue];
      } else {
        return key;
      }
    }
    
    return typeof currentValue === 'string' ? currentValue : key;
  };
  
  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

// Çeviri hook'u
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}; 