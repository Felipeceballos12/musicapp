import React from 'react';
import { View } from 'react-native';
import { RoutesContainer, FlatNavigator } from '../../Navigation';
import { ErrorBoundary } from '../components/util/ErrorBoundary';
import { colors } from '@/lib/colors';

function ShellInner() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <FlatNavigator />
    </View>
  );
}

export const Shell: React.FC = function () {
  return (
    <View style={{ height: '100%', backgroundColor: colors.black }}>
      <RoutesContainer>
        <ShellInner />
      </RoutesContainer>
    </View>
  );
};
