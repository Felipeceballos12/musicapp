import { View, TouchableOpacity, Text } from 'react-native';

export function SplashScreen({
  onPressSignin,
  onPressCreateAccount,
}: {
  onPressSignin: () => void;
  onPressCreateAccount: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        testID="createAccountButton"
        onPress={onPressCreateAccount}
        accessibilityRole="button"
        accessibilityLabel="Create new account"
        accessibilityHint="Opens flow to create a new Bluesky account"
      >
        <Text>Create a new account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="signInButton"
        onPress={onPressSignin}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
        accessibilityHint="Opens flow to sign into your existing Bluesky account"
      >
        <Text>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
