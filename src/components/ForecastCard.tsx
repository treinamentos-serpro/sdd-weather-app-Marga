import { getDayLabel, getShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

/** Apresenta a previsão de um único dia. */
export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const condition = getWeatherLabel(day.weatherCode);

  return (
    <article
      aria-label={`${getDayLabel(day.date, index)}, ${getShortDate(day.date)}: ${condition}`}
      className="flex min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white shadow-glass backdrop-blur-md"
    >
      <h3 className="font-semibold">{getDayLabel(day.date, index)}</h3>
      <p className="text-sm text-white/60">{getShortDate(day.date)}</p>
      <span aria-hidden="true" className="my-3 text-4xl">
        {getWeatherIcon(day.weatherCode)}
      </span>
      <p className="text-sm text-white/80">{condition}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="font-semibold">
          <span className="sr-only">Máxima: </span>
          {formatTemperature(day.maxTemperatureC, unit)}
          {unit === 'fahrenheit' ? 'F' : 'C'}
        </span>
        <span className="text-white/60">
          <span className="sr-only">Mínima: </span>
          {formatTemperature(day.minTemperatureC, unit)}
          {unit === 'fahrenheit' ? 'F' : 'C'}
        </span>
      </div>
      {day.rainProbabilityPercent !== undefined && (
        <p className="mt-3 text-sm text-sky-200">
          <span aria-hidden="true">🌧 </span>
          Probabilidade de chuva: {Math.round(day.rainProbabilityPercent)}%
        </p>
      )}
    </article>
  );
}
