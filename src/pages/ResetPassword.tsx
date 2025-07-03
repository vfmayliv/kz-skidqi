
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const { language } = useAppContext();
  const { supabase, user, loading } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // Проверяем, если пользователь уже авторизован
  useEffect(() => {
    if (user && !loading) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  // Проверяем, есть ли токен сброса в URL
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    if (accessToken && refreshToken && type === 'recovery') {
      setIsResetMode(true);
      // Устанавливаем сессию с токенами восстановления
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
  }, [searchParams, supabase.auth]);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      const title = language === 'ru' ? 'Ошибка' : 'Қате';
      const description = language === 'ru' 
        ? 'Пожалуйста, введите email' 
        : 'Email енгізіңіз';
        
      toast({
        title,
        description,
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Ошибка отправки email:', error);
        
        toast({
          title: language === 'ru' ? 'Ошибка' : 'Қате',
          description: language === 'ru' 
            ? 'Произошла ошибка при отправке письма' 
            : 'Хат жіберу кезінде қате орын алды',
          variant: 'destructive'
        });
      } else {
        toast({
          title: language === 'ru' ? 'Письмо отправлено' : 'Хат жіберілді',
          description: language === 'ru' 
            ? 'Проверьте свою почту и перейдите по ссылке для сброса пароля' 
            : 'Поштаңызды тексеріп, құпия сөзді қалпына келтіру сілтемесін басыңыз'
        });
      }
    } catch (error) {
      console.error('Неожиданная ошибка:', error);
      
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Произошла неожиданная ошибка' 
          : 'Күтпеген қате орын алды',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      const title = language === 'ru' ? 'Ошибка' : 'Қате';
      const description = language === 'ru' 
        ? 'Пожалуйста, заполните все поля' 
        : 'Барлық өрістерді толтырыңыз';
        
      toast({
        title,
        description,
        variant: 'destructive'
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пароли не совпадают' 
          : 'Құпия сөздер сәйкес келмейді',
        variant: 'destructive'
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пароль должен содержать минимум 6 символов' 
          : 'Құпия сөз кемінде 6 таңбадан тұруы керек',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Ошибка обновления пароля:', error);
        
        toast({
          title: language === 'ru' ? 'Ошибка' : 'Қате',
          description: language === 'ru' 
            ? 'Произошла ошибка при обновлении пароля' 
            : 'Құпия сөзді жаңарту кезінде қате орын алды',
          variant: 'destructive'
        });
      } else {
        toast({
          title: language === 'ru' ? 'Успешно' : 'Сәтті',
          description: language === 'ru' 
            ? 'Пароль успешно изменен' 
            : 'Құпия сөз сәтті өзгертілді'
        });
        
        // Перенаправляем на страницу входа
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Неожиданная ошибка:', error);
      
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Произошла неожиданная ошибка' 
          : 'Күтпеген қате орын алды',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Показываем загрузку во время проверки сессии
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {language === 'ru' ? 'Загрузка...' : 'Жүктелуде...'}
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
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isResetMode
                ? (language === 'ru' ? 'Установить новый пароль' : 'Жаңа құпия сөз орнату')
                : (language === 'ru' ? 'Восстановление пароля' : 'Құпия сөзді қалпына келтіру')
              }
            </CardTitle>
            <CardDescription>
              {isResetMode
                ? (language === 'ru' 
                  ? 'Введите новый пароль для вашего аккаунта'
                  : 'Аккаунтыңыз үшін жаңа құпия сөз енгізіңіз')
                : (language === 'ru' 
                  ? 'Введите email для получения ссылки восстановления'
                  : 'Қалпына келтіру сілтемесін алу үшін email енгізіңіз')
              }
            </CardDescription>
          </CardHeader>
          
          {isResetMode ? (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    {language === 'ru' ? 'Новый пароль' : 'Жаңа құпия сөз'}
                  </Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isSubmitting}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {language === 'ru' ? 'Подтвердите пароль' : 'Құпия сөзді растаңыз'}
                  </Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (language === 'ru' ? 'Обновление...' : 'Жаңартылуда...')
                    : (language === 'ru' ? 'Обновить пароль' : 'Құпия сөзді жаңарту')
                  }
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleSendResetEmail}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (language === 'ru' ? 'Отправка...' : 'Жіберілуде...')
                    : (language === 'ru' ? 'Отправить ссылку' : 'Сілтеме жіберу')
                  }
                </Button>
                
                <div className="text-center text-sm">
                  {language === 'ru' ? 'Вспомнили пароль?' : 'Құпия сөзді есте сақтадыңыз ба?'}{' '}
                  <Link 
                    to="/login"
                    className="text-primary hover:underline"
                  >
                    {language === 'ru' ? 'Войти' : 'Кіру'}
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
