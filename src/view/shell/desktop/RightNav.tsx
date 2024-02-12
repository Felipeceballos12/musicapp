import { StyleSheet, Text, View } from 'react-native';
import { useWebMediaQueries } from '../../../lib/hooks/useWebMediaQueries';
import { useSession } from '../../../state/session';

export function DesktopRightNav({
  routeName,
}: {
  routeName: string;
}) {
  const { hasSession, currentAccount } = useSession();
  const { isTablet } = useWebMediaQueries();
  if (isTablet) return null;

  return (
    <View style={styles.rightNav}>
      <View style={{ paddingVertical: 20 }}>
        {routeName === 'Search' ? (
          <View style={{ marginBottom: 18 }}>
            <Text>DesktopFeeds</Text>
          </View>
        ) : (
          <>
            {hasSession && (
              <View style={styles.desktopFeedsContainer}>
                <Text>DesktopFeeds</Text>
              </View>
            )}
          </>
        )}

        <View>
          <Text>Other Context</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightNav: {
    position: 'absolute',
    // @ts-ignore web only
    left: 'calc(50vw + 320px)',
    width: 300,
    maxHeight: '100%',
    overflowY: 'auto',
    borderWidth: 1,
    borderColor: 'blue',
  },
  desktopFeedsContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'green',
  },
});
