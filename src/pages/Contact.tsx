
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Contact = () => {
  const { language } = useAppContext();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [isMapError, setIsMapError] = useState<boolean>(false);

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
      setIsMapError(true);
    };
    
    document.head.appendChild(script);
  }, []);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapContainer.current) return;
    
    const ymaps = (window as any).ymaps;
    
    // Check if ymaps is properly loaded
    if (!ymaps) {
      console.error('Yandex Maps API not available');
      setIsMapError(true);
      return;
    }
    
    try {
      ymaps.ready(() => {
        try {
          mapRef.current = new ymaps.Map(mapContainer.current, {
            center: [43.229, 76.885],
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
          });
          
          const placemark = new ymaps.Placemark([43.229, 76.885], {
            balloonContentHeader: 'Skid QI',
            balloonContentBody: language === 'ru' 
              ? '050000, Республика Казахстан г. Алматы, ул. Чайковского, 131/6'
              : '050000, Қазақстан Республикасы, Алматы қ., Чайковский к-сі, 131/6'
          }, {
            preset: 'islands#redDotIcon'
          });
          
          mapRef.current.geoObjects.add(placemark);
        } catch (error) {
          console.error('Error initializing map:', error);
          setIsMapError(true);
        }
      });
    } catch (error) {
      console.error('Error calling ymaps.ready():', error);
      setIsMapError(true);
    }
  }, [isScriptLoaded, language]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        variant: "destructive",
        title: language === 'ru' 
          ? "Пожалуйста, заполните все поля" 
          : "Барлық өрістерді толтырыңыз",
        description: language === 'ru'
          ? "Все поля обязательны для заполнения"
          : "Барлық өрістер міндетті"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: language === 'ru' 
          ? "Неверный формат email" 
          : "Email форматы дұрыс емес",
      });
      return;
    }

    console.log('Form submitted:', formData);
    
    toast({
      title: language === 'ru' 
        ? "Сообщение отправлено" 
        : "Хабарлама жіберілді",
      description: language === 'ru'
        ? "Мы свяжемся с вами в ближайшее время"
        : "Біз сізбен жақын арада хабарласамыз"
    });

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ru' ? 'Связаться с нами' : 'Бізбен байланыс'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Отправить сообщение' : 'Хабарлама жіберу'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {language === 'ru' ? 'Имя' : 'Аты'} *
                    </Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {language === 'ru' ? 'Тема' : 'Тақырып'} *
                    </Label>
                    <Input 
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {language === 'ru' ? 'Сообщение' : 'Хабарлама'} *
                    </Label>
                    <Textarea 
                      id="message" 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {language === 'ru' ? 'Отправить' : 'Жіберу'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Наше местоположение' : 'Орналасқан жеріміз'}
                </h2>
                {isMapError ? (
                  <div className="w-full h-64 rounded-lg bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      {language === 'ru' 
                        ? 'Карта временно недоступна. Наш адрес: Республика Казахстан г. Алматы, ул. Чайковского, 131/6' 
                        : 'Карта уақытша қолжетімсіз. Біздің мекенжайымыз: Қазақстан Республикасы, Алматы қ., Чайковский к-сі, 131/6'}
                    </p>
                  </div>
                ) : (
                  <div ref={mapContainer} className="w-full h-64 rounded-lg" />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">info@skidqi.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {language === 'ru' ? 'Телефоны' : 'Телефондар'}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">+7 (701) 341-36-85</p>
                        <p className="text-sm text-muted-foreground">+7 (777) 289-49-49</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">+7 (982) 622-52-14</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {language === 'ru' ? 'Адрес' : 'Мекенжай'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ru' 
                          ? '050000, Республика Казахстан г. Алматы, ул. Чайковского, 131/6'
                          : '050000, Қазақстан Республикасы, Алматы қ., Чайковский к-сі, 131/6'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {language === 'ru' ? 'Часы работы' : 'Жұмыс уақыты'}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {language === 'ru' 
                            ? 'Пн-Пт: 9:00 - 20:00'
                            : 'Дс-Жм: 9:00 - 20:00'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ru'
                            ? 'Сб-Вс: 9:00 - 17:00'
                            : 'Сб-Жс: 9:00 - 17:00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'О службе поддержки' : 'Қолдау қызметі туралы'}
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    {language === 'ru'
                      ? 'Здесь вы можете оставить свой отзыв о проекте или обратиться в службу заботы о пользователях.'
                      : 'Мұнда сіз жоба туралы пікіріңізді қалдыра аласыз немесе пайдаланушыларға қамқорлық көрсету қызметіне хабарласа аласыз.'}
                  </p>
                  <p>
                    {language === 'ru'
                      ? 'Мы прочитаем ваше письмо с 9:00 до 20:00 в рабочие дни и до 17:00 в выходные.'
                      : 'Біз сіздің хатыңызды жұмыс күндері сағат 9:00-ден 20:00-ге дейін және демалыс күндері 17:00-ге дейін оқимыз.'}
                  </p>
                  <p>
                    {language === 'ru'
                      ? 'Также, вы можете написать свой вопрос службе заботы в WhatsApp по номеру +7 (982) 622-52-14 или позвонить по номерам: +7 (701) 341-36-85 и +7 (777) 289-49-49 (с 9:00 до 20:00 в рабочие и с 9:00 до 17:00 в выходные дни)'
                      : 'Сондай-ақ, сіз +7 (982) 622-52-14 нөмірі арқылы WhatsApp-та қамқорлық қызметіне сұрағыңызды жаза аласыз немесе +7 (701) 341-36-85 және +7 (777) 289-49-49 нөмірлеріне қоңырау шала аласыз (жұмыс күндері 9:00-ден 20:00-ге дейін және демалыс күндері 9:00-ден 17:00-ге дейін)'}
                  </p>
                  <p>
                    {language === 'ru'
                      ? 'Будем благодарны за найденные ошибки и предложения. Спасибо!'
                      : 'Табылған қателіктер мен ұсыныстар үшін алғыс білдіреміз. Рахмет!'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Мы в социальных сетях' : 'Біз әлеуметтік желілерде'}
                </h2>
                
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Youtube className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
