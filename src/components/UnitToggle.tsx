import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md"
      role="group"
    >
      <button
        aria-pressed={unit === 'celsius'}
        className={`min-h-10 min-w-12 rounded-lg px-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
          unit === 'celsius'
            ? 'bg-accent-500 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onChange('celsius')}
        type="button"
      >
        °C
      </button>
      <button
        aria-pressed={unit === 'fahrenheit'}
        className={`min-h-10 min-w-12 rounded-lg px-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
          unit === 'fahrenheit'
            ? 'bg-accent-500 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onChange('fahrenheit')}
        type="button"
      >
        °F
      </button>
    </div>
  );
}
