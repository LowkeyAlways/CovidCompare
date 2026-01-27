import './App.css'
import './styles/index.css'
import "./config/chart";
import { useState } from 'react';
import { CountrySelector } from './components/CountrySelector';
import { CountryStats } from './components/CountryStats';
import { TrendChart } from './components/TrendChart';
import { ComparisonChart } from './components/ComparisonChart';
import { ChartSkeleton, CountryStatsSkeleton } from './components/SkeletonLoaders';
import { useCovidData } from './hooks/useCovidData';
import type { CountryListItem } from './types/covid';

function App() {
  const [selectedCountries, setSelectedCountries] = useState<CountryListItem[]>([]);
  const { snapshots, trendData, isLoading, error, selectedMetric, setSelectedMetric, retry } = useCovidData(selectedCountries);

  const handleCountrySelection = (countries: CountryListItem[]) => {
    setSelectedCountries(countries);
  };

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
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-96 w-full">
                    <ComparisonChart 
                      countries={snapshots}
                      selectedMetric={selectedMetric}
                      onMetricChange={setSelectedMetric}
                    />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Évolution 2019 - 2023
                </h2>
                {isLoading ? (
                  <ChartSkeleton />
                ) : trendData.length > 0 ? (
                  <div className="h-[620px] w-full">
                    <TrendChart series={trendData} selectedMetric={selectedMetric} />
                  </div>
                ) : null}
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
                {isLoading && (
                  <span className="text-sm text-blue-600 flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Chargement...
                  </span>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-1">⚠️ Erreur lors du chargement</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                    <button
                      onClick={retry}
                      className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
                    >
                      🔄 Réessayer
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <CountryStatsSkeleton />
                    <CountryStatsSkeleton />
                  </>
                ) : (
                  snapshots.map((snapshot) => (
                    <CountryStats key={snapshot.code} country={snapshot} />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App