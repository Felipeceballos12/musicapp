import { StyleSheet, Text, View } from 'react-native';
import { useWebMediaQueries } from '../../../lib/hooks/useWebMediaQueries';
import { useSession } from '../../../state/session';

export function DesktopLeftNav() {
  const { hasSession, currentAccount } = useSession();
  const { isDesktop, isTablet } = useWebMediaQueries();

  if (!hasSession && !isDesktop) {
    return null;
  }

  return (
    <View style={[styles.leftNav, isTablet && styles.leftNavTablet]}>
      {hasSession ? (
        <Text>ProfileCard</Text>
      ) : isDesktop ? (
        <View style={{ paddingHorizontal: 12 }}>
          <Text>NavSignupCard</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  leftNav: {
    position: 'absolute',
    top: 10,
    // @ts-ignore web only
    right: 'calc(50vw + 312px)',
    width: 220,
    // @ts-ignore web only
    maxHeight: 'calc(100vh - 10px)',
    overflowY: 'auto',
    borderWidth: 1,
    borderColor: 'red',
  },
  leftNavTablet: {
    top: 0,
    left: 0,
    right: 'auto',
    borderRightWidth: 1,
    height: '100%',
    width: 76,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
});
