
import { useTranslation } from 'react-i18next';

interface ListingDescriptionProps {
  description: string;
  language: string;
}

export const ListingDescription = ({ description }: ListingDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {t('description', 'Описание')}
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm whitespace-pre-line">
            {description}
          </p>
          
          {/* Additional description content for better resemblance to Avito */}
          <p className="text-sm">
            {t('guaranteeMessage', 'Товар в наличии. Гарантия качества. Возможен торг при осмотре.')}
          </p>
          
          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">
              {t('advantages', 'Преимущества товара:')}
            </h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>{t('highQuality', 'Высокое качество')}</li>
              <li>{t('longLifespan', 'Долгий срок службы')}</li>
              <li>{t('reliableManufacturer', 'Надежный производитель')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
