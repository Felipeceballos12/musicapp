import React from 'react';
import {
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  Platform,
  Linking,
  View,
  Text,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { NavigationProp } from '../../../lib/routes/types';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { router } from '../../../routes';
import { isAndroid } from '../../../platform/detection';
import FixedTouchableHighlight from '../pager/FixedTouchableHighlight';
import { PressableWithHover } from './PressableWithHover';

type Event =
  | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  | GestureResponderEvent;

interface Props
  extends React.ComponentProps<typeof TouchableOpacity> {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  href?: string;
  title?: string;
  children?: React.ReactNode;
  hoverStyle?: StyleProp<ViewStyle>;
  noFeedback?: boolean;
  asAnchor?: boolean;
  anchorNoUnderline?: boolean;
  navigationAction?: 'push' | 'replace' | 'navigate';
}

export const Link = React.memo(function Link({
  testID,
  style,
  href,
  title,
  children,
  noFeedback,
  asAnchor,
  accessible,
  anchorNoUnderline,
  navigationAction,
  ...props
}: Props) {
  const navigation = useNavigation<NavigationProp>();
  const anchorHref = asAnchor ? sanitizeUrl(href) : undefined;

  const onPress = React.useCallback(
    (e?: Event) => {
      if (typeof href === 'string') {
        return onPressInner(
          navigation,
          sanitizeUrl(href),
          navigationAction,
          e
        );
      }
    },
    [navigation, navigationAction, href]
  );

  if (noFeedback) {
    if (isAndroid) {
      // workaround for Android not working well with left/right swipe gestures and TouchableWithoutFeedback
      // https://github.com/callstack/react-native-pager-view/issues/424
      return (
        <FixedTouchableHighlight
          testID={testID}
          onPress={onPress}
          // @ts-ignore web only -prf
          href={asAnchor ? sanitizeUrl(href) : undefined}
          accessible={accessible}
          //accessibilityRole="link"
          role="link"
          {...props}
        >
          <View style={style}>
            {
              // I need to create a Text Component, so at the moment I'm going to use the react native Text
              children ? children : <Text>{title || 'link'}</Text>
            }
          </View>
        </FixedTouchableHighlight>
      );
    }

    return (
      <TouchableWithoutFeedback
        testID={testID}
        onPress={onPress}
        accessible={accessible}
        //accessibilityRole="link"
        role="link"
        {...props}
      >
        {/* @ts-ignore web only -prf */}
        <View style={style} href={anchorHref}>
          {children ? children : <Text>{title || 'link'}</Text>}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  if (anchorNoUnderline) {
    // @ts-ignore web only -prf
    props.dataSet = props.dataSet || {};
    // @ts-ignore web only -prf
    props.dataSet.noUnderline = 1;
  }

  if (title && !props.accessibilityLabel) {
    props.accessibilityLabel = title;
  }

  const Com = props.hoverStyle ? PressableWithHover : Pressable;

  return (
    <Com
      testID={testID}
      style={style}
      onPress={onPress}
      accessible={accessible}
      //accessibilityRole="link"
      role="link"
      // @ts-ignore web only -prf
      href={anchorHref}
      {...props}
    >
      {children ? children : <Text>{title || 'link'}</Text>}
    </Com>
  );
});

// NOTE
// we can't use the onPress given by useLinkProps because it will
// match most paths to the HomeTab routes while we actually want to
// preserve the tab the app is currently in
//
// we also have some additional behaviors - closing the current modal,
// converting bsky urls, and opening http/s links in the system browser
//
// this method copies from the onPress implementation but adds our
// needed customizations
// -prf
function onPressInner(
  navigation: NavigationProp,
  href: string,
  navigationAction: 'push' | 'replace' | 'navigate' = 'push',
  e?: Event
) {
  let shouldHandle = false;
  const isLeftClick =
    // @ts-ignore Web only -prf
    Platform.OS === 'web' && (e.button == null || e.button === 0);

  const isMiddleClick =
    // @ts-ignore Web only -prf
    Platform.OS === 'web' && e.button === 1;
  const isMetaKey =
    Platform.OS === 'web' &&
    // @ts-ignore Web only -prf
    (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

  const newTab = isMetaKey || isMiddleClick;

  if (Platform.OS !== 'web' || !e) {
    shouldHandle = e ? !e.defaultPrevented : true;
  } else if (
    !e.defaultPrevented && // onPress prevented default
    (isLeftClick || isMiddleClick) && // ignore everything but left and middle clicks
    // @ts-ignore Web only -prf
    [undefined, null, '', 'self'].includes(e.currentTarget?.target) // let browser handle "target=_blank" etc.
  ) {
    e.preventDefault();
    shouldHandle = true;
  }

  if (shouldHandle) {
    if (
      newTab ||
      href.startsWith('http') ||
      href.startsWith('mailto')
    ) {
      Linking.openURL(href);
    } else {
      if (navigationAction === 'push') {
        navigation.dispatch(
          StackActions.push(...router.matchPath(href))
        );
      } else if (navigationAction === 'replace') {
        navigation.dispatch(
          StackActions.replace(...router.matchPath(href))
        );
      } else if (navigationAction === 'navigate') {
        // @ts-ignore we're not able to type check on this one -prf
        navigation.navigate(...router.matchPath(href));
      } else {
        throw Error('Unsopported navigator action.');
      }
    }
  }
}
