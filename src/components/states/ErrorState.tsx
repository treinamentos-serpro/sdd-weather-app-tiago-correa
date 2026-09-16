interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = 'Não foi possível carregar a previsão. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      aria-labelledby="weather-error-title"
      className="flex flex-col items-center gap-4 rounded-2xl border border-red-300/20 bg-red-950/30 p-6 text-center backdrop-blur-md"
      role="alert"
    >
      <div>
        <h2 className="text-lg font-semibold text-white" id="weather-error-title">
          Ocorreu um erro
        </h2>
        <p className="mt-1 text-sm text-white/75">{message}</p>
      </div>
      <button
        className="min-h-11 rounded-xl bg-accent-500 px-5 font-semibold text-white transition-colors hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </div>
  );
}
