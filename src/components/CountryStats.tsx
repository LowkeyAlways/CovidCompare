import type { CountryStats as CountryStatsType } from '../utils/constants';
import { formatNumber } from '../utils/formatters';

interface StatCardProps {
  label: string;
  value: number | undefined;
  color: string;
}

const StatCard = ({ label, value, color }: StatCardProps) => (
  <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${color}`}>
    <p className="text-gray-600 text-sm font-medium">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-2">
      {value !== undefined ? formatNumber(value) : 'N/A'}
    </p>
  </div>
);

interface CountryStatsProps {
  country: CountryStatsType;
  layout?: 'grid' | 'row';
}

export const CountryStats = ({ country, layout = 'grid' }: CountryStatsProps) => {
  const containerClass = layout === 'grid' 
    ? 'grid grid-cols-2 md:grid-cols-4 gap-4' 
    : 'flex flex-wrap gap-4';

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{country.name}</h3>
      
      <div className={containerClass}>
        <StatCard 
          label="Total Cases" 
          value={country.cases} 
          color="border-blue-500" 
        />
        <StatCard 
          label="Active" 
          value={country.active} 
          color="border-orange-500" 
        />
        <StatCard 
          label="Deaths" 
          value={country.deaths} 
          color="border-red-500" 
        />
        <StatCard 
          label="Vaccinations" 
          value={country.vaccinations} 
          color="border-green-500" 
        />
      </div>
    </div>
  );
};
