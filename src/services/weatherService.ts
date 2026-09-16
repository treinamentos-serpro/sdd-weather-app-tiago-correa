import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

interface GeocodingResult {
  id?: number;
  name?: string;
  country?: string | null;
  admin1?: string | null;
  latitude?: number;
  longitude?: number;
  timezone?: string | null;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  timezone?: string | null;
  current?: {
    time?: string | null;
    temperature_2m?: number | null;
    apparent_temperature?: number | null;
    relative_humidity_2m?: number | null;
    wind_speed_10m?: number | null;
    precipitation?: number | null;
    surface_pressure?: number | null;
    weather_code?: number | null;
  };
  daily?: {
    time?: Array<string | null>;
    weather_code?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
  };
}

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

const REQUEST_TIMEOUT_MS = 10_000;

function optionalFiniteNumber(value: number | null | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function validCoordinate(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function boundedOptionalNumber(
  value: number | null | undefined,
  minimum: number,
  maximum: number,
): number | undefined {
  const normalized = optionalFiniteNumber(value);
  return normalized !== undefined && normalized >= minimum && normalized <= maximum
    ? normalized
    : undefined;
}

function requiredFiniteNumber(value: number | null | undefined): number {
  const normalized = optionalFiniteNumber(value);

  if (normalized === undefined) {
    throw new WeatherServiceError('Resposta de previsão incompleta.');
  }

  return normalized;
}

function requiredDate(value: string | null | undefined): string {
  if (!value) {
    throw new WeatherServiceError('Resposta de previsão incompleta.');
  }

  return value;
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.');
    }

    throw new WeatherServiceError('Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new WeatherServiceError('Resposta inválida da API.');
  }
}

export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return [];
  }

  const response = await fetchWithTimeout(
    `${GEOCODING_URL}?name=${encodeURIComponent(trimmedName)}&count=5&language=pt&format=json`,
  );

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar cidades. Tente novamente.');
  }

  const data = await parseJson<GeocodingResponse>(response);

  if (data.results !== undefined && !Array.isArray(data.results)) {
    throw new WeatherServiceError('Resposta inválida da API.');
  }

  return (data.results ?? [])
    .slice(0, 5)
    .filter(
      (
        result,
      ): result is GeocodingResult & {
        name: string;
        latitude: number;
        longitude: number;
      } =>
        typeof result.name === 'string' &&
        typeof result.latitude === 'number' &&
        typeof result.longitude === 'number',
    )
    .map((result) => ({
      id: result.id,
      name: result.name,
      country: result.country ?? undefined,
      region: result.admin1 ?? undefined,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone ?? undefined,
    }));
}

export async function getWeather(city: City): Promise<WeatherData> {
  if (!validCoordinate(city.latitude, city.longitude)) {
    throw new WeatherServiceError('Coordenadas da cidade inválidas.');
  }

  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure,weather_code',
    daily:
      'weather_code,temperature_2m_min,temperature_2m_max,precipitation_sum,precipitation_probability_max',
    temperature_unit: 'celsius',
    forecast_days: '5',
    timezone: 'auto',
  });

  const response = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível carregar a previsão. Tente novamente.');
  }

  const data = await parseJson<ForecastResponse>(response);

  if (!data.current || !data.daily) {
    throw new WeatherServiceError('Resposta de previsão incompleta.');
  }

  const { current, daily } = data;
  const requiredDailyArrays = [
    daily.time,
    daily.weather_code,
    daily.temperature_2m_min,
    daily.temperature_2m_max,
  ];

  const hasFiveDailyItems = requiredDailyArrays.every(
    (values) => values !== undefined && values.length >= 5,
  );

  if (
    !data.timezone ||
    !current.time ||
    optionalFiniteNumber(current.temperature_2m) === undefined ||
    optionalFiniteNumber(current.apparent_temperature) === undefined ||
    optionalFiniteNumber(current.weather_code) === undefined ||
    !hasFiveDailyItems
  ) {
    throw new WeatherServiceError('Resposta de previsão incompleta.');
  }

  const mappedCurrent: CurrentWeather = {
    time: requiredDate(current.time),
    temperatureCelsius: requiredFiniteNumber(current.temperature_2m),
    apparentTemperatureCelsius: requiredFiniteNumber(current.apparent_temperature),
    weatherCode: requiredFiniteNumber(current.weather_code),
    humidityPercent: boundedOptionalNumber(current.relative_humidity_2m, 0, 100),
    windSpeedKmh: optionalFiniteNumber(current.wind_speed_10m),
    precipitationMm: optionalFiniteNumber(current.precipitation) ?? 0,
    pressureHpa: optionalFiniteNumber(current.surface_pressure),
  };

  const forecast: ForecastDay[] = daily.time!.slice(0, 5).map((date, index) => ({
    date: requiredDate(date),
    weatherCode: requiredFiniteNumber(daily.weather_code![index]),
    minimumTemperatureCelsius: requiredFiniteNumber(daily.temperature_2m_min![index]),
    maximumTemperatureCelsius: requiredFiniteNumber(daily.temperature_2m_max![index]),
    precipitationMm: optionalFiniteNumber(daily.precipitation_sum?.[index]) ?? 0,
    precipitationProbabilityPercent: boundedOptionalNumber(
      daily.precipitation_probability_max?.[index],
      0,
      100,
    ),
  }));

  return {
    city,
    timezone: data.timezone,
    current: mappedCurrent,
    forecast,
  };
}
