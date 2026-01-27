import './App.css'
import './styles/index.css'
import "./config/chart";
import { TrendChart } from './components/TrendChart';
import type { CountryHistoricalData } from './utils/constants';

const generateLast30Days = (startValue: number, variability: number): CountryHistoricalData['data'] => {
  const data = [];
  let current = startValue;
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    current += Math.random() * variability - variability / 2;
    current = Math.max(0, current);
    
    data.push({
      date: dateStr,
      value: Math.floor(current),
    });
  }
  
  return data;
};

const mockTrendData: CountryHistoricalData[] = [
  {
    name: 'France',
    data: generateLast30Days(45000, 5000),
  },
  {
    name: 'Germany',
    data: generateLast30Days(38000, 4500),
  },
  {
    name: 'Italy',
    data: generateLast30Days(32000, 3800),
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          COVID-19 Trend (30 Days)
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <TrendChart series={mockTrendData} />
        </div>
      </div>
    </div>
  )
}

export default App
