import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { baseLineOptions } from '../config/chart';
import type { CountryHistoricalData } from '../utils/constants';

type ChartMode = 'daily' | 'cumulative';
type MetricKey = 'cases' | 'active' | 'deaths' | 'vaccinations';

interface TrendChartProps {
  series: CountryHistoricalData[];
  selectedMetric: MetricKey;
}

export const TrendChart = ({ series, selectedMetric }: TrendChartProps) => {
  const [mode, setMode] = useState<ChartMode>('daily');

  if (!series || series.length === 0) {
    return <div className="text-center text-gray-500">Pas de données disponibles</div>;
  }

  const isCrowded = series.length >= 6; // Simplify visuals when many countries are shown
  const chartHeightClass = isCrowded
    ? 'h-[520px] md:h-[620px]'
    : 'h-[420px] md:h-[520px]';

  const firstSeries = series[0];
  const labels = firstSeries.data.map((d) => d.date);

  const aggregateToWeeks = (values: number[], dates: string[], sumMode: boolean) => {
    const weeklyValues: number[] = [];
    const weeklyLabels: string[] = [];

    for (let i = 0; i < values.length; i += 7) {
      const slice = values.slice(i, i + 7);
      const start = dates[i];
      const end = dates[Math.min(i + 6, dates.length - 1)];
      const label = `${start} → ${end}`;
      const value = sumMode
        ? slice.reduce((acc, v) => acc + v, 0)
        : slice[slice.length - 1];

      weeklyValues.push(value);
      weeklyLabels.push(label);
    }

    return { weeklyValues, weeklyLabels };
  };

  const calculateDailyValues = (values: number[]): number[] => {
    return values.map((val, idx) => {
      return idx === 0 ? val : Math.max(0, val - values[idx - 1]);
    });
  };

  const getMetricValues = (data: any[], metric: MetricKey): number[] => {
    if (metric === 'active') {
      // Active = cases - deaths - recovered
      return data.map(d => Math.max(0, (d.cases || 0) - (d.deaths || 0) - (d.recovered || 0)));
    }
    return data.map(d => (d[metric] || 0) as number);
  };

  let weeklyLabels: string[] = [];

  const datasets = series.map((country, idx) => {
    const values = getMetricValues(country.data, selectedMetric);
    const displayValues = mode === 'daily' ? calculateDailyValues(values) : values;
    const { weeklyValues, weeklyLabels: labelsForSeries } = aggregateToWeeks(
      displayValues,
      labels,
      mode === 'daily'
    );

    if (weeklyLabels.length === 0) {
      weeklyLabels = labelsForSeries;
    }

    const colors = [
      'rgb(59, 130, 246)',     // Bleu
      'rgb(249, 115, 22)',     // Orange
      'rgb(34, 197, 94)',      // Vert
      'rgb(168, 85, 247)',     // Violet
      'rgb(236, 72, 153)',     // Rose
      'rgb(14, 165, 233)',     // Cyan
      'rgb(245, 158, 11)',     // Ambre
      'rgb(239, 68, 68)',      // Rouge
    ];

    const baseColor = colors[idx % colors.length];

    return {
      label: country.name,
      data: weeklyValues,
      borderColor: baseColor,
      backgroundColor: isCrowded
        ? baseColor.replace('rgb', 'rgba').replace(')', ', 0.02)')
        : baseColor.replace('rgb', 'rgba').replace(')', ', 0.08)'),
      borderWidth: isCrowded ? 2 : 3,
      pointRadius: isCrowded ? 0 : 2,
      pointBackgroundColor: baseColor,
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 8,
      tension: 0.35,
      fill: !isCrowded,
    };
  });

  const chartData = {
    labels: weeklyLabels,
    datasets,
  };

  const allValues = datasets.flatMap((d) => d.data as number[]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = Math.max(1, maxVal - minVal);
  const padding = range * 0.1;

  const dynamicOptions = {
    ...baseLineOptions,
    scales: {
      ...baseLineOptions.scales,
      y: {
        ...baseLineOptions.scales?.y,
        beginAtZero: false,
        suggestedMin: Math.max(0, minVal - padding),
        suggestedMax: maxVal + padding,
      },
    },
  } as const;

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode('daily')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            mode === 'daily'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 Quotidien
        </button>
        <button
          onClick={() => setMode('cumulative')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            mode === 'cumulative'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📈 Cumulatif
        </button>
      </div>

      <div className={`${chartHeightClass} w-full rounded-xl bg-white shadow-inner p-3`}>
        <Line data={chartData} options={dynamicOptions} />
      </div>
    </div>
  );
};
