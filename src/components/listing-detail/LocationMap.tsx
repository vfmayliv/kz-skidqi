
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  city: string;
  coordinates?: { lat: number; lng: number };
  language: string;
}

// Координаты основных городов Казахстана
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Алматы': { lat: 43.2381, lng: 76.9452 },
  'Астана': { lat: 51.1694, lng: 71.4491 },
  'Нур-Султан': { lat: 51.1694, lng: 71.4491 },
  'Шымкент': { lat: 42.3417, lng: 69.5901 },
  'Актобе': { lat: 50.2839, lng: 57.1670 },
  'Тараз': { lat: 42.9000, lng: 71.3667 },
  'Павлодар': { lat: 52.2873, lng: 76.9674 },
  'Усть-Каменогорск': { lat: 49.9787, lng: 82.6067 },
  'Семей': { lat: 50.4119, lng: 80.2275 },
  'Атырау': { lat: 47.1164, lng: 51.8826 },
  'Костанай': { lat: 53.2141, lng: 63.6246 },
  'Кызылорда': { lat: 44.8479, lng: 65.5093 },
  'Уральск': { lat: 51.2333, lng: 51.3667 },
  'Петропавловск': { lat: 54.8833, lng: 69.1500 },
  'Актау': { lat: 43.6481, lng: 51.1801 },
  'Темиртау': { lat: 50.0547, lng: 72.9405 },
  'Туркестан': { lat: 43.3061, lng: 68.2539 },
  'Балхаш': { lat: 46.8667, lng: 75.0000 },
  'Жезказган': { lat: 47.7833, lng: 67.7167 },
  'Рудный': { lat: 52.9667, lng: 63.1167 }
};

const LocationMap = ({ city, coordinates, language }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  
  // Функция для получения координат города
  const getCityCoordinates = (cityName: string) => {
    // Сначала ищем точное совпадение
    let coords = CITY_COORDINATES[cityName];
    
    if (!coords) {
      // Ищем частичное совпадение (игнорируя регистр)
      const cityKey = Object.keys(CITY_COORDINATES).find(key => 
        key.toLowerCase().includes(cityName.toLowerCase()) ||
        cityName.toLowerCase().includes(key.toLowerCase())
      );
      
      if (cityKey) {
        coords = CITY_COORDINATES[cityKey];
      }
    }
    
    // Если не нашли, используем Алматы по умолчанию
    return coords || CITY_COORDINATES['Алматы'];
  };

  // Load Yandex Maps script
  useEffect(() => {
    if (document.getElementById('yandex-maps-script')) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'yandex-maps-script';
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU';
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('Error loading Yandex Maps script:', error);
    };
    
    document.head.appendChild(script);
  }, []);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapContainer.current) return;
    
    // Wait for ymaps to be available
    if (!(window as any).ymaps) {
      const checkYmaps = setInterval(() => {
        if ((window as any).ymaps) {
          clearInterval(checkYmaps);
          initializeMap();
        }
      }, 100);
      return;
    }
    
    initializeMap();
  }, [isScriptLoaded, coordinates, city]);

  // Initialize Yandex Map
  const initializeMap = () => {
    const ymaps = (window as any).ymaps;
    
    ymaps.ready(() => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
      
      // Определяем координаты для карты
      let mapCenter;
      
      if (coordinates) {
        // Если есть точные координаты объявления
        mapCenter = [coordinates.lat, coordinates.lng];
        console.log(`Используем точные координаты: ${mapCenter}`);
      } else {
        // Если нет точных координат, используем координаты города
        const cityCoords = getCityCoordinates(city);
        mapCenter = [cityCoords.lat, cityCoords.lng];
        console.log(`Используем координаты города ${city}: ${mapCenter}`);
      }
      
      // Create map instance
      mapRef.current = new ymaps.Map(mapContainer.current, {
        center: mapCenter,
        zoom: coordinates ? 15 : 12, // Больший зум для точных координат
        controls: ['zoomControl', 'fullscreenControl']
      });
      
      // Add controls
      mapRef.current.controls.add('searchControl');
      mapRef.current.controls.add('geolocationControl', { float: 'right' });
      
      // If we have specific coordinates, add a marker
      if (coordinates) {
        const placemark = new ymaps.Placemark([coordinates.lat, coordinates.lng], {
          hintContent: city
        }, {
          preset: 'islands#redDotIconWithCaption'
        });
        
        mapRef.current.geoObjects.add(placemark);
      } else {
        // If we don't have coordinates, search for the city
        const geocoder = ymaps.geocode(city);
        geocoder.then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);
          
          if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            const bounds = firstGeoObject.properties.get('boundedBy');
            
            // Create a placemark at the found location
            const placemark = new ymaps.Placemark(coords, {
              hintContent: city
            }, {
              preset: 'islands#redDotIconWithCaption'
            });
            
            mapRef.current.geoObjects.add(placemark);
            
            // Adjust the map to show the found city
            if (bounds) {
              mapRef.current.setBounds(bounds, {
                checkZoomRange: true
              });
            } else {
              // Если bounds недоступен, центрируем карту на найденных координатах
              mapRef.current.setCenter(coords, 12);
            }
          } else {
            // Если геокодирование не дало результатов, используем предустановленные координаты
            const fallbackCoords = getCityCoordinates(city);
            const placemark = new ymaps.Placemark([fallbackCoords.lat, fallbackCoords.lng], {
              hintContent: city
            }, {
              preset: 'islands#redDotIconWithCaption'
            });
            
            mapRef.current.geoObjects.add(placemark);
            mapRef.current.setCenter([fallbackCoords.lat, fallbackCoords.lng], 12);
          }
        }).catch((error: any) => {
          console.error('Geocoding error:', error);
          // В случае ошибки используем предустановленные координаты
          const fallbackCoords = getCityCoordinates(city);
          const placemark = new ymaps.Placemark([fallbackCoords.lat, fallbackCoords.lng], {
            hintContent: city
          }, {
            preset: 'islands#redDotIconWithCaption'
          });
          
          mapRef.current.geoObjects.add(placemark);
          mapRef.current.setCenter([fallbackCoords.lat, fallbackCoords.lng], 12);
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-primary" />
        {language === 'ru' ? 'Местоположение' : 'Орналасқан жері'}
      </h2>
      <div ref={mapContainer} className="w-full h-[300px] rounded overflow-hidden"></div>
      <div className="mt-3 text-sm text-muted-foreground">
        {city}
      </div>
      <Button variant="outline" className="mt-3 text-sm" size="sm" onClick={() => {
        const url = `https://maps.yandex.ru/?text=${encodeURIComponent(city)}`;
        window.open(url, '_blank');
      }}>
        <MapPin className="h-4 w-4 mr-2" />
        {language === 'ru' ? 'Открыть на Яндекс Картах' : 'Яндекс Карталарда ашу'}
      </Button>
    </div>
  );
};

export default LocationMap;
