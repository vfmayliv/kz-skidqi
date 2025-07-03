
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
  const { language } = useAppContext();

  // FAQs
  const faqs = language === 'ru' ? [
    {
      question: 'Как разместить объявление?',
      answer: 'Для размещения объявления нажмите кнопку "Подать объявление" в верхней части сайта. Заполните форму, указав название, категорию, описание, цену и фотографии вашего товара или услуги. Обязательно укажите обычную цену и цену со скидкой.'
    },
    {
      question: 'Сколько стоит размещение объявления?',
      answer: 'Базовое размещение объявлений на нашей платформе бесплатное. Однако мы предлагаем платные опции для продвижения ваших объявлений, чтобы они получили больше просмотров.'
    },
    {
      question: 'Как редактировать или удалить объявление?',
      answer: 'Войдите в свой аккаунт, перейдите в "Личный кабинет" и выберите раздел "Мои объявления". Рядом с каждым объявлением вы найдете опции для редактирования или удаления.'
    },
    {
      question: 'Как связаться с продавцом?',
      answer: 'На странице объявления вы найдете кнопку "Показать телефон" или "Написать сообщение". Для просмотра контактной информации и отправки сообщений необходимо зарегистрироваться на сайте.'
    },
    {
      question: 'Что делать, если я забыл пароль?',
      answer: 'На странице входа нажмите на ссылку "Забыли пароль?". Следуйте инструкциям по восстановлению пароля, которые будут отправлены на вашу электронную почту.'
    },
    {
      question: 'Как сменить город?',
      answer: 'Вы можете изменить город в любое время, нажав на текущий город в верхней части сайта и выбрав новый из выпадающего списка.'
    },
    {
      question: 'Обязательно ли указывать скидку?',
      answer: 'Да, особенностью нашей платформы является то, что каждое объявление должно включать скидку. Укажите обычную цену и цену со скидкой, и система автоматически рассчитает процент скидки.'
    },
  ] : [
    {
      question: 'Хабарландыруды қалай орналастыруға болады?',
      answer: 'Хабарландыру орналастыру үшін сайттың жоғарғы жағындағы "Хабарландыру беру" түймесін басыңыз. Нысанды толтырыңыз, тауарыңыздың немесе қызметіңіздің атауын, санатын, сипаттамасын, бағасын және фотосуреттерін көрсетіңіз. Міндетті түрде қалыпты бағаны және жеңілдікпен бағаны көрсетіңіз.'
    },
    {
      question: 'Хабарландыру орналастыру қанша тұрады?',
      answer: 'Біздің платформада хабарландыруларды орналастырудың негізгі нұсқасы тегін. Алайда, хабарландыруларыңыз көбірек қаралым алуы үшін оларды жылжытуға арналған ақылы опцияларды ұсынамыз.'
    },
    {
      question: 'Хабарландыруды қалай өңдеуге немесе жоюға болады?',
      answer: 'Аккаунтыңызға кіріп, "Жеке кабинет" бөліміне өтіп, "Менің хабарландыруларым" бөлімін таңдаңыз. Әр хабарландырудың қасында өңдеу немесе жою опцияларын табасыз.'
    },
    {
      question: 'Сатушымен қалай байланысуға болады?',
      answer: 'Хабарландыру бетінде "Телефонды көрсету" немесе "Хабарлама жазу" түймесін табасыз. Байланыс ақпаратын көру және хабарлама жіберу үшін сайтта тіркелу қажет.'
    },
    {
      question: 'Құпия сөзді ұмытсам не істеймін?',
      answer: 'Кіру бетінде "Құпия сөзді ұмыттыңыз ба?" сілтемесін басыңыз. Электрондық поштаңызға жіберілетін құпия сөзді қалпына келтіру нұсқауларын орындаңыз.'
    },
    {
      question: 'Қаланы қалай өзгертуге болады?',
      answer: 'Сайттың жоғарғы жағындағы ағымдағы қаланы басып, ашылмалы тізімнен жаңасын таңдау арқылы қаланы кез келген уақытта өзгерте аласыз.'
    },
    {
      question: 'Жеңілдікті көрсету міндетті ме?',
      answer: 'Иә, біздің платформаның ерекшелігі - әрбір хабарландыру жеңілдікті қамтуы керек. Қалыпты бағаны және жеңілдікпен бағаны көрсетіңіз, жүйе жеңілдік пайызын автоматты түрде есептейді.'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ru' ? 'Центр помощи' : 'Көмек орталығы'}
        </h1>
        
        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center max-w-lg mx-auto">
              <h2 className="text-xl font-semibold mb-4">
                {language === 'ru' ? 'Как мы можем помочь?' : 'Біз қалай көмектесе аламыз?'}
              </h2>
              <div className="relative w-full mb-4">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={language === 'ru' ? 'Поиск по вопросам...' : 'Сұрақтар бойынша іздеу...'}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {language === 'ru' 
                  ? 'Часто задаваемые вопросы или свяжитесь с нами для получения дополнительной помощи'
                  : 'Жиі қойылатын сұрақтар немесе қосымша көмек алу үшін бізбен байланысыңыз'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                <Link to="/faq">
                  <Button variant="outline" className="w-full h-20 flex flex-col">
                    <HelpCircle className="h-5 w-5 mb-2" />
                    <span>{language === 'ru' ? 'FAQ' : 'FAQ'}</span>
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full h-20 flex flex-col">
                    <MessageSquare className="h-5 w-5 mb-2" />
                    <span>{language === 'ru' ? 'Контакты' : 'Байланыс'}</span>
                  </Button>
                </Link>
                <Link to="/terms">
                  <Button variant="outline" className="w-full h-20 flex flex-col">
                    <FileText className="h-5 w-5 mb-2" />
                    <span>{language === 'ru' ? 'Правила' : 'Ережелер'}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'ru' ? 'Часто задаваемые вопросы' : 'Жиі қойылатын сұрақтар'}
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {/* Contact section */}
        <div className="bg-primary/5 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">
            {language === 'ru' ? 'Не нашли ответ?' : 'Жауап таппадыңыз ба?'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {language === 'ru' 
              ? 'Свяжитесь с нашей командой поддержки для получения дополнительной помощи'
              : 'Қосымша көмек алу үшін біздің қолдау көрсету тобымызбен байланысыңыз'}
          </p>
          <Button asChild>
            <Link to="/contact">
              {language === 'ru' ? 'Связаться с нами' : 'Бізбен байланыс'}
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
