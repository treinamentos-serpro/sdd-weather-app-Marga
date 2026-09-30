interface EmptyStateProps {
  title: string;
  hint: string;
}

/** Orientação inicial ou mensagem para uma lista sem resultados. */
export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-12 text-center text-white/80 backdrop-blur-md"
    >
      <span aria-hidden="true" className="text-4xl">
        🌍
      </span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-sm text-white/60">{hint}</p>
    </div>
  );
}
