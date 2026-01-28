import type { Country, HistoricalData, ApiResponse, CountryListItem, CountrySnapshot } from '../types/covid';

const BASE_URL = 'https://disease.sh/v3/covid-19';

async function getJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      let errorMsg = `Erreur HTTP ${response.status}`;
      
      // Essayer de lire le body JSON pour un message plus détaillé
      try {
        const errorBody = await response.json();
        if (errorBody?.message) {
          errorMsg = errorBody.message;
        } else if (errorBody?.error) {
          errorMsg = errorBody.error;
        }
      } catch {
        // Si le body n'est pas JSON, utiliser le statusText
        errorMsg += `: ${response.statusText}`;
      }
      
      // Messages personnalisés par code HTTP
      if (response.status === 404) {
        throw new Error(`Pays ou ressource introuvable (404)`);
      } else if (response.status === 429) {
        throw new Error(`Trop de requêtes - veuillez réessayer dans quelques secondes (429)`);
      } else if (response.status >= 500) {
        throw new Error(`API indisponible - Erreur serveur (${response.status})`);
      }
      
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Erreur réseau ou inconnue');
  }
}

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
      .filter((country) => country.code)
      .sort((a, b) => a.name.localeCompare(b.name));
    
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

export async function fetchCountriesList(): Promise<ApiResponse<CountryListItem[]>> {
  try {
    const data = await getJSON<any[]>(`${BASE_URL}/countries`);
    
    const countries: CountryListItem[] = data
      .map((country) => {
        const iso2 = country.countryInfo?.iso2;
        const iso3 = country.countryInfo?.iso3;
        const code = iso2 || iso3 || country.country;
        
        // Créer l'URL du drapeau via GitHub (flag-icons - très stable et clean)
        const flag = iso2 ? `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${iso2.toLowerCase()}.svg` : undefined;
        
        return {
          name: country.country,
          code,
          flag,
        };
      })
      .filter((country) => country.name && country.code)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('🌍 Pays chargés:', countries.slice(0, 5));
    
    return {
      success: true,
      data: countries,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération de la liste des pays',
    };
  }
}

export async function fetchCountryStats(countryCode: string): Promise<ApiResponse<CountrySnapshot>> {
  if (!countryCode || countryCode.trim() === '') {
    return {
      success: false,
      error: 'Le code pays est requis',
    };
  }

  try {
    const statsPromise = getJSON<any>(
      `${BASE_URL}/countries/${encodeURIComponent(countryCode)}`
    );

    // Vaccination coverage (fullData=true to get the latest total field)
    const vaccinePromise = getJSON<any>(
      `${BASE_URL}/vaccine/coverage/countries/${encodeURIComponent(countryCode)}?lastdays=1&fullData=true`
    ).catch(() => null); // Ne bloque pas si l'endpoint vaccination échoue

    const [data, vaccineData] = await Promise.all([statsPromise, vaccinePromise]);

    let vaccinations: number | undefined;
    if (Array.isArray(vaccineData) && vaccineData.length > 0) {
      const latest = vaccineData[vaccineData.length - 1];
      vaccinations = latest?.total ?? latest?.totalVaccinations ?? undefined;
    } else if (Array.isArray(vaccineData?.timeline)) {
      // fullData renvoie parfois { timeline: [{ total, date, ... }] }
      const latest = vaccineData.timeline[vaccineData.timeline.length - 1];
      vaccinations = latest?.total ?? latest?.totalVaccinations ?? undefined;
    } else if (vaccineData?.timeline && typeof vaccineData.timeline === 'object') {
      // Fallback si on reçoit un objet {"1/1/21": 123, ...}
      const timelineValues = Object.values(vaccineData.timeline) as number[];
      vaccinations = timelineValues.length > 0 ? timelineValues[timelineValues.length - 1] : undefined;
    }

    const snapshot: CountrySnapshot = {
      country: data.country,
      code: data.countryInfo?.iso2 || data.countryInfo?.iso3 || data.country,
      flag: data.countryInfo?.flag,
      continent: data.continent,
      updated: Number(data.updated) || Date.now(),
      cases: data.cases ?? 0,
      todayCases: data.todayCases,
      deaths: data.deaths ?? 0,
      todayDeaths: data.todayDeaths,
      active: data.active ?? 0,
      recovered: data.recovered,
      todayRecovered: data.todayRecovered,
      critical: data.critical,
      tests: data.tests,
      vaccinations,
      population: data.population,
    };

    return {
      success: true,
      data: snapshot,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques',
    };
  }
}

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

