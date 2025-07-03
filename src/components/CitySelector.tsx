
import { useState, useEffect } from 'react';
import { X, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cities } from '@/data/cities';
import { useAppWithTranslations } from '@/stores/useAppStore';

interface CitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CitySelector({ isOpen, onClose }: CitySelectorProps) {
  const { language, selectedCity, setSelectedCity } = useAppWithTranslations();
  const [searchTerm, setSearchTerm] = useState('');

  const selectCity = (city) => {
    setSelectedCity(city);
    onClose();
  };

  const filteredCities = searchTerm
    ? cities.filter(c => 
        c[language].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cities;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {language === 'ru' ? 'Выберите город' : 'Қаланы таңдаңыз'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ru' ? 'Поиск города...' : 'Қаланы іздеу...'}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => selectCity(null)}
            >
              {language === 'ru' ? 'Все города' : 'Барлық қалалар'}
              {!selectedCity && <Check className="ml-auto h-4 w-4" />}
            </Button>
            
            {filteredCities.map((city, index) => (
              <Button
                key={index}
                variant="outline"
                className={`w-full justify-start ${
                  selectedCity && selectedCity[language] === city[language] 
                    ? 'bg-primary/10 border-primary' 
                    : ''
                }`}
                onClick={() => selectCity(city)}
              >
                {city[language]}
                {selectedCity && selectedCity[language] === city[language] && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
