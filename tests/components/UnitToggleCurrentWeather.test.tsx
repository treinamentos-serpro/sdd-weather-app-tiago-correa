import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import UnitToggle from '../../src/components/UnitToggle';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../../src/types/weather';

const city: City = {
  name: 'Sao Paulo',
  latitude: -23.55,
  longitude: -46.63,
};

const current: CurrentWeatherData = {
  time: '2026-09-16T10:00',
  temperatureCelsius: 0,
  apparentTemperatureCelsius: 0,
  weatherCode: 0,
};

describe('UnitToggle + CurrentWeather', () => {
  it('converte 0°C para 32°F ao clicar em Fahrenheit', async () => {
    const user = userEvent.setup();
    let unit: Unit = 'celsius';
    const onChange = vi.fn((nextUnit: Unit) => {
      unit = nextUnit;
    });

    const { rerender } = render(
      <>
        <UnitToggle onChange={onChange} unit={unit} />
        <CurrentWeather city={city} current={current} unit={unit} />
      </>,
    );

    expect(screen.getAllByText('0.0°C')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: '°F' }));
    rerender(
      <>
        <UnitToggle onChange={onChange} unit={unit} />
        <CurrentWeather city={city} current={current} unit={unit} />
      </>,
    );

    expect(onChange).toHaveBeenCalledWith('fahrenheit');
    expect(screen.getAllByText('32.0°F')).toHaveLength(2);
  });
});
