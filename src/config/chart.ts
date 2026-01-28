import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";

// Enregistrer les modules Chart.js nécessaires (scales, éléments, plugins)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// Options de base pour tous les bar charts - responsive sans aspect ratio fixe
export const baseBarOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false, // Important: permet de contrôler la hauteur via CSS
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 16,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        // Formatter les nombres dans les tooltips (1,234,567)
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value !== null ? value.toLocaleString() : 'N/A'}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Formatter l'axe Y avec séparateurs de milliers
        callback: (value) => {
          return typeof value === 'number' ? value.toLocaleString() : value;
        },
      },
    },
  },
};

// Options de base pour tous les line charts - mêmes principes + point styling
export const baseLineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 16,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value !== null ? value.toLocaleString() : 'N/A'}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return typeof value === 'number' ? value.toLocaleString() : value;
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.2, // Légère courbe pour lisibilité
    },
    point: {
      radius: 3,
      hoverRadius: 5,
    },
  },
};
