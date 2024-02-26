import React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from 'view/screens/Home';
import { SearchScreen } from 'view/screens/Search';
import { MusicScreen } from 'view/screens/Music';
import { LibraryScreen } from 'view/screens/Library';
import { NotFoundScreen } from 'view/screens/NotFound';
import { ProfileScreen } from 'view/screens/Profile';

import {
  AllNavigatorParams,
  FlatNavigatorParams,
  HomeTabNavigatorParams,
  RouteParams,
  State,
} from './lib/routes/types';
import { router } from './routes';
import { isNative } from './platform/detection';
import { buildStateObject } from './lib/routes/helpers';
import { createNativeStackNavigatorWithAuth } from './view/shell/createNativeStackNavigatorWithAuth';
import { colors } from './lib/colors';
import { useSpotify } from './state/playback';
import { heading } from './lib/strings/heading';

const navigationRef =
  createNavigationContainerRef<AllNavigatorParams>();

const HomeTab =
  createNativeStackNavigatorWithAuth<HomeTabNavigatorParams>();
const Flat =
  createNativeStackNavigatorWithAuth<FlatNavigatorParams>();
const Tab = createBottomTabNavigator<HomeTabNavigatorParams>();

const commonScreens = (Stack: typeof HomeTab) => {
  return (
    <>
      <Stack.Screen
        name="NotFound"
        getComponent={() => NotFoundScreen}
        options={{ title: 'Not Found' }}
      />
      <Stack.Screen
        name="Profile"
        getComponent={() => ProfileScreen}
        options={({ route }: any) => ({
          title: `@${route.params.name}`,
          animation: 'none',
        })}
      />
    </>
  );
};

/**
 * The FlatNavigator is used by Web to represent the routes
 * in a single ("flat") stack.
 */

const FlatNavigator = () => {
  const { track, isPaused } = useSpotify();
  const { info } = track;

  return (
    <Flat.Navigator
      screenOptions={{
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        headerShown: false,
        animationDuration: 250,
        contentStyle: { backgroundColor: colors.black },
      }}
    >
      <Flat.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: heading('Home', isPaused, info),
          requireAuth: true,
        }}
      />
      <Flat.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: heading('Search', isPaused, info),
          requireAuth: true,
        }}
      />
      <Flat.Screen
        name="MyMusic"
        component={MusicScreen}
        options={{
          title: heading('MyMusic', isPaused, info),
          requireAuth: true,
        }}
      />
      <Flat.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          title: heading('Library', isPaused, info),
          requireAuth: true,
        }}
      />
      {commonScreens(Flat as typeof HomeTab)}
    </Flat.Navigator>
  );
};

/**
 * The RoutesContainer should wrap all components which need access
 * to the navigation context.
 */

const LINKING = {
  prefixes: ['felipeC://', 'felipeceballos.dev'],

  getPathFromState(state: State) {
    // find the current node on the navigation tree
    let node = state.routes[state.index || 0];

    while (
      node.state?.routes &&
      typeof node.state?.index === 'number'
    ) {
      node = node.state?.routes[node.state?.index];
    }

    // build the path
    const route = router.matchName(node.name);
    if (typeof route === 'undefined') {
      return '/'; // defualt to home
    }

    return route.build((node.params || {}) as RouteParams);
  },

  getStateFromPath(path: string) {
    const [name, params] = router.matchPath(path);

    if (isNative) {
      if (name === 'Search') {
        return buildStateObject('SearchTab', 'Search', params);
      }

      if (name === 'Library') {
        return buildStateObject('LibraryTab', 'Library', params);
      }

      if (name === 'Home') {
        return buildStateObject('HomeTab', 'Home', params);
      }

      // if the path is something else, like a post, profile, or even settings, we need to initialize the home tab as pre-existing state otherwise the back button will not work
      return buildStateObject('HomeTab', name, params, [
        {
          name: 'Home',
          params: {},
        },
      ]);
    } else {
      return buildStateObject('Flat', name, params);
    }
  },
};

function RoutesContainer({ children }: React.PropsWithChildren<{}>) {
  return (
    <NavigationContainer ref={navigationRef} linking={LINKING}>
      {children}
    </NavigationContainer>
  );
}

export { FlatNavigator, RoutesContainer };
