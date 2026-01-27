import { useState, useEffect } from 'react';
import { fetchCountriesList } from '../services/covidApi';
import type { CountryListItem } from '../types/covid';

export const useCountriesList = () => {
  const [countries, setCountries] = useState<CountryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchCountriesList();
        
        if (response.success && response.data) {
          setCountries(response.data);
          console.log('✅ Pays chargés avec succès:', response.data.length);
        } else {
          setError(response.error || 'Erreur lors du chargement des pays');
          console.error('❌ Erreur API:', response.error);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMsg);
        console.error('❌ Erreur du hook:', errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  return { countries, isLoading, error };
};
