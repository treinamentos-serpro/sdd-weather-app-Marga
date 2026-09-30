import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchCities, WeatherServiceError } from '../../src/services/weatherService';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchCities', () => {
  it('returns an empty list without fetching when the name is blank', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes the query and maps geocoding results to cities', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        results: [
          {
            id: 123,
            name: 'São Paulo',
            latitude: -23.55,
            longitude: -46.63,
            country: 'Brasil',
            country_code: 'BR',
            admin1: 'São Paulo',
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities("São João d'Oeste")).resolves.toEqual([
      {
        id: 123,
        name: 'São Paulo',
        latitude: -23.55,
        longitude: -46.63,
        country: 'Brasil',
        countryCode: 'BR',
        admin1: 'São Paulo',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Jo%C3%A3o%20d'Oeste&count=5&language=pt&format=json",
    );
  });

  it('throws WeatherServiceError when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    await expect(searchCities('Lisboa')).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
