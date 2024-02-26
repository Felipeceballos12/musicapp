import { Text, View } from 'react-native';
import { WebPlayBack } from '../components/mediaPlayer/index.web';
import { colors } from '@/lib/colors';

export function MusicScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: colors.black,
      }}
    >
      <WebPlayBack />
    </View>
  );
}
