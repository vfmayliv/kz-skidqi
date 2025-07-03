import { CitySelectionModal } from '@/components/CitySelectionModal';
import { Header } from '@/components/Header';
import CategoryMenu from '@/components/CategoryMenu';
import CategoryGrid from '@/components/CategoryGrid';
import { EnhancedFeaturedListings } from '@/components/EnhancedFeaturedListings';
import { Footer } from '@/components/Footer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { useIsMobile } from '@/hooks/use-mobile';

const Banner = () => {
  const { language, t } = useAppWithTranslations();
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-blue-50 py-6">
      <div className="container mx-auto px-4">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div 
                className="h-[200px] md:h-[300px] rounded-lg flex flex-col items-center justify-center text-white p-6 relative overflow-hidden"
                style={{
                  backgroundImage: "url('/bg.png')",
                  backgroundSize: "cover",
                  backgroundPosition: isMobile ? "center" : "center"
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">
                    {language === 'ru' ? 'Добро пожаловать на Skidoska.kz' : 'Skidoska.kz-ге қош келдіңіз'}
                  </h2>
                  <p className="text-lg md:text-xl mb-4 text-center">
                    {language === 'ru' ? 'Покупайте и продавайте все, что угодно' : 'Кез келген затты сатып алыңыз және сатыңыз'}
                  </p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div 
                className="h-[200px] md:h-[300px] rounded-lg flex flex-col items-center justify-center text-white p-6 relative overflow-hidden"
                style={{
                  backgroundImage: "url('/sale.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 bg-gradient-to-r from-red-500/70 to-orange-500/70"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">
                    {language === 'ru' ? 'Скидки до 70%' : 'Жеңілдіктер 70% дейін'}
                  </h2>
                  <p className="text-lg md:text-xl mb-4 text-center">
                    {language === 'ru' ? 'Отличные предложения каждый день' : 'Күн сайын тамаша ұсыныстар'}
                  </p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <CitySelectionModal />
      <Header />
      <Banner />
      {/* Новый компонент с сеткой категорий и выпадающими подкатегориями */}
      <CategoryGrid />
      <main className="flex-1">
        <EnhancedFeaturedListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;