import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../../../state/session';
import {
  useNavigationState,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { getCurrentRoute, isTab } from '../../../lib/routes/helpers';
import { Link } from '../../components/util/Link';
import { styles } from './BottomBarStyle';
import Animated from 'react-native-reanimated';
import { Library } from 'lucide-react-native';
import { clamp } from '../../../lib/numbers';
import { colors } from '@/lib/colors';
import { NavigationProp } from '@/lib/routes/types';
import {
  HomeIcon,
  HomeIconSolid,
  MusicIcon,
  MusicIconSolid,
  SearchIcon,
  SearchIconSolid,
} from '@/lib/icons';
import { useSpotify } from '@/state/playback';
import LinearGradient from 'react-native-linear-gradient';
import { useImageColorPallete } from '@/lib/hooks/useImageColorPallete';
import { Image } from 'expo-image';
import {
  Skip,
  TogglePLay,
  TrackArtist,
  TrackName,
} from '@/view/components/mediaPlayer/index.web';
import { PressableWithHover } from '@/view/components/util/PressableWithHover';
import { MiniWebPlayerLoading } from '@/view/components/util/MediaPlayerLoading';

function InnerBottomBarWeb() {
  const { hasSession, currentAccount } = useSession();
  const safeAreInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.menuBar,
        { paddingBottom: clamp(safeAreInsets.bottom, 15, 30) },
      ]}
    >
      <NavItem routeName="Home" href="/">
        {({ isActive }) => {
          const Icon = isActive ? (
            <HomeIconSolid
              color={colors.neutral200}
              size={27}
              style={[styles.ctrlIcon, styles.homeIcon]}
            />
          ) : (
            <HomeIcon
              color="rgba(179, 185, 196, 0.8)"
              style={[styles.ctrlIcon, styles.homeIcon]}
            />
          );

          return <>{Icon}</>;
        }}
      </NavItem>
      <NavItem routeName="Search" href="/search">
        {({ isActive }) => {
          const Icon = isActive ? (
            <SearchIconSolid
              color={colors.neutral200}
              circleColor="transparent"
              size={27}
              style={[styles.ctrlIcon, styles.homeIcon]}
            />
          ) : (
            <SearchIcon
              color="rgba(179, 185, 196, 0.8)"
              style={[styles.ctrlIcon, styles.homeIcon]}
            />
          );

          return <>{Icon}</>;
        }}
      </NavItem>
      {hasSession && (
        <>
          {/* <NavItem routeName="MyMusic" href="/mymusic">
            {({ isActive }) => {
              const Icon = isActive ? (
                <MusicIconSolid
                  color={colors.neutral200}
                  size={27}
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              ) : (
                <MusicIcon
                  color="rgba(179, 185, 196, 0.8)"
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              );

              return <>{Icon}</>;
            }}
          </NavItem> */}
          <NavItem routeName="Library" href="/library">
            {({ isActive }) => {
              const Icon = isActive ? (
                <Library
                  color={colors.neutral200}
                  size={27}
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              ) : (
                <Library
                  color="rgba(179, 185, 196, 0.8)"
                  size={24}
                  style={[styles.ctrlIcon, styles.homeIcon]}
                />
              );

              return <>{Icon}</>;
            }}
          </NavItem>
        </>
      )}
    </View>
  );
}

export function BottomBarWeb() {
  const { hasSession } = useSession();
  const currentRoute = useNavigationState((state) => {
    if (!state) {
      return { name: 'Home' };
    }

    return getCurrentRoute(state);
  });

  return (
    <Animated.View style={[styles.bottomBar, styles.bottomBarWeb]}>
      {hasSession ? (
        <>
          {currentRoute.name !== 'Home' && <MiniWebPlayer />}
          <InnerBottomBarWeb />
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

function MiniWebPlayer() {
  const { track } = useSpotify();

  if (!track.info.uri) {
    return <MiniWebPlayerLoading />;
  }

  return (
    <MiniWebPlayerContainer url={track.info.album.images[2].url}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: track.info.album.images[0].url }}
          alt=""
          style={{ width: 60, height: 60, borderRadius: 5 }}
          contentFit="cover"
          transition={250}
        />
        <View style={{ flex: 1 }}>
          <TrackName fontSize={16} fontWeight="400" />
          <TrackArtist
            fontSize={14}
            fontWeight="400"
            color={colors.neutral400}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <TogglePLay
          btnSize={60}
          iconSize={24}
          color={colors.neutral300}
        />
        <Skip
          mode="forward"
          btnSize={60}
          iconSize={24}
          color={colors.neutral300}
        />
      </View>
    </MiniWebPlayerContainer>
  );
}

function MiniWebPlayerContainer({
  children,
  url,
}: {
  children: React.ReactNode;
  url: string;
}) {
  const [colours] = useImageColorPallete(url);
  const navigation = useNavigation<NavigationProp>();

  return (
    <PressableWithHover
      hoverStyle={{}}
      style={styles.miniWebPlayerBtn}
      onPress={() => navigation.dispatch(StackActions.push('Home'))}
    >
      <LinearGradient
        colors={[colours[2], 'rgba(0,0,0,0.8)']}
        style={styles.miniWebPlayerContainer}
      >
        <View style={styles.miniWebPlayerWrapper}>{children}</View>
      </LinearGradient>
    </PressableWithHover>
  );
}
