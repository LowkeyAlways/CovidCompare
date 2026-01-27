import { Bar } from 'react-chartjs-2';
import { baseBarOptions } from '../config/chart';
import type { CountrySnapshot } from '../types/covid';
import { formatNumberCompact } from '../utils/formatters';

interface SummaryChartProps {
  countries: CountrySnapshot[];
}

export const SummaryChart = ({ countries }: SummaryChartProps) => {
  if (!countries || countries.length === 0) {
    return null;
  }

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(14, 165, 233, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
  ];

  const borderColors = [
    'rgb(59, 130, 246)',
    'rgb(249, 115, 22)',
    'rgb(34, 197, 94)',
    'rgb(168, 85, 247)',
    'rgb(236, 72, 153)',
    'rgb(14, 165, 233)',
    'rgb(245, 158, 11)',
    'rgb(239, 68, 68)',
  ];

  const chartData = {
    labels: countries.map(c => c.country),
    datasets: countries.map((country, idx) => ({
      label: country.country,
      data: [country.cases],
      backgroundColor: colors[idx % colors.length],
      borderColor: borderColors[idx % borderColors.length],
      borderWidth: 2,
      borderRadius: 6,
    })),
  };

  const totalCases = countries.reduce((sum, c) => sum + c.cases, 0);
  const avgCases = Math.round(totalCases / countries.length);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📋 Résumé global
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Total Cas</p>
            <p className="text-2xl font-bold text-blue-600">{formatNumberCompact(totalCases)}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Moyenne/Pays</p>
            <p className="text-2xl font-bold text-orange-600">{formatNumberCompact(avgCases)}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Pays Suivi</p>
            <p className="text-2xl font-bold text-green-600">{countries.length}</p>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <Bar data={chartData} options={baseBarOptions} />
      </div>
    </>
  );
};
