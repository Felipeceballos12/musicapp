import React from 'react';

export function useKeyDown(key: string, handle: () => Promise<void>) {
  React.useEffect(() => {
    async function handleKeyDown(e: KeyboardEvent) {
      console.info(e);
      if (e.code === key) {
        console.info('Press');
        await handle();
      }
    }

    addEventListener('keydown', handleKeyDown);

    return () => {
      removeEventListener('keydown', handleKeyDown);
    };
  }, [handle, key]);
}
