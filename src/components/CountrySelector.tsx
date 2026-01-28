import { useState } from 'react';
import { useCountriesList } from '../hooks/useCountriesList';
import { MAX_COUNTRIES_COMPARISON } from '../utils/constants';
import type { CountryListItem } from '../types/covid';

interface CountrySelectorProps {
  onSelectionChange: (selected: CountryListItem[]) => void;
}

export const CountrySelector = ({ onSelectionChange }: CountrySelectorProps) => {
  const { countries, isLoading, error } = useCountriesList();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const handleToggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      const updated = selectedCountries.filter((c) => c !== countryCode);
      setSelectedCountries(updated);
      const selectedData = countries.filter((c) => updated.includes(c.code));
      onSelectionChange(selectedData);
    } else {
      if (selectedCountries.length >= MAX_COUNTRIES_COMPARISON) {
        return;
      }
      const updated = [...selectedCountries, countryCode];
      setSelectedCountries(updated);
      const selectedData = countries.filter((c) => updated.includes(c.code));
      onSelectionChange(selectedData);
    }
  };

  const handleClear = () => {
    setSelectedCountries([]);
    onSelectionChange([]);
  };

  // Filtrer les pays en fonction de la recherche
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-md">
      {isLoading && <p className="text-gray-400 text-sm">Chargement des pays...</p>}
      {error && <p className="text-red-500 text-sm mb-2">⚠️ {error}</p>}
      
      {!isLoading && (
        <div className="space-y-3">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg text-left font-medium text-gray-700 hover:from-blue-100 hover:to-blue-200 transition flex justify-between items-center shadow-sm hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                🌍
                {selectedCountries.length === 0
                  ? 'Sélectionnez des pays...'
                  : `${selectedCountries.length} sélectionnés`}
              </span>
              <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-lg shadow-xl z-10 max-h-72 overflow-hidden flex flex-col">
                <input
                  type="text"
                  placeholder="🔍 Rechercher un pays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                />
                <div className="overflow-y-auto max-h-64">
                  {filteredCountries.length === 0 ? (
                    <p className="px-4 py-3 text-gray-500 text-center text-sm">
                      {searchQuery ? 'Aucun pays trouvé' : 'Aucun pays disponible'}
                    </p>
                  ) : (
                    filteredCountries.map((country) => (
                      <label
                        key={country.code}
                        className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCountries.includes(country.code)}
                          onChange={() => handleToggleCountry(country.code)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                        <span className="ml-3 text-gray-700 flex items-center gap-3 flex-1">
                          {country.flag && (
                            <img src={country.flag} alt={country.name} className="w-5 h-3 object-cover rounded" />
                          )}
                          <span className="font-medium">{country.name}</span>
                          <span className="text-xs text-gray-400 ml-auto">({country.code})</span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedCountries.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((countryCode) => {
                  const country = countries.find((c) => c.code === countryCode);
                  return (
                    <div
                      key={countryCode}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition"
                    >
                      <span className="flex items-center gap-2">
                        {country?.flag && (
                          <img src={country.flag} alt={country.name} className="w-4 h-3 object-cover rounded" />
                        )}
                        {country?.name}
                      </span>
                      <button
                        onClick={() => handleToggleCountry(countryCode)}
                        className="text-white hover:text-blue-100 font-bold ml-1 text-lg leading-none"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleClear}
                className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium underline py-1 transition"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
