import React from 'react';
import { View } from 'react-native';
import { colors } from '@/lib/colors';
import { useSpotify } from '@/state/playback';
import { WebPlayerLoading } from '../components/util/MediaPlayerLoading';
import { WebPlayBack } from '../components/mediaPlayer/index.web';

export function HomeScreen() {
  const { isReady } = useSpotify();

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          backgroundColor: colors.black,
        }}
      >
        <WebPlayerLoading />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: colors.black,
      }}
    >
      <WebPlayBack />
    </View>
  );
}
