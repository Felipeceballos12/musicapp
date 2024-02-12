import React from 'react';
import {
  GestureResponderEvent,
  TouchableHighlight,
} from 'react-native';

type Position = { pageX: number; pageY: number };

export default function FixedTouchableHighlight({
  onPress,
  onPressIn,
  ...props
}: React.ComponentProps<typeof TouchableHighlight>) {
  const _touchActivatePositionRef = React.useRef<Position | null>(
    null
  );

  function _onPressIn(e: GestureResponderEvent) {
    const { pageX, pageY } = e.nativeEvent;

    _touchActivatePositionRef.current = {
      pageX,
      pageY,
    };

    onPressIn?.(e);
  }

  function _onPress(e: GestureResponderEvent) {
    const { pageX, pageY } = e.nativeEvent;

    const absX = Math.abs(
      _touchActivatePositionRef.current?.pageX! - pageX
    );
    const absY = Math.abs(
      _touchActivatePositionRef.current?.pageY! - pageY
    );

    const dragged = absX > 2 || absY > 2;
    if (!dragged) {
      onPress?.(e);
    }
  }

  return (
    <TouchableHighlight
      onPressIn={_onPressIn}
      onPress={_onPress}
      {...props}
    >
      {props.children}
    </TouchableHighlight>
  );
}
