import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PressableWithHover } from '../util/PressableWithHover';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Repeat1,
  Repeat2,
} from 'lucide-react-native';
import { colors } from '@/lib/colors';
import Slider from '@react-native-community/slider';
import { useSpotify, useSpotifyApi } from '@/state/playback';
import { convertMsOnM } from '@/lib/functions';
import Container from './container';
import { Image } from 'expo-image';
import { useKeyDown } from '@/lib/hooks/useKeyDown';

export function WebPlayBack() {
  const { isReady, track } = useSpotify();

  if (!isReady) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.mainWrapper,
            { backgroundColor: colors.black },
          ]}
        >
          <Text style={{ color: colors.neutral200 }}>
            Loading....
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Container url={track.info.album.images[2].url}>
        <WebPlayerContent>
          <View style={{ marginTop: 17 }}>
            <Seekbar />
          </View>
          <PlaybackControls />
        </WebPlayerContent>
      </Container>
    </View>
  );
}

function Seekbar() {
  const { player, isPaused, track } = useSpotify();

  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [seek, setSeek] = React.useState<number>(track.position);

  React.useEffect(() => {
    setSeek(track.position);
  }, [track.position]);

  React.useEffect(() => {
    if (isPaused) return;

    if (!isActive) {
      const interval = setInterval(() => {
        setSeek((currentSeek) => currentSeek + 1000);
      }, 1000); // Update every second

      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, [seek, isPaused, isActive]);

  return (
    <>
      <Slider
        value={seek}
        style={{
          width: '100%',
          height: 12,
        }}
        minimumValue={0}
        onValueChange={(position) => setSeek(position)}
        maximumValue={track.duration}
        thumbTintColor={colors.neutral200}
        minimumTrackTintColor={colors.neutral200}
        maximumTrackTintColor="rgba(179, 185, 196, 0.8)"
        onSlidingStart={() => setIsActive(true)}
        onSlidingComplete={(number) => {
          player?.seek(number).then(() => {
            setIsActive(false);
            setSeek(number);
          });
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 14,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.neutral200,
          }}
        >
          {convertMsOnM(seek)}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.neutral200,
          }}
        >
          {convertMsOnM(track.duration)}
        </Text>
      </View>
    </>
  );
}

function WebPlayerContent({ children }: { children: ReactNode }) {
  const { track } = useSpotify();
  return (
    <>
      <Image
        source={{ uri: track.info.album.images[2].url }}
        alt=""
        style={styles.nowPlayingCover}
        contentFit="cover"
        transition={300}
      />
      <View
        style={{
          maxWidth: 355,
          width: '100%',
          marginTop: 32,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
      >
        <TrackName />
        <TrackArtist />
        {children}
      </View>
    </>
  );
}

export function TrackName({
  fontSize = 24,
  fontWeight = '700',
  color = colors.neutral100,
}: {
  fontSize?: number;
  fontWeight?:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  color?: string;
}) {
  const { track } = useSpotify();

  return (
    <View style={{ overflow: 'hidden' }}>
      <Text
        style={{
          fontSize: fontSize,
          fontWeight: fontWeight,
          textTransform: 'capitalize',
          color: color,
        }}
      >
        <Text numberOfLines={1}>{track.info.name}</Text>
      </Text>
    </View>
  );
}

export function TrackArtist({
  fontSize = 16,
  fontWeight = '600',
  color = 'rgba(179, 185, 196, 0.8)',
}: {
  fontSize?: number;
  fontWeight?:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  color?: string;
}) {
  const { track } = useSpotify();

  return (
    <View style={{ flex: 1, marginTop: 4 }}>
      <Text
        style={{
          //color: colors.neutral400,
          color: color,
          fontSize: fontSize,
          fontWeight: fontWeight,
        }}
      >
        {track.info.artists[0].name}
      </Text>
    </View>
  );
}

function PlaybackControls() {
  const { player, isPaused, track, deviceID } = useSpotify();
  const { shuffleSpotify, repeatMode } = useSpotifyApi();
  const device = deviceID ? deviceID : '';

  const handleShuffle = async (
    currentDevice: string,
    isShuffle: boolean
  ) => {
    await shuffleSpotify(currentDevice, isShuffle);
  };

  const handleRepeatMode = async (
    currentRepeatMode: number,
    currentDevice: string
  ) => {
    await repeatMode(currentRepeatMode, currentDevice);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 25,
        marginTop: 16,
      }}
    >
      <Pressable
        onPress={() => {
          handleShuffle(device, track.shuffle).then(() =>
            console.info('Shuffle')
          );
        }}
      >
        <Shuffle
          color={
            track.shuffle ? '#E8EAF6' : 'rgba(179, 185, 196, 0.8)'
          }
          size={24}
        />
      </Pressable>
      <PressableWithHover
        hoverStyle={{}}
        style={{
          width: 44,
          height: 44,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          player?.previousTrack().then(() => console.log('Back'));
        }}
      >
        <SkipBack
          fill="rgba(179, 185, 196, 0.8)"
          color="rgba(179, 185, 196, 0.8)"
          size={28}
        />
      </PressableWithHover>

      <TogglePLay />

      <PressableWithHover
        style={{
          width: 44,
          height: 44,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        hoverStyle={{}}
        onPress={() =>
          player?.nextTrack().then(() => console.log('Next'))
        }
      >
        <SkipForward
          fill="rgba(179, 185, 196, 0.9)"
          color="rgba(179, 185, 196, 0.8)"
          size={28}
        />
      </PressableWithHover>

      <Pressable
        onPress={() => handleRepeatMode(track.repeatMode, device)}
      >
        {track.repeatMode === 0 ? (
          <Repeat color="rgba(179, 185, 196, 0.8)" size={24} />
        ) : track.repeatMode === 1 ? (
          <Repeat2 color="#E8EAF6" size={24} />
        ) : (
          <Repeat1 color="#E8EAF6" size={24} />
        )}
      </Pressable>
    </View>
  );
}

export function TogglePLay({
  btnSize = 70,
  iconSize = 32,
  btnRadius = 50,
  color = '#E8EAF6',
}: {
  btnSize?: number;
  iconSize?: number;
  btnRadius?: number;
  color?: string;
}) {
  const { player, isPaused } = useSpotify();

  useKeyDown('Space', handlePlay);

  async function handlePlay() {
    await player?.togglePlay();
  }
  return (
    <PressableWithHover
      //ref={buttonRef}
      onPress={handlePlay}
      style={{
        width: btnSize,
        height: btnSize,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: btnRadius,
        //backgroundColor: colors.neutral200,
      }}
      hoverStyle={{
        backgroundColor: 'rgba( 232, 234, 246, 0.2)',
      }}
    >
      {isPaused ? (
        <Play
          fill={color}
          color={color}
          size={iconSize}
          style={{ marginLeft: 4 }}
        />
      ) : (
        <Pause fill={color} color={color} size={iconSize} />
      )}
    </PressableWithHover>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    marginVertical: 'auto',
  },
  nowPlayingCover: {
    alignSelf: 'center',
    borderRadius: 5,
    textAlign: 'right',
    width: 355,
    height: 355,
  },
});
