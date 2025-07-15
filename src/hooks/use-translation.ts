import { useAppStore } from '@/stores/useAppStore';
import ruTranslation from '@/i18n/locales/ru.json';
import kzTranslation from '@/i18n/locales/kz.json';

export interface TranslationKey {
  ru: string;
  kz: string;
}

const translations = {
  ru: ruTranslation,
  kz: kzTranslation
};

export const useTranslation = () => {
  const { language } = useAppStore();
  
  const t = (key: string | TranslationKey, fallback?: string): string => {
    if (typeof key === 'string') {
      // Для простых строк, ищем перевод в файлах локализации
      const translation = translations[language as keyof typeof translations];
      
      // Сначала проверяем, существует ли такой ключ напрямую
      if (translation && key in translation) {
        return translation[key as keyof typeof translation];
      }
      
      // Если прямого ключа нет, пробуем обработать как вложенную структуру
      const keys = key.split('.');
      let result: any = translation;
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k as keyof typeof result];
        } else {
          // Если перевод не найден, возвращаем fallback или ключ
          return fallback || key;
        }
      }
      
      return typeof result === 'string' ? result : (fallback || key);
    }
    
    // Для объектов с языковыми ключами, возвращаем соответствующий перевод
    return key[language as keyof TranslationKey] || (fallback || '');
  };
  
  return { 
    t,
    currentLang: language 
  };
};
