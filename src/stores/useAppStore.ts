
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useTranslation as useReactTranslation } from 'react-i18next';
import i18n from '../i18n';

export type Language = 'ru' | 'kz';
export type UserRole = 'guest' | 'user' | 'admin';

export type CityType = {
  ru: string;
  kz: string;
};

type AppState = {
  language: Language;
  selectedCity: CityType | null;
  cityConfirmed: boolean;
  isAuthenticated: boolean;
  userRole: UserRole;
  
  // Actions
  setLanguage: (language: Language) => void;
  setSelectedCity: (city: CityType | null) => void;
  setCityConfirmed: (confirmed: boolean) => void;
  login: () => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ru',
      selectedCity: null,
      cityConfirmed: false,
      isAuthenticated: false,
      userRole: 'guest',
      
      setLanguage: (language: Language) => {
        i18n.changeLanguage(language); // Change i18next language
        set({ language });
      },
      
      setSelectedCity: (city: CityType | null) => set({ selectedCity: city }),
      
      setCityConfirmed: (confirmed: boolean) => set({ cityConfirmed: confirmed }),
      
      login: () => set({ isAuthenticated: true, userRole: 'user' }),
      
      logout: () => set({ isAuthenticated: false, userRole: 'guest' }),
      
      setUserRole: (role: UserRole) => set({ userRole: role }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Helper hook to access translations through i18next
export const useTranslations = () => {
  const { t } = useReactTranslation();
  return { t };
};

// Combined hook for app store and translations
export const useAppWithTranslations = () => {
  const appStore = useAppStore();
  const { t } = useReactTranslation();
  
  return {
    ...appStore,
    t,
  };
};

// Aliases for backward compatibility
export const useLanguage = () => useAppStore(state => state.language);
export const useSelectedCity = () => useAppStore(state => state.selectedCity);
