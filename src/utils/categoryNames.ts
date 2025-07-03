
export function getCategoryName(categoryId: string, language: 'ru' | 'kz'): string {
  const categoryNames: Record<string, Record<string, string>> = {
    'property': {
      'ru': 'Недвижимость',
      'kz': 'Жылжымайтын мүлік'
    },
    'transport': {
      'ru': 'Транспорт',
      'kz': 'Көлік'
    },
    'electronics': {
      'ru': 'Техника и электроника',
      'kz': 'Техника және электроника'
    },
    'kids': {
      'ru': 'Детям',
      'kz': 'Балаларға'
    },
    'pharmacy': {
      'ru': 'Аптеки',
      'kz': 'Дәріханалар'
    },
    'fashion': {
      'ru': 'Мода и стиль',
      'kz': 'Сән және стиль'
    },
    'food': {
      'ru': 'Продукты питания',
      'kz': 'Азық-түлік'
    },
    'home': {
      'ru': 'Все для дома и дачи',
      'kz': 'Үй мен дача үшін бәрі'
    },
    'services': {
      'ru': 'Услуги',
      'kz': 'Қызметтер'
    },
    'pets': {
      'ru': 'Зоотовары',
      'kz': 'Жануарлар тауарлары'
    },
    'hobby': {
      'ru': 'Хобби и спорт',
      'kz': 'Хобби және спорт'
    },
    'beauty': {
      'ru': 'Красота и здоровье',
      'kz': 'Сұлулық және денсаулық'
    }
  };

  return categoryNames[categoryId]?.[language] || (language === 'ru' ? 'Товары' : 'Тауарлар');
}
