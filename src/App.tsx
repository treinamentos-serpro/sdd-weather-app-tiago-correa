import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import LocationResults from './components/LocationResults';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const contentRef = useRef<HTMLElement>(null);

  const { cities, data, error, retry, search, selectCity, status } = useWeather();

  useEffect(() => {
    if (status !== 'idle' && status !== 'loading') {
      contentRef.current?.focus({ preventScroll: true });
    }
  }, [status]);

  function renderContent() {
    switch (status) {
      case 'loading':
        return <LoadingState />;
      case 'empty':
        return <EmptyState title="Nenhuma cidade encontrada" />;
      case 'error':
        return <ErrorState message={error ?? undefined} onRetry={retry} />;
      case 'success':
        return data ? (
          <div className="space-y-6">
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </div>
        ) : null;
      default:
        return <EmptyState />;
    }
  }

  return (
    <main className="min-h-screen bg-night-900 px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-400">
                Clima simples, onde você estiver
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Céu Aberto</h1>
            </div>
            <div className="shrink-0">
              <UnitToggle onChange={setUnit} unit={unit} />
            </div>
          </div>
          <SearchBar disabled={status === 'loading'} onSearch={search} />
          <LocationResults cities={cities} disabled={status === 'loading'} onSelect={selectCity} />
        </header>

        <section
          aria-busy={status === 'loading'}
          aria-live="polite"
          aria-label="Conteúdo meteorológico"
          ref={contentRef}
          tabIndex={-1}
        >
          {renderContent()}
        </section>
      </div>
    </main>
  );
}
