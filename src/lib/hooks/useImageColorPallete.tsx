import React from 'react';
import { getColors } from 'react-native-image-colors';
import { colors } from '../colors';

const initialColors: [] | string[] = [];

export function useImageColorPallete(url: string) {
  const [colours, setColours] = React.useState(initialColors);

  React.useEffect(() => {
    const fetchColors = async () => {
      const result = await getColors(url, {
        fallback: colors.black,
        pixelSpacing: 5,
      });

      switch (result.platform) {
        case 'android':
        case 'web':
          const newColorsPallete = [
            result.lightVibrant,
            result.dominant,
            result.vibrant,
            result.darkVibrant,
          ];
          setColours(newColorsPallete);
          break;
        case 'ios':
          const newColorsPalleteIOS = [
            result.background,
            result.detail,
            result.primary,
            result.secondary,
          ];
          setColours(newColorsPalleteIOS);
          break;
        default:
          throw new Error('Unexpected platform');
      }
    };

    fetchColors();
  }, [url]);

  return [colours];
}
