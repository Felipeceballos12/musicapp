import {
  NavigationState,
  PartialState,
} from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
export type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type CommonNavigatorParams = {
  NotFound: undefined;
  Profile: { name: string; hideBackButton?: boolean };
};

export type BottomTabNavigatorParams = CommonNavigatorParams & {
  HomeTab: undefined;
  SearchTab: undefined;
  MyMusicTab: undefined;
  LibraryTab: undefined;
  MyProfileTab: undefined;
};

export type HomeTabNavigatorParams = CommonNavigatorParams & {
  Home: undefined;
};

export type SearchTabNavigatorParams = CommonNavigatorParams & {
  Search: { q?: string };
};

export type MyMusicTabNavigatorParams = CommonNavigatorParams & {
  Profile: undefined;
};

export type LibraryTabNavigatorParams = CommonNavigatorParams & {
  Library: undefined;
};

export type AllNavigatorParams = CommonNavigatorParams & {
  HomeTab: undefined;
  Home: undefined;
  SearchTab: undefined;
  Search: { q?: string };
  MyMusicTab: undefined;
  MyMusic: undefined;
  LibraryTab: undefined;
  Library: undefined;
  MyProfileTab: undefined;
};

export type FlatNavigatorParams = {
  Home: undefined;
  Search: { q?: string };
  MyMusic: undefined;
  Library: undefined;
};

// NOTE
// this isn't strictly correct but it should be close enough
// a TS wizard might be able to get this 100%
// -prf
export type NavigationProp =
  NativeStackNavigationProp<AllNavigatorParams>;

export type State =
  | NavigationState
  | Omit<PartialState<NavigationState>, 'stale'>;

export type RouteParams = Record<string, string>;
export type MatchResult = { params: RouteParams };
export type Route = {
  match: (path: string) => MatchResult | undefined;
  build: (params: RouteParams) => string;
};
