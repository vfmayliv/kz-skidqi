
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
import { useToast } from '@/hooks/useToast';

const Login = () => {
  const { language } = useAppContext();
  const { signIn, user, loading } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isOwnerLogin = searchParams.get('owner') === 'true';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Перенаправляем уже авторизованных пользователей
  useEffect(() => {
    if (user && !loading) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  // Сбрасываем форму при переключении между режимами входа
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [isOwnerLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Начинаем процесс входа:', email);
    
    // Валидация
    if (!email || !password) {
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
    
    setIsSubmitting(true);
    
    try {
      console.log('📤 Отправляем запрос входа в Supabase...');
      
      // Используем реальную аутентификацию через Supabase
      const { error } = await signIn(email, password);
      
      console.log('📨 Ответ от Supabase:', { error });
      
      if (error) {
        console.error('❌ Ошибка входа:', error);
        
        // Обработка различных типов ошибок
        let errorMessage = language === 'ru' 
          ? 'Произошла ошибка при входе' 
          : 'Кіру кезінде қате орын алды';
          
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = language === 'ru' 
            ? 'Неверный email или пароль' 
            : 'Қате email немесе құпия сөз';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = language === 'ru' 
            ? 'Пожалуйста, подтвердите ваш email перед входом' 
            : 'Кіру алдында электрондық поштаңызды растаңыз';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = language === 'ru' 
            ? 'Слишком много попыток входа. Попробуйте позже' 
            : 'Тым көп кіру әрекеті. Кейінірек көріңіз';
        }
        
        toast({
          title: language === 'ru' ? 'Ошибка входа' : 'Кіру қатесі',
          description: errorMessage,
          variant: 'destructive'
        });
        
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Вход успешен');
      
      // Показываем сообщение об успешном входе
      toast({
        title: language === 'ru' ? 'Успешный вход' : 'Сәтті кіру',
        description: language === 'ru' 
          ? 'Вы успешно вошли в аккаунт' 
          : 'Аккаунтқа сәтті кірдіңіз'
      });
      
      // Перенаправление произойдет автоматически через useEffect
      
    } catch (error) {
      console.error('💥 Неожиданная ошибка:', error);
      
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Произошла неожиданная ошибка. Попробуйте еще раз.' 
          : 'Күтпеген қате орын алды. Қайтадан көріңіз.',
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
              {isOwnerLogin 
                ? (language === 'ru' ? 'Вход для администратора' : 'Әкімші кірісі')
                : (language === 'ru' ? 'Вход' : 'Кіру')
              }
            </CardTitle>
            <CardDescription>
              {isOwnerLogin
                ? (language === 'ru' 
                  ? 'Введите данные для доступа к панели администратора'
                  : 'Әкімші тақтасына қол жеткізу үшін деректерді енгізіңіз')
                : (language === 'ru' 
                  ? 'Введите свои данные для входа в аккаунт'
                  : 'Аккаунтқа кіру үшін деректеріңізді енгізіңіз')
              }
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {isOwnerLogin 
                    ? (language === 'ru' ? 'Логин' : 'Логин')
                    : 'Email'
                  }
                </Label>
                <Input 
                  id="email" 
                  type={isOwnerLogin ? "text" : "email"}
                  placeholder={isOwnerLogin ? "ceo" : "email@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    {language === 'ru' ? 'Пароль' : 'Құпия сөз'}
                  </Label>
                  {!isOwnerLogin && (
                    <Link 
                      to="/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      {language === 'ru' ? 'Забыли пароль?' : 'Құпия сөзді ұмыттыңыз ба?'}
                    </Link>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  ? (language === 'ru' ? 'Выполняется вход...' : 'Кіру жүргізілуде...')
                  : (language === 'ru' ? 'Войти' : 'Кіру')
                }
              </Button>
              
              {!isOwnerLogin && (
                <div className="text-center text-sm">
                  {language === 'ru' ? 'Нет аккаунта?' : 'Аккаунтыңыз жоқ па?'}{' '}
                  <Link 
                    to="/register"
                    className="text-primary hover:underline"
                  >
                    {language === 'ru' ? 'Зарегистрироваться' : 'Тіркелу'}
                  </Link>
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
