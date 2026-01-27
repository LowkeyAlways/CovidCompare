/**
 * Formate un nombre avec séparateurs de milliers
 * Ex: 1234567 → "1,234,567"
 */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString('en-US');
};

/**
 * Formate une date au format lisible court
 * Ex: "2024-01-15" → "Jan 15"
 * Ex: Date object → "Jan 15, 2024"
 */
export const formatDate = (date: string | Date, includeYear = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(includeYear && { year: 'numeric' }),
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Formate un nombre avec suffixe (K, M, B)
 * Ex: 1500 → "1.5K", 2500000 → "2.5M"
 */
export const formatNumberCompact = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Formate un pourcentage avec décimales
 * Ex: 0.8567 → "85.67%"
 */
export const formatPercentage = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${(value * 100).toFixed(decimals)}%`;
};
