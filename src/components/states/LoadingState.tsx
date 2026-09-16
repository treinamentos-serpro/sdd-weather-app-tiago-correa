interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = 'Carregando previsão do tempo...',
}: LoadingStateProps) {
  return (
    <div
      aria-label={message}
      aria-live="polite"
      className="flex min-h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/80 backdrop-blur-md"
      role="status"
    >
      <span>{message}</span>
    </div>
  );
}
