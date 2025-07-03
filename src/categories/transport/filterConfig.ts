
export const transportFilterConfig = {
  categories: [
    {
      id: 'passenger',
      label: { ru: 'Легковой транспорт', kz: 'Жеңіл автокөліктер' },
      subcategories: [
        { id: 'cars', label: { ru: 'Легковые', kz: 'Жеңіл автокөліктер' } },
        { id: 'suvs', label: { ru: 'Внедорожники', kz: 'Жол талғамайтын көліктер' } },
        { id: 'vans', label: { ru: 'Минивэны', kz: 'Шағын фургондар' } },
        { id: 'electric', label: { ru: 'Электромобили', kz: 'Электромобильдер' } }
      ]
    },
    {
      id: 'moto',
      label: { ru: 'Мототранспорт', kz: 'Мотокөлік' },
      subcategories: [
        { id: 'motorcycles', label: { ru: 'Мотоциклы', kz: 'Мотоциклдер' } },
        { id: 'scooters', label: { ru: 'Скутеры', kz: 'Скутерлер' } },
        { id: 'atvs', label: { ru: 'Квадроциклы', kz: 'Квадроциклдер' } },
        { id: 'snowmobiles', label: { ru: 'Снегоходы', kz: 'Қар мотоциклдері' } }
      ]
    },
    {
      id: 'commercial',
      label: { ru: 'Коммерческий транспорт', kz: 'Коммерциялық көлік' },
      subcategories: [
        { id: 'light-commercial', label: { ru: 'Лёгкие коммерческие', kz: 'Жеңіл коммерциялық көліктер' } },
        { id: 'trucks', label: { ru: 'Грузовики', kz: 'Жүк көліктері' } },
        { id: 'truck-tractors', label: { ru: 'Седельные тягачи', kz: 'Жүк тартқыштар' } },
        { id: 'buses', label: { ru: 'Автобусы', kz: 'Автобустар' } },
        { id: 'trailers', label: { ru: 'Прицепы и полуприцепы', kz: 'Тіркемелер және жартылай тіркемелер' } },
        { id: 'agricultural', label: { ru: 'Сельскохозяйственная', kz: 'Ауыл шаруашылық техникасы' } },
        { id: 'construction', label: { ru: 'Строительная и дорожная', kz: 'Құрылыс және жол техникасы' } },
        { id: 'loaders', label: { ru: 'Погрузчики', kz: 'Тиегіштер' } },
        { id: 'cranes', label: { ru: 'Автокраны', kz: 'Автокрандар' } },
        { id: 'excavators', label: { ru: 'Экскаваторы', kz: 'Экскаваторлар' } },
        { id: 'bulldozers', label: { ru: 'Бульдозеры', kz: 'Бульдозерлер' } },
        { id: 'municipal', label: { ru: 'Коммунальная', kz: 'Коммуналдық техника' } }
      ]
    },
  ],
  vehicleTypes: [
    { id: 'car', label: { ru: 'Легковые', kz: 'Жеңіл автокөліктер' } },
    { id: 'truck', label: { ru: 'Грузовые', kz: 'Жүк көліктері' } },
    { id: 'moto', label: { ru: 'Мотоциклы', kz: 'Мотоциклдер' } }
  ],
  bodyTypes: [
    { id: 'sedan', label: { ru: 'Седан', kz: 'Седан' } },
    { id: 'suv', label: { ru: 'Внедорожник', kz: 'Жол талғамайтын көлік' } },
    { id: 'hatchback', label: { ru: 'Хэтчбек', kz: 'Хэтчбек' } },
    { id: 'wagon', label: { ru: 'Универсал', kz: 'Универсал' } },
    { id: 'minivan', label: { ru: 'Минивэн', kz: 'Шағын фургон' } },
    { id: 'coupe', label: { ru: 'Купе', kz: 'Купе' } },
    { id: 'convertible', label: { ru: 'Кабриолет', kz: 'Кабриолет' } },
    { id: 'pickup', label: { ru: 'Пикап', kz: 'Пикап' } }
  ],
  transmissions: [
    { id: 'auto', label: { ru: 'Автоматическая', kz: 'Автоматты' } },
    { id: 'manual', label: { ru: 'Механическая', kz: 'Механикалық' } },
    { id: 'robot', label: { ru: 'Робот', kz: 'Роботты' } },
    { id: 'variator', label: { ru: 'Вариатор', kz: 'Вариатор' } }
  ],
  engineTypes: [
    { id: 'petrol', label: { ru: 'Бензин', kz: 'Бензин' } },
    { id: 'diesel', label: { ru: 'Дизель', kz: 'Дизель' } },
    { id: 'hybrid', label: { ru: 'Гибрид', kz: 'Гибрид' } },
    { id: 'electric', label: { ru: 'Электро', kz: 'Электр' } },
    { id: 'gas', label: { ru: 'Газ', kz: 'Газ' } }
  ],
  driveTypes: [
    { id: 'fwd', label: { ru: 'Передний', kz: 'Алдыңғы' } },
    { id: 'rwd', label: { ru: 'Задний', kz: 'Артқы' } },
    { id: 'awd', label: { ru: 'Полный', kz: 'Толық' } }
  ],
  weightCategories: [
    { id: 'up_to_1t', label: { ru: 'до 1 т', kz: '1 т дейін' } },
    { id: '1_1.5t', label: { ru: '1-1,5 т', kz: '1-1,5 т' } },
    { id: 'over_1.5t', label: { ru: 'от 1,5 т', kz: '1,5 т астам' } }
  ]
};
