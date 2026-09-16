import type { City } from '../types/weather';

interface LocationResultsProps {
  cities: City[];
  disabled?: boolean;
  onSelect: (city: City) => void;
}

export default function LocationResults({
  cities,
  disabled = false,
  onSelect,
}: LocationResultsProps) {
  if (cities.length < 2) {
    return null;
  }

  return (
    <section
      aria-labelledby="location-results-title"
      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <h2 className="text-sm font-semibold text-white" id="location-results-title">
        Escolha uma localidade
      </h2>
      <ul aria-label="Cidades encontradas" className="mt-3 grid gap-2 sm:grid-cols-2">
        {cities.map((city) => (
          <li key={`${city.id ?? city.name}-${city.latitude}-${city.longitude}`}>
            <button
              aria-label={`Selecionar ${city.name}${city.region ? `, ${city.region}` : ''}${city.country ? `, ${city.country}` : ''}`}
              className="min-h-14 w-full rounded-xl border border-white/10 bg-night-800/60 px-4 py-3 text-left text-white transition-colors hover:border-accent-400/70 hover:bg-accent-500/10 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled}
              onClick={() => onSelect(city)}
              type="button"
            >
              <span className="block font-medium">{city.name}</span>
              <span className="mt-1 block text-sm text-white/75">
                {[city.region, city.country].filter(Boolean).join(', ') ||
                  'Localidade selecionável'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
