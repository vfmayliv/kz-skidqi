
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Импортируем типы данных
import { useTranslation } from '@/hooks/use-translation';
import { transportConfig } from '../config';

export const TransportCategoryPage: React.FC = () => {
  const { t, currentLang } = useTranslation();
  const [activeTab, setActiveTab] = useState('passenger');

  // Данные о количестве объявлений для каждого бренда (для примера)
  const brandsData = {
    passenger: [
      { name: 'Toyota', count: 57963 },
      { name: 'Lada (ВАЗ)', count: 103238 },
      { name: 'Hyundai', count: 35452 },
      { name: 'Kia', count: 38278 },
      { name: 'Nissan', count: 28935 },
      { name: 'Mercedes-Benz', count: 32739 },
      { name: 'Volkswagen', count: 32019 },
      { name: 'BMW', count: 36022 },
      { name: 'Geely', count: 24759 },
      { name: 'Ford', count: 21608 },
      { name: 'Chery', count: 23934 },
    ],
    moto: [
      { name: 'Honda', count: 215 },
      { name: 'Yamaha', count: 189 },
      { name: 'Suzuki', count: 187 },
      { name: 'Kawasaki', count: 165 },
      { name: 'BMW', count: 120 },
      { name: 'Harley-Davidson', count: 110 },
      { name: 'KTM', count: 98 },
      { name: 'BRP', count: 76 },
      { name: 'Ducati', count: 65 },
      { name: 'Triumph', count: 43 },
    ],
    commercial: [
      { name: 'Mercedes-Benz', count: 1206 },
      { name: 'Volkswagen', count: 620 },
      { name: 'Toyota', count: 162 },
      { name: 'Mitsubishi', count: 28 },
      { name: 'Isuzu', count: 212 },
      { name: 'GAZ', count: 4 },
      { name: 'КамАЗ', count: 5 },
      { name: 'МАЗ', count: 3 },
      { name: 'Hyundai', count: 628 },
      { name: 'BAW', count: 135 },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm breadcrumbs">
          <ul>
            <li><Link to="/">{t('home')}</Link></li>
            <li>{t(transportConfig.name)}</li>
          </ul>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">{t('buy.transport')}</h1>
        <p className="text-lg text-gray-600">{t('in.kazakhstan')}</p>
      </div>

      {/* Рекламный баннер */}
      <div className="bg-red-600 rounded-lg p-6 mb-10 flex justify-between items-center">
        <div className="text-white">
          <h3 className="text-xl font-semibold">{t('new.vehicles')}</h3>
          <p>{t('in.stock')}</p>
        </div>
        <div className="relative">
          <img src="/images/vehicle-promo.png" alt="New vehicles" className="h-20 object-contain" />
          <div className="absolute top-0 right-0 bg-yellow-400 px-2 py-1 text-xs font-bold rotate-6">
            {t('new.autos.here')}
          </div>
        </div>
      </div>

      {/* Основные категории */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="w-full flex overflow-x-auto space-x-1 mb-8">
          <TabsTrigger 
            value="passenger" 
            className={`flex-1 py-3 px-6 rounded-md ${activeTab === 'passenger' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            {t('passenger.vehicles')}
          </TabsTrigger>
          <TabsTrigger 
            value="moto" 
            className={`flex-1 py-3 px-6 rounded-md ${activeTab === 'moto' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            {t('moto.vehicles')}
          </TabsTrigger>
          <TabsTrigger 
            value="commercial" 
            className={`flex-1 py-3 px-6 rounded-md ${activeTab === 'commercial' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            {t('commercial.vehicles')}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Подкатегории для выбранного таба */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {activeTab === 'passenger' && (
          <>
            <Link to="/transport/cars" className={`bg-blue-100 text-blue-600 p-4 rounded-md font-medium`}>
              {t('cars')}
            </Link>
            <Link to="/transport/suvs" className="hover:bg-gray-100 p-4 rounded-md">
              {t('suvs')}
            </Link>
            <Link to="/transport/vans" className="hover:bg-gray-100 p-4 rounded-md">
              {t('vans')}
            </Link>
            <Link to="/transport/electric" className="hover:bg-gray-100 p-4 rounded-md">
              {t('electric.cars')}
            </Link>
          </>
        )}

        {activeTab === 'moto' && (
          <>
            <Link to="/transport/motorcycles" className={`bg-blue-100 text-blue-600 p-4 rounded-md font-medium`}>
              {t('motorcycles')}
            </Link>
            <Link to="/transport/scooters" className="hover:bg-gray-100 p-4 rounded-md">
              {t('scooters')}
            </Link>
            <Link to="/transport/atvs" className="hover:bg-gray-100 p-4 rounded-md">
              {t('atvs')}
            </Link>
            <Link to="/transport/snowmobiles" className="hover:bg-gray-100 p-4 rounded-md">
              {t('snowmobiles')}
            </Link>
          </>
        )}

        {activeTab === 'commercial' && (
          <>
            <Link to="/transport/light-commercial" className={`bg-blue-100 text-blue-600 p-4 rounded-md font-medium`}>
              {t('light.commercial')}
            </Link>
            <Link to="/transport/trucks" className="hover:bg-gray-100 p-4 rounded-md">
              {t('trucks')}
            </Link>
            <Link to="/transport/truck-tractors" className="hover:bg-gray-100 p-4 rounded-md">
              {t('truck.tractors')}
            </Link>
            <Link to="/transport/buses" className="hover:bg-gray-100 p-4 rounded-md">
              {t('buses')}
            </Link>
            <Link to="/transport/trailers" className="hover:bg-gray-100 p-4 rounded-md">
              {t('trailers')}
            </Link>
            <Link to="/transport/agricultural" className="hover:bg-gray-100 p-4 rounded-md">
              {t('agricultural')}
            </Link>
            <Link to="/transport/construction" className="hover:bg-gray-100 p-4 rounded-md">
              {t('construction')}
            </Link>
            <Link to="/transport/loaders" className="hover:bg-gray-100 p-4 rounded-md">
              {t('loaders')}
            </Link>
            <Link to="/transport/cranes" className="hover:bg-gray-100 p-4 rounded-md">
              {t('cranes')}
            </Link>
            <Link to="/transport/excavators" className="hover:bg-gray-100 p-4 rounded-md">
              {t('excavators')}
            </Link>
            <Link to="/transport/bulldozers" className="hover:bg-gray-100 p-4 rounded-md">
              {t('bulldozers')}
            </Link>
            <Link to="/transport/municipal" className="hover:bg-gray-100 p-4 rounded-md">
              {t('municipal')}
            </Link>
          </>
        )}
      </div>

      {/* Фильтры */}
      <Card className="mb-10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">{t('condition')}</label>
            <div className="flex rounded-md overflow-hidden">
              <Button variant="outline" className="flex-1 rounded-none border-r-0 bg-white">{t('all')}</Button>
              <Button variant="outline" className="flex-1 rounded-none border-r-0 border-l-0">{t('new')}</Button>
              <Button variant="outline" className="flex-1 rounded-none border-l-0">{t('used')}</Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500 mb-1 block">{t('brand')}</label>
            <Select>
              <option value="">{t('all.brands')}</option>
              {brandsData[activeTab as keyof typeof brandsData].map(brand => (
                <option key={brand.name} value={brand.name}>{brand.name}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-gray-500 mb-1 block">{t('model')}</label>
            <Select>
              <option value="">{t('all.models')}</option>
            </Select>
          </div>
        </div>

        {/* Дополнительные фильтры (отображаются в зависимости от выбранной категории) */}
        {activeTab === 'passenger' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('body.type')}</label>
              <Select>
                <option value="">{t('all.types')}</option>
                <option value="sedan">{t('sedan')}</option>
                <option value="suv">{t('suv')}</option>
                <option value="hatchback">{t('hatchback')}</option>
                <option value="wagon">{t('wagon')}</option>
                <option value="coupe">{t('coupe')}</option>
                <option value="convertible">{t('convertible')}</option>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('transmission')}</label>
              <Select>
                <option value="">{t('all')}</option>
                <option value="automatic">{t('automatic')}</option>
                <option value="manual">{t('manual')}</option>
                <option value="robot">{t('robot')}</option>
                <option value="variator">{t('variator')}</option>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('engine')}</label>
              <Select>
                <option value="">{t('all')}</option>
                <option value="petrol">{t('petrol')}</option>
                <option value="diesel">{t('diesel')}</option>
                <option value="hybrid">{t('hybrid')}</option>
                <option value="electric">{t('electric')}</option>
                <option value="gas">{t('gas')}</option>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('drive')}</label>
              <Select>
                <option value="">{t('all')}</option>
                <option value="fwd">{t('fwd')}</option>
                <option value="rwd">{t('rwd')}</option>
                <option value="awd">{t('awd')}</option>
              </Select>
            </div>
          </div>
        )}

        {activeTab === 'commercial' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('weight')}</label>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">{t('up.to.1t')}</Button>
                <Button variant="outline" className="flex-1">{t('1.1.5t')}</Button>
                <Button variant="outline" className="flex-1">{t('over.1.5t')}</Button>
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="text-sm text-gray-500 mb-1 block">{t('price')}</label>
              <div className="flex space-x-2">
                <Input type="text" placeholder={t('from')} />
                <Input type="text" placeholder={t('to')} />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('year')}</label>
              <div className="flex space-x-2">
                <Select>
                  <option value="">{t('from')}</option>
                  {Array.from({ length: 30 }, (_, i) => 2023 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
                <Select>
                  <option value="">{t('to')}</option>
                  {Array.from({ length: 30 }, (_, i) => 2023 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Checkbox id="withPhoto" />
            <label htmlFor="withPhoto" className="ml-2 text-sm">{t('with.photo')}</label>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            {activeTab === 'passenger' ? t('show.results') : 
             activeTab === 'moto' ? t('show.results') : 
             t('show.results')}
          </Button>
        </div>
      </Card>

      {/* Список популярных брендов */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6">{t('popular.brands')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brandsData[activeTab as keyof typeof brandsData].map(brand => (
            <Link 
              key={brand.name} 
              to={`/transport/brands/${brand.name.toLowerCase()}`} 
              className="flex justify-between hover:text-blue-600"
            >
              <span>{brand.name}</span>
              <span className="text-gray-500">{brand.count.toLocaleString()}</span>
            </Link>
          ))}
          
          {activeTab === 'passenger' && (
            <Link to="/transport/brands" className="text-blue-600 hover:underline">
              {t('all.brands')} — 395
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportCategoryPage;
