
import React, { useEffect, useRef, useState } from 'react';
import { Listing } from '@/types/listingType';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, List } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface PropertyMapProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  className?: string;
  showListToggle?: boolean;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  listings, 
  onListingClick, 
  className = '', 
  showListToggle = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { language } = useAppContext();
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [isMapInitialized, setIsMapInitialized] = useState<boolean>(false);

  // Load Yandex Maps script
  useEffect(() => {
    if (document.getElementById('yandex-maps-script')) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'yandex-maps-script';
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU';
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('Error loading Yandex Maps script:', error);
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Don't remove the script on component unmount to avoid reloading it
    };
  }, []);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapContainer.current || isMapInitialized) return;
    
    // Wait for ymaps to be available
    if (!(window as any).ymaps) {
      const checkYmaps = setInterval(() => {
        if ((window as any).ymaps) {
          clearInterval(checkYmaps);
          initializeMap();
        }
      }, 100);
      return;
    }
    
    initializeMap();
  }, [isScriptLoaded, mapContainer.current, isMapInitialized]);

  // Initialize Yandex Map
  const initializeMap = () => {
    const ymaps = (window as any).ymaps;
    
    ymaps.ready(() => {
      // Create map instance
      mapRef.current = new ymaps.Map(mapContainer.current, {
        center: [43.25, 76.95], // Default to Almaty
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });
      
      // Add controls
      mapRef.current.controls.add('searchControl');
      mapRef.current.controls.add('geolocationControl', { float: 'right' });
      mapRef.current.controls.add('typeSelector');
      
      setIsMapInitialized(true);
      
      // Add markers after map is initialized
      addMarkers();
    });
  };

  // Add markers when listings change
  useEffect(() => {
    if (isMapInitialized && mapRef.current) {
      addMarkers();
    }
  }, [listings, isMapInitialized]);

  // Clean up markers when component unmounts
  useEffect(() => {
    return () => {
      cleanupMarkers();
    };
  }, []);

  // Add markers for listings
  const addMarkers = () => {
    if (!mapRef.current || !(window as any).ymaps) return;
    
    const ymaps = (window as any).ymaps;
    
    // Clean up existing markers
    cleanupMarkers();
    
    // Skip if no listings with coordinates
    const listingsWithCoordinates = listings.filter(listing => listing.coordinates);
    if (listingsWithCoordinates.length === 0) return;
    
    // Create collection for markers
    const markersCollection = new ymaps.GeoObjectCollection();
    
    // Add markers for listings with coordinates
    listingsWithCoordinates.forEach(listing => {
      if (!listing.coordinates) return;
      
      const { lat, lng } = listing.coordinates;
      
      // Create placemark
      const placemark = new ymaps.Placemark([lat, lng], {
        balloonContentHeader: listing.title[language],
        balloonContentBody: `
          <div style="max-width: 200px;">
            <img src="${listing.imageUrl}" alt="${listing.title[language]}" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;">
            <p style="font-weight: bold; margin: 4px 0;">${(listing.discountPrice).toLocaleString()} ₸</p>
            <p style="margin: 4px 0;">${listing.address || ''}</p>
          </div>
        `,
        hintContent: `${(listing.discountPrice / 1000000).toFixed(1)}M ₸`
      }, {
        preset: 'islands#blueCircleDotIconWithCaption',
        iconCaptionMaxWidth: '50',
        iconCaption: `${(listing.discountPrice / 1000000).toFixed(1)}M`,
        iconColor: 'var(--primary)'
      });
      
      // Add click handler
      placemark.events.add('click', () => {
        if (onListingClick) {
          onListingClick(listing);
        }
      });
      
      // Add to collection
      markersCollection.add(placemark);
      markersRef.current.push(placemark);
    });
    
    // Add collection to map
    mapRef.current.geoObjects.add(markersCollection);
    
    // Fit bounds if we have markers
    if (markersRef.current.length > 0) {
      mapRef.current.setBounds(markersCollection.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 50
      });
    }
  };

  // Clean up markers
  const cleanupMarkers = () => {
    if (mapRef.current) {
      mapRef.current.geoObjects.removeAll();
    }
    markersRef.current = [];
  };

  // Handle refresh button click
  const handleRefreshMap = () => {
    addMarkers();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRefreshMap} className="bg-background">
          <RefreshCw className="h-4 w-4" />
        </Button>
        {showListToggle && (
          <Button variant="outline" size="sm" className="bg-background">
            <List className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div ref={mapContainer} className="w-full h-full min-h-[400px] rounded-lg" />
    </div>
  );
};

export default PropertyMap;
