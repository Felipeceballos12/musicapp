import { colors } from '@/lib/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    maxWidth: 500,
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    margin: 'auto',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.neutral200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomBarWeb: {
    // @ts-ignore web-only
    position: 'fixed',
  },
  ctrl: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 4,
  },
  ctrlIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  homeIcon: {
    top: 0,
  },
});
