import { StyleProp, ViewStyle } from 'react-native';
import { Svg, Path, G, Circle } from 'react-native-svg';

export function HomeIcon({
  size,
  style,
  strokeWidth,
  color,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
}) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      height={size || '24'}
      width={size || '24'}
      id="Home-1--Streamline-Plump"
      style={style}
    >
      <G id="Home-1--Streamline-Plump">
        <Path
          id="Vector 705"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12.56953125 1.9500000000000002c3.39140625 1.50515625 5.96203125 3.4828124999999996 7.2909375 4.625156250000001 0.67171875 0.5775 1.0462500000000001 1.4085937499999999 1.0921875 2.2931250000000003C21.016875 10.082812500000001 21.09375 11.98359375 21.09375 14.0625c0 1.599375 -0.04546875 3.1434375 -0.09562499999999999 4.356093749999999a2.66625 2.66625 0 0 1 -2.5837499999999998 2.5640625c-1.621875 0.056249999999999994 -4.02890625 0.11109374999999999 -7.164375000000001 0.11109374999999999s-5.54203125 -0.0553125 -7.164375000000001 -0.110625a2.66625 2.66625 0 0 1 -2.5837499999999998 -2.5640625A107.59031250000001 107.59031250000001 0 0 1 1.40625 14.0625c0 -2.0789062499999997 0.07734375 -3.9796875000000003 0.140625 -5.19421875 0.046875 -0.88453125 0.4209375 -1.7156250000000002 1.0926562499999999 -2.2931250000000003 1.32890625 -1.1428125 3.9000000000000004 -3.1199999999999997 7.2909375 -4.625156250000001a3.25359375 3.25359375 0 0 1 2.6390625 0Z"
          strokeWidth={strokeWidth || '2'}
        ></Path>
        <Path
          id="Vector 1068"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7.5 17.8125 7.5 0"
          strokeWidth={strokeWidth || '2'}
        ></Path>
      </G>
    </Svg>
  );
}

export function HomeIconSolid({
  size,
  style,
  strokeWidth,
  color,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
}) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      height={size || '24'}
      width={size || '24'}
      id="Home-1--Streamline-Plump"
      style={style}
    >
      <G id="Home-1--Streamline-Plump">
        <Path
          id="Subtract"
          fill={color}
          fillRule="evenodd"
          d="M10.284 1.406a4.123 4.123 0 0 1 3.432 0c3.8825 1.778 6.7755 4.321 8.1685 5.693 0.751 0.7395 1.1525 1.7255 1.209 2.743 0.069 1.2535 0.1565 3.2865 0.1565 5.5795 0 1.618 -0.0435 3.106 -0.0935 4.282a3.5725 3.5725 0 0 1 -3.4635 3.427c-1.739 0.06 -4.3235 0.1195 -7.693 0.1195 -3.37 0 -5.954 -0.06 -7.693 -0.1195a3.5725 3.5725 0 0 1 -3.4635 -3.427 102.055 102.055 0 0 1 -0.0935 -4.282c0 -2.293 0.0875 -4.326 0.1565 -5.5795 0.0565 -1.0175 0.458 -2.0035 1.209 -2.743 1.393 -1.372 4.286 -3.915 8.1685 -5.693ZM8 18a1 1 0 1 0 0 2h8a1 1 0 1 0 0 -2H8Z"
          clipRule="evenodd"
          strokeWidth={strokeWidth || '2'}
        ></Path>
      </G>
    </Svg>
  );
}

export function SearchIcon({
  size,
  style,
  strokeWidth,
  color,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
}) {
  return (
    <Svg
      height={size || '24'}
      width={size || '24'}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth || '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      id="lucide lucide-search"
      style={style}
    >
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

export function SearchIconSolid({
  size,
  style,
  strokeWidth,
  color,
  circleColor,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
  circleColor?: string;
}) {
  return (
    <Svg
      height={size || '24'}
      width={size || '24'}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth || '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      id="lucide lucide-search"
      style={style}
    >
      <Circle
        fill={circleColor || 'currentColor'}
        cx="11"
        cy="11"
        r="8"
      />
      <Path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

export function MusicIcon({
  size,
  style,
  strokeWidth,
  color,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
}) {
  return (
    <Svg
      height={size || '24'}
      width={size || '24'}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth || '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      id="lucide lucide-music"
      style={style}
    >
      <Path d="M9 18V5l12-2v13" />
      <Circle cx="6" cy="18" r="3" />
      <Circle cx="18" cy="16" r="3" />
    </Svg>
  );
}

export function MusicIconSolid({
  size,
  style,
  strokeWidth,
  color,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
}) {
  return (
    <Svg
      height={size || '24'}
      width={size || '24'}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth || '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      id="lucide lucide-music"
      style={style}
    >
      <Path d="M9 18V5l12-2v13" />
      <Circle fill={color} cx="6" cy="18" r="3" />
      <Circle fill={color} cx="18" cy="16" r="3" />
    </Svg>
  );
}

export function UserIcon({
  size,
  style,
  strokeWidth,
  color,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
}) {
  return (
    <Svg
      height={size || '24'}
      width={size || '24'}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth || '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      id="lucide lucide-user"
      style={style}
    >
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function UserIconSolid({
  size,
  style,
  strokeWidth,
  color,
}: {
  size?: number;
  style: StyleProp<ViewStyle>;
  strokeWidth?: number;
  color: string;
}) {
  return (
    <Svg
      height={size || '24'}
      width={size || '24'}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth || '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      id="lucide lucide-user"
      style={style}
    >
      <Path
        fill={color}
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      />
      <Circle fill={color} cx="12" cy="7" r="4" />
    </Svg>
  );
}
