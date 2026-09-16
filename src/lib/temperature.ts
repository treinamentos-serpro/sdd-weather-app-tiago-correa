import type { Unit } from '../types/weather';

export function convertTemperature(valueCelsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? (valueCelsius * 9) / 5 + 32 : valueCelsius;
}

export function unitLabel(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function formatTemperature(valueCelsius: number, unit: Unit): string {
  if (!Number.isFinite(valueCelsius)) {
    return '—';
  }

  return `${convertTemperature(valueCelsius, unit).toFixed(1)}${unitLabel(unit)}`;
}
