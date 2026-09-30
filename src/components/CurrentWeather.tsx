import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel, getWindDirection } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface MetricProps {
  icon: string;
  label: string;
  value: string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
      <dt className="flex items-center gap-3 text-xs text-white/60">
        <span aria-hidden="true" className="text-xl">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  );
}

function formatReferenceTime(referenceTime: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/.exec(referenceTime);

  if (!match) {
    throw new RangeError('Horário de referência inválido.');
  }

  const [, year, month, day, hour, minute] = match;
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

/** Apresenta o clima atual da cidade em destaque. */
export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const location = [city.admin1, city.country].filter(Boolean).join(', ');
  const metrics: MetricProps[] = [];

  if (current.humidityPercent !== undefined) {
    metrics.push({
      icon: '💧',
      label: 'Umidade',
      value: `${Math.round(current.humidityPercent)}%`,
    });
  }

  if (current.windSpeedKmh !== undefined || current.windDirectionDegrees !== undefined) {
    const windValues = [
      current.windSpeedKmh === undefined ? undefined : `${Math.round(current.windSpeedKmh)} km/h`,
      current.windDirectionDegrees === undefined
        ? undefined
        : getWindDirection(current.windDirectionDegrees),
    ].filter((value) => value !== undefined);

    metrics.push({
      icon: '💨',
      label: 'Vento',
      value: windValues.join(' '),
    });
  }

  if (current.precipitationMm !== undefined) {
    metrics.push({
      icon: '🌧️',
      label: 'Precipitação',
      value: `${current.precipitationMm.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mm`,
    });
  }

  if (current.pressureHpa !== undefined) {
    metrics.push({
      icon: '📊',
      label: 'Pressão',
      value: `${current.pressureHpa.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} hPa`,
    });
  }

  return (
    <section
      aria-label="Clima atual"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md md:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{city.name}</h2>
          {location && <p className="text-white/70">{location}</p>}

          <div className="mt-6 flex items-center gap-4">
            <span aria-hidden="true" className="text-6xl">
              {getWeatherIcon(current.weatherCode)}
            </span>
            <p className="text-6xl font-light text-white md:text-7xl">
              {formatTemperature(current.temperatureC, unit)}
              <span className="text-3xl text-white/80">{unit === 'fahrenheit' ? 'F' : 'C'}</span>
            </p>
          </div>
          <p className="mt-2 text-lg text-white/80">{getWeatherLabel(current.weatherCode)}</p>
          <p className="mt-1 text-sm text-white/60">
            Sensação térmica: {formatTemperature(current.apparentTemperatureC, unit)}
            {unit === 'fahrenheit' ? 'F' : 'C'}
          </p>
          <p className="mt-2 text-xs text-white/50">
            Referência local: {formatReferenceTime(current.referenceTime)} ({current.timezone})
          </p>
        </div>

        {metrics.length > 0 && (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <Metric key={metric.label} {...metric} />
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
