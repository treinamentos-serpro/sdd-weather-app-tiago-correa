interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade selecionada',
  hint = 'Pesquise uma cidade para consultar a previsão do tempo.',
}: EmptyStateProps) {
  return (
    <div
      aria-labelledby="empty-state-title"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md sm:p-8"
      role="region"
    >
      <h2 className="text-xl font-semibold text-white" id="empty-state-title">
        {title}
      </h2>
      <p className="mt-2 text-sm text-white/80">{hint}</p>
    </div>
  );
}
