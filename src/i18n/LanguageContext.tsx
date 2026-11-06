import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageOption } from './types';
import { TRANSLATIONS } from './translations';
import { getLocalizedCategories, getLocalizedCategory } from './catalogData';
import { TransformerCategory } from '../types/transformer';
import { TRANSFORMER_CATEGORIES } from '../data/transformerCatalog';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'ru', label: 'Русский', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', nativeName: '中文', flag: '🇨🇳' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS.ru;
  categories: TransformerCategory[];
  getCategory: (slug: string) => TransformerCategory | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onearth_lang') as Language;
      if (saved && (saved === 'ru' || saved === 'en' || saved === 'zh')) {
        return saved;
      }
    }
    return 'ru';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onearth_lang', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (TRANSLATIONS[language] || TRANSLATIONS.ru) as typeof TRANSLATIONS.ru;
  const categories = getLocalizedCategories(language);

  const getCategory = (slug: string): TransformerCategory | undefined => {
    const raw = TRANSFORMER_CATEGORIES.find((c) => c.slug === slug);
    if (!raw) return undefined;
    return getLocalizedCategory(raw, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, categories, getCategory }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
