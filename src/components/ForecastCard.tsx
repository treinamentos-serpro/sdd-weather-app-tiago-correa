import { memo } from 'react';
import { formatDayLabel } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index?: number;
  unit: Unit;
}

function displayProbability(probability?: number): string {
  return probability === undefined || !Number.isFinite(probability) ? '—' : `${probability}%`;
}

function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const condition = getWeatherCodeInfo(day.weatherCode);
  const dayLabel = formatDayLabel(day.date, index);

  return (
    <article
      aria-label={`Previsão para ${dayLabel}`}
      className="flex min-h-48 min-w-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <h3 className="truncate text-sm font-semibold capitalize text-white">{dayLabel}</h3>
      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <span aria-hidden="true" className="text-4xl" role="img">
          {condition.icon}
        </span>
        <span className="text-xs text-white/80">{condition.label}</span>
      </div>
      <div className="mt-4 flex items-baseline justify-center gap-2">
        <span className="font-semibold text-white">
          {formatTemperature(day.maximumTemperatureCelsius, unit)}
        </span>
        <span className="text-sm text-white/75">
          {formatTemperature(day.minimumTemperatureCelsius, unit)}
        </span>
      </div>
      <p className="mt-3 text-center text-xs text-white/80">
        Chuva: {displayProbability(day.precipitationProbabilityPercent)}
      </p>
    </article>
  );
}

export default memo(ForecastCard);
