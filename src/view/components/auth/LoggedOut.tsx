import React from 'react';
import { Pressable, View, Text } from 'react-native';
import {
  useLoggedOutView,
  useLoggedOutViewControls,
} from '../../../state/shell/logged-out';
import { useWebMediaQueries } from '../../../lib/hooks/useWebMediaQueries';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../../lib/routes/types';
import { isIOS, isNative } from '../../../platform/detection';
import { Feather } from '@expo/vector-icons';
import { Login } from './login/Login';
import { useSession } from '../../../state/session';

type LoggedOutProps = {
  onDismiss?: () => void;
};

export function LoggedOut({ onDismiss }: LoggedOutProps) {
  const { hasSession } = useSession();
  const { requestedAccountSwitchTo } = useLoggedOutView();

  const { isMobile } = useWebMediaQueries();
  const { clearRequestedAccount } = useLoggedOutViewControls();
  const navigation = useNavigation<NavigationProp>();

  const onPressDismiss = React.useCallback(() => {
    if (onDismiss) {
      onDismiss();
    }

    clearRequestedAccount();
  }, [clearRequestedAccount, onDismiss]);

  const onPressSearch = React.useCallback(() => {
    navigation.navigate('SearchTab');
  }, [navigation]);

  return (
    <View
      testID="noSessionView"
      style={{ flex: 1, paddingTop: onDismiss && isMobile ? 40 : 0 }}
    >
      {onDismiss ? (
        <Pressable
          accessibilityHint="Go back"
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={{
            position: 'absolute',
            top: isIOS ? 0 : 20,
            right: 20,
            padding: 10,
            zIndex: 100,
            backgroundColor: 'white',
            borderRadius: 100,
            borderWidth: 2,
            borderColor: 'purple',
          }}
          onPress={onPressDismiss}
        >
          <Feather name="x" size={12} color="black" />
        </Pressable>
      ) : isNative && !hasSession ? (
        <Pressable
          accessibilityHint="Search for users"
          accessibilityLabel="Search for users"
          accessibilityRole="button"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            position: 'absolute',
            top: 20,
            right: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            zIndex: 100,
            backgroundColor: 'black',
            borderRadius: 100,
            borderWidth: 1,
            borderColor: 'yellow',
          }}
          onPress={onPressSearch}
        >
          <Text>Search </Text>
          <Feather name="search" size={16} color="black" />
        </Pressable>
      ) : null}

      <Login
        onPressBack={() => {
          clearRequestedAccount();
        }}
      />
    </View>
  );
}
