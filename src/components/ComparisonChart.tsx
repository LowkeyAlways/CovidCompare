
import { Bar } from 'react-chartjs-2';
import { baseBarOptions } from '../config/chart';
import { 
  METRIC_LABELS,
} from '../utils/constants';
import type { CountrySnapshot } from '../types/covid';
import { formatNumberCompact } from '../utils/formatters';

type MetricKey = 'cases' | 'active' | 'deaths' | 'vaccinations';

interface ComparisonChartProps {
  countries: CountrySnapshot[];
  selectedMetric: MetricKey;
  onMetricChange: (metric: MetricKey) => void;
}

export const ComparisonChart = ({ countries, selectedMetric, onMetricChange }: ComparisonChartProps) => {
  if (!countries || countries.length === 0) {
    return <div className="text-center text-gray-500">Sélectionnez au moins un pays</div>;
  }

  const colors = [
    'rgba(59, 130, 246, 0.8)',      // Bleu
    'rgba(249, 115, 22, 0.8)',      // Orange
    'rgba(34, 197, 94, 0.8)',       // Vert
    'rgba(168, 85, 247, 0.8)',      // Violet
    'rgba(236, 72, 153, 0.8)',      // Rose
    'rgba(14, 165, 233, 0.8)',      // Cyan
    'rgba(245, 158, 11, 0.8)',      // Ambre
    'rgba(239, 68, 68, 0.8)',       // Rouge
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

  const getMetricValue = (country: CountrySnapshot, metric: MetricKey): number => {
    const value = country[metric];
    return typeof value === 'number' ? value : 0;
  };

  const maxValue = Math.max(...countries.map(c => getMetricValue(c, selectedMetric)));
  const sortedCountries = [...countries].sort((a, b) => 
    getMetricValue(b, selectedMetric) - getMetricValue(a, selectedMetric)
  );

  const metricLabel = METRIC_LABELS[selectedMetric] || selectedMetric;

  const chartData = {
    labels: countries.map(c => c.country),
    datasets: [
      {
        label: metricLabel,
        data: countries.map(country => getMetricValue(country, selectedMetric)),
        backgroundColor: countries.map((_, idx) => colors[idx % colors.length]),
        borderColor: countries.map((_, idx) => borderColors[idx % borderColors.length]),
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {(['cases', 'active', 'deaths', 'vaccinations'] as MetricKey[]).map((metric) => (
          <button
            key={metric}
            onClick={() => onMetricChange(metric)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedMetric === metric
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {METRIC_LABELS[metric]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-80 w-full overflow-hidden">
            <Bar data={chartData} options={baseBarOptions} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 h-80 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 sticky top-0 bg-gradient-to-r from-blue-50 to-orange-50 py-2">Classement - {metricLabel}</h3>
          <div className="space-y-2">
            {sortedCountries.map((country, idx) => {
              const value = getMetricValue(country, selectedMetric);
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              return (
                <div key={country.code} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600 w-5">#{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-gray-800 truncate">{country.country}</span>
                      <span className="text-xs font-bold text-blue-600 whitespace-nowrap">{formatNumberCompact(value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
