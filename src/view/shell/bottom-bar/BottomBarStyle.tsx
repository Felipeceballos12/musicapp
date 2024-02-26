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
    margin: 'auto',
  },
  bottomBarWeb: {
    // @ts-ignore web-only
    position: 'fixed',
  },
  menuBar: {
    height: 62,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.darkNeutral100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  miniWebPlayerBtn: {
    maxWidth: 416,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  miniWebPlayerContainer: {
    borderRadius: 8,
    //borderTopRightRadius: 8,
    //borderTopLeftRadius: 8,
  },
  miniWebPlayerWrapper: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)',
    //backgroundColor: 'rgba(255,255,255,0.11)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 16,
    borderRadius: 8,
    //borderTopRightRadius: 8,
    //borderTopLeftRadius: 8,
  },
});
