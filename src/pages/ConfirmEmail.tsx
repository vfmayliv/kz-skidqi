
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ConfirmEmail = () => {
  const { language, login } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | 'verifying'>('pending');

  // Check if there's a token in the URL (simulating email link click)
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      setStatus('verifying');
      
      // Simulate verification process
      setTimeout(() => {
        // In a real app, verify the token on the server
        const pendingUser = localStorage.getItem('pendingUser');
        
        if (pendingUser) {
          // Store the user as registered
          localStorage.setItem('registeredUser', pendingUser);
          localStorage.removeItem('pendingUser');
          localStorage.removeItem('confirmationSent');
          
          // Set as authenticated - pass dummy credentials
          if (login) {
            login({ email: 'user@example.com', password: 'password' });
          }
          
          setStatus('success');
          
          // Show success notification
          toast({
            title: language === 'ru' ? 'Подтверждение успешно' : 'Растау сәтті',
            description: language === 'ru' 
              ? 'Ваш аккаунт успешно подтвержден' 
              : 'Сіздің аккаунтыңыз сәтті расталды'
          });
          
          // Redirect to profile after a short delay
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        } else {
          setStatus('error');
        }
      }, 1500);
    }
  }, [searchParams, language, toast, login, navigate]);

  // Function to simulate resending confirmation email
  const handleResendEmail = () => {
    toast({
      title: language === 'ru' ? 'Письмо отправлено' : 'Хат жіберілді',
      description: language === 'ru' 
        ? 'Новое письмо с подтверждением отправлено на ваш email' 
        : 'Жаңа растау хаты сіздің электрондық поштаңызға жіберілді'
    });
    
    // For demo purposes, simulate a confirmation link
    setTimeout(() => {
      // Create a dummy token
      const dummyToken = 'confirm-' + Date.now();
      
      // Open the same page with a token to simulate email link
      window.location.href = `/confirm-email?token=${dummyToken}`;
    }, 1000);
  };

  // For demo purposes, let users manually activate (simulating clicking the email link)
  const handleManualActivation = () => {
    // Create a dummy token
    const dummyToken = 'confirm-' + Date.now();
    
    // Navigate to the same page with a token
    navigate(`/confirm-email?token=${dummyToken}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            {status === 'pending' && (
              <>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Mail className="h-6 w-6" />
                  {language === 'ru' ? 'Подтвердите ваш email' : 'Электрондық поштаңызды растаңыз'}
                </CardTitle>
                <CardDescription>
                  {language === 'ru' 
                    ? 'Мы отправили письмо с ссылкой для подтверждения на ваш email'
                    : 'Біз сіздің электрондық поштаңызға растау сілтемесі бар хат жібердік'}
                </CardDescription>
              </>
            )}
            
            {status === 'verifying' && (
              <>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  {language === 'ru' ? 'Проверка...' : 'Тексеру...'}
                </CardTitle>
                <CardDescription>
                  {language === 'ru' 
                    ? 'Подтверждаем ваш аккаунт'
                    : 'Сіздің аккаунтыңызды растаймыз'}
                </CardDescription>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CardTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  {language === 'ru' ? 'Успешно!' : 'Сәтті!'}
                </CardTitle>
                <CardDescription>
                  {language === 'ru' 
                    ? 'Ваш аккаунт успешно подтвержден'
                    : 'Сіздің аккаунтыңыз сәтті расталды'}
                </CardDescription>
              </>
            )}
            
            {status === 'error' && (
              <>
                <CardTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  {language === 'ru' ? 'Ошибка' : 'Қате'}
                </CardTitle>
                <CardDescription>
                  {language === 'ru' 
                    ? 'Ссылка для подтверждения недействительна или устарела'
                    : 'Растау сілтемесі жарамсыз немесе ескірген'}
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {status === 'pending' && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'ru' 
                    ? 'Проверьте вашу почту и нажмите на ссылку в письме'
                    : 'Поштаңызды тексеріп, хаттағы сілтемені басыңыз'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? 'Не получили письмо?'
                    : 'Хатты алмадыңыз ба?'}
                </p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'ru' 
                    ? 'Попробуйте запросить новое письмо с подтверждением'
                    : 'Жаңа растау хатын сұрауға тырысыңыз'}
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            {(status === 'pending' || status === 'error') && (
              <>
                <Button 
                  className="w-full" 
                  onClick={handleResendEmail}
                >
                  {language === 'ru' ? 'Отправить письмо повторно' : 'Хатты қайта жіберу'}
                </Button>
                
                {/* For demo purposes only */}
                <div className="w-full border-t pt-4 mt-2">
                  <p className="text-xs text-center text-muted-foreground mb-2">
                    {language === 'ru' 
                      ? 'Демонстрационный режим'
                      : 'Демонстрациялық режим'}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleManualActivation}
                  >
                    {language === 'ru' ? 'Активировать аккаунт вручную' : 'Аккаунтты қолмен белсендіру'}
                  </Button>
                </div>
              </>
            )}
            
            {status === 'success' && (
              <Button
                className="w-full"
                onClick={() => navigate('/profile')}
              >
                {language === 'ru' ? 'Перейти в личный кабинет' : 'Жеке кабинетке өту'}
              </Button>
            )}
            
            <div className="text-center text-sm">
              <Link 
                to="/"
                className="text-primary hover:underline"
              >
                {language === 'ru' ? 'Вернуться на главную' : 'Басты бетке оралу'}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ConfirmEmail;
