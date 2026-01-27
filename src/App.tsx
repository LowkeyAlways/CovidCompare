import './App.css'
import './styles/index.css'
import "./config/chart";
import { useEffect, useState } from 'react';
import { CountrySelector } from './components/CountrySelector';
import { CountryStats } from './components/CountryStats';
import { TrendChart } from './components/TrendChart';
import { ComparisonChart } from './components/ComparisonChart';
import { fetchCountryStats, fetchHistoricalData } from './services/covidApi';
import type { CountryListItem, CountrySnapshot } from './types/covid';
import type { CountryHistoricalData } from './utils/constants';

type MetricKey = 'cases' | 'active' | 'deaths' | 'vaccinations';

function App() {
  const [selectedCountries, setSelectedCountries] = useState<CountryListItem[]>([]);
  const [snapshots, setSnapshots] = useState<CountrySnapshot[]>([]);
  const [trendData, setTrendData] = useState<CountryHistoricalData[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('cases');

  const handleCountrySelection = (countries: CountryListItem[]) => {
    setSelectedCountries(countries);
  };

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      if (selectedCountries.length === 0) {
        setSnapshots([]);
        setTrendData([]);
        setStatsError(null);
        return;
      }

      setIsLoadingStats(true);
      setStatsError(null);

      try {
        const statsResponses = await Promise.all(
          selectedCountries.map((country) => fetchCountryStats(country.code))
        );

        const historicalResponses = await Promise.all(
          selectedCountries.map((country) => fetchHistoricalData(country.code, 1500))
        );

        if (cancelled) return;

        const errors = statsResponses.filter((res) => !res.success);
        if (errors.length > 0) {
          setStatsError(errors[0].error || 'Erreur lors du chargement des statistiques');
        }

        const data = statsResponses
          .filter((res): res is { success: true; data: CountrySnapshot } => res.success === true && !!res.data)
          .map((res) => res.data);

        setSnapshots(data);

        const trendDataArray = historicalResponses
          .filter((res): res is { success: true; data: any } => res.success === true && !!res.data)
          .map((res, idx) => {
            const country = selectedCountries[idx];
            
            // Générer l'historique pour toutes les métriques
            const casesDates = Object.keys(res.data.timeline.cases);
            const histData = casesDates.map((date) => ({
              date: new Date(date).toISOString().split('T')[0],
              cases: (res.data.timeline.cases[date] || 0) as number,
              deaths: (res.data.timeline.deaths[date] || 0) as number,
              recovered: (res.data.timeline.recovered?.[date] || 0) as number,
              // Pour 'active', on calcule: cases - deaths - recovered
            }));

            return {
              name: country.name,
              data: histData,
            };
          });

        setTrendData(trendDataArray);
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Erreur inconnue';
          setStatsError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingStats(false);
        }
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [selectedCountries]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          CovidCompare 🌍
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-md mx-auto">
          <CountrySelector onSelectionChange={handleCountrySelection} />
        </div>

        {selectedCountries.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Comparaison multi-pays
                </h2>
                <div className="h-96 w-full">
                  <ComparisonChart 
                    countries={snapshots}
                    selectedMetric={selectedMetric}
                    onMetricChange={setSelectedMetric}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Évolution 2019 - 2023
                </h2>
                {trendData.length > 0 && (
                  <div className="h-[620px] w-full">
                    <TrendChart series={trendData} selectedMetric={selectedMetric} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🏥 Statistiques détaillées
              </h2>
              
              <div className="flex items-center gap-3 justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {selectedCountries.map((c) => c.name).join(', ')}
                </p>
                {isLoadingStats && (
                  <span className="text-sm text-blue-600 flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Chargement...
                  </span>
                )}
              </div>

              {statsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700">{statsError}</p>
                </div>
              )}

              <div className="space-y-6">
                {snapshots.map((snapshot) => (
                  <CountryStats key={snapshot.code} country={snapshot} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App