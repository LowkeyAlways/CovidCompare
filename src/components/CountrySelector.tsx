import { useState } from 'react';
import { MAX_COUNTRIES_COMPARISON } from '../utils/constants';
import type { CountryStats } from '../utils/constants';

interface CountrySelectorProps {
  availableCountries: CountryStats[];
  onSelectionChange: (selected: CountryStats[]) => void;
}

export const CountrySelector = ({ availableCountries, onSelectionChange }: CountrySelectorProps) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCountry = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      const updated = selectedCountries.filter((c) => c !== countryName);
      setSelectedCountries(updated);
      const selectedData = availableCountries.filter((c) => updated.includes(c.name));
      onSelectionChange(selectedData);
    } else {
      if (selectedCountries.length >= MAX_COUNTRIES_COMPARISON) {
        alert(`Max ${MAX_COUNTRIES_COMPARISON} countries allowed`);
        return;
      }
      const updated = [...selectedCountries, countryName];
      setSelectedCountries(updated);
      const selectedData = availableCountries.filter((c) => updated.includes(c.name));
      onSelectionChange(selectedData);
    }
  };

  const handleClear = () => {
    setSelectedCountries([]);
    onSelectionChange([]);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
        >
          <span>
            {selectedCountries.length === 0
              ? 'Select countries...'
              : `${selectedCountries.length} selected`}
          </span>
          <span className={`transition ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {availableCountries.map((country) => (
              <label
                key={country.name}
                className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country.name)}
                  onChange={() => handleToggleCountry(country.name)}
                  className="w-4 h-4 text-blue-500 rounded cursor-pointer"
                />
                <span className="ml-3 text-gray-700">{country.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {selectedCountries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCountries.map((country) => (
            <div
              key={country}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{country}</span>
              <button
                onClick={() => handleToggleCountry(country)}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
