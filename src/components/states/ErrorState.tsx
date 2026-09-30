interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Mensagem de erro com ação acessível para tentar novamente. */
export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-2xl border border-red-300/20 bg-red-500/10 py-12 text-center text-white backdrop-blur-md"
    >
      <span aria-hidden="true" className="text-4xl">
        ⚠️
      </span>
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-night-900 transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
      >
        Tentar novamente
      </button>
    </div>
  );
}
