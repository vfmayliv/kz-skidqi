
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { categories } from '@/data/categories';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CitySelector } from '@/components/CitySelector';
import { useChildrenCategories } from '@/hooks/useChildrenCategories';
import { usePharmacyCategories } from '@/hooks/usePharmacyCategories';
import { useFashionCategories } from '@/hooks/useFashionCategories';
import { useFoodCategories } from '@/hooks/useFoodCategories';
import { useTechElectronicsCategories } from '@/hooks/useTechElectronicsCategories';
import { useHomeCategories } from '@/hooks/useHomeCategories';
import { useServicesCategories } from '@/hooks/useServicesCategories';
import { usePetCategories } from '@/hooks/usePetCategories';
import { useHobbiesCategories } from '@/hooks/useHobbiesCategories';
import { useBeautyCategories } from '@/hooks/useBeautyCategories';
import { useSupabase } from '@/contexts/SupabaseContext';
import * as LucideIcons from 'lucide-react';

export function Header() {
  const { language, setLanguage, selectedCity, t } = useAppWithTranslations();
  const { user } = useSupabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { categories: childrenCategories } = useChildrenCategories();
  const { categories: pharmacyCategories } = usePharmacyCategories();
  const { categories: fashionCategories } = useFashionCategories();
  const { categories: foodCategories } = useFoodCategories();
  const { categories: techElectronicsCategories } = useTechElectronicsCategories();
  const { categories: homeCategories } = useHomeCategories();
  const { categories: servicesCategories } = useServicesCategories();
  const { categories: petCategories } = usePetCategories();
  const { categories: hobbiesCategories } = useHobbiesCategories();
  const { categories: beautyCategories } = useBeautyCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCreateListingClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/create-listing');
    }
  };

  const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  // Helper function to get city display name
  const getCityDisplayName = () => {
    if (!selectedCity) {
      return language === 'ru' ? 'Город' : 'Қала';
    }
    return selectedCity[language];
  };

  // Handle city selection click
  const handleCityClick = () => {
    setIsCityModalOpen(true);
  };

  // Get subcategories for specific categories (only level 0)
  const getSubcategories = (categoryId: string) => {
    if (categoryId === 'kids') {
      return childrenCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Baby'
        }));
    }
    if (categoryId === 'pharmacy') {
      return pharmacyCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Pill'
        }));
    }
    if (categoryId === 'fashion') {
      return fashionCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Shirt'
        }));
    }
    if (categoryId === 'food') {
      return foodCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Apple'
        }));
    }
    if (categoryId === 'electronics') {
      return techElectronicsCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Smartphone'
        }));
    }
    if (categoryId === 'home') {
      return homeCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Home'
        }));
    }
    if (categoryId === 'services') {
      return servicesCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Settings'
        }));
    }
    if (categoryId === 'pets') {
      return petCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug || cat.id,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Heart'
        }));
    }
    if (categoryId === 'hobby') {
      return hobbiesCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug || cat.id,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Dumbbell'
        }));
    }
    if (categoryId === 'beauty') {
      return beautyCategories
        .filter(cat => cat.level === 0) // Only level 0
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Sparkles'
        }));
    }
    return [];
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Categories Menu */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" onError={(e) => {
                  // Fallback if logo doesn't load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }} />
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ display: 'none' }}>
                  L
                </div>
              </Link>
              
              {/* Categories Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    {language === 'ru' ? 'Все категории' : 'Барлық санаттар'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="start">
                  <div className="grid grid-cols-1 max-h-96 overflow-y-auto">
                    {categories.map((category) => (
                      <div 
                        key={category.id} 
                        className="relative"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {/* Main Category */}
                        <Link
                          to={category.id === 'property' ? '/property' : 
                               category.id === 'transport' ? '/transport' : 
                               `/category/${category.id}`}
                          className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <DynamicIcon name={category.icon} className="h-5 w-5 mr-3 text-gray-600" />
                          <span className="font-medium text-gray-900">
                            {category.name[language]}
                          </span>
                        </Link>
                        
                        {/* Subcategories on hover - only for categories with Supabase data */}
                        {hoveredCategory === category.id && 
                         ['kids', 'pharmacy', 'fashion', 'food', 'electronics', 'home', 'services', 'pets', 'hobby', 'beauty'].includes(category.id) && (
                          <div className="absolute left-full top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                            <div className="p-2">
                              {getSubcategories(category.id).map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  to={`/category/${category.id}/${subcat.id}`}
                                  className="flex items-center p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                >
                                  <DynamicIcon name={subcat.icon} className="h-4 w-4 mr-2" />
                                  {subcat.name[language]}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder={language === 'ru' ? 'Поиск товаров...' : 'Тауарларды іздеу...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  {language === 'ru' ? 'Найти' : 'Табу'}
                </Button>
              </form>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* City Selector - Now clickable */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-blue-600"
                onClick={handleCityClick}
              >
                📍 {getCityDisplayName()}
              </Button>

              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {language === 'ru' ? 'РУ' : 'ҚЗ'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage('ru')}>
                    Русский
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('kz')}>
                    Қазақша
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button onClick={handleCreateListingClick} className="ml-2">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Подать объявление' : 'Хабарландыру беру'}
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      to={category.id === 'property' ? '/property' : 
                           category.id === 'transport' ? '/transport' : 
                           `/category/${category.id}`}
                      className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name[language]}
                    </Link>
                    {/* Only show level 0 subcategories in mobile */}
                    {['kids', 'pharmacy', 'fashion', 'food', 'electronics', 'home', 'services', 'pets', 'hobby', 'beauty'].includes(category.id) && 
                     getSubcategories(category.id).map((subcat) => (
                      <Link
                        key={subcat.id}
                        to={`/category/${category.id}/${subcat.id}`}
                        className="block px-8 py-1 text-sm text-gray-500 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subcat.name[language]}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* City Selection Modal */}
      <CitySelector 
        isOpen={isCityModalOpen} 
        onClose={() => setIsCityModalOpen(false)} 
      />
    </>
  );
}
