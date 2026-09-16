import { describe, expect, it } from 'vitest';
import { formatDayLabel, getShortDate } from '../../src/lib/format';

describe('formatDayLabel', () => {
  it('rotula o primeiro dia como Hoje', () => {
    expect(formatDayLabel('2026-09-16', 0)).toBe('Hoje');
  });

  it('rotula o segundo dia como Amanhã', () => {
    expect(formatDayLabel('2026-09-17', 1)).toBe('Amanhã');
  });

  it('usa o dia da semana nos demais índices', () => {
    expect(formatDayLabel('2026-09-18', 2)).toBe('sexta-feira');
  });
});

describe('getShortDate', () => {
  it('retorna dia e mês no formato dd/MM', () => {
    expect(getShortDate('2026-09-16')).toBe('16/09');
  });
});
