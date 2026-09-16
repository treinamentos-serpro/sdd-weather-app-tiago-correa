import { useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

interface SearchOperation {
  type: 'search';
  name: string;
}

interface SelectOperation {
  type: 'select';
  city: City;
}

type WeatherOperation = SearchOperation | SelectOperation;

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível carregar os dados.';
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const requestIdRef = useRef(0);
  const lastOperationRef = useRef<WeatherOperation | null>(null);

  async function loadWeather(city: City, requestId: number): Promise<void> {
    try {
      const weather = await getWeather(city);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setData(weather);
      setStatus('success');
    } catch (caughtError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setData(null);
      setError(getErrorMessage(caughtError));
      setStatus('error');
    }
  }

  async function search(name: string): Promise<void> {
    const trimmedName = name.trim();
    const requestId = ++requestIdRef.current;

    lastOperationRef.current = { type: 'search', name: trimmedName };
    setQuery(trimmedName);
    setError(null);
    setData(null);
    setCities([]);

    if (!trimmedName) {
      setStatus('empty');
      return;
    }

    setStatus('loading');

    try {
      const results = await searchCities(trimmedName);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCities(results);

      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      await loadWeather(results[0], requestId);
    } catch (caughtError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(getErrorMessage(caughtError));
      setStatus('error');
    }
  }

  async function selectCity(city: City): Promise<void> {
    const requestId = ++requestIdRef.current;

    lastOperationRef.current = { type: 'select', city };
    setQuery(city.name);
    setError(null);
    setData(null);
    setStatus('loading');
    await loadWeather(city, requestId);
  }

  async function retry(): Promise<void> {
    const operation = lastOperationRef.current;

    if (!operation) {
      return;
    }

    if (operation.type === 'search') {
      await search(operation.name);
      return;
    }

    await selectCity(operation.city);
  }

  return {
    status,
    data,
    cities,
    error,
    query,
    search,
    selectCity,
    retry,
  };
}
