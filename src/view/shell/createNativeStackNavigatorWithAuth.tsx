import React from 'react';
import {
  createNavigatorFactory,
  ParamListBase,
  StackActionHelpers,
  StackNavigationState,
  StackRouterOptions,
  useNavigationBuilder,
  StackRouter,
  EventArg,
  StackActions,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  NativeStackView,
} from '@react-navigation/native-stack';
import type { NativeStackNavigatorProps } from '@react-navigation/native-stack/src/types';
import { useWebMediaQueries } from '../../lib/hooks/useWebMediaQueries';
import { View } from 'react-native';
import { isWeb } from '../../platform/detection';
import {
  useLoggedOutView,
  useLoggedOutViewControls,
} from '../../state/shell/logged-out';
import { useSession } from '../../state/session';
import { LoggedOut } from '../components/auth/LoggedOut';
import { DesktopLeftNav } from './desktop/LeftNav';
import { DesktopRightNav } from './desktop/RightNav';
import { BottomBarWeb } from './bottom-bar/BottomBarWeb';

type NativeStackNavigationOptionsWithAuth =
  NativeStackNavigationOptions & {
    requireAuth?: boolean;
  };

function NativeStackNavigator({
  id,
  initialRouteName,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: NativeStackNavigatorProps) {
  // --- this is copy and pasted from the original native stack navigator ---
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      NativeStackNavigationOptionsWithAuth,
      NativeStackNavigationEventMap
    >(StackRouter, {
      id,
      initialRouteName,
      children,
      screenListeners,
      screenOptions,
    });

  React.useEffect(
    () =>
      // @ts-expect-error: there may not be a tab navigator in parent
      navigation?.addListener?.('tabPress', (e: any) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as EventArg<'tabPress', true>).defaultPrevented
          ) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key]
  );

  // --- our custom logic starts here ---
  const { hasSession } = useSession();
  const activeRoute = state.routes[state.index];
  const activeDescriptor = descriptors[activeRoute.key];
  const activeRouteRequiresAuth =
    activeDescriptor.options.requireAuth ?? false;

  const { showLoggedOut } = useLoggedOutView();
  const { setShowLoggedOut } = useLoggedOutViewControls();

  const { isMobile } = useWebMediaQueries();

  if (activeRouteRequiresAuth && !hasSession) {
    return <LoggedOut />;
  }

  if (showLoggedOut) {
    console.log('Segundo if de AuthContext');
    return <LoggedOut onDismiss={() => setShowLoggedOut(false)} />;
  }

  // This is an object containing descriptors for each route
  // with the route keys as its properties.
  // https://reactnavigation.org/docs/custom-navigators/#usenavigationbuilder
  const newDescriptors: typeof descriptors = {};

  for (let key in descriptors) {
    const descriptor = descriptors[key];
    const requireAuth = descriptor.options.requireAuth ?? false;

    newDescriptors[key] = {
      ...descriptor,
      render() {
        if (requireAuth && !hasSession) {
          return <View />;
        } else {
          return descriptor.render();
        }
      },
    };
  }

  return (
    <NavigationContent>
      <NativeStackView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={newDescriptors}
      />
      {(isWeb || isMobile) && <BottomBarWeb />}
    </NavigationContent>
  );
}

export const createNativeStackNavigatorWithAuth =
  createNavigatorFactory<
    StackNavigationState<ParamListBase>,
    NativeStackNavigationOptionsWithAuth,
    NativeStackNavigationEventMap,
    typeof NativeStackNavigator
  >(NativeStackNavigator);
