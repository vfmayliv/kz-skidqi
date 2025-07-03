
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useLocationData() {
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        console.log('🔄 Fetching location data from Supabase...');
        
        // Загружаем регионы
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('*')
          .order('name_ru', { ascending: true });

        if (regionsError) {
          console.error('❌ Error fetching regions:', regionsError);
          throw regionsError;
        }

        // Загружаем города
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('*')
          .order('name_ru', { ascending: true });

        if (citiesError) {
          console.error('❌ Error fetching cities:', citiesError);
          throw citiesError;
        }

        console.log('✅ Location data fetched - Regions:', regionsData?.length, 'Cities:', citiesData?.length);
        
        setRegions(regionsData || []);
        setCities(citiesData || []);
        setError(null);
      } catch (err: any) {
        console.error('💥 Error in useLocationData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  return { regions, cities, loading, error };
}
