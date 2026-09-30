import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

/** Campo acessível para pesquisar uma cidade. */
export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const [value, setValue] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const city = value.trim();

    if (!city || disabled) {
      return;
    }

    onSearch(city);
  }

  return (
    <form
      role="search"
      aria-label="Busca de cidades"
      onSubmit={handleSubmit}
      className="min-w-0 w-full max-w-xl flex-1 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-md"
    >
      <label htmlFor={inputId} className="sr-only">
        Buscar cidade
      </label>
      <div className="flex items-center gap-3">
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Digite o nome de uma cidade"
          autoComplete="off"
          disabled={disabled}
          className="min-h-11 min-w-0 flex-1 rounded-lg bg-transparent px-3 py-2 text-white placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className="min-h-11 shrink-0 rounded-lg bg-accent-500 px-5 py-2 font-semibold text-night-900 transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
