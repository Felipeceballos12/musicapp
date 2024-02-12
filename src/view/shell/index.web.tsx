import React from 'react';
import { View } from 'react-native';
import { RoutesContainer, FlatNavigator } from '../../Navigation';
import { ErrorBoundary } from '../components/util/ErrorBoundary';

function ShellInner() {
  return (
    <View style={{ flex: 1 }}>
      <FlatNavigator />
    </View>
  );
}

export const Shell: React.FC = function () {
  return (
    <View style={{ flex: 1 }}>
      <RoutesContainer>
        <ShellInner />
      </RoutesContainer>
    </View>
  );
};
