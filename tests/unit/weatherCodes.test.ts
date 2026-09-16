import { describe, expect, it } from 'vitest';
import { getWeatherCodeInfo } from '../../src/lib/weatherCodes';

describe('getWeatherCodeInfo', () => {
  it('retorna label e ícone para código conhecido', () => {
    expect(getWeatherCodeInfo(0)).toEqual({
      label: 'Céu limpo',
      icon: '☀️',
    });
  });

  it('retorna fallback para código desconhecido', () => {
    expect(getWeatherCodeInfo(999)).toEqual({
      label: 'Condição desconhecida',
      icon: '🌡️',
    });
  });
});
