import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import {
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { NavigationProp } from 'lib/routes/types';

export function NotFoundScreen() {
  const navigation = useNavigation<NavigationProp>();

  const canGoBack = navigation.canGoBack();
  console.log(canGoBack);
  const onPressHome = React.useCallback(() => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
      console.log(navigation);
      navigation.dispatch(StackActions.popToTop());
    }
  }, [navigation, canGoBack]);

  return (
    <View testID="notFoundView" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ marginBottom: 10, fontSize: 24 }}>
          Page not found
        </Text>
        <Text style={{ marginBottom: 10, fontSize: 18 }}>
          We're sorry! We can't find the page you were looking for.
        </Text>
        <Pressable onPress={onPressHome}>
          <Text>{canGoBack ? 'Go back' : 'Go home'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
    height: '100%',
  },
});
