import { useState, useEffect } from "react";
import { useAppWithTranslations } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, MapPin, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { Region, City, Microdistrict } from "@/types/listingType";
import { getRegions, getCitiesByRegion, getMicrodistrictsByCity, getSpecialCityRegions } from "@/services/locationService";
import { Badge } from "@/components/ui/badge";

interface LocationFilterProps {
  regionId: string | null;
  cityId: string | null;
  microdistrictId: string | null;
  onLocationChange: (params: { regionId?: string | null; cityId?: string | null; microdistrictId?: string | null }) => void;
}

export function LocationFilter({
  regionId,
  cityId,
  microdistrictId,
  onLocationChange
}: LocationFilterProps) {
  const { language } = useAppWithTranslations();
  const [isOpen, setIsOpen] = useState(false);
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [microdistricts, setMicrodistricts] = useState<Microdistrict[]>([]);
  const [specialCityRegions, setSpecialCityRegions] = useState<string[]>([]);
  
  const [loading, setLoading] = useState({
    regions: false,
    cities: false,
    microdistricts: false
  });
  
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedMicrodistrict, setSelectedMicrodistrict] = useState<Microdistrict | null>(null);

  // Загрузка регионов и специальных городов-регионов
  useEffect(() => {
    const loadRegions = async () => {
      setLoading(prev => ({ ...prev, regions: true }));
      
      try {
        const regionsData = await getRegions();
        setRegions(regionsData);
        
        const specialCities = await getSpecialCityRegions();
        setSpecialCityRegions(specialCities);
      } catch (error) {
        console.error('Failed to load regions:', error);
      } finally {
        setLoading(prev => ({ ...prev, regions: false }));
      }
    };
    
    loadRegions();
  }, []);
  
  // Загрузка городов при выборе региона
  useEffect(() => {
    if (!regionId) {
      setCities([]);
      return;
    }
    
    const loadCities = async () => {
      setLoading(prev => ({ ...prev, cities: true }));
      
      try {
        const citiesData = await getCitiesByRegion(regionId);
        setCities(citiesData);
        
        // Если есть выбранный город, найти его в списке
        if (cityId) {
          const city = citiesData.find(c => c.id === cityId);
          setSelectedCity(city || null);
        } else {
          setSelectedCity(null);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    };
    
    // Установка выбранного региона
    const region = regions.find(r => r.id === regionId);
    setSelectedRegion(region || null);
    
    loadCities();
  }, [regionId, regions, cityId]);
  
  // Загрузка микрорайонов при выборе города
  useEffect(() => {
    if (!cityId) {
      setMicrodistricts([]);
      return;
    }
    
    const loadMicrodistricts = async () => {
      setLoading(prev => ({ ...prev, microdistricts: true }));
      
      try {
        const microdistrictsData = await getMicrodistrictsByCity(cityId);
        setMicrodistricts(microdistrictsData);
        
        // Если есть выбранный микрорайон, найти его в списке
        if (microdistrictId) {
          const microdistrict = microdistrictsData.find(md => md.id === microdistrictId);
          setSelectedMicrodistrict(microdistrict || null);
        } else {
          setSelectedMicrodistrict(null);
        }
      } catch (error) {
        console.error('Failed to load microdistricts:', error);
      } finally {
        setLoading(prev => ({ ...prev, microdistricts: false }));
      }
    };
    
    loadMicrodistricts();
  }, [cityId, microdistrictId]);
  
  // Определение названий для разных уровней административного деления
  const getCityLevelLabel = (): string => {
    if (selectedRegion && specialCityRegions.includes(selectedRegion.id)) {
      return language === 'ru' ? 'Город' : 'Қала';
    }
    return language === 'ru' ? 'Район' : 'Аудан';
  };
  
  const getMicrodistrictLabel = (): string => {
    return language === 'ru' ? 'Микрорайон' : 'Шағынаудан';
  };
  
  // Построение текста для кнопки
  const getButtonText = (): string => {
    if (!selectedRegion) {
      return language === 'ru' ? 'Местоположение' : 'Орналасқан жері';
    }
    
    let text = selectedRegion ? (language === 'ru' ? selectedRegion.name_ru : selectedRegion.name_kz) : '';
    
    if (selectedCity) {
      text += `, ${language === 'ru' ? selectedCity.name_ru : selectedCity.name_kz}`;
      
      if (selectedMicrodistrict) {
        text += `, ${language === 'ru' ? selectedMicrodistrict.name_ru : selectedMicrodistrict.name_kz}`;
      }
    }
    
    return text;
  };
  
  // Обработчики выбора
  const handleRegionSelect = (region: Region) => {
    onLocationChange({ 
      regionId: region.id, 
      cityId: null, 
      microdistrictId: null 
    });
  };
  
  const handleCitySelect = (city: City) => {
    onLocationChange({ 
      cityId: city.id,
      microdistrictId: null
    });
  };
  
  const handleMicrodistrictSelect = (microdistrict: Microdistrict) => {
    onLocationChange({
      microdistrictId: microdistrict.id
    });
  };
  
  const handleReset = () => {
    onLocationChange({ 
      regionId: null, 
      cityId: null, 
      microdistrictId: null 
    });
    setIsOpen(false);
  };
  
  return (
    <div className="w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`w-full justify-start ${selectedRegion ? 'font-medium' : ''}`}
          >
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            {getButtonText()}
            <ChevronDown className="w-4 h-4 ml-auto opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={language === 'ru' ? "Поиск..." : "Іздеу..."} 
            />
            <CommandList>
              <CommandEmpty>
                {language === 'ru' ? "Не найдено" : "Табылмады"}
              </CommandEmpty>
              
              {/* Регионы */}
              <CommandGroup heading={language === 'ru' ? "Регион" : "Аймақ"}>
                {loading.regions ? (
                  <div className="p-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full mt-2" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                ) : (
                  regions.map((region) => (
                    <CommandItem
                      key={region.id}
                      value={language === 'ru' ? region.name_ru : region.name_kz}
                      onSelect={() => handleRegionSelect(region)}
                      className="flex items-center"
                    >
                      {language === 'ru' ? region.name_ru : region.name_kz}
                      {regionId === region.id && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
              
              {/* Города/районы */}
              {regionId && (
                <CommandGroup heading={getCityLevelLabel()}>
                  {loading.cities ? (
                    <div className="p-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full mt-2" />
                    </div>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <CommandItem
                        key={city.id}
                        value={language === 'ru' ? city.name_ru : city.name_kz}
                        onSelect={() => handleCitySelect(city)}
                        className="flex items-center"
                      >
                        {language === 'ru' ? city.name_ru : city.name_kz}
                        {cityId === city.id && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))
                  ) : (
                    <div className="py-2 px-3 text-sm text-muted-foreground">
                      {language === 'ru' ? 'Нет данных' : 'Деректер жоқ'}
                    </div>
                  )}
                </CommandGroup>
              )}
              
              {/* Микрорайоны */}
              {cityId && (
                <CommandGroup heading={getMicrodistrictLabel()}>
                  {loading.microdistricts ? (
                    <div className="p-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full mt-2" />
                    </div>
                  ) : microdistricts.length > 0 ? (
                    microdistricts.map((microdistrict) => (
                      <CommandItem
                        key={microdistrict.id}
                        value={language === 'ru' ? microdistrict.name_ru : microdistrict.name_kz}
                        onSelect={() => handleMicrodistrictSelect(microdistrict)}
                        className="flex items-center"
                      >
                        {language === 'ru' ? microdistrict.name_ru : microdistrict.name_kz}
                        {microdistrictId === microdistrict.id && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))
                  ) : (
                    <div className="py-2 px-3 text-sm text-muted-foreground">
                      {language === 'ru' ? 'Нет данных' : 'Деректер жоқ'}
                    </div>
                  )}
                </CommandGroup>
              )}
            </CommandList>
            
            <div className="p-2 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-center" 
                onClick={handleReset}
                size="sm"
              >
                {language === 'ru' ? 'Сбросить' : 'Тазалау'}
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Отображение выбранного местоположения в виде бейджей */}
      {(regionId || cityId || microdistrictId) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedRegion && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {language === 'ru' ? selectedRegion.name_ru : selectedRegion.name_kz}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0" 
                onClick={() => handleReset()}
              >
                <span className="sr-only">
                  {language === 'ru' ? 'Удалить' : 'Жою'}
                </span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedCity && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {language === 'ru' ? selectedCity.name_ru : selectedCity.name_kz}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0" 
                onClick={() => onLocationChange({ cityId: null, microdistrictId: null })}
              >
                <span className="sr-only">
                  {language === 'ru' ? 'Удалить' : 'Жою'}
                </span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedMicrodistrict && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {language === 'ru' ? selectedMicrodistrict.name_ru : selectedMicrodistrict.name_kz}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0" 
                onClick={() => onLocationChange({ microdistrictId: null })}
              >
                <span className="sr-only">
                  {language === 'ru' ? 'Удалить' : 'Жою'}
                </span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
