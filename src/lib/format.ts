const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function parseLocalDate(isoDate: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

  if (!match) {
    throw new RangeError('Data local inválida.');
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    throw new RangeError('Data local inválida.');
  }

  return date;
}

/** Retorna o rótulo relativo ou o dia da semana para uma data local. */
export function getDayLabel(isoDate: string, index: number): string {
  if (index === 0) {
    return 'Hoje';
  }

  if (index === 1) {
    return 'Amanhã';
  }

  return WEEKDAYS[parseLocalDate(isoDate).getDay()];
}

/** Formata a data local como "12 Jun". */
export function getShortDate(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  const month = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    timeZone: 'UTC',
  })
    .format(new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)))
    .replace('.', '');

  return `${date.getDate()} ${month}`;
}
