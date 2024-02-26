import React from 'react';
import { View } from 'react-native';
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
    ></View>
  );
}
