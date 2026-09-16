import { describe, expect, it } from 'vitest';
import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('%s°C converte para %s°F', (celsius, fahrenheit) => {
    expect(convertTemperature(celsius, 'fahrenheit')).toBe(fahrenheit);
  });

  it('retorna o valor original em Celsius', () => {
    expect(convertTemperature(22.4, 'celsius')).toBe(22.4);
  });
});

describe('formatTemperature', () => {
  it('arredonda o valor e inclui o símbolo da unidade', () => {
    expect(formatTemperature(22.46, 'celsius')).toBe('22.5°C');
    expect(formatTemperature(22.44, 'fahrenheit')).toBe('72.4°F');
  });
});

describe('unitLabel', () => {
  it('retorna o símbolo correto para cada unidade', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
