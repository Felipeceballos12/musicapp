export function choose<U, T extends Record<string, U>>(
  value: keyof T,
  choices: T
): U {
  return choices[value];
}

export function dedupArray<T>(arr: T[]): T[] {
  const s = new Set(arr);
  return [...s];
}

export function parseVolumen<T>(value?: T): number {
  if (typeof value !== 'number') return 1;

  if (value > 1) return value / 100;

  return value;
}

export function convertMsOnM(duration: number): string {
  return new Date(duration).toISOString().slice(14, 19);
}

export function changeRepeatMode(number: number) {
  return (number + 1) % 3;
}

export function getIDFromURI(str: string) {
  return str.slice(str.lastIndexOf(':') + 1);
}
