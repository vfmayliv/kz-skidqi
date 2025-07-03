import { useState, useEffect } from 'react';
import { X, Check, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cities } from '@/data/cities';
import { useAppWithTranslations } from '@/stores/useAppStore';

export function CitySelectionModal() {
  const { language, selectedCity, cityConfirmed, t, setSelectedCity, setCityConfirmed } = useAppWithTranslations();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedCity, setSuggestedCity] = useState(cities[0]);

  useEffect(() => {
    // Check if this is the first visit by looking at localStorage
    const hasVisited = localStorage.getItem('hasVisited');
    
    // If city is not confirmed and user hasn't visited before, show confirmation dialog
    if (!cityConfirmed && !hasVisited) {
      // Set Almaty as suggested city (first in list)
      setSuggestedCity(cities[0]); // Almaty
      setOpen(true);
      // Mark as visited
      localStorage.setItem('hasVisited', 'true');
    }
  }, [cityConfirmed]);

  const confirmCity = (confirm: boolean) => {
    if (confirm) {
      setSelectedCity(suggestedCity);
      setCityConfirmed(true);
    } else {
      // If user says no, show city selection
      setCityConfirmed(true);
      // Keep modal open for city selection
      return;
    }
    setOpen(false);
  };

  const selectCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCityConfirmed(true);
    setOpen(false);
  };

  const filteredCities = searchTerm
    ? cities.filter(c => 
        c[language].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cities;

  return (
    <>
      {/* City Confirmation Dialog */}
      <Dialog open={open && !cityConfirmed} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setCityConfirmed(true);
        }
        setOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' 
                ? `Ваш город ${suggestedCity[language]}?` 
                : `Сіздің қалаңыз ${suggestedCity[language]}?`
              }
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center space-x-4 mt-4">
            <Button onClick={() => confirmCity(true)} className="w-24">
              {language === 'ru' ? 'Да' : 'Иә'}
            </Button>
            <Button variant="outline" onClick={() => confirmCity(false)} className="w-24">
              {language === 'ru' ? 'Нет' : 'Жоқ'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* City Selection Dialog for manual selection */}
      <Dialog open={open && cityConfirmed && !selectedCity} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('selectCity')}</DialogTitle>
          </DialogHeader>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  setSelectedCity(null);
                  setCityConfirmed(true);
                  setOpen(false);
                }}
              >
                {t('allCities')}
              </Button>
              
              {filteredCities.map((c, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start ${selectedCity && selectedCity[language] === c[language] ? 'bg-primary/10' : ''}`}
                  onClick={() => selectCity(c)}
                >
                  {c[language]}
                  {selectedCity && selectedCity[language] === c[language] && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export a function to open city selection manually
export const openCitySelection = () => {
  // This will be used by the header to open city selection
  const event = new CustomEvent('openCitySelection');
  window.dispatchEvent(event);
};
