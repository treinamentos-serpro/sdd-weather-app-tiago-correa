import { expect, type Page, test } from '@playwright/test';

const geocodingResult = {
  id: 3451190,
  name: 'Sao Paulo',
  country: 'Brazil',
  admin1: 'Sao Paulo',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

const forecastResponse = {
  timezone: 'America/Sao_Paulo',
  current: {
    time: '2026-09-16T10:00',
    temperature_2m: 22.4,
    apparent_temperature: 22.1,
    relative_humidity_2m: 68,
    wind_speed_10m: 11.5,
    precipitation: 0,
    surface_pressure: 1015,
    weather_code: 2,
  },
  daily: {
    time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
    weather_code: [2, 61, 3, 1, 0],
    temperature_2m_min: [17, 16, 15, 16, 17],
    temperature_2m_max: [25, 22, 21, 24, 26],
    precipitation_sum: [0, 4, 1, 0, 0],
    precipitation_probability_max: [10, 70, 45, 15, 5],
  },
};

async function mockWeatherApi(page: Page, geocodingResponse: unknown) {
  let forecastRequestCount = 0;

  await page.route('**/geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({ json: geocodingResponse });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequestCount += 1;
    await route.fulfill({ json: forecastResponse });
  });

  return {
    get forecastRequestCount() {
      return forecastRequestCount;
    },
  };
}

test('busca uma cidade e alterna a temperatura para Fahrenheit', async ({ page }) => {
  const api = await mockWeatherApi(page, { results: [geocodingResult] });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Sao Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Sao Paulo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByText('22.4°C', { exact: true }).first()).toBeVisible();

  await page.getByRole('button', { name: '°F' }).click();

  await expect(page.getByText('72.3°F', { exact: true }).first()).toBeVisible();
  expect(api.forecastRequestCount).toBe(1);
});

test('mostra cidade não encontrada quando geocoding não retorna results', async ({ page }) => {
  const api = await mockWeatherApi(page, {});

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  expect(api.forecastRequestCount).toBe(0);
});

test('não consulta geocoding quando a busca contém apenas espaços', async ({ page }) => {
  let geocodingRequestCount = 0;

  await page.route('**/geocoding-api.open-meteo.com/**', async (route) => {
    geocodingRequestCount += 1;
    await route.fulfill({ json: { results: [geocodingResult] } });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('   ');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  expect(geocodingRequestCount).toBe(0);
});

test('preserva caracteres especiais na busca enviada ao geocoding', async ({ page }) => {
  let requestedName = '';

  await page.route('**/geocoding-api.open-meteo.com/**', async (route) => {
    requestedName = new URL(route.request().url()).searchParams.get('name') ?? '';
    await route.fulfill({ json: { results: [geocodingResult] } });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({ json: forecastResponse });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo & Centro');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Sao Paulo' })).toBeVisible();
  expect(requestedName).toBe('São Paulo & Centro');
});

test('mostra erro quando o forecast retorna resposta incompleta', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({ json: { results: [geocodingResult] } });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({ json: { timezone: 'America/Sao_Paulo' } });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Sao Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
});

test('renderiza o clima no fluxo principal em viewport mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockWeatherApi(page, { results: [geocodingResult] });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Sao Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Sao Paulo' })).toBeVisible();
  await expect(page.getByText('22.4°C', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
