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
import { convertMsOnM } from '@/lib/functions';

export function WebPlayBack() {
  const { player, isPaused, isReady, track } = useSpotify();
  /*  */

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
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
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
          <View style={{ flex: 1, marginTop: 4 }}>
            <Text
              numberOfLines={1}
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
                backgroundColor: colors.darkNeutral100,
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
              //ref={buttonRef}
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
                backgroundColor: colors.darkNeutral100,
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

const Seekbar = React.memo(function Seekbar({
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
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [seek, setSeek] = React.useState<number>(position);

  React.useEffect(() => {
    setSeek(position);
  }, [position]);

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
        maximumValue={duration}
        thumbTintColor={colors.neutral200}
        minimumTrackTintColor={colors.green400}
        maximumTrackTintColor={colors.neutral600}
        onSlidingStart={() => setIsActive(true)}
        onSlidingComplete={(number) => {
          player?.seek(number).then(() => {
            setIsActive(false);
            setSeek(number);
          });
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
          {convertMsOnM(seek)}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.neutral200,
          }}
        >
          {convertMsOnM(duration)}
        </Text>
      </View>
    </>
  );
});

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
