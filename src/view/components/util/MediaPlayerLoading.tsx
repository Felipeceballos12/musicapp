import { View } from 'react-native';
import { colors } from '@/lib/colors';
import {
  Play,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
} from 'lucide-react-native';

export function WebPlayerLoading() {
  return (
    <View
      style={{
        maxWidth: 416,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.11)',
        borderRadius: 10,
        paddingTop: 38,
        paddingBottom: 45,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          maxWidth: 355,
          width: '100%',
          height: 355,
          backgroundColor: colors.black,
          borderRadius: 5,
        }}
      ></View>

      <View
        style={{
          maxWidth: 355,
          width: '100%',
          marginTop: 32,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
      >
        <View
          style={{
            backgroundColor: colors.black,
            width: 196,
            height: 28,
            borderRadius: 28,
          }}
        ></View>
        <View
          style={{
            backgroundColor: colors.black,
            width: 110,
            height: 19,
            borderRadius: 28,
            marginTop: 4,
          }}
        ></View>
        <View style={{ marginTop: 17 }}>
          <View
            style={{
              height: 12,
              borderRadius: 12,
              backgroundColor: colors.black,
            }}
          ></View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 14,
            }}
          >
            <View
              style={{
                width: 40,
                height: 16,
                borderRadius: 16,
                backgroundColor: colors.black,
              }}
            ></View>
            <View
              style={{
                width: 40,
                height: 16,
                borderRadius: 16,
                backgroundColor: colors.black,
              }}
            ></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 25,
            marginTop: 16,
          }}
        >
          <Shuffle size={24} />
          <View
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SkipBack size={28} fill={colors.black} />
          </View>
          <View
            style={{
              width: 70,
              height: 70,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Play
              size={32}
              color={colors.black}
              fill={colors.black}
              style={{ marginLeft: 4 }}
            />
          </View>
          <View
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SkipForward size={28} fill={colors.black} />
          </View>
          <Repeat size={24} />
        </View>
      </View>
    </View>
  );
}

export function MiniWebPlayerLoading() {
  return (
    <View
      style={{
        maxWidth: 416,
        width: '100%',
        alignSelf: 'center',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        gap: 16,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 5,
          }}
        ></View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              width: 130,
              height: 19,
              borderRadius: 19,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
          ></View>
          <View
            style={{
              width: 80,
              height: 16,
              borderRadius: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              marginTop: 4,
            }}
          ></View>
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Play
              size={24}
              color="rgba(0, 0, 0, 0.8)"
              fill="rgba(0, 0, 0, 0.8)"
              style={{ marginLeft: 4 }}
            />
          </View>
          <View
            style={{
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SkipForward
              size={24}
              fill="rgba(0, 0, 0, 0.8)"
              color="rgba(0, 0, 0, 0.8)"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
