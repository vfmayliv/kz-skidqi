import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';

interface GuidedSearchProps {
  onComplete: (dealType: string, segment: string) => void;
}

export function GuidedSearch({ onComplete }: GuidedSearchProps) {
  const { language } = useAppStore();
  const [step, setStep] = useState(1);
  const [dealType, setDealType] = useState('');

  const dealTypes = [
    { id: 'sale', label: { ru: 'Купить', kz: 'Сатып алу' } },
    { id: 'rent_long', label: { ru: 'Снять надолго', kz: 'Ұзақ мерзімге жалға алу' } },
    { id: 'rent_short', label: { ru: 'Снять посуточно', kz: 'Тәулікке жалға алу' } },
  ];

  const segments = [
    { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
    { id: 'commercial', label: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
  ];

  const handleDealTypeSelect = (selectedDealType: string) => {
    setDealType(selectedDealType);
    setStep(2);
  };

  const handleSegmentSelect = (segment: string) => {
    onComplete(dealType, segment);
  };

  return (
    <div className="bg-card border border-border p-8 rounded-lg text-center mb-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">{language === 'ru' ? 'Поиск недвижимости' : 'Жылжымайтын мүлікті іздеу'}</h1>
        <p className="text-muted-foreground mb-8">{language === 'ru' ? 'Ответьте на два вопроса, чтобы мы подобрали для вас лучшие объявления и фильтры.' : 'Сізге ең жақсы хабарландырулар мен сүзгілерді табу үшін екі сұраққа жауап беріңіз.'}</p>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{language === 'ru' ? 'Шаг 1: Что вы хотите сделать?' : '1-қадам: Не істегіңіз келеді?'}</h2>
          <div className="flex justify-center gap-4">
            {dealTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleDealTypeSelect(type.id)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {type.label[language]}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{language === 'ru' ? 'Шаг 2: Какой тип недвижимости вас интересует?' : '2-қадам: Сізді қандай жылжымайтын мүлік түрі қызықтырады?'}</h2>
          <div className="flex justify-center gap-4">
            {segments.map((segment) => (
              <button
                key={segment.id}
                onClick={() => handleSegmentSelect(segment.id)}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                {segment.label[language]}
              </button>
            ))}
          </div>
           <button onClick={() => setStep(1)} className="mt-6 text-sm text-muted-foreground hover:underline">{language === 'ru' ? 'Назад' : 'Артқа'}</button>
        </div>
      )}
    </div>
  );
}
