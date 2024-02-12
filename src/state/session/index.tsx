import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { refreshToken, token } from '../../lib/api';
import { useLoggedOutViewControls } from '../shell/logged-out';
import * as persisted from '../persisted/index';

export type SessionAccount = persisted.PersistedAccount;

export type SessionState = {
  isInitialLoad: boolean;
  currentAccount: SessionAccount | undefined;
};

export type StateContext = SessionState & {
  hasSession: boolean;
};

export type ApiContext = {
  getToken: (
    code: string,
    redirectUri: string,
    clientId: string,
    codeVerifier: string
  ) => Promise<void>;
  /**
   * A full logout. Clears the `currentAccount` from session, AND removes
   * access tokens from all accounts, so that returning as any user will
   * require a full login.
   */
  logout: () => Promise<void>;
  /**
   * A partial logout. Clears the `currentAccount` from session, but DOES NOT
   * clear access tokens from accounts, allowing the user to return to their
   * other accounts without logging in.
   *
   * Used when adding a new account, deleting an account.
   */
  initSession: (acount: SessionAccount) => Promise<void>;
  resumeSession: (account?: SessionAccount) => void;
  clearAccount: () => void;
  //updateAccount: (account: Partial<SessionAccount>) => void;
};

const StateContext = React.createContext<StateContext>({
  isInitialLoad: true,
  currentAccount: undefined,
  hasSession: false,
});

const ApiContext = React.createContext<ApiContext>({
  getToken: async () => {},
  logout: async () => {},
  clearAccount: () => {},
  initSession: async () => {},
  resumeSession: async () => {},
});

export function Provider({ children }: React.PropsWithChildren<{}>) {
  const queryClient = useQueryClient();
  const isDirty = React.useRef(false);
  const [state, setState] = React.useState<SessionState>({
    isInitialLoad: true,
    currentAccount: persisted.get('session').currentAccount,
  });

  const setStateAndPersist = React.useCallback(
    (fn: (prev: SessionState) => SessionState) => {
      isDirty.current = true;
      setState(fn);
    },
    [setState]
  );

  const upsertAccount = React.useCallback(
    (account: SessionAccount, expired = false) => {
      setStateAndPersist((s) => {
        return {
          ...s,
          currentAccount: expired ? undefined : account,
        };
      });
    },
    [setStateAndPersist]
  );

  const clearAccount = React.useCallback(() => {
    queryClient.clear();
    setStateAndPersist((s) => ({
      ...s,
      currentAccount: undefined,
    }));
  }, [setStateAndPersist, queryClient]);

  const getToken = React.useCallback<ApiContext['getToken']>(
    async (code, redirectUri, clientId, codeVerifier) => {
      const hasLogin = await token(
        code,
        redirectUri,
        clientId,
        codeVerifier
      );

      if (hasLogin) {
        const now = new Date();
        const expiries = new Date(
          now.getTime() + hasLogin.expires_in * 1000
        );

        const response = {
          accessJwt: hasLogin.access_token,
          refreshJwt: hasLogin.refresh_token,
          expiresIn: hasLogin.expires_in,
          expires: expiries.toString(),
        };
        const acount: SessionAccount = {
          ...response,
          codeVerifier: codeVerifier,
        };

        queryClient.clear();
        upsertAccount(acount);
      }
    },
    [queryClient, upsertAccount]
  );

  const initSession = React.useCallback<ApiContext['initSession']>(
    async (account) => {
      let canReusePrevSession = false;

      if (account.expires) {
        const didExpire = Date.now() >= Date.parse(account.expires);

        if (!didExpire) {
          canReusePrevSession = true;
        }
      }

      // Depronto no necesito tener a codeVerifier como SessionType
      const prevSession = {
        accessJwt: account.accessJwt || '',
        refreshJwt: account.refreshJwt || '',
      };

      if (canReusePrevSession) {
        console.info('session: attempting to reuse previous session');
        queryClient.clear();
        upsertAccount(account);
      } else {
        console.info(
          'session: attempting to resume using previous session'
        );

        try {
          const freshAccount = await resumeSessionWithFreshAccount();
          if (freshAccount) {
            queryClient.clear();
            upsertAccount(freshAccount);
          }

          clearAccount();
        } catch (error) {
          console.error(
            'session: resumeSessionWithFreshAccount failed: ',
            error
          );
        }
      }

      async function resumeSessionWithFreshAccount(): Promise<
        SessionAccount | undefined
      > {
        const rToken = !account.refreshJwt ? '' : account.refreshJwt;
        const hasRefreshToken = await refreshToken(rToken);
        if (hasRefreshToken.error) return undefined;

        const now = new Date();
        const expiries = new Date(
          now.getTime() + hasRefreshToken.expires_in * 1000
        );

        return {
          codeVerifier: '',
          accessJwt: hasRefreshToken.access_token,
          refreshJwt: hasRefreshToken.refresh_token,
          expiresIn: hasRefreshToken.expires_in,
          expires: expiries.toString(),
        };
      }
    },
    []
  );

  const resumeSession = React.useCallback<
    ApiContext['resumeSession']
  >(
    async (account) => {
      try {
        if (account) {
          await initSession(account);
        }
      } catch (e) {
        console.error('session: resumeSession failed', e);
      } finally {
        setState((s) => ({
          ...s,
          isInitialLoad: false,
        }));
      }
    },
    [initSession]
  );

  const logout = React.useCallback<ApiContext['logout']>(async () => {
    clearAccount();
    setStateAndPersist((s) => {
      return {
        ...s,
        currentAccount: undefined,
      };
    });
  }, [clearAccount, setStateAndPersist]);

  React.useEffect(() => {
    if (isDirty.current) {
      isDirty.current = false;
      persisted.write('session', {
        currentAccount: state.currentAccount,
      });
    }
  }, [state]);

  React.useEffect(() => {
    return persisted.onUpdate(() => {
      const session = persisted.get('session');

      console.log(`session: onUpdate: `, session);

      if (session.currentAccount) {
      }
    });
  }, [state, clearAccount, initSession]);

  const stateContext = React.useMemo(
    () => ({
      ...state,
      hasSession: !!state.currentAccount,
    }),
    [state]
  );

  const api = React.useMemo(
    () => ({
      getToken,
      logout,
      clearAccount,
      initSession,
      resumeSession,
    }),
    [getToken, logout, clearAccount, initSession, resumeSession]
  );

  return (
    <StateContext.Provider value={stateContext}>
      <ApiContext.Provider value={api}>
        {children}
      </ApiContext.Provider>
    </StateContext.Provider>
  );
}

export function useSession() {
  return React.useContext(StateContext);
}

export function useSessionApi() {
  return React.useContext(ApiContext);
}

export function useRequireAuth() {
  const { hasSession } = useSession();
  const { setShowLoggedOut } = useLoggedOutViewControls();
  //const closeAll = useCloseAllActiveElements();

  return React.useCallback(
    (fn: () => void) => {
      if (hasSession) {
        fn();
      } else {
        setShowLoggedOut(true);
      }
    },
    [hasSession, setShowLoggedOut]
  );
}

/*
import { useQuery } from 'react-query';
import axios from 'axios';

export function useToken(code: Code, redirectUri: RedirectUri) {
  return useQuery(['token', code, redirectUri], async () => {
    const code_verifier = loadString('code_verifier');

    const response = await axios.post(tokenEndpoint, `client_id=34bac0dcfa7f49d0a0cf6f8b713af47&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&code_verifier=${code_verifier}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  });
}
*/
