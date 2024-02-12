export function clamp(y: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, y));
}
