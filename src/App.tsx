import './App.css'
import './styles/index.css'
import "./config/chart";
import { useState } from 'react';
import { CountrySelector } from './components/CountrySelector';
import type { CountryListItem } from './types/covid';

function App() {
  const [selectedCountries, setSelectedCountries] = useState<CountryListItem[]>([]);

  const handleCountrySelection = (countries: CountryListItem[]) => {
    setSelectedCountries(countries);
    console.log('Selected countries:', countries);
  };

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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Comparison for {selectedCountries.map(c => c.name).join(', ')}
            </h2>
            {/* TODO: Add comparison charts and stats */}
          </div>
        )}
      </div>
    </div>
  )
}

export default App