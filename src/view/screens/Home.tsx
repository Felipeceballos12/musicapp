import React from 'react';
import { View } from 'react-native';
import { WebPlayBack } from '../components/mediaPlayer/index.web';
import { colors } from '@/lib/colors';

export function HomeScreen() {
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
