import React from 'react';
import { Spotify } from '@/view/components/mediaPlayer';
import { getCurrentDevice } from '../api';
import { load, save } from '../storage';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

const track = {
  name: '',
  album: {
    images: [{ url: '' }],
  },
  artists: [{ name: '' }],
};

const SPOTIFY_PLAYER_SCRIPT = 'https://sdk.scdn.co/spotify-player.js';
const SPOTIFY_NAME = 'Musicapp';

export function useSpotifyWebPlayer(
  token: string,
  getCurrentState: () => void
): [
  player: Spotify.Player | undefined
  //isLoading: boolean,
  //currentTrack: typeof track,
  //isPaused: boolean
] {
  const [player, setPlayer] = React.useState<
    Spotify.Player | undefined
  >(undefined);
  /*  const [isLoading, setLoading] = React.useState(false);
  const [currentTrack, setTrack] = React.useState(track);
  const [isPaused, setIsPaused] = React.useState(false); */

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
      const sdk = new window.Spotify.Player({
        name: SPOTIFY_NAME,
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(sdk);
    };
  }, []);

  React.useEffect(() => {
    if (player === undefined) return;

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
      getCurrentState();
      /* player
        .getCurrentState()
        .then((state: Spotify.PlaybackState | null) => {
          if (!state) {
            setLoading(false);
            return;
          }

          console.info('Get state: ', state);
          setTrack(state.track_window.current_track);
          console.info('Updated track');
          setIsPaused(state.paused);
          console.info('Updated paused');
          setLoading(true);
          console.info('Updated loading');
        }); */
    };

    player.addListener('ready', handleSpotifyReady);

    player.addListener('not_ready', handleSpotifyNotReady);

    player.addListener(
      'player_state_changed',
      handleSpotifyStateChanged
    );

    player.connect();

    return () => {
      player.removeListener('ready', handleSpotifyReady);

      player.removeListener('not_ready', handleSpotifyNotReady);

      player.removeListener(
        'player_state_changed',
        handleSpotifyStateChanged
      );
      player.disconnect();
    };
  }, [player]);

  //return [player, isLoading, currentTrack, isPaused];
  return [player];
}
