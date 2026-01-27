import { useEffect, useState } from 'react';
import { fetchCountryStats, fetchHistoricalData } from '../services/covidApi';
import type { CountryListItem, CountrySnapshot } from '../types/covid';
import type { CountryHistoricalData } from '../utils/constants';

type MetricKey = 'cases' | 'active' | 'deaths' | 'vaccinations';

interface UseCovidDataReturn {
  snapshots: CountrySnapshot[];
  trendData: CountryHistoricalData[];
  isLoading: boolean;
  error: string | null;
  selectedMetric: MetricKey;
  setSelectedMetric: (metric: MetricKey) => void;
}

export const useCovidData = (selectedCountries: CountryListItem[]): UseCovidDataReturn => {
  const [snapshots, setSnapshots] = useState<CountrySnapshot[]>([]);
  const [trendData, setTrendData] = useState<CountryHistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('cases');

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (selectedCountries.length === 0) {
        setSnapshots([]);
        setTrendData([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch stats et historiques en parallèle
        const statsResponses = await Promise.all(
          selectedCountries.map((country) => fetchCountryStats(country.code))
        );

        const historicalResponses = await Promise.all(
          selectedCountries.map((country) => fetchHistoricalData(country.code, 1500))
        );

        if (cancelled) return;

        // Gestion des erreurs
        const errors = statsResponses.filter((res) => !res.success);
        if (errors.length > 0) {
          setError(errors[0].error || 'Erreur lors du chargement des statistiques');
        }

        // Extraction des snapshots
        const snapshotData = statsResponses
          .filter((res): res is { success: true; data: CountrySnapshot } => res.success === true && !!res.data)
          .map((res) => res.data);
        setSnapshots(snapshotData);

        // Extraction des données historiques
        const trendDataArray = historicalResponses
          .filter((res): res is { success: true; data: any } => res.success === true && !!res.data)
          .map((res, idx) => {
            const country = selectedCountries[idx];
            const casesDates = Object.keys(res.data.timeline.cases);
            const histData = casesDates.map((date) => ({
              date: new Date(date).toISOString().split('T')[0],
              cases: (res.data.timeline.cases[date] || 0) as number,
              deaths: (res.data.timeline.deaths[date] || 0) as number,
              recovered: (res.data.timeline.recovered?.[date] || 0) as number,
            }));

            return {
              name: country.name,
              data: histData,
            };
          });

        setTrendData(trendDataArray);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Erreur inconnue';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [selectedCountries]);

  return {
    snapshots,
    trendData,
    isLoading,
    error,
    selectedMetric,
    setSelectedMetric,
  };
};
