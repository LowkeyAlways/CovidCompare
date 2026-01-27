import { Bar } from 'react-chartjs-2';
import { baseBarOptions } from '../config/chart';
import { 
  CHART_COLOR_ARRAY, 
  METRIC_LABELS,
  CHART_HEIGHTS 
} from '../utils/constants';
import type { CountryStats } from '../utils/constants';
import { formatNumber, formatNumberCompact } from '../utils/formatters';

interface ComparisonChartProps {
  leftCountry: CountryStats;
  rightCountry: CountryStats;
}

export const ComparisonChart = ({ leftCountry, rightCountry }: ComparisonChartProps) => {
  const labels = [
    METRIC_LABELS.cases,
    METRIC_LABELS.active,
    METRIC_LABELS.deaths,
    METRIC_LABELS.vaccinations,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: leftCountry.name,
        data: [
          leftCountry.cases,
          leftCountry.active,
          leftCountry.deaths,
          leftCountry.vaccinations ?? 0,
        ],
        backgroundColor: CHART_COLOR_ARRAY[0],
        borderColor: CHART_COLOR_ARRAY[0],
        borderWidth: 1,
      },
      {
        label: rightCountry.name,
        data: [
          rightCountry.cases,
          rightCountry.active,
          rightCountry.deaths,
          rightCountry.vaccinations ?? 0,
        ],
        backgroundColor: CHART_COLOR_ARRAY[1],
        borderColor: CHART_COLOR_ARRAY[1],
        borderWidth: 1,
      },
    ],
  };

  const casesDiff = leftCountry.cases - rightCountry.cases;
  const higherCountry = casesDiff > 0 ? leftCountry.name : rightCountry.name;
  const lowerCountry = casesDiff > 0 ? rightCountry.name : leftCountry.name;
  const diffAbs = Math.abs(casesDiff);

  return (
    <div className="w-full">
      <div className={`${CHART_HEIGHTS.mobile} ${CHART_HEIGHTS.desktop} w-full`}>
        <Bar data={chartData} options={baseBarOptions} />
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          <span className="font-semibold">{higherCountry}</span> has{' '}
          <span className="font-semibold">{formatNumberCompact(diffAbs)}</span> more cases than{' '}
          <span className="font-semibold">{lowerCountry}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Total: {formatNumber(leftCountry.cases)} vs {formatNumber(rightCountry.cases)}
        </p>
      </div>
    </div>
  );
};
