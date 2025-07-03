import React from 'react';
import { Listing } from '@/types/listingType';

interface MapViewProps {
  listings: Listing[];
}

const MapView: React.FC<MapViewProps> = ({ listings }) => {
  return (
    <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Карта скоро появится здесь. Найдено объявлений: {listings.length}</p>
    </div>
  );
};

export default MapView;
