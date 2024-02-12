import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../../../state/session';
import { useNavigationState } from '@react-navigation/native';
import { getCurrentRoute, isTab } from '../../../lib/routes/helpers';
import { Link } from '../../components/util/Link';
import { styles } from './BottomBarStyle';
import Animated from 'react-native-reanimated';
import {
  Home,
  Search,
  Music,
  Library,
  User,
} from 'lucide-react-native';
import { clamp } from '../../../lib/numbers';
import { colors } from '@/lib/colors';

export function BottomBarWeb() {
  const { hasSession, currentAccount } = useSession();
  const safeAreInsets = useSafeAreaInsets();
  return (
    <Animated.View
      style={[
        styles.bottomBar,
        { paddingBottom: clamp(safeAreInsets.bottom, 15, 30) },
      ]}
    >
      {hasSession ? (
        <>
          <NavItem routeName="Home" href="/">
            {({ isActive }) => {
              const Icon = isActive ? (
                <Home
                  strokeWidth={2}
                  color={colors.green400}
                  size={27}
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              ) : (
                <Home
                  color={colors.neutral200}
                  size={24}
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              );

              return <>{Icon}</>;
            }}
          </NavItem>
          <NavItem routeName="Search" href="/search">
            {({ isActive }) => {
              const Icon = isActive ? (
                <Search
                  strokeWidth={2}
                  color={colors.green400}
                  size={27}
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              ) : (
                <Search
                  color={colors.neutral200}
                  size={24}
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              );

              return <>{Icon}</>;
            }}
          </NavItem>
          {hasSession && (
            <>
              <NavItem routeName="MyMusic" href="/mymusic">
                {({ isActive }) => {
                  const Icon = isActive ? (
                    <Music
                      strokeWidth={2}
                      color={colors.green400}
                      size={27}
                      style={[styles.ctrlIcon, styles.homeIcon]}
                    />
                  ) : (
                    <Music
                      color={colors.neutral200}
                      size={24}
                      style={[styles.ctrlIcon, styles.homeIcon]}
                    />
                  );

                  return <>{Icon}</>;
                }}
              </NavItem>
              <NavItem routeName="Library" href="/library">
                {({ isActive }) => {
                  const Icon = isActive ? (
                    <Library
                      strokeWidth={2}
                      color={colors.green400}
                      size={27}
                      style={[styles.ctrlIcon, styles.homeIcon]}
                    />
                  ) : (
                    <Library
                      color={colors.neutral200}
                      size={24}
                      style={[styles.ctrlIcon, styles.homeIcon]}
                    />
                  );

                  return <>{Icon}</>;
                }}
              </NavItem>
              <NavItem
                routeName="Profile"
                href={
                  currentAccount ? `/profile/felipeCeballos` : '/'
                }
              >
                {({ isActive }) => {
                  const Icon = isActive ? (
                    <User
                      strokeWidth={2}
                      color={colors.green400}
                      size={27}
                      style={[styles.ctrlIcon, styles.homeIcon]}
                    />
                  ) : (
                    <User
                      color={colors.neutral200}
                      size={24}
                      style={[styles.ctrlIcon, styles.homeIcon]}
                    />
                  );

                  return <>{Icon}</>;
                }}
              </NavItem>
            </>
          )}
        </>
      ) : (
        <>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 14,
              paddingBottom: 2,
              paddingLeft: 14,
              paddingRight: 6,
              gap: 8,
            }}
          >
            <Text>No tienes Session</Text>
          </View>
        </>
      )}
    </Animated.View>
  );
}

const NavItem: React.FC<{
  children: (props: { isActive: boolean }) => React.ReactNode;
  href: string;
  routeName: string;
}> = ({ children, href, routeName }) => {
  const currentRoute = useNavigationState((state) => {
    if (!state) {
      return { name: 'Home' };
    }

    return getCurrentRoute(state);
  });

  const isActive =
    currentRoute.name === 'Profile'
      ? isTab(currentRoute.name, routeName)
      : isTab(currentRoute.name, routeName);

  return (
    <Link href={href} style={styles.ctrl} navigationAction="navigate">
      {children({ isActive })}
    </Link>
  );
};
