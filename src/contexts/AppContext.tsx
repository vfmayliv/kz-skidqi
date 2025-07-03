import React, { createContext, useContext, useState } from 'react';

export type Language = 'ru' | 'kz';

export interface CityType {
  id?: string;
  name?: string;
  name_ru?: string;
  name_kz?: string;
  ru: string;
  kz: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  city?: CityType;
  setCity?: (city: CityType) => void;
  login?: (credentials: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  ru: {
    tenge: '₸',
    // Add more translations as needed
  },
  kz: {
    tenge: '₸',
    // Add more translations as needed
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');
  const [city, setCity] = useState<CityType | undefined>();

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.ru] || key;
  };

  const login = (credentials: any) => {
    // Login implementation
    console.log('Login called with:', credentials);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, t, city, setCity, login }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
