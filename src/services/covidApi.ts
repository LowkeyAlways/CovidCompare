import type { Country, CountryStats, HistoricalData, ApiResponse } from '../types/covid';

const BASE_URL = 'https://disease.sh/v3/covid-19';

/**
 * Helper générique pour faire des appels GET et parser le JSON
 * @param url - URL complète à appeler
 * @returns Promise avec les données parsées
 * @throws Error si la requête échoue
 */
async function getJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(
        `Erreur HTTP ${response.status}: ${response.statusText}`
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Échec de la requête API: ${error.message}`);
    }
    throw new Error('Une erreur inconnue est survenue');
  }
}

/**
 * Récupère la liste de tous les pays disponibles
 * @returns ApiResponse avec la liste des pays
 */
export async function fetchCountries(): Promise<ApiResponse<Country[]>> {
  try {
    const data = await getJSON<any[]>(`${BASE_URL}/countries`);
    
    const countries: Country[] = data
      .map((country) => ({
        name: country.country,
        code: country.countryInfo.iso2 || country.countryInfo.iso3,
        iso2: country.countryInfo.iso2,
        iso3: country.countryInfo.iso3,
      }))
      .filter((country) => country.code) // Filtrer les pays sans code
      .sort((a, b) => a.name.localeCompare(b.name)); // Trier par nom
    
    return {
      success: true,
      data: countries,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération des pays',
    };
  }
}

/**
 * Récupère les statistiques complètes pour un pays spécifique
 * @param countryCode - Code ISO2 ou ISO3 du pays (ex: 'FR', 'USA')
 * @returns ApiResponse avec les statistiques du pays
 */
export async function fetchCountryStats(countryCode: string): Promise<ApiResponse<CountryStats>> {
  if (!countryCode || countryCode.trim() === '') {
    return {
      success: false,
      error: 'Le code pays est requis',
    };
  }

  try {
    const data = await getJSON<CountryStats>(
      `${BASE_URL}/countries/${encodeURIComponent(countryCode)}`
    );
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques',
    };
  }
}

/**
 * Récupère les données historiques pour un pays sur les X derniers jours
 * @param countryCode - Code ISO2 ou ISO3 du pays
 * @param days - Nombre de jours (par défaut 30)
 * @returns ApiResponse avec les données historiques
 */
export async function fetchHistoricalData(
  countryCode: string,
  days: number = 30
): Promise<ApiResponse<HistoricalData>> {
  if (!countryCode || countryCode.trim() === '') {
    return {
      success: false,
      error: 'Le code pays est requis',
    };
  }

  if (days < 1) {
    return {
      success: false,
      error: 'Le nombre de jours doit être supérieur à 0',
    };
  }

  try {
    const data = await getJSON<HistoricalData>(
      `${BASE_URL}/historical/${encodeURIComponent(countryCode)}?lastdays=${days}`
    );
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération des données historiques',
    };
  }
}

/**
 * Récupère toutes les données historiques pour tous les pays (utilisé pour comparaison globale)
 * @param days - Nombre de jours (par défaut 30)
 * @returns ApiResponse avec les données historiques globales
 */
export async function fetchAllHistoricalData(days: number = 30): Promise<ApiResponse<any>> {
  try {
    const data = await getJSON<any>(`${BASE_URL}/historical/all?lastdays=${days}`);
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération des données historiques globales',
    };
  }
}
