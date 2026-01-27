import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { baseLineOptions } from '../config/chart';
import { 
  CHART_COLOR_ARRAY, 
  CHART_HEIGHTS,
} from '../utils/constants';
import type { CountryHistoricalData } from '../utils/constants';

type ChartMode = 'daily' | 'cumulative';

interface TrendChartProps {
  series: CountryHistoricalData[];
}

export const TrendChart = ({ series }: TrendChartProps) => {
  const [mode, setMode] = useState<ChartMode>('daily');

  if (!series || series.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  const firstSeries = series[0];
  const labels = firstSeries.data.map((d) => d.date);

  const calculateDailyValues = (values: number[]): number[] => {
    return values.map((val, idx) => {
      return idx === 0 ? val : val - values[idx - 1];
    });
  };

  const datasets = series.map((country, idx) => {
    const values = country.data.map((d) => d.value);
    const displayValues = mode === 'daily' ? calculateDailyValues(values) : values;

    return {
      label: country.name,
      data: displayValues,
      borderColor: CHART_COLOR_ARRAY[idx % CHART_COLOR_ARRAY.length],
      backgroundColor: CHART_COLOR_ARRAY[idx % CHART_COLOR_ARRAY.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.2,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className="w-full">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode('daily')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === 'daily'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setMode('cumulative')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === 'cumulative'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cumulative
        </button>
      </div>

      <div className={`${CHART_HEIGHTS.mobile} ${CHART_HEIGHTS.desktop} w-full`}>
        <Line data={chartData} options={baseLineOptions} />
      </div>
    </div>
  );
};
