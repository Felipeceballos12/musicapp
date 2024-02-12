import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export const Player = React.forwardRef(function Player(
  { children }: ViewProps,
  ref: React.Ref<any>
) {
  return <View ref={ref}>{children}</View>;
});

const styles = StyleSheet.create({
  container: {},
});
