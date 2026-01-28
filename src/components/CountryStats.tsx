import type { CountrySnapshot } from '../types/covid';
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
  country: CountrySnapshot;
  layout?: 'grid' | 'row';
}

export const CountryStats = ({ country, layout = 'grid' }: CountryStatsProps) => {
  const containerClass = layout === 'grid' 
    ? 'grid grid-cols-2 md:grid-cols-4 gap-4' 
    : 'flex flex-wrap gap-4';

  const metrics = [
    { label: 'Cas totaux', value: country.cases, color: 'border-blue-500' },
    { label: 'Cas actifs', value: country.active, color: 'border-orange-500' },
    { label: 'Décès', value: country.deaths, color: 'border-red-500' },
    { label: 'Vaccination', value: country.vaccinations, color: 'border-green-500' },
  ].filter((m) => m.value !== undefined);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        {country.flag && (
          <img src={country.flag} alt={country.country} className="w-8 h-6 object-cover rounded" />
        )}
        <div>
          <h3 className="text-xl font-bold text-gray-800">{country.country}</h3>
          {country.continent && <p className="text-sm text-gray-500">{country.continent}</p>}
        </div>
      </div>

      <div className={containerClass}>
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            color={metric.color}
          />
        ))}
      </div>
    </div>
  );
};
