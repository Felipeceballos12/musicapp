import { StyleSheet, View, Text, Pressable } from 'react-native';
import { sty } from '../../../../lib/styles';
import { colors } from '../../../../lib/colors';

export function ErrorScreen({
  title,
  message,
  details,
  onPressTryAgain,
  testID,
}: {
  title: string;
  message: string;
  details?: string;
  onPressTryAgain?: () => void;
  testID?: string;
}) {
  return (
    <View testID={testID} style={[styles.outer, sty.px16, sty.py32]}>
      <View style={[styles.errorIconContainer, sty.mb12]}>
        <View
          style={[
            styles.errorIcon,
            {
              backgroundColor: colors.black,
            },
          ]}
        ></View>
      </View>
      <Text style={[styles.title]}>{title}</Text>
      <Text style={[styles.message, sty.mb20]}>{message}</Text>
      {details && (
        <Text testID={`${testID}-details`} style={[styles.details]}>
          {details}
        </Text>
      )}
      {onPressTryAgain && (
        <View style={styles.btnContainer}>
          <Pressable
            testID="errorScreenTryAgainButton"
            style={[styles.btn]}
            onPress={onPressTryAgain}
            accessibilityLabel="Retry"
            accessibilityHint="Retries the last action, which errored out"
          >
            <Text style={[styles.btnText]}>Try again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconContainer: {
    alignItems: 'center',
  },
  errorIcon: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
  },
  details: {
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  btnContainer: {
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnText: {
    marginLeft: 5,
  },
});
