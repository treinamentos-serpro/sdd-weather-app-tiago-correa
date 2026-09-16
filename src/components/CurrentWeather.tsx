import { formatTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function displayMetric(value: number | undefined, suffix: string): string {
  return value === undefined || !Number.isFinite(value) ? '—' : `${value}${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const condition = getWeatherCodeInfo(current.weatherCode);

  return (
    <section
      aria-labelledby="current-weather-title"
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent-400">
            Clima atual
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white" id="current-weather-title">
            {city.name}
          </h2>
          {(city.region || city.country) && (
            <p className="mt-1 text-sm text-white/75">
              {[city.region, city.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="text-5xl" role="img">
            {condition.icon}
          </span>
          <div>
            <p className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              {formatTemperature(current.temperatureCelsius, unit)}
            </p>
            <p className="mt-1 text-base text-white/85">{condition.label}</p>
          </div>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-night-800/60 p-4">
          <dt className="text-sm text-white/75">Sensação</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {formatTemperature(current.apparentTemperatureCelsius, unit)}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-800/60 p-4">
          <dt className="text-sm text-white/75">Umidade</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {displayMetric(current.humidityPercent, '%')}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-800/60 p-4">
          <dt className="text-sm text-white/75">Vento</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {displayMetric(current.windSpeedKmh, ' km/h')}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-800/60 p-4">
          <dt className="text-sm text-white/75">Precipitação</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {displayMetric(current.precipitationMm, ' mm')}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-800/60 p-4">
          <dt className="text-sm text-white/75">Pressão</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {displayMetric(current.pressureHpa, ' hPa')}
          </dd>
        </div>
      </dl>
    </section>
  );
}
