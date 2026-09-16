import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../src/hooks/useWeather';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const city: City = {
  name: 'Sao Paulo',
  latitude: -23.55,
  longitude: -46.63,
};

beforeEach(() => {
  vi.mocked(searchCities).mockResolvedValue([city]);
  vi.mocked(getWeather).mockRejectedValue(new Error('Falha de rede.'));
});

describe('useWeather retry', () => {
  it('limita retry manual a duas novas tentativas', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Sao Paulo');
    });
    await act(async () => {
      await result.current.retry();
      await result.current.retry();
      await result.current.retry();
    });

    expect(getWeather).toHaveBeenCalledTimes(3);
    expect(result.current.status).toBe('error');
  });
});
