import EventEmitter from 'eventemitter3';
import { defaults, Schema } from './schema';
import * as store from './store';

export type { Schema, PersistedAccount } from './schema';
export { defaults } from './schema';

let _state: Schema = defaults;
const _emitter = new EventEmitter();

/**
 * Initializes and returns persisted data state, so that it can be passed to
 * the Provider.
 */
export async function init() {
  console.info('persisted state: initilizing');

  try {
    const stored: Schema | undefined = await store.read();
    if (!stored) {
      console.info('persisted state: initializing default storage');
      await store.write(defaults);
    }

    _state = stored || defaults;
    console.info('persisted state: initialized');
  } catch (e) {
    console.error(
      'persisted state: failed to load root state from storage',
      e
    );

    // AsyncStorage failure, but we can still continue in memory
    return defaults;
  }
}

export function get<K extends keyof Schema>(key: K): Schema[K] {
  return _state[key];
}

export async function write<K extends keyof Schema>(
  key: K,
  value: Schema[K]
): Promise<void> {
  try {
    _state[key] = value;
    await store.write(_state);

    // must happen on next tick, otherwise the tab will read stale storage data
    console.info(`persisted state: wrote root state to storage`, {
      updatedKey: key,
    });
  } catch (e) {
    console.error(
      'persisted state: failed to load root state from storage',
      e
    );
  }
}

export function onUpdate(cb: () => void): () => void {
  _emitter.addListener('update', cb);

  return () => _emitter.removeListener('update', cb);
}
