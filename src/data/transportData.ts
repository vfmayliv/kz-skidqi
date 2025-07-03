
// Define the interfaces that are referenced but not defined
export interface BrandData {
  id: string;
  name: {
    ru: string;
    kz: string;
  };
  models: string[];
  toLowerCase(): string; // Adding implementation for toLowerCase
}

export interface CommercialType {
  id: string;
  name: {
    ru: string;
    kz: string;
  };
}

// Convert carBrands strings to BrandData objects
export const carBrands: BrandData[] = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'DS', 'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Plymouth', 'Polestar', 'Pontiac', 'Porsche', 'RAM', 'Renault', 'Rolls-Royce', 'Rover', 'Saab', 'Saturn', 'Scion', 'Seat', 'Škoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo', 'ВАЗ (Lada)', 'ГАЗ', 'ЗАЗ', 'Москвич', 'УАЗ'
].map(brand => {
  const brandObj: BrandData = {
    id: brand.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
    name: {
      ru: brand,
      kz: brand
    },
    models: [],
    toLowerCase(): string {
      return this.id;
    }
  };
  return brandObj;
});

// Convert motorcycleBrands strings to BrandData objects
export const motorcycleBrands: BrandData[] = [
  'Aprilia', 'Benelli', 'Beta', 'BMW', 'BRP', 'Buell', 'CFMOTO', 'Ducati', 'Gas Gas', 'Harley-Davidson', 'Honda', 'Husqvarna', 'Kawasaki', 'KTM', 'Kymco', 'MV Agusta', 'Norton', 'Piaggio', 'Royal Enfield', 'Suzuki', 'Triumph', 'Vespa', 'Yamaha', 'Другой'
].map(brand => {
  const brandObj: BrandData = {
    id: brand.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
    name: {
      ru: brand,
      kz: brand
    },
    models: [],
    toLowerCase(): string {
      return this.id;
    }
  };
  return brandObj;
});

// Convert commercialTypes strings to CommercialType objects
export const commercialTypes: CommercialType[] = [
  'Тягачи', 'Автобусы', 'Микроавтобусы', 'Фургоны', 'Самосвалы', 'Автокраны', 'Бетономешалки', 'Рефрижераторы', 'Цистерны', 'Эвакуаторы', 'Сельхозтехника', 'Погрузчики', 'Экскаваторы', 'Катки', 'Бульдозеры', 'Автогрейдеры', 'Коммунальная техника', 'Спецтехника', 'Другая'
].map(type => ({
  id: type.toLowerCase().replace(/\s+/g, '-'),
  name: {
    ru: type,
    kz: type
  }
}));

export const transportCategories = [
  {
    id: 'transport-main',
    name: {
      ru: 'Транспорт',
      kz: 'Көлік'
    },
    subcategories: [
      {
        id: 'cars',
        name: {
          ru: 'Легковые автомобили',
          kz: 'Жеңіл автомобильдер'
        }
      },
      {
        id: 'motorcycles',
        name: {
          ru: 'Мотоциклы и мопеды',
          kz: 'Мотоциклдер мен мопедтер'
        }
      },
      {
        id: 'commercial',
        name: {
          ru: 'Коммерческий транспорт',
          kz: 'Коммерциялық көлік'
        }
      },
      {
        id: 'water-transport',
        name: {
          ru: 'Водный транспорт',
          kz: 'Су көлігі'
        }
      },
      {
        id: 'spare-parts',
        name: {
          ru: 'Запчасти и аксессуары',
          kz: 'Бөлшектер мен керек-жарақтар'
        }
      },
      {
        id: 'transport-tires',
        name: {
          ru: 'Шины, диски и колёса',
          kz: 'Шиналар, дискілер мен дөңгелектер'
        }
      },
      {
        id: 'transport-services',
        name: {
          ru: 'Услуги',
          kz: 'Қызметтер'
        }
      },
      {
        id: 'transport-additional',
        name: {
          ru: 'Дополнительно',
          kz: 'Қосымша'
        }
      }
    ]
  }
];
