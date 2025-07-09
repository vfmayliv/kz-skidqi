import { transliterate as tr, slugify } from 'transliteration';

export const transliterate = (text: string): string => {
  if (!text) {
    return '';
  }
  return slugify(text, { lowercase: true, separator: '-' });
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Маппинг ID категорий на их slug-и
const categoryIdToSlugMap: { [key: string]: string } = {
  // Основные категории
  '1': 'transport',
  '2': 'real-estate', 
  '3': 'electronics',
  '4': 'fashion',
  '5': 'home',
  '6': 'beauty',
  '7': 'hobbies',
  '8': 'kids',
  '9': 'pets',
  '10': 'food',
  '11': 'services',
  '12': 'free',
  '13': 'pharmacy',
  
  // Транспорт подкategories
  '14': 'cars',
  '15': 'motorcycles',
  '16': 'trucks',
  '17': 'buses',
  '18': 'atv',
  '19': 'agricultural',
  '20': 'construction',
  '21': 'municipal',
  '22': 'parts',
  
  // Недвижимость подкategories
  '23': 'apartments',
  '24': 'houses',
  '25': 'commercial',
  '26': 'land',
  '27': 'rent-apartments',
  '28': 'rent-houses',
  '29': 'rent-commercial'
};

// Обратный маппинг slug на ID категории  
const categorySlugToIdMap: { [key: string]: number } = {};
Object.entries(categoryIdToSlugMap).forEach(([id, slug]) => {
  categorySlugToIdMap[slug] = parseInt(id);
});

// Функция для получения slug категории по ID
export const getCategorySlugById = (categoryId: string | number): string => {
  const id = typeof categoryId === 'number' ? categoryId.toString() : categoryId;
  return categoryIdToSlugMap[id] || id; // Возвращаем сам ID как fallback
};

// Функция для получения ID категории по slug
export const getCategoryIdBySlug = (slug: string): number | null => {
  return categorySlugToIdMap[slug] || null;
};

// Создание SEO-friendly URL для объявления
export const createListingUrl = (categoryId: string | number, title: string): string => {
  const categorySlug = getCategorySlugById(categoryId);
  const titleSlug = transliterate(title);
  return `/category/${categorySlug}/${titleSlug}`;
};
