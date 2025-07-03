
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const { language, t } = useAppContext();
  const { signUp } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Начинаем регистрацию пользователя:', email);
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пожалуйста, заполните все поля' 
          : 'Барлық өрістерді толтырыңыз',
        variant: 'destructive'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пароли не совпадают' 
          : 'Құпия сөздер сәйкес келмейді',
        variant: 'destructive'
      });
      return;
    }
    
    if (!agreedToTerms) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Вы должны согласиться с условиями использования' 
          : 'Пайдалану шарттарымен келісуіңіз керек',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('📤 Отправляем запрос регистрации в Supabase...');
      
      // Используем реальную регистрацию через Supabase
      const { data, error } = await signUp(email, password);
      
      console.log('📨 Ответ от Supabase:', { data, error });
      
      if (error) {
        console.error('❌ Ошибка регистрации:', error);
        
        // Обработка различных типов ошибок
        let errorMessage = language === 'ru' 
          ? 'Произошла ошибка при регистрации' 
          : 'Тіркелу кезінде қате орын алды';
          
        if (error.message.includes('User already registered')) {
          errorMessage = language === 'ru' 
            ? 'Пользователь с таким email уже зарегистрирован' 
            : 'Осы email-мен пайдаланушы қазірдің өзінде тіркелген';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = language === 'ru' 
            ? 'Неверный формат email' 
            : 'Email форматы дұрыс емес';
        } else if (error.message.includes('Password')) {
          errorMessage = language === 'ru' 
            ? 'Пароль должен содержать минимум 6 символов' 
            : 'Құпия сөз кемінде 6 таңбадан тұруы керек';
        }
        
        toast({
          title: language === 'ru' ? 'Ошибка регистрации' : 'Тіркелу қатесі',
          description: errorMessage,
          variant: 'destructive'
        });
        
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Регистрация успешна:', data);
      
      // Обновляем профиль пользователя с дополнительными данными
      if (data.user) {
        console.log('📝 Сохраняем дополнительные данные пользователя...');
        
        // Здесь можно добавить логику для сохранения firstName, lastName, phone
        // в таблицу profiles, если она существует
      }
      
      toast({
        title: language === 'ru' ? 'Регистрация успешна' : 'Тіркелу сәтті',
        description: language === 'ru' 
          ? 'Проверьте вашу почту для подтверждения аккаунта' 
          : 'Аккаунтты растау үшін поштаңызды тексеріңіз'
      });
      
      // Перенаправляем на страницу подтверждения или входа
      navigate('/confirm-email');
      
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t('register')}
            </CardTitle>
            <CardDescription>
              {language === 'ru' 
                ? 'Создайте аккаунт, чтобы размещать объявления'
                : 'Хабарландырулар орналастыру үшін аккаунт жасаңыз'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">
                    {language === 'ru' ? 'Имя' : 'Аты'}
                  </Label>
                  <Input 
                    id="first-name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">
                    {language === 'ru' ? 'Фамилия' : 'Тегі'}
                  </Label>
                  <Input 
                    id="last-name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
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
              
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {language === 'ru' ? 'Телефон' : 'Телефон'}
                </Label>
                <Input 
                  id="phone" 
                  placeholder="+7 (___) ___-__-__" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'ru' ? 'Пароль' : 'Құпия сөз'}
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  {language === 'ru' ? 'Подтвердите пароль' : 'Құпия сөзді растаңыз'}
                </Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {language === 'ru' 
                    ? 'Я согласен с ' 
                    : 'Мен келісемін '} 
                  <Link to="/terms" className="text-primary hover:underline">
                    {language === 'ru' 
                      ? 'условиями использования' 
                      : 'пайдалану шарттарымен'}
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  (language === 'ru' ? 'Регистрация...' : 'Тіркелу...') : 
                  (language === 'ru' ? 'Зарегистрироваться' : 'Тіркелу')
                }
              </Button>
              <div className="text-center text-sm">
                {language === 'ru' ? 'Уже есть аккаунт?' : 'Аккаунтыңыз бар ма?'}{' '}
                <Link 
                  to="/login"
                  className="text-primary hover:underline"
                >
                  {language === 'ru' ? 'Войти' : 'Кіру'}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
