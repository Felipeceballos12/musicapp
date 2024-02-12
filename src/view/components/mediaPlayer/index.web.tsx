import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PressableWithHover } from '../util/PressableWithHover';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from 'lucide-react-native';
import { colors } from '@/lib/colors';
import Slider from '@react-native-community/slider';
import { useSpotify } from '@/state/playback';
import { Spotify } from '.';

export function WebPlayBack() {
  const { player, isPaused, isReady, track } = useSpotify();

  if (!isReady) {
    return (
      <View style={styles.container}>
        <View style={styles.mainWrapper}>
          <Text style={{ color: colors.neutral200 }}>
            Loading....
          </Text>
        </View>
      </View>
    );
  }

  const handlePlay = async () => {
    await player?.togglePlay();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainWrapper}>
        <Image
          source={{ uri: track.info.album.images[0].url }}
          alt=""
          style={styles.nowPlayingCover}
          resizeMethod="resize"
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
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                textTransform: 'capitalize',
                color: colors.neutral200,
              }}
            >
              {track.info.name}
            </Text>
          </View>
          <View style={{ marginTop: 4 }}>
            <Text
              style={{
                color: colors.neutral400,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {track.info.artists[0].name}
            </Text>
          </View>
          <View style={{ marginTop: 17 }}>
            <Seekbar
              player={player}
              duration={track.duration}
              position={track.position}
              isPaused={isPaused}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 25,
              marginTop: 16,
            }}
          >
            <PressableWithHover
              hoverStyle={{}}
              style={{
                width: 44,
                height: 44,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.darkNeutral250,
              }}
              onPress={() => {
                player
                  ?.previousTrack()
                  .then(() => console.log('Back'));
              }}
            >
              <SkipBack fill="#E8EAF6" color="#E8EAF6" size={28} />
            </PressableWithHover>
            <PressableWithHover
              onPress={handlePlay}
              style={{
                width: 70,
                height: 70,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                backgroundColor: colors.neutral200,
              }}
              hoverStyle={{}}
            >
              {isPaused ? (
                <Play
                  fill={colors.black}
                  color={colors.black}
                  size={24}
                  style={{ marginLeft: 4 }}
                />
              ) : (
                <Pause
                  fill={colors.black}
                  color={colors.black}
                  size={24}
                />
              )}
            </PressableWithHover>
            <PressableWithHover
              style={{
                width: 44,
                height: 44,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.darkNeutral250,
              }}
              hoverStyle={{}}
              onPress={() =>
                player?.nextTrack().then(() => console.log('Next'))
              }
            >
              <SkipForward fill="#E8EAF6" color="#E8EAF6" size={28} />
            </PressableWithHover>
          </View>
        </View>
      </View>
    </View>
  );
}

function Seekbar({
  duration,
  position,
  player,
  isPaused,
  ...rest
}: {
  duration: number;
  position: number;
  player: Spotify.Player | undefined;
  isPaused: boolean;
}) {
  const [seek, setSeek] = React.useState(0);

  React.useEffect(() => {
    setSeek(position);
  }, [position]);

  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSeek((currentSeek) => currentSeek + 1000);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on unmount
  }, [seek, isPaused]);

  return (
    <>
      <Slider
        value={seek}
        style={{
          width: '100%',
          height: 4,
          pointerEvents: 'box-only',
        }}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor={colors.neutral200}
        minimumTrackTintColor={colors.green400}
        maximumTrackTintColor={colors.neutral600}
        onSlidingComplete={(number) => {
          player?.seek(number).then(() => setSeek(number));
        }}
        {...rest}
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
          {new Date(seek).toISOString().slice(14, 19)}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.neutral200,
          }}
        >
          {new Date(duration).toISOString().slice(14, 19)}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWrapper: {
    maxWidth: 416,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingtop: 45,
    marginHorizontal: 0,
    marginVertical: 'auto',
    backgroundColor: colors.black,
    paddingVertical: 45,
    paddingHorizontal: 16,
    borderRadius: 40,
  },
  nowPlayingCover: {
    borderRadius: 8,
    marginRight: 10,
    textAlign: 'right',
    width: 355,
    height: 355,
  },
});
