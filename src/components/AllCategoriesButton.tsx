import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';

const AllCategoriesButton = () => {
  const { language } = useAppWithTranslations();
  
  return (
    <div className="bg-white py-4">
      <div className="container mx-auto px-4">
        <Link to="/categories">
          <Button 
            variant="outline" 
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md border border-blue-200"
          >
            {language === 'ru' ? 'Все категории' : 'Барлық санаттар'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AllCategoriesButton;