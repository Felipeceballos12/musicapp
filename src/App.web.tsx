import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './lib/react-query';
import { Shell } from './view/shell/index.web';
import {
  Provider as SessionProvider,
  useSession,
  useSessionApi,
} from './state/session';
import * as persisted from './state/persisted';
import { init as initPersistedState } from './state/persisted';
import { Provider as SpotifyProvider } from './state/playback';

const InnerApp = () => {
  const { isInitialLoad, currentAccount } = useSession();
  const { resumeSession } = useSessionApi();

  // init
  React.useEffect(() => {
    const account = persisted.get('session').currentAccount;
    resumeSession(account);
  }, [resumeSession]);

  if (isInitialLoad) return null;

  return (
    <React.Fragment>
      <SpotifyProvider>
        <SafeAreaProvider>
          <Shell />
        </SafeAreaProvider>
      </SpotifyProvider>
    </React.Fragment>
  );
};

export default function App() {
  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    initPersistedState().then(() => setReady(true));
  }, []);

  if (!isReady) return null;

  /*
   * NOTE: only nothing here can depend on other data or session state, since
   * that is set up in the InnerApp component above.
   */
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <InnerApp />
      </SessionProvider>
    </QueryClientProvider>
  );
}
