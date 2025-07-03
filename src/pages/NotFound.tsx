
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/useAppStore";

const NotFound = () => {
  const location = useLocation();
  const { language } = useAppStore();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          {language === 'ru' 
            ? 'Страница не найдена' 
            : 'Бет табылмады'}
        </p>
        <Button asChild>
          <Link to="/">
            {language === 'ru' 
              ? 'Вернуться на главную' 
              : 'Басты бетке оралу'}
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
