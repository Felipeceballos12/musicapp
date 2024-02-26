import { track } from '@/state/playback';

export function heading(
  page: string,
  isPaused: boolean,
  info: typeof track
): string {
  if (isPaused) {
    return page;
  }

  if (!info.name) {
    return page;
  }

  return `${info.name} • ${info.artists[0].name}`;
}
