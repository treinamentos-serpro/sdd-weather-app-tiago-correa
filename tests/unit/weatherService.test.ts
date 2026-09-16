import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

const city: City = {
  name: 'Sao Paulo',
  latitude: -23.5475,
  longitude: -46.63611,
};

function response(body: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? 'OK' : 'Server Error',
    json: async () => body,
  } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('searchCities', () => {
  it('não chama a rede para input vazio', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('codifica o nome e mapeia resultados para City', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        results: [
          {
            id: 1,
            name: 'Sao Paulo',
            country: 'Brazil',
            admin1: 'Sao Paulo',
            latitude: -23.5,
            longitude: -46.6,
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('São Paulo')).resolves.toEqual([
      {
        id: 1,
        name: 'Sao Paulo',
        country: 'Brazil',
        region: 'Sao Paulo',
        latitude: -23.5,
        longitude: -46.6,
        timezone: 'America/Sao_Paulo',
      },
    ]);
    expect(fetchMock.mock.calls[0][0]).toContain('name=S%C3%A3o%20Paulo');
  });

  it('retorna vazio quando results está ausente', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({})));

    await expect(searchCities('Sao Paulo')).resolves.toEqual([]);
  });

  it('retorna vazio quando results é uma lista vazia', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ results: [] })));

    await expect(searchCities('Sao Paulo')).resolves.toEqual([]);
  });

  it('lança WeatherServiceError em HTTP não-ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({}, false)));

    await expect(searchCities('Sao Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Não foi possível buscar cidades. Tente novamente.',
    });
  });

  it('converte falha de rede em WeatherServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network failed')));

    await expect(searchCities('Sao Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
    });
  });

  it('converte JSON inválido em WeatherServiceError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      }),
    );

    await expect(searchCities('Sao Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Resposta inválida da API.',
    });
  });
});

describe('getWeather', () => {
  it('mapeia current e cinco itens de daily', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2026-09-16T10:00',
          temperature_2m: 22.4,
          apparent_temperature: 22.1,
          precipitation: null,
          weather_code: 2,
        },
        daily: {
          time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
          weather_code: [2, 61, 3, 1, 0],
          temperature_2m_min: [17, 16, 15, 16, 17],
          temperature_2m_max: [25, 22, 21, 24, 26],
          precipitation_sum: [null, 4, 1, 0, 0],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await getWeather(city);

    expect(result.current.temperatureCelsius).toBe(22.4);
    expect(result.current.precipitationMm).toBe(0);
    expect(result.forecast).toHaveLength(5);
    expect(result.forecast[0]).toMatchObject({
      date: '2026-09-16',
      minimumTemperatureCelsius: 17,
      maximumTemperatureCelsius: 25,
      precipitationMm: 0,
    });
    expect(fetchMock.mock.calls[0][0]).toContain('forecast_days=5');
  });

  it('lança WeatherServiceError quando current está ausente', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ timezone: 'America/Sao_Paulo' })));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('lança WeatherServiceError quando daily está ausente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        response({
          timezone: 'America/Sao_Paulo',
          current: {
            time: '2026-09-16T10:00',
            temperature_2m: 22.4,
            apparent_temperature: 22.1,
            weather_code: 2,
          },
        }),
      ),
    );

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('lança WeatherServiceError quando os arrays diários têm menos de cinco itens', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        response({
          timezone: 'America/Sao_Paulo',
          current: {
            time: '2026-09-16T10:00',
            temperature_2m: 22.4,
            apparent_temperature: 22.1,
            weather_code: 2,
          },
          daily: {
            time: ['2026-09-16'],
            weather_code: [2],
            temperature_2m_min: [17],
            temperature_2m_max: [25],
          },
        }),
      ),
    );

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('converte AbortError em erro de timeout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' })),
    );

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A requisição demorou demais.',
    });
  });
});
