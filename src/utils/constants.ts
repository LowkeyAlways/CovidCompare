// Palette de couleurs temporaire pour les charts (sera ajustée par Person C)
export const CHART_COLORS = {
  primary: 'rgb(59, 130, 246)',    // Bleu
  secondary: 'rgb(239, 68, 68)',   // Rouge
  tertiary: 'rgb(34, 197, 94)',    // Vert
  quaternary: 'rgb(251, 146, 60)', // Orange
  quinary: 'rgb(168, 85, 247)',    // Violet
  senary: 'rgb(236, 72, 153)',     // Rose
  septenary: 'rgb(14, 165, 233)',  // Cyan
  octonary: 'rgb(250, 204, 21)',   // Jaune
};

// Palette transparente pour les backgrounds (ex: area charts)
export const CHART_COLORS_TRANSPARENT = {
  primary: 'rgba(59, 130, 246, 0.1)',
  secondary: 'rgba(239, 68, 68, 0.1)',
  tertiary: 'rgba(34, 197, 94, 0.1)',
  quaternary: 'rgba(251, 146, 60, 0.1)',
  quinary: 'rgba(168, 85, 247, 0.1)',
  senary: 'rgba(236, 72, 153, 0.1)',
  septenary: 'rgba(14, 165, 233, 0.1)',
  octonary: 'rgba(250, 204, 21, 0.1)',
};

// Array de couleurs pour itérer facilement sur plusieurs datasets
export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
  CHART_COLORS.senary,
  CHART_COLORS.septenary,
  CHART_COLORS.octonary,
];

// Types de métriques disponibles pour les comparaisons
export type MetricType = 'cases' | 'active' | 'deaths' | 'vaccinations';

// Labels lisibles pour chaque métrique
export const METRIC_LABELS: Record<MetricType, string> = {
  cases: 'Total Cases',
  active: 'Active Cases',
  deaths: 'Deaths',
  vaccinations: 'Vaccinations',
};

// Interface pour les stats d'un pays (format temporaire, sera validé par Person B)
export interface CountryStats {
  name: string;
  cases: number;
  active: number;
  deaths: number;
  vaccinations?: number; // Optionnel car pas toujours disponible
  recovered?: number;
  tests?: number;
}

// Interface pour les données historiques (séries temporelles)
export interface HistoricalDataPoint {
  date: string; // Format ISO "YYYY-MM-DD"
  value: number;
}

export interface CountryHistoricalData {
  name: string;
  data: HistoricalDataPoint[];
}

// Constantes pour la responsiveness
export const CHART_HEIGHTS = {
  mobile: 'h-72',      // 288px
  tablet: 'md:h-80',   // 320px
  desktop: 'md:h-96',  // 384px
};

// Limite de pays pour multi-comparison (au-delà, warning)
export const MAX_COUNTRIES_COMPARISON = 8;
