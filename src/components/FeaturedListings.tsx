
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/ListingCard';
import { mockListings } from '@/data/mockListings';
import { useTranslation } from 'react-i18next';
import { useAppWithTranslations } from '@/stores/useAppStore';

export function FeaturedListings() {
  const { t } = useTranslation();
  const { language } = useAppWithTranslations();
  const [activeTab, setActiveTab] = useState('featured');
  
  const featuredListings = mockListings.filter(listing => listing.isFeatured);
  const latestListings = [...mockListings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 8);

  // Helper function to adapt multilingual listings to simple string format
  const adaptListing = (listing: any) => ({
    ...listing,
    title: typeof listing.title === 'string' ? listing.title : listing.title[language] || listing.title.ru,
    description: typeof listing.description === 'string' ? listing.description : listing.description?.[language] || listing.description?.ru,
    city: typeof listing.city === 'string' ? listing.city : listing.city?.[language] || listing.city?.ru
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fix: Center the heading and move it above the tabs */}
      <h2 className="text-2xl font-bold mb-4 text-center">{t('listings')}</h2>
      
      <Tabs defaultValue="featured" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="featured">{t('featuredAds')}</TabsTrigger>
            <TabsTrigger value="latest">{t('latestAds')}</TabsTrigger>
          </TabsList>
          
          <Button variant="link" asChild>
            <Link to="/search">{t('allAds')}</Link>
          </Button>
        </div>
        
        <TabsContent value="featured" className="mt-0">
          {/* Updated grid to always show 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredListings.slice(0, 8).map(listing => (
              <ListingCard key={listing.id} listing={adaptListing(listing)} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="latest" className="mt-0">
          {/* Updated grid to always show 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestListings.map(listing => (
              <ListingCard key={listing.id} listing={adaptListing(listing)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
