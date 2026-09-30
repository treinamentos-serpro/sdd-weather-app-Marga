import type { City } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/** Erro tipado da camada de acesso à Open-Meteo. */
export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readGeocodingResults(data: unknown): City[] {
  if (!isRecord(data)) {
    throw new WeatherServiceError('A resposta de geocodificação é inválida.');
  }

  const results = data.results;
  if (results === undefined) return [];
  if (!Array.isArray(results)) {
    throw new WeatherServiceError('A resposta de geocodificação é inválida.');
  }

  return results.map((result): City => {
    if (!isRecord(result)) {
      throw new WeatherServiceError('A resposta de geocodificação é inválida.');
    }

    const { id, name, latitude, longitude } = result;
    const country = result.country;
    const countryCode = result.country_code;
    const admin1 = result.admin1;

    if (
      typeof id !== 'number' ||
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof name !== 'string' ||
      !name.trim() ||
      typeof latitude !== 'number' ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      typeof longitude !== 'number' ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180 ||
      (country !== undefined && typeof country !== 'string') ||
      (countryCode !== undefined && typeof countryCode !== 'string') ||
      (admin1 !== undefined && typeof admin1 !== 'string')
    ) {
      throw new WeatherServiceError('A resposta de geocodificação é inválida.');
    }

    return {
      id,
      name,
      latitude,
      longitude,
      ...(country !== undefined && { country }),
      ...(countryCode !== undefined && { countryCode }),
      ...(admin1 !== undefined && { admin1 }),
    };
  });
}

/** Busca cidades pelo nome e normaliza os resultados da Open-Meteo. */
export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();
  if (!query) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar a cidade. Tente novamente.');
  }

  return readGeocodingResults(await response.json());
}
