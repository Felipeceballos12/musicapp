import React from 'react';
import { Spotify } from '@/view/components/mediaPlayer';
import { useSession } from '../session';
import { getCurrentDevice } from '@/lib/api';
import { save } from '@/lib/storage';
import { boolean } from 'zod';
import { changeRepeatMode } from '@/lib/functions';

export const track = {
  uid: '',
  uri: '',
  name: '',
  album: {
    images: [{ url: '' }],
  },
  artists: [{ name: '', uri: '' }],
};

export type Track = {
  info: typeof track;
  duration: number;
  position: number;
  shuffle: boolean;
  repeatMode: number;
};

export type PlaybackState = {
  isReady: boolean;
  player: Spotify.Player | undefined;
  track: Track;
  isPaused: boolean;
  deviceID: string | undefined;
};

export type ApiPlaybackContext = {
  initTrack: (uri: string, device: string) => Promise<boolean>;
  shuffleSpotify: (
    currentDevice: string,
    isShuffle: boolean
  ) => Promise<void>;
  repeatMode: (
    currentRepeatState: number,
    currentDevice: string
  ) => Promise<void>;
  recommendations: (
    trackID: string,
    artistID: string
  ) => Promise<typeof track | undefined>;
};

const SpotifyContext = React.createContext<PlaybackState>({
  isReady: false,
  player: undefined,
  track: {
    info: track,
    duration: 0,
    position: 0,
    shuffle: false,
    repeatMode: 0,
  },
  isPaused: false,
  deviceID: undefined,
});

const ApiSpotifyContext = React.createContext<ApiPlaybackContext>({
  initTrack: async () => false,
  shuffleSpotify: async () => {},
  repeatMode: async () => {},
  recommendations: async () => track,
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
      shuffle: false,
      repeatMode: 0,
    },
    isPaused: false,
    deviceID: undefined,
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

  const initTrack = React.useCallback<
    ApiPlaybackContext['initTrack']
  >(async (uri, device) => {
    let isPlaying = false;

    try {
      const getDevices = await fetch(
        'https://api.spotify.com/v1/me/player/devices',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (getDevices.status !== 200) {
        isPlaying = false;
        return isPlaying;
      }

      const activeDevices = await getDevices.json();

      if (activeDevices.devices.length <= 0) {
        isPlaying = false;
        return isPlaying;
      }

      const hasDevice = activeDevices.devices.filter(
        ({ id, is_active }: { id: string; is_active: boolean }) => {
          return id === device && is_active;
        }
      );

      if (hasDevice.length <= 0) {
        isPlaying = false;
        return isPlaying;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?` +
          new URLSearchParams({
            device_id: device,
          }).toString(),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [uri],
          }),
        }
      );

      if (response.status !== 202) {
        isPlaying = false;
        return isPlaying;
      }

      isPlaying = true;
      return isPlaying;
    } catch (err) {
      isPlaying = false;
      return isPlaying;
    }

    /* https://api.spotify.com/v1/me/player/play?device_id=${device} */
  }, []);

  const shuffleSpotify = React.useCallback<
    ApiPlaybackContext['shuffleSpotify']
  >(async (currentDevice, isShuffle) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffle}&device_id=${currentDevice}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.info({ response });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const repeatMode = React.useCallback<
    ApiPlaybackContext['repeatMode']
  >(async (currentRepeatState, currentDevice) => {
    try {
      const repeatState = ['off', 'context', 'track'];
      const newRepeatState = changeRepeatMode(currentRepeatState);

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/repeat?state=${repeatState[newRepeatState]}&device_id=${currentDevice}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.info({ response });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const recommendations = React.useCallback<
    ApiPlaybackContext['recommendations']
  >(async (trackID, artistID) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${artistID}&seed_tracks=${trackID}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) return;

      const nextTracks = await response.json();
      return nextTracks.tracks;
    } catch (err) {
      console.error(err);
    }
  }, []);

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
      getCurrentDevice(device_id, token)
        .then((response) => {
          if (response.status !== 204) return;
        })
        .catch((e) => console.error(e));

      setState((currentState) => {
        return {
          ...currentState,
          deviceID: device_id,
        };
      });

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
                shuffle: state.shuffle,
                repeatMode: state.repeat_mode,
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
        state.player.removeListener('ready');

        state.player.removeListener('not_ready');

        state.player.removeListener('player_state_changed');

        state.player.disconnect();
      }
    };
  }, [state.player]);

  const value = React.useMemo(() => {
    return {
      ...state,
    };
  }, [state]);

  const api = React.useMemo(
    () => ({
      initTrack,
      shuffleSpotify,
      repeatMode,
      recommendations,
    }),
    [initTrack, shuffleSpotify, repeatMode, recommendations]
  );

  return (
    <SpotifyContext.Provider value={value}>
      <ApiSpotifyContext.Provider value={api}>
        {children}
      </ApiSpotifyContext.Provider>
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  return React.useContext(SpotifyContext);
}

export function useSpotifyApi() {
  return React.useContext(ApiSpotifyContext);
}
