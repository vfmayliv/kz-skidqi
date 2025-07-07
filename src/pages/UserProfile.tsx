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
import { useListings } from '@/hooks/useListings';

// Import profile components
import { MyListings } from '@/components/profile/MyListings';
import { MessagesInbox } from '@/components/profile/MessagesInbox';
import { ReviewsList } from '@/components/profile/ReviewsList';
import { NotificationsList } from '@/components/profile/NotificationsList';

const UserProfile = () => {
  const { language } = useAppContext();
  const { user: authUser, supabase, loading: authLoading } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const { getUserListings } = useListings();
  
  // Combined loading state
  const [isInitializing, setIsInitializing] = useState(true);
  
  // User profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile photo
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  
  // Real data from Supabase
  const [userListings, setUserListings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Authentication and profile data loading
  useEffect(() => {
    const initializeProfile = async () => {
      if (authLoading) {
        return;
      }

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

      setEmail(authUser.email || '');
      
      try {
        // Load profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, avatar_url')
          .eq('id', authUser.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Ошибка загрузки профиля:', profileError);
        } else if (profileData) {
          setFirstName(profileData.first_name || '');
          setLastName(profileData.last_name || '');
          setPhone(profileData.phone || '');
          setAvatarUrl(profileData.avatar_url || null);
        }

        // Load real user listings from Supabase
        await loadUserListings();
        
        // Load real messages from Supabase
        await loadUserMessages();
        
        // Load real notifications from Supabase
        await loadUserNotifications();
        
        // Load real reviews from Supabase (placeholder for now)
        setReviews([]);
        
      } catch (e) {
        console.error('Исключение при загрузке профиля:', e);
        toast({
          title: language === 'ru' ? 'Исключение при загрузке профиля' : 'Профильді жүктеу кезіндегі қате',
          description: (e as Error).message,
          variant: 'destructive'
        });
      }

      setIsInitializing(false);
    };

    initializeProfile();
  }, [authUser, authLoading, supabase, language, toast, navigate]);

  // Load user's real listings from Supabase
  const loadUserListings = async () => {
    if (!authUser) return;

    try {
      const listings = await getUserListings();
      console.log('📋 Загруженные объявления пользователя:', listings);
      
      // Transform Supabase data to match expected format
      const transformedListings = listings.map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description || '',
        price: listing.regular_price || 0,
        originalPrice: listing.regular_price || 0,
        discountPrice: listing.discount_price || listing.regular_price || 0,
        discount: listing.discount_percent || 0,
        city: listing.city_id?.toString() || '',
        categoryId: listing.category_id?.toString() || '',
        createdAt: listing.created_at,
        imageUrl: listing.images?.[0] || '/placeholder.svg',
        views: listing.views || 0,
        isFeatured: listing.is_premium || false,
        userId: listing.user_id,
        regionId: listing.region_id?.toString() || '',
        cityId: listing.city_id?.toString() || '',
        microdistrictId: listing.microdistrict_id?.toString() || ''
      }));
      
      setUserListings(transformedListings);
    } catch (error) {
      console.error('Ошибка загрузки объявлений пользователя:', error);
      setUserListings([]);
    }
  };

  // Load user's real messages from Supabase
  const loadUserMessages = async () => {
    if (!authUser) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(first_name, last_name),
          receiver:profiles!messages_receiver_id_fkey(first_name, last_name)
        `)
        .or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Ошибка загрузки сообщений:', error);
        setMessages([]);
        return;
      }

      const transformedMessages = messagesData?.map(msg => ({
        id: msg.id,
        sender: msg.sender_id === authUser.id 
          ? language === 'ru' ? 'Вы' : 'Сіз'
          : `${msg.sender?.first_name || ''} ${msg.sender?.last_name || ''}`.trim() || 'Пользователь',
        content: msg.content,
        date: msg.created_at,
        read: msg.read || msg.sender_id === authUser.id
      })) || [];

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
      setMessages([]);
    }
  };

  // Load user's real notifications from Supabase
  const loadUserNotifications = async () => {
    if (!authUser) return;

    try {
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Ошибка загрузки уведомлений:', error);
        setNotifications([]);
        return;
      }

      const transformedNotifications = notificationsData?.map(notif => ({
        id: notif.id,
        title: notif.title,
        content: notif.content,
        date: notif.created_at,
        read: notif.is_read
      })) || [];

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
      setNotifications([]);
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const processedFile = await processImageForUpload(file);
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

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: language === 'ru' ? 'Ошибка валидации' : 'Тексеру қатесі',
        description: language === 'ru' ? 'Имя и фамилия обязательны' : 'Аты мен тегі міндетті',
        variant: 'destructive'
      });
      return;
    }

    let processedAvatarUrl = avatarUrl;

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
      toast({
        title: lang === 'ru' ? 'Язык изменен' : 'Тіл өзгертілді',
        description: lang === 'ru' 
          ? 'Язык интерфейса изменен на русский' 
          : 'Интерфейс тілі қазақшаға өзгертілді',
      });
    }
  };
  
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
  
  const markNotificationAsRead = async (id: string) => {
    if (!authUser) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', authUser.id);

      if (error) {
        console.error('Ошибка обновления уведомления:', error);
        return;
      }

      // Update local state
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === id) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Ошибка при отметке уведомления как прочитанного:', error);
    }
  };
  
  const getUnreadCount = (items: any[]) => {
    return items.filter(item => !item.read).length;
  };

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
                        {language === 'ru' ? 'Сообщения:' : 'Хабарламалар:'}
                      </span>
                      <span className="font-medium">{messages.length}</span>
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
