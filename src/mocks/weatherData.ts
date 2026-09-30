import type { WeatherData } from '../types/weather';

/** Fixture sintética e estável para desenvolver a interface sem chamadas à API. */
export const weatherDataMock: WeatherData = {
  city: {
    id: 1,
    name: 'Campinas',
    latitude: -22.9056,
    longitude: -47.0608,
    country: 'Brasil',
    countryCode: 'BR',
    admin1: 'São Paulo',
  },
  current: {
    temperatureC: 23.4,
    apparentTemperatureC: 24.1,
    weatherCode: 2,
    humidityPercent: 68,
    windSpeedKmh: 12.6,
    windDirectionDegrees: 45,
    precipitationMm: 0,
    pressureHpa: 1013.2,
    referenceTime: '2026-09-30T12:00',
    timezone: 'America/Sao_Paulo',
  },
  forecast: [
    {
      date: '2026-09-30',
      minTemperatureC: 17.2,
      maxTemperatureC: 25.8,
      weatherCode: 2,
      rainProbabilityPercent: 10,
    },
    {
      date: '2026-10-01',
      minTemperatureC: 16.8,
      maxTemperatureC: 27.1,
      weatherCode: 1,
      rainProbabilityPercent: 5,
    },
    {
      date: '2026-10-02',
      minTemperatureC: 18.1,
      maxTemperatureC: 28.4,
      weatherCode: 0,
      rainProbabilityPercent: 0,
    },
    {
      date: '2026-10-03',
      minTemperatureC: 19.3,
      maxTemperatureC: 26.7,
      weatherCode: 61,
      rainProbabilityPercent: 65,
    },
    {
      date: '2026-10-04',
      minTemperatureC: 18.6,
      maxTemperatureC: 25.2,
      weatherCode: 3,
    },
  ],
};
