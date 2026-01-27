import './App.css'
import './styles/index.css'
import "./config/chart";
import { useEffect, useState } from 'react';
import { CountrySelector } from './components/CountrySelector';
import { CountryStats } from './components/CountryStats';
import { fetchCountryStats } from './services/covidApi';
import type { CountryListItem, CountrySnapshot } from './types/covid';

function App() {
  const [selectedCountries, setSelectedCountries] = useState<CountryListItem[]>([]);
  const [snapshots, setSnapshots] = useState<CountrySnapshot[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const handleCountrySelection = (countries: CountryListItem[]) => {
    setSelectedCountries(countries);
  };

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      if (selectedCountries.length === 0) {
        setSnapshots([]);
        setStatsError(null);
        return;
      }

      setIsLoadingStats(true);
      setStatsError(null);

      try {
        const responses = await Promise.all(
          selectedCountries.map((country) => fetchCountryStats(country.code))
        );

        if (cancelled) return;

        const errors = responses.filter((res) => !res.success);
        if (errors.length > 0) {
          setStatsError(errors[0].error || 'Erreur lors du chargement des statistiques');
        }

        const data = responses
          .filter((res): res is { success: true; data: CountrySnapshot } => res.success === true && !!res.data)
          .map((res) => res.data);

        setSnapshots(data);
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          CovidCompare 🌍
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-md mx-auto">
          <CountrySelector onSelectionChange={handleCountrySelection} />
        </div>

        {selectedCountries.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3 justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Statistiques instant T
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedCountries.map((c) => c.name).join(', ')}
                </p>
              </div>
              {isLoadingStats && (
                <span className="text-sm text-blue-600">Chargement...</span>
              )}
            </div>

            {statsError && (
              <p className="text-sm text-red-600">{statsError}</p>
            )}

            <div className="space-y-6">
              {snapshots.map((snapshot) => (
                <CountryStats key={snapshot.code} country={snapshot} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App