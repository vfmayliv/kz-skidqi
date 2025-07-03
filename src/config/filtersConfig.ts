import { PropertyType } from '@/types/listingType';

// Generic interfaces for configuration elements
interface Label {
  ru: string;
  kz: string;
}

interface ConfigOption {
  id: string;
  label: Label;
}

interface FilterDefinition {
  id: string;
  type: 'range' | 'select' | 'boolean';
  label: Label;
  options?: ConfigOption[];
}

// Defines the complete filter setup for a specific segment (e.g., residential homes for sale)
interface SegmentConfig {
  propertyTypes: ConfigOption[];
  filters: FilterDefinition[];
  visibility: Partial<Record<PropertyType, string[]>>; // Maps a property type to its visible filter IDs
}

// Defines the configuration for a deal type (e.g., 'sale'), including its available segments
interface DealConfig {
  segments: ConfigOption[];
  segmentDetails: Record<string, SegmentConfig>; // Maps a segment ID to its configuration
}

// The main, top-level configuration interface
export interface FiltersConfig {
  dealTypes: ConfigOption[];
  dealDetails: Record<string, DealConfig>; // Maps a deal type ID to its configuration
}

export const filtersConfig: FiltersConfig = {
  dealTypes: [
    { id: 'sale', label: { ru: 'Купить', kz: 'Сатып алу' } },
    { id: 'rent', label: { ru: 'Снять надолго', kz: 'Ұзақ мерзімге жалға алу' } },
    { id: 'rent_daily', label: { ru: 'Снять посуточно', kz: 'Тәуліктік жалға алу' } },
  ],
  dealDetails: {
    sale: {
      segments: [
        { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
        { id: 'commercial', label: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
      ],
      segmentDetails: {
        residential: {
          propertyTypes: [
            { id: PropertyType.APARTMENT, label: { ru: 'Квартира', kz: 'Пәтер' } },
            { id: PropertyType.ROOM, label: { ru: 'Комната', kz: 'Бөлме' } },
            { id: PropertyType.HOUSE, label: { ru: 'Дом', kz: 'Үй' } },
            { id: PropertyType.LAND, label: { ru: 'Участок', kz: 'Жер учаскесі' } },
          ],
          filters: [
            { id: 'price', type: 'range', label: { ru: 'Цена', kz: 'Бағасы' } },
            { id: 'area', type: 'range', label: { ru: 'Площадь', kz: 'Ауданы' } },
            { id: 'rooms', type: 'select', label: { ru: 'Комнаты', kz: 'Бөлмелер' }, options: [
              { id: '1', label: { ru: '1', kz: '1' } },
              { id: '2', label: { ru: '2', kz: '2' } },
              { id: '3', label: { ru: '3', kz: '3' } },
              { id: '4+', label: { ru: '4+', kz: '4+' } },
            ]},
          ],
          visibility: {
            [PropertyType.APARTMENT]: ['price', 'area', 'rooms'],
            [PropertyType.ROOM]: ['price', 'area'],
            [PropertyType.HOUSE]: ['price', 'area', 'rooms'],
            [PropertyType.LAND]: ['price', 'area'],
          },
        },
        commercial: {
            propertyTypes: [
                { id: PropertyType.OFFICE, label: { ru: 'Офис', kz: 'Кеңсе' } },
                { id: PropertyType.BUILDING, label: { ru: 'Здание', kz: 'Ғимарат' } },
            ],
            filters: [
                { id: 'price', type: 'range', label: { ru: 'Цена', kz: 'Бағасы' } },
                { id: 'area', type: 'range', label: { ru: 'Площадь', kz: 'Ауданы' } },
            ],
            visibility: {
                [PropertyType.OFFICE]: ['price', 'area'],
                [PropertyType.BUILDING]: ['price', 'area'],
            }
        }
      },
    },
    rent: {
        segments: [
            { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
        ],
        segmentDetails: {
            residential: {
                propertyTypes: [
                    { id: PropertyType.APARTMENT, label: { ru: 'Квартира', kz: 'Пәтер' } },
                    { id: PropertyType.ROOM, label: { ru: 'Комната', kz: 'Бөлме' } },
                    { id: PropertyType.HOUSE, label: { ru: 'Дом', kz: 'Үй' } },
                ],
                filters: [
                    { id: 'price', type: 'range', label: { ru: 'Цена в месяц', kz: 'Ай сайынғы бағасы' } },
                    { id: 'area', type: 'range', label: { ru: 'Площадь', kz: 'Ауданы' } },
                    { id: 'rooms', type: 'select', label: { ru: 'Комнаты', kz: 'Бөлмелер' }, options: [
                        { id: '1', label: { ru: '1', kz: '1' } },
                        { id: '2', label: { ru: '2', kz: '2' } },
                        { id: '3', label: { ru: '3', kz: '3' } },
                        { id: '4+', label: { ru: '4+', kz: '4+' } },
                    ]},
                ],
                visibility: {
                    [PropertyType.APARTMENT]: ['price', 'area', 'rooms'],
                    [PropertyType.ROOM]: ['price', 'area'],
                    [PropertyType.HOUSE]: ['price', 'area', 'rooms'],
                }
            }
        }
    },
    rent_daily: {
        segments: [
            { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
        ],
        segmentDetails: {
            residential: {
                propertyTypes: [
                    { id: PropertyType.APARTMENT, label: { ru: 'Квартира', kz: 'Пәтер' } },
                    { id: PropertyType.ROOM, label: { ru: 'Комната', kz: 'Бөлме' } },
                ],
                filters: [
                    { id: 'price', type: 'range', label: { ru: 'Цена за сутки', kz: 'Тәуліктік бағасы' } },
                ],
                visibility: {
                    [PropertyType.APARTMENT]: ['price'],
                    [PropertyType.ROOM]: ['price'],
                }
            }
        }
    }
  },
};
