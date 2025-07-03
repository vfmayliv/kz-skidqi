
import { cities } from './cities';
import { categories } from './categories';
import { Listing } from '../types/listingType';

// Helper function to get random city
export const getRandomCity = () => {
  return cities[Math.floor(Math.random() * cities.length)];
};

// Helper function to get random category
export const getRandomCategory = () => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  let subcategoryId = undefined;
  
  if (category.subcategories && category.subcategories.length > 0) {
    subcategoryId = category.subcategories[Math.floor(Math.random() * category.subcategories.length)].id;
  }
  
  return {
    categoryId: category.id,
    subcategoryId
  };
};

// Helper to generate random listings
export const generateAdditionalListings = (startId: number, count: number): Listing[] => {
  const products = [
    {
      ru: 'Смартфон Samsung Galaxy S22',
      kz: 'Samsung Galaxy S22 смартфоны',
      desc: {
        ru: 'Новый смартфон Samsung Galaxy S22 с гарантией.',
        kz: 'Кепілдігі бар жаңа Samsung Galaxy S22 смартфоны.',
      },
      price: 450000,
      img: 'https://via.placeholder.com/300x200?text=Samsung'
    },
    {
      ru: 'Ноутбук Apple MacBook Pro',
      kz: 'Apple MacBook Pro ноутбугі',
      desc: {
        ru: 'Ноутбук Apple MacBook Pro в идеальном состоянии.',
        kz: 'Тамаша жағдайдағы Apple MacBook Pro ноутбугі.',
      },
      price: 950000,
      img: 'https://via.placeholder.com/300x200?text=MacBook'
    },
    {
      ru: '2-комнатная квартира в центре',
      kz: 'Орталықта 2 бөлмелі пәтер',
      desc: {
        ru: 'Продам 2-комнатную квартиру в центре города.',
        kz: 'Қала орталығында 2 бөлмелі пәтер сатылады.',
      },
      price: 25000000,
      img: 'https://via.placeholder.com/300x200?text=Apartment'
    },
    {
      ru: 'Toyota Camry 2020',
      kz: 'Toyota Camry 2020',
      desc: {
        ru: 'Продам автомобиль Toyota Camry 2020 года.',
        kz: '2020 жылғы Toyota Camry автомобилін сатамын.',
      },
      price: 15000000,
      img: 'https://via.placeholder.com/300x200?text=Toyota'
    },
    {
      ru: 'Диван угловой',
      kz: 'Бұрыштық диван',
      desc: {
        ru: 'Продам угловой диван в отличном состоянии.',
        kz: 'Жақсы күйдегі бұрыштық диван сатылады.',
      },
      price: 180000,
      img: 'https://via.placeholder.com/300x200?text=Sofa'
    },
  ];
  
  const additionalListings = [];
  
  for (let i = 0; i < count; i++) {
    const product = products[i % products.length];
    const discount = Math.floor(Math.random() * 50) + 5;
    const originalPrice = product.price;
    const discountPrice = Math.round(originalPrice * (100 - discount) / 100);
    
    const { categoryId, subcategoryId } = getRandomCategory();
    
    additionalListings.push({
      id: `listing-${startId + i}`,
      title: {
        ru: product.ru,
        kz: product.kz,
      },
      description: {
        ru: product.desc.ru,
        kz: product.desc.kz,
      },
      originalPrice,
      discountPrice,
      discount,
      imageUrl: product.img,
      categoryId,
      subcategoryId,
      city: getRandomCity(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 1000),
      isFeatured: Math.random() > 0.8,
      userId: `user-${Math.floor(Math.random() * 10) + 1}`,
    });
  }
  
  return additionalListings;
};
