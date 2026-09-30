import type { Unit } from '../types/weather';

/** Converte uma temperatura em Celsius para Fahrenheit. */
export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/** Converte um valor Celsius para a unidade escolhida, sem arredondar. */
export function convertTemperature(celsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? toFahrenheit(celsius) : celsius;
}

/** Formata a temperatura arredondada para apresentação. */
export function formatTemperature(celsius: number, unit: Unit): string {
  const value = convertTemperature(celsius, unit);
  const rounded = Math.sign(value) * Math.floor(Math.abs(value) + 0.5);
  return `${rounded}°`;
}

/** Retorna o símbolo da unidade selecionada. */
export function unitLabel(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}
