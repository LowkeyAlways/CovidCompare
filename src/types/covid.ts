// Types pour l'API COVID-19

export interface Country {
  name: string;
  code: string;
  iso2?: string;
  iso3?: string;
}

export interface CountryInfo {
  _id?: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}

export interface CountryStats {
  country: string;
  countryInfo: CountryInfo;
  updated: number;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
}

export interface TimelineData {
  [date: string]: number;
}

export interface HistoricalData {
  country: string;
  province?: string[];
  timeline: {
    cases: TimelineData;
    deaths: TimelineData;
    recovered: TimelineData;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
