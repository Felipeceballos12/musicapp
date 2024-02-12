import React, { useRef } from 'react';
import { Spotify } from '@/view/components/mediaPlayer';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
    PlayerInstance: Spotify.Player;
  }
}
const SPOTIFY_PLAYER_SCRIPT = 'https://sdk.scdn.co/spotify-player.js';
const SPOTIFY_NAME = 'Web Playback SDK';
// Placeholder
window.onSpotifyWebPlaybackSDKReady = () => {};

function WebPlayBackLoading(props: any) {
  React.useEffect(() => {
    if (window.Spotify) {
      props.setLoadingState(true);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        props.setLoadingState(true);
      };
    }
  }, []);

  return <>{props.children}</>;
}

function WebPlaybackWaitingForDevice({
  playerName,
  playerInitialVolume,
  token,
  setError,
  onPlayerStateChange,
  onPlayerReady,
  playerAutoConnect,
  children,
}: any) {
  const createSpotifyPlayerInstance = () => {
    const sdk = new window.Spotify.Player({
      name: playerName,
      volume: playerInitialVolume,
      getOAuthToken: async (callback) => {
        callback(token);
      },
    });

    sdk.on('initialization_error', (e: Spotify.Error) => {
      setError(e.message);
    });
    sdk.on('authentication_error', (e: Spotify.Error) => {
      setError(e.message);
    });
    sdk.on('account_error', (e: Spotify.Error) => {
      setError(e.message);
    });
    sdk.on('playback_error', (e: Spotify.Error) => {
      setError(e.message);
    });
    sdk.on('player_state_changed', (state: Spotify.PlaybackState) => {
      if (onPlayerStateChange) onPlayerStateChange(state);
    });
    sdk.on('ready', (data: Spotify.WebPlaybackInstance) => {
      if (onPlayerReady) onPlayerReady(data);
      const iframe = document.querySelector(
        'iframe[src="https://sdk.scdn.co/embedded/index.html"]'
      ) as HTMLIFrameElement;

      if (iframe) {
        iframe.style.display = 'block';
        iframe.style.position = 'absolute';
        iframe.style.top = '-1000px';
        iframe.style.left = '-1000px';
      }
    });

    window.PlayerInstance = sdk;

    if (playerAutoConnect) {
      sdk.connect();
    }
  };

  React.useEffect(() => {
    if (!window.Spotify.Player) {
      createSpotifyPlayerInstance();
    }
  }, []);

  return <>{children}</>;
}

function WebPlaybackScreen(props: any) {
  return <>{props.children}</>;
}

function WebPlayback(props: any) {
  const interval = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const [error, setError] = React.useState(null);

  const setLoadingState = (loadingState: boolean) => {
    setLoaded(loadingState);

    if (!interval.current) {
      interval.current = setInterval(async () => {
        if (window.Spotify.Player) {
          let state = await window.PlayerInstance.getCurrentState();
          setSelected(state !== null);
          if (props.onPlayerStateChange)
            props.onPlayerStateChange(state);
        }
      }, 100);
    }
  };

  React.useEffect(() => {
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  const getTypeName = (props: any) => {
    let prop_keys = Object.keys(props);
    if (prop_keys.includes('Error')) return 'Error';
    if (prop_keys.includes('Loading')) return 'Loading';
    if (prop_keys.includes('WaitingForDevice'))
      return 'WaitingForDevice';
    if (prop_keys.includes('Player')) return 'Player';
    throw new Error(`Unrecognised WebPlayback.Screen type`);
  };

  const childrenWithAddedProps = () => {
    return React.Children.map(props.children, (child) => {
      let child_type = getTypeName(child.props);

      switch (child_type) {
        case 'Error':
          return React.cloneElement(child, {
            errorMessage: error,
          });
        case 'Loading':
          return (
            <WebPlayBackLoading
              Loading
              setLoadingState={setLoadingState}
            >
              {child.props.children}
            </WebPlayBackLoading>
          );
        case 'WaitingForDevice':
          //return child;

          return (
            <WebPlaybackWaitingForDevice WaitingForDevice {...props}>
              {child.props.children}
            </WebPlaybackWaitingForDevice>
          );
        case 'Player':
          return (
            <WebPlaybackScreen Player {...props}>
              {child}
            </WebPlaybackScreen>
          );
        // TODO: Send state as a props for better developer UX
        //return child;
        default:
          throw new Error(
            `Unrecognised WebPlayback.Screen type - ${child_type}`
          );
      }
    });
  };

  const getScreenByTypeName = (type_name: any) => {
    return childrenWithAddedProps().filter((child: any) => {
      return type_name === getTypeName(child.props);
    })[0];
  };

  return (
    <>
      {error && getScreenByTypeName('Error')}
      {!loaded && getScreenByTypeName('Loading')}
      {loaded && !selected && getScreenByTypeName('WaitingForDevice')}
      {loaded && selected && getScreenByTypeName('Player')}
    </>
  );
}

export { WebPlaybackScreen, WebPlayback };

// WEBPACK FOOTER //
// ./src/spotify/spotify-web-playback.js

/* class WebPlaybackLoading extends Component {
  componentWillMount = () => {
    if (window.Spotify) {
      this.props.setLoadingState(true);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        this.props.setLoadingState(true);
      };
    }
  };

  render = () => {
    return this.props.children;
  };
} */
