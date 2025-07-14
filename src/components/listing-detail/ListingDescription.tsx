
import { useTranslation } from '@/hooks/use-translation';

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
          
        </div>
      </div>
    </div>
  );
};
