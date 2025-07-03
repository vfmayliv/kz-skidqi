import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { processImageForUpload } from '@/utils/imageUtils';
import { useNavigate } from 'react-router-dom';

// Import profile components
import { MyListings } from '@/components/profile/MyListings';
import { MessagesInbox } from '@/components/profile/MessagesInbox';
import { ReviewsList } from '@/components/profile/ReviewsList';
import { NotificationsList } from '@/components/profile/NotificationsList';

// User listings and messages localStorage keys (temporary)
const USER_LISTINGS_KEY = 'userListings';
const USER_MESSAGES_KEY = 'userMessages';
const USER_REVIEWS_KEY = 'userReviews';
const USER_NOTIFICATIONS_KEY = 'userNotifications';

const UserProfile = () => {
  const { language } = useAppContext();
  const { user: authUser, supabase, loading: authLoading } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Combined loading state
  const [isInitializing, setIsInitializing] = useState(true);
  
  // User profile state (start with empty values, no mock data)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile photo
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  
  // User listings (temporary localStorage)
  const [userListings, setUserListings] = useState<any[]>([]);
  
  // User messages (temporary localStorage)
  const [messages, setMessages] = useState<any[]>([]);
  
  // User reviews (temporary localStorage)
  const [reviews, setReviews] = useState<any[]>([]);
  
  // User notifications (temporary localStorage)
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Authentication and profile data loading
  useEffect(() => {
    const initializeProfile = async () => {
      // Wait for auth loading to complete
      if (authLoading) {
        return;
      }

      // If user is not authenticated, redirect to login
      if (!authUser) {
        toast({
          title: language === 'ru' ? 'Доступ запрещен' : 'Қол жеткізу тыйым салынған',
          description: language === 'ru' 
            ? 'Пожалуйста, войдите в систему.' 
            : 'Жүйеге кіріңіз.',
          variant: 'destructive'
        });
        navigate('/login');
        return;
      }

      // If user is authenticated, load profile data
      setEmail(authUser.email || '');
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, avatar_url')
          .eq('id', authUser.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Ошибка загрузки профиля:', profileError);
          toast({
            title: language === 'ru' ? 'Ошибка загрузки профиля' : 'Профильді жүктеу қатесі',
            description: profileError.message,
            variant: 'destructive'
          });
        } else if (profileData) {
          // Load real data from Supabase
          setFirstName(profileData.first_name || '');
          setLastName(profileData.last_name || '');
          setPhone(profileData.phone || '');
          setAvatarUrl(profileData.avatar_url || null);
        }
        // If no profile data exists yet (new user), keep empty strings
        
      } catch (e) {
        console.error('Исключение при загрузке профиля:', e);
        toast({
          title: language === 'ru' ? 'Исключение при загрузке профиля' : 'Профильді жүктеу кезіндегі қате',
          description: (e as Error).message,
          variant: 'destructive'
        });
      }

      // Load temporary data from localStorage
      loadTemporaryData();
      
      // Mark initialization as complete
      setIsInitializing(false);
    };

    initializeProfile();

  }, [authUser, authLoading, supabase, language, toast, navigate]);

  // Function to load temporary data (messages, reviews, etc.)
  const loadTemporaryData = () => {
    // Load listings
    const savedListings = localStorage.getItem(USER_LISTINGS_KEY);
    if (savedListings) {
      try {
        const listingsData = JSON.parse(savedListings);
        setUserListings(listingsData);
      } catch (error) {
        console.error('Error loading user listings:', error);
        setUserListings([]);
      }
    } else {
      setUserListings([]);
    }
    
    // Load messages
    const savedMessages = localStorage.getItem(USER_MESSAGES_KEY);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
      }
    } else {
      const exampleMessages = [
        {
          id: 1,
          sender: 'Асқар Жұмабаев',
          content: language === 'ru' ? 'Здравствуйте, интересует ваше объявление' : 'Сәлеметсіз бе, сіздің хабарландыруыңыз қызықтырады',
          date: new Date().toISOString(),
          read: false
        }
      ];
      setMessages(exampleMessages);
      localStorage.setItem(USER_MESSAGES_KEY, JSON.stringify(exampleMessages));
    }
    
    // Load reviews
    const savedReviews = localStorage.getItem(USER_REVIEWS_KEY);
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      }
    } else {
      const exampleReviews = [
        {
          id: 1,
          author: 'Мария К.',
          rating: 5,
          comment: language === 'ru' ? 'Отличный продавец, быстрая доставка!' : 'Керемет сатушы, жылдам жеткізу!',
          date: new Date().toISOString()
        }
      ];
      setReviews(exampleReviews);
      localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(exampleReviews));
    }
    
    // Load notifications
    const savedNotifications = localStorage.getItem(USER_NOTIFICATIONS_KEY);
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
      }
    } else {
      const exampleNotifications = [
        {
          id: 1,
          title: language === 'ru' ? 'Новое сообщение' : 'Жаңа хабарлама',
          content: language === 'ru' ? 'У вас новое сообщение от пользователя Асқар Жұмабаев' : 'Сізде Асқар Жұмабаевтан жаңа хабарлама бар',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          title: language === 'ru' ? 'Новый отзыв' : 'Жаңа пікір',
          content: language === 'ru' ? 'Пользователь оставил вам новый отзыв' : 'Пайдаланушы сізге жаңа пікір қалдырды',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: true
        }
      ];
      setNotifications(exampleNotifications);
      localStorage.setItem(USER_NOTIFICATIONS_KEY, JSON.stringify(exampleNotifications));
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Process image for upload
      const processedFile = await processImageForUpload(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(processedFile);
      setAvatarUrl(previewUrl);
      setNewAvatarFile(processedFile);
      
      toast({
        title: language === 'ru' ? 'Фото загружено' : 'Фото жүктелді',
        description: language === 'ru' ? 'Фото профиля обновлено' : 'Профиль фотосы жаңартылды',
      });
    }
  };
  
  const handleProfileSave = async () => {
    if (!authUser || !supabase) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' ? 'Сессия не найдена' : 'Сессия табылмады',
        variant: 'destructive'
      });
      return;
    }

    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: language === 'ru' ? 'Ошибка валидации' : 'Тексеру қатесі',
        description: language === 'ru' ? 'Имя и фамилия обязательны' : 'Аты мен тегі міндетті',
        variant: 'destructive'
      });
      return;
    }

    let processedAvatarUrl = avatarUrl;

    // Handle avatar upload if new file is selected
    if (newAvatarFile) {
      try {
        const filePath = `avatars/${authUser.id}/${Date.now()}_${newAvatarFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, newAvatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        processedAvatarUrl = data.publicUrl;
        setAvatarUrl(processedAvatarUrl);
        setNewAvatarFile(null);

      } catch (error) {
        console.error('Ошибка загрузки аватара:', error);
        toast({
          title: language === 'ru' ? 'Ошибка загрузки аватара' : 'Аватар жүктеу қатесі',
          description: (error as Error).message,
          variant: 'destructive'
        });
        return;
      }
    }

    // Save profile data to Supabase
    const profileDataToSave = {
      id: authUser.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      avatar_url: processedAvatarUrl,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: saveError } = await supabase
        .from('profiles')
        .upsert(profileDataToSave, { onConflict: 'id' });

      if (saveError) throw saveError;

      setIsEditingProfile(false);
      
      toast({
        title: language === 'ru' ? 'Профиль сохранен' : 'Профиль сақталды',
        description: language === 'ru' ? 'Ваши данные профиля успешно обновлены' : 'Сіздің профиль деректеріңіз сәтті жаңартылды',
      });
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      toast({
        title: language === 'ru' ? 'Ошибка сохранения профиля' : 'Профильді сақтау қатесі',
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  };
  
  const handleLanguageChange = (lang: 'ru' | 'kz') => {
    if (language !== lang) {
      // This should be handled by AppContext
      toast({
        title: lang === 'ru' ? 'Язык изменен' : 'Тіл өзгертілді',
        description: lang === 'ru' 
          ? 'Язык интерфейса изменен на русский' 
          : 'Интерфейс тілі қазақшаға өзгертілді',
      });
    }
  };
  
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const markNotificationAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    localStorage.setItem(USER_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  };
  
  const getUnreadCount = (items: any[]) => {
    return items.filter(item => !item.read).length;
  };

  // Show loading spinner only during initial loading
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {language === 'ru' ? 'Загрузка профиля...' : 'Профильді жүктеу...'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {language === 'ru' ? 'Личный кабинет' : 'Жеке кабинет'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar with user info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Profile" 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                            {firstName.charAt(0)}{lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      {isEditingProfile && (
                        <div className="absolute bottom-0 right-0">
                          <label htmlFor="profile-photo" className="cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </div>
                            <input 
                              id="profile-photo" 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleAvatarChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold">
                      {firstName || lastName ? `${firstName} ${lastName}` : (
                        language === 'ru' ? 'Пользователь' : 'Пайдаланушы'
                      )}
                    </h2>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    {phone && <p className="text-sm text-muted-foreground">{phone}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile 
                      ? (language === 'ru' ? 'Отменить' : 'Болдырмау')
                      : (language === 'ru' ? 'Редактировать профиль' : 'Профильді өңдеу')
                    }
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ru' ? 'Язык интерфейса' : 'Интерфейс тілі'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant={language === 'ru' ? 'default' : 'outline'}
                      onClick={() => handleLanguageChange('ru')}
                      className="flex-1"
                    >
                      Русский
                    </Button>
                    <Button 
                      variant={language === 'kz' ? 'default' : 'outline'}
                      onClick={() => handleLanguageChange('kz')}
                      className="flex-1"
                    >
                      Қазақша
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Статистика объявлений */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ru' ? 'Статистика объявлений' : 'Хабарландырулар статистикасы'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ru' ? 'Активные:' : 'Белсенді:'}
                      </span>
                      <span className="font-medium">{userListings.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ru' ? 'Просмотры:' : 'Қаралымдар:'}
                      </span>
                      <span className="font-medium">
                        {userListings.reduce((sum, listing) => sum + (listing.views || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ru' ? 'Избранное:' : 'Таңдаулы:'}
                      </span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content area */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5">
                      <TabsTrigger value="profile">
                        {language === 'ru' ? 'Профиль' : 'Профиль'}
                      </TabsTrigger>
                      <TabsTrigger value="listings">
                        {language === 'ru' ? 'Объявления' : 'Хабарландырулар'}
                      </TabsTrigger>
                      <TabsTrigger value="messages">
                        {language === 'ru' ? 'Сообщения' : 'Хабарламалар'}
                        {getUnreadCount(messages) > 0 && (
                          <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-white rounded-full">
                            {getUnreadCount(messages)}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="reviews">
                        {language === 'ru' ? 'Отзывы' : 'Пікірлер'}
                      </TabsTrigger>
                      <TabsTrigger value="notifications">
                        {language === 'ru' ? 'Уведомления' : 'Хабарландырулар'}
                        {getUnreadCount(notifications) > 0 && (
                          <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-white rounded-full">
                            {getUnreadCount(notifications)}
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab}>
                    <TabsContent value="profile" className="space-y-4">
                      {isEditingProfile ? (
                        // Edit profile form
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">
                                {language === 'ru' ? 'Имя' : 'Аты'}
                              </Label>
                              <Input 
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">
                                {language === 'ru' ? 'Фамилия' : 'Тегі'}
                              </Label>
                              <Input 
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email"
                              type="email"
                              value={email}
                              readOnly
                              disabled
                              className="bg-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                              {language === 'ru' 
                                ? 'Email не может быть изменен через профиль' 
                                : 'Email профиль арқылы өзгертілмейді'
                              }
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">
                              {language === 'ru' ? 'Телефон' : 'Телефон'}
                            </Label>
                            <Input 
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          
                          <Button onClick={handleProfileSave}>
                            {language === 'ru' ? 'Сохранить изменения' : 'Өзгерістерді сақтау'}
                          </Button>
                        </div>
                      ) : (
                        // Profile info
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="font-medium text-sm text-muted-foreground mb-1">
                                {language === 'ru' ? 'Имя' : 'Аты'}
                              </div>
                              <div>{firstName || (language === 'ru' ? 'Не указано' : 'Көрсетілмеген')}</div>
                            </div>
                            <div>
                              <div className="font-medium text-sm text-muted-foreground mb-1">
                                {language === 'ru' ? 'Фамилия' : 'Тегі'}
                              </div>
                              <div>{lastName || (language === 'ru' ? 'Не указано' : 'Көрсетілмеген')}</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-1">
                              Email
                            </div>
                            <div>{email}</div>
                          </div>
                          
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-1">
                              {language === 'ru' ? 'Телефон' : 'Телефон'}
                            </div>
                            <div>{phone || (language === 'ru' ? 'Не указано' : 'Көрсетілмеген')}</div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="listings">
                      <MyListings listings={userListings} />
                    </TabsContent>
                    
                    <TabsContent value="messages">
                      <MessagesInbox messages={messages} formatDate={formatDate} />
                    </TabsContent>
                    
                    <TabsContent value="reviews">
                      <ReviewsList reviews={reviews} formatDate={formatDate} />
                    </TabsContent>
                    
                    <TabsContent value="notifications">
                      <NotificationsList 
                        notifications={notifications} 
                        formatDate={formatDate}
                        onMarkAsRead={markNotificationAsRead}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
