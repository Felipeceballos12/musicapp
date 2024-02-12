import { AppState, AppStateStatus } from 'react-native';
import { QueryClient, focusManager } from '@tanstack/react-query';
import { isNative } from '../platform/detection';

focusManager.setEventListener((onFocus) => {
  if (isNative) {
    const subscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        focusManager.setFocused(status === 'active');
      }
    );

    return () => subscription.remove();
  } else if (
    typeof window !== 'undefined' &&
    window.addEventListener
  ) {
    // these handlers are a bit redundant but focus catches when the browser window
    // is blurred/focused while visibilitychange seems to only handle when the
    // window minimizes (both of them catch tab changes)
    // there's no harm to redundant fires because refetchOnWindowFocus is only
    // used with queries that employ stale data times
    const handler = () => onFocus();
    window.addEventListener('focus', handler, false);
    window.addEventListener('visibilitychange', handler, false);
    return () => {
      window.removeEventListener('visibilitychange', handler);
      window.removeEventListener('focus', handler);
    };
  }
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // NOTE
      // refetchOnWindowFocus breaks some UIs (like feeds)
      // so we only selectively want to enable this
      // -prf
      refetchOnWindowFocus: false,
      // Structural sharing between responses makes it impossible to rely on
      // "first seen" timestamps on objects to determine if they're fresh.
      // Disable this optimization so that we can rely on "first seen" timestamps.
      structuralSharing: false,
      // We don't want to retry queries by default, because in most cases we
      // want to fail early and show a response to the user. There are
      // exceptions, and those can be made on a per-query basis. For others, we
      // should give users controls to retry.
      retry: false,
    },
  },
});
