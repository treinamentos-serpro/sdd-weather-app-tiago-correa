export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id?: number;
  name: string;
  country?: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperatureCelsius: number;
  apparentTemperatureCelsius: number;
  weatherCode: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
  pressureHpa?: number;
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  minimumTemperatureCelsius: number;
  maximumTemperatureCelsius: number;
  precipitationMm?: number;
  precipitationProbabilityPercent?: number;
}

export interface WeatherData {
  city: City;
  timezone: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
