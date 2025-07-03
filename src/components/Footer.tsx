
import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';

export function Footer() {
  const { t } = useAppWithTranslations();

  return (
    <footer className="bg-gray-100 mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">{t('siteName')}</h3>
            <p className="text-sm text-gray-600">{t('tagline')}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">{t('categories')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/electronics" className="text-sm text-gray-600 hover:text-primary">
                  {t('electronics')}
                </Link>
              </li>
              <li>
                <Link to="/category/property" className="text-sm text-gray-600 hover:text-primary">
                  {t('realestate')}
                </Link>
              </li>
              <li>
                <Link to="/category/transport" className="text-sm text-gray-600 hover:text-primary">
                  {t('transport')}
                </Link>
              </li>
              <li>
                <Link to="/category/jobs" className="text-sm text-gray-600 hover:text-primary">
                  {t('services')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">{t('siteName')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  {t('about', 'О нас')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                  {t('contact', 'Контакты')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  {t('terms', 'Правила')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  {t('privacy', 'Политика конфиденциальности')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-center text-gray-600">
          &copy; {new Date().getFullYear()} SKIDQI.COM. {t('allRights')}
        </div>
      </div>
    </footer>
  );
}
