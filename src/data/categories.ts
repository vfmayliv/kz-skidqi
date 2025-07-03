import { Language } from '../contexts/AppContext';

export interface FilterOption {
  id: string;
  label: Record<Language, string>;
}

export interface PropertyFilterConfig {
  dealTypes: FilterOption[];
  segments: {
    id: string;
    label: Record<Language, string>;
    types: FilterOption[];
  }[];
  residentialFilters: FilterOption[];
  commercialFilters: FilterOption[];
  generalFilters: FilterOption[];
}

export type Category = {
  id: string;
  slug?: string;
  name: Record<Language, string>;
  icon: string;
  subcategories?: Category[];
  propertyFilterConfig?: PropertyFilterConfig;
  filters?: Record<Language, string[]>;
  description?: Record<Language, string>;
  heroImage?: string;
};

export const categories: Category[] = [
  {
    id: 'free',
    name: {
      ru: 'Бесплатно',
      kz: 'Тегін',
    },
    icon: 'Gift',
  },
  {
    id: 'pharmacy',
    name: {
      ru: 'Аптеки',
      kz: 'Дәріханалар',
    },
    icon: 'Pill',
  },
  {
    id: 'electronics',
    name: {
      ru: 'Техника и Электроника',
      kz: 'Техника және Электроника',
    },
    icon: 'Smartphone',
    subcategories: [
      {
        id: 'phones',
        name: {
          ru: 'Телефоны и гаджеты',
          kz: 'Телефондар мен гаджеттер',
        },
        icon: 'Smartphone',
      },
      {
        id: 'computers',
        name: {
          ru: 'Компьютеры',
          kz: 'Компьютерлер',
        },
        icon: 'Laptop',
      },
      {
        id: 'tv',
        name: {
          ru: 'Телевизоры',
          kz: 'Теледидарлар',
        },
        icon: 'Tv',
      },
    ],
  },
  {
    id: 'fashion',
    name: {
      ru: 'Мода и Стиль',
      kz: 'Сән және Стиль',
    },
    icon: 'Shirt',
  },
  {
    id: 'kids',
    name: {
      ru: 'Детям',
      kz: 'Балаларға',
    },
    icon: 'Baby',
  },
  {
    id: 'food',
    name: {
      ru: 'Продукты Питания',
      kz: 'Азық-түлік',
    },
    icon: 'Utensils',
  },
  {
    id: 'hobby',
    name: {
      ru: 'Хобби и Спорт',
      kz: 'Хобби және Спорт',
    },
    icon: 'Dumbbell',
  },
  {
    id: 'pets',
    name: {
      ru: 'Зоотовары',
      kz: 'Зоотауарлар',
    },
    icon: 'Dog',
  },
  {
    id: 'beauty',
    name: {
      ru: 'Красота и Здоровье',
      kz: 'Сұлулық және Денсаулық',
    },
    icon: 'Heart',
  },
  {
    id: 'transport',
    name: {
      ru: 'Транспорт',
      kz: 'Көлік',
    },
    icon: 'Car',
    filters: {
      ru: ['Пробег', 'Объем двигателя', 'Год выпуска'],
      kz: ['Жүріс', 'Қозғалтқыштың көлемі', 'Шығарылған жылы'],
    },
    description: {
      ru: 'Лучшие автомобили со скидками в Казахстане.',
      kz: 'Қазақстандағы жеңілдігі бар ең үздік автокөліктер.',
    },
    heroImage: '/images/transport-banner.jpg',
    subcategories: [
      {
        id: 'cars',
        name: {
          ru: 'Автомобили',
          kz: 'Автомобильдер',
        },
        icon: 'Car',
      },
      {
        id: 'motorcycles',
        name: {
          ru: 'Мотоциклы',
          kz: 'Мотоциклдер',
        },
        icon: 'Bike',
      },
      {
        id: 'commercial',
        name: {
          ru: 'Коммерческие',
          kz: 'Коммерциялық',
        },
        icon: 'Truck',
      },
    ],
  },
  {
    id: 'property',
    name: {
      ru: 'Недвижимость',
      kz: 'Жылжымайтын мүлік',
    },
    icon: 'Building',
    propertyFilterConfig: {
      dealTypes: [
        { id: 'buy', label: { ru: 'Купить', kz: 'Сатып алу' } },
        { id: 'rent_long', label: { ru: 'Снять долгосрочно', kz: 'Ұзақ мерзімге жалға алу' } },
        { id: 'rent_daily', label: { ru: 'Посуточно', kz: 'Күнделікті' } },
      ],
      segments: [
        {
          id: 'residential',
          label: { ru: 'Жилая', kz: 'Тұрғын' },
          types: [
            { id: 'apartment', label: { ru: 'Квартира', kz: 'Пәтер' } },
            { id: 'house', label: { ru: 'Дом', kz: 'Үй' } },
            { id: 'townhouse', label: { ru: 'Таунхаус', kz: 'Таунхаус' } },
            { id: 'land', label: { ru: 'Участок', kz: 'Жер' } },
            { id: 'garage', label: { ru: 'Гараж', kz: 'Гараж' } },
            { id: 'dacha', label: { ru: 'Дача', kz: 'Дача' } },
          ],
        },
        {
          id: 'commercial',
          label: { ru: 'Коммерческая', kz: 'Коммерциялық' },
          types: [
            { id: 'commercial', label: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
          ],
        },
      ],
      residentialFilters: [
        { id: 'rooms', label: { ru: 'Комнаты', kz: 'Бөлмелер' } },
        { id: 'floor', label: { ru: 'Этаж', kz: 'Қабат' } },
        { id: 'area', label: { ru: 'Площадь', kz: 'Алаң' } },
      ],
      commercialFilters: [
        { id: 'area', label: { ru: 'Площадь', kz: 'Алаң' } },
        { id: 'ceilingHeight', label: { ru: 'Высота потолков', kz: 'Төбенің биіктігі' } },
        { id: 'parking', label: { ru: 'Парковка', kz: 'Тұрақ' } },
        { id: 'communications', label: { ru: 'Коммуникации', kz: 'Коммуникациялар' } },
      ],
      generalFilters: [
        { id: 'price', label: { ru: 'Цена', kz: 'Баға' } },
        { id: 'hasPhoto', label: { ru: 'Фото', kz: 'Фото' } },
        { id: 'districts', label: { ru: 'Район', kz: 'Аудан' } },
      ],
    },
    description: {
      ru: 'Недвижимость по выгодным ценам.',
      kz: 'Табысты бағамен жылжымайтын мүлік.',
    },
    heroImage: '/images/property-banner.jpg',
    subcategories: [
      {
        id: 'apartments',
        name: {
          ru: 'Квартиры',
          kz: 'Пәтерлер',
        },
        icon: 'Building',
      },
      {
        id: 'houses',
        name: {
          ru: 'Дома',
          kz: 'Үйлер',
        },
        icon: 'Home',
      },
      {
        id: 'commercial',
        name: {
          ru: 'Коммерческая',
          kz: 'Коммерциялық',
        },
        icon: 'Store',
      },
      {
        id: 'land',
        name: {
          ru: 'Земельные участки',
          kz: 'Жер телімдері',
        },
        icon: 'LandPlot',
      },
    ],
  },
  {
    id: 'services',
    name: {
      ru: 'Услуги',
      kz: 'Қызметтер',
    },
    icon: 'Wrench',
  },
  {
    id: 'home',
    name: {
      ru: 'Все для Дома и Дачи',
      kz: 'Үй және Саяжай үшін',
    },
    icon: 'Sofa',
  },
];

export const addCategory = (category: Category): void => {
  categories.push(category);
};

export const addSubcategory = (categoryId: string, subcategory: Category): boolean => {
  const category = categories.find(c => c.id === categoryId);
  if (category) {
    if (!category.subcategories) {
      category.subcategories = [];
    }
    category.subcategories.push(subcategory);
    return true;
  }
  return false;
};

export const categoryExists = (categoryId: string): boolean => {
  return categories.some(c => c.id === categoryId);
};

export const subcategoryExists = (categoryId: string, subcategoryId: string): boolean => {
  const category = categories.find(c => c.id === categoryId);
  if (category && category.subcategories) {
    return category.subcategories.some(sc => sc.id === subcategoryId);
  }
  return false;
};
