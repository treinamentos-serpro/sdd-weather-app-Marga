import { useEffect, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { weatherDataMock } from './mocks/weatherData';
import type { Unit, WeatherData } from './types/weather';

type WeatherViewState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'empty'; query: string }
  | { status: 'error'; query: string; message: string }
  | { status: 'success'; data: WeatherData };

const MOCK_LOADING_DELAY_MS = 200;

function normalizeCityName(city: string): string {
  return city.trim().toLocaleLowerCase('pt-BR');
}

/** Layout principal do protótipo local de clima. */
export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [weatherState, setWeatherState] = useState<WeatherViewState>({
    status: 'idle',
  });

  useEffect(() => {
    if (weatherState.status !== 'loading') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (normalizeCityName(weatherState.query) === normalizeCityName(weatherDataMock.city.name)) {
        setWeatherState({ status: 'success', data: weatherDataMock });
        return;
      }

      setWeatherState({ status: 'empty', query: weatherState.query });
    }, MOCK_LOADING_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [weatherState]);

  function handleSearch(city: string) {
    const query = city.trim();

    if (!query) {
      return;
    }

    setWeatherState({ status: 'loading', query });
  }

  function renderWeatherContent() {
    switch (weatherState.status) {
      case 'idle':
        return (
          <EmptyState
            title="Consulte o clima da sua cidade"
            hint={`Experimente buscar ${weatherDataMock.city.name} para ver a fixture local.`}
          />
        );
      case 'loading':
        return <LoadingState />;
      case 'empty':
        return (
          <EmptyState
            title={`Nenhuma cidade encontrada para “${weatherState.query}”`}
            hint={`Esta demonstração local contém somente ${weatherDataMock.city.name}.`}
          />
        );
      case 'error':
        return (
          <ErrorState
            message={weatherState.message}
            onRetry={() => handleSearch(weatherState.query)}
          />
        );
      case 'success':
        return (
          <div className="space-y-8">
            <CurrentWeather
              city={weatherState.data.city}
              current={weatherState.data.current}
              unit={unit}
            />
            <ForecastList forecast={weatherState.data.forecast} unit={unit} />
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-night-900 font-sans text-white">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-white px-4 py-3 font-semibold text-night-900 focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        Pular para o conteúdo principal
      </a>
      <header className="border-b border-white/10 bg-night-800/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <a
            href="#main-content"
            className="flex min-h-11 w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-label="Clima — início"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/20 text-2xl"
            >
              ☀️
            </span>
            <span className="text-xl font-bold tracking-tight">Clima</span>
          </a>

          <div className="flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <SearchBar onSearch={handleSearch} disabled={weatherState.status === 'loading'} />
            <div className="shrink-0 self-start sm:self-auto">
              <UnitToggle unit={unit} onChange={setUnit} />
            </div>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 md:py-10"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
            Clima local
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Previsão do tempo</h1>
        </div>
        {renderWeatherContent()}
      </main>
    </div>
  );
}
