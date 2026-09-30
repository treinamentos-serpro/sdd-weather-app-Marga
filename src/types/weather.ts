/** Unidade selecionável na interface; os valores de domínio permanecem em °C. */
export type Unit = 'celsius' | 'fahrenheit';

/** Localidade retornada pela API de geocodificação da Open-Meteo. */
export interface City {
  /** Identificador da localidade na API de geocodificação. */
  id: number;
  /** Nome da cidade retornado pela busca. */
  name: string;
  /** Latitude usada para consultar o clima. */
  latitude: number;
  /** Longitude usada para consultar o clima. */
  longitude: number;
  /** País, quando disponível. */
  country?: string;
  /** Código do país, quando disponível. */
  countryCode?: string;
  /** Região administrativa, quando disponível. */
  admin1?: string;
}

/** Condições atuais normalizadas para unidades internas estáveis. */
export interface CurrentWeather {
  /** Temperatura do ar em °C, sem arredondamento. */
  temperatureC: number;
  /** Temperatura aparente em °C, sem arredondamento. */
  apparentTemperatureC: number;
  /** Código de condição meteorológica WMO. */
  weatherCode: number;
  /** Umidade relativa em porcentagem, quando disponível. */
  humidityPercent?: number;
  /** Velocidade do vento em km/h, quando disponível. */
  windSpeedKmh?: number;
  /** Direção do vento em graus, quando disponível. */
  windDirectionDegrees?: number;
  /** Precipitação em milímetros, quando disponível. */
  precipitationMm?: number;
  /** Pressão ao nível médio do mar em hPa, quando disponível. */
  pressureHpa?: number;
  /** Data e hora local de referência retornadas pela API. */
  referenceTime: string;
  /** Fuso IANA validado na resposta de clima atual. */
  timezone: string;
}

/** Previsão normalizada para uma data local da cidade. */
export interface ForecastDay {
  /** Data local no formato YYYY-MM-DD. */
  date: string;
  /** Temperatura mínima em °C, sem arredondamento. */
  minTemperatureC: number;
  /** Temperatura máxima em °C, sem arredondamento. */
  maxTemperatureC: number;
  /** Código de condição meteorológica WMO. */
  weatherCode: number;
  /** Probabilidade máxima de precipitação em porcentagem, quando disponível. */
  rainProbabilityPercent?: number;
}

/** Dados meteorológicos completos para uma cidade selecionada. */
export interface WeatherData {
  /** Localidade usada nas consultas por coordenadas. */
  city: City;
  /** Condições atuais da localidade. */
  current: CurrentWeather;
  /** Previsões diárias em ordem cronológica. */
  forecast: ForecastDay[];
}

/** Falha normalizada para apresentação sem expor payloads brutos da API. */
export type WeatherError =
  | { kind: 'network' }
  | { kind: 'http'; status: number }
  | { kind: 'api' }
  | { kind: 'timeout' }
  | { kind: 'invalid-response' }
  | { kind: 'timezone-unavailable'; section: 'current' | 'forecast' }
  | { kind: 'incomplete-data'; section: 'current' | 'forecast' };

/** Estados de uma operação que retorna dados meteorológicos. */
export type OperationState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: WeatherError };

/** Estado da busca, que também pode terminar sem cidades correspondentes. */
export type SearchState = OperationState<City[]> | { status: 'empty' };

/** Estado em memória da tela; cada operação de rede evolui independentemente. */
export interface WeatherState {
  /** Texto atual do campo de busca. */
  query: string;
  /** Estado da busca de localidades. */
  search: SearchState;
  /** Localidade selecionada, se houver. */
  selectedCity?: City;
  /** Estado independente da consulta de clima atual. */
  current: OperationState<CurrentWeather>;
  /** Estado independente da consulta de previsão diária. */
  forecast: OperationState<ForecastDay[]>;
  /** Unidade de apresentação da sessão, inicializada em Celsius. */
  unit: Unit;
}
