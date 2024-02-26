import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/lib/colors';
import LinearGradient from 'react-native-linear-gradient';
import { useImageColorPallete } from '@/lib/hooks/useImageColorPallete';

function Container({
  children,
  url,
}: {
  children: React.ReactNode;
  url: string;
}) {
  const [colours] = useImageColorPallete(url);

  return (
    <LinearGradient
      colors={[colours[2], colours[3], colors.black]}
      style={styles.container}
    >
      <View style={styles.wrapper}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 416,
    width: '100%',
    marginHorizontal: 0,
    marginVertical: 'auto',
    borderRadius: 10,
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 38,
    paddingBottom: 45,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default Container;
