import React from 'react';
import { Spotify } from '@/view/components/mediaPlayer';
import { useSession } from '../session';
import { getCurrentDevice } from '@/lib/api';
import { save } from '@/lib/storage';

const track = {
  name: '',
  album: {
    images: [{ url: '' }],
  },
  artists: [{ name: '' }],
};

export type PlaybackState = {
  isReady: boolean;
  player: Spotify.Player | undefined;
  track: {
    info: typeof track;
    duration: number;
    position: number;
  };
  isPaused: boolean;
};

const SpotifyContext = React.createContext<PlaybackState>({
  isReady: false,
  player: undefined,
  track: {
    info: track,
    duration: 0,
    position: 0,
  },
  isPaused: false,
});

const SPOTIFY_PLAYER_SCRIPT = 'https://sdk.scdn.co/spotify-player.js';
const SPOTIFY_NAME = 'Musicapp';

export function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<PlaybackState>({
    isReady: false,
    player: undefined,
    track: {
      info: track,
      duration: 0,
      position: 0,
    },
    isPaused: false,
  });

  const { currentAccount } = useSession();
  const token = currentAccount?.accessJwt
    ? currentAccount.accessJwt
    : '';

  const setStateAndPersist = React.useCallback(
    (fn: (prev: PlaybackState) => PlaybackState) => {
      setState(fn);
    },
    [setState]
  );

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = SPOTIFY_PLAYER_SCRIPT;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  React.useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      if (currentAccount === undefined) return;

      const sdk = new window.Spotify.Player({
        name: SPOTIFY_NAME,
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setState((currentPlayer) => {
        return {
          ...currentPlayer,
          player: sdk,
        };
      });
    };
  }, []);

  React.useEffect(() => {
    if (state.player === undefined) return;

    const handleSpotifyReady = ({
      device_id,
    }: {
      device_id: string;
    }) => {
      getCurrentDevice(device_id, token).catch((e) =>
        console.error(e)
      );
      console.log('Ready with Device ID', device_id);
    };

    const handleSpotifyNotReady = ({
      device_id,
    }: {
      device_id: string;
    }) => {
      console.log('Device ID has gone offline', device_id);
    };
    const handleSpotifyStateChanged = (
      props: Spotify.PlaybackState
    ) => {
      if (!props) return;

      if (!state.player) return;

      state.player
        .getCurrentState()
        .then((state: Spotify.PlaybackState | null) => {
          if (!state) {
            setStateAndPersist((s) => {
              return {
                ...s,
                isReady: false,
              };
            });
            return;
          }

          save('SPOTIFY_STORAGE', state);
          setStateAndPersist((s) => {
            return {
              ...s,
              track: {
                info: state.track_window.current_track,
                duration: state.duration,
                position: state.position,
              },
              isPaused: state.paused,
              isReady: true,
            };
          });
        });
    };

    const handleSpotifyError = ({ message }: Spotify.Error) => {
      console.info(message);
    };

    state.player.addListener('ready', handleSpotifyReady);

    state.player.addListener('not_ready', handleSpotifyNotReady);

    state.player.addListener(
      'player_state_changed',
      handleSpotifyStateChanged
    );

    state.player.on('initialization_error', handleSpotifyError);
    state.player.on('authentication_error', handleSpotifyError);
    state.player.on('account_error', handleSpotifyError);
    state.player.on('playback_error', handleSpotifyError);

    state.player.connect();

    return () => {
      if (state.player !== undefined) {
        state.player.removeListener('ready', handleSpotifyReady);

        state.player.removeListener(
          'not_ready',
          handleSpotifyNotReady
        );

        state.player.removeListener(
          'player_state_changed',
          handleSpotifyStateChanged
        );

        state.player.disconnect();
      }
    };
  }, [state.player]);

  const value = React.useMemo(
    () => ({
      ...state,
    }),
    [state]
  );

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  return React.useContext(SpotifyContext);
}
