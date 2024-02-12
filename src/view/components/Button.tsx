import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'positive'
  | 'negative';

export type ButtonSize = 'small' | 'large';

export type VairantProps = {
  type?: ButtonType;
  size?: ButtonSize;
};

type ButtonState = {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
};

export type ButtonProps = Omit<PressableProps, 'children'> &
  VairantProps & {
    children:
      | ((props: {
          state: ButtonState;
          type?: ButtonType;
          size?: ButtonSize;
        }) => React.ReactNode)
      | React.ReactNode
      | string;
  };

export function Button({
  children,
  style,
  size,
  type,
  ...rest
}: ButtonProps) {
  const { baseStyles, hoverStyles } = React.useMemo(() => {
    const baseStyles = [];
    const hoverStyles = [];

    switch (type) {
      case 'primary':
        baseStyles.push({
          backgroundColor: `hsl(211, 99%, 53%)`,
        });
        break;
      case 'secondary':
        baseStyles.push({
          backgroundColor: `hsl(211, 22%, 85%)`,
        });
        hoverStyles.push({
          backgroundColor: 'hsl(211, 22%, 95%)',
        });
        break;
      default:
    }

    switch (size) {
      case 'large':
        baseStyles.push(
          {
            paddingTop: 12,
            paddingBottom: 12,
          },
          {
            paddingLeft: 24,
            paddingRight: 24,
          },
          {
            borderRadius: 12,
          },
          {
            gap: 8,
          }
        );
        break;
      case 'small':
        baseStyles.push(
          {
            paddingTop: 8,
            paddingBottom: 8,
          },
          {
            paddingLeft: 12,
            paddingRight: 12,
          },
          {
            borderRadius: 8,
          },
          {
            gap: 4,
          }
        );
        break;
      default:
    }

    return {
      baseStyles,
      hoverStyles,
    };
  }, [type, size]);

  const [buttonState, setState] = React.useState({
    pressed: false,
    hovered: false,
    focused: false,
  });

  const onPressIn = React.useCallback(() => {
    setState((s) => ({
      ...s,
      pressed: true,
    }));
  }, [setState]);

  const onPressOut = React.useCallback(() => {
    setState((s) => ({
      ...s,
      pressed: false,
    }));
  }, [setState]);

  const onHoverIn = React.useCallback(() => {
    setState((s) => ({
      ...s,
      hovered: true,
    }));
  }, [setState]);

  const onHoverOut = React.useCallback(() => {
    setState((s) => ({
      ...s,
      hovered: false,
    }));
  }, [setState]);

  const onFocus = React.useCallback(() => {
    setState((s) => ({
      ...s,
      focused: true,
    }));
  }, [setState]);

  const onBlur = React.useCallback(() => {
    setState((s) => ({
      ...s,
      focused: false,
    }));
  }, [setState]);

  return (
    <Pressable
      style={(state) => [
        { flexDirection: 'row' },
        { alignItems: 'center' },
        ...baseStyles,
        ...(buttonState.hovered ? hoverStyles : []),
        typeof style === 'function' ? style(state) : style,
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {typeof children === 'string' ? (
        <ButtonText type={type} size={size}>
          {children}
        </ButtonText>
      ) : typeof children === 'function' ? (
        children({ state, type, size })
      ) : (
        children
      )}
    </Pressable>
  );
}

const ButtonText = ({ type, size, children }: {}) => {
  return <Text>{children}</Text>;
};
