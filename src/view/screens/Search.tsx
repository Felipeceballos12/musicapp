import React from 'react';
import {
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';

import { Search, X } from 'lucide-react-native';
import { useSession } from '@/state/session';
import { colors } from '@/lib/colors';
import { useWebMediaQueries } from '@/lib/hooks/useWebMediaQueries';
import { isWeb } from '@/platform/detection';
import { PressableWithHover } from '../components/util/PressableWithHover';
import { useSpotify, useSpotifyApi } from '@/state/playback';
import {
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { NavigationProp } from '@/lib/routes/types';
import { convertMsOnM } from '@/lib/functions';

type MusicContent = {
  uri: string;
  name: string;
  album: {
    images: [
      {
        url: string;
        width: number;
        height: number;
      },
      {
        url: string;
        width: number;
        height: number;
      },
      {
        url: string;
        width: number;
        height: number;
      }
    ];
  };
  artists: [];
  duration_ms: number;
  id?: string;
  explicit: boolean;
};

type deviceID = string | undefined;

type SearchMusicProps = MusicContent & {
  device: deviceID;
};
const explores = [
  { id: crypto.randomUUID(), name: 'pop' },
  { id: crypto.randomUUID(), name: 'hip-hop' },
  { id: crypto.randomUUID(), name: 'salsa' },
  { id: crypto.randomUUID(), name: 'r&b' },
  { id: crypto.randomUUID(), name: 'metal' },
  { id: crypto.randomUUID(), name: 'trending' },
  { id: crypto.randomUUID(), name: 'blues' },
  { id: crypto.randomUUID(), name: 'latin' },
];

export function SearchScreen() {
  const [query, setQuery] = React.useState<string>('');
  const [inputIsFocused, setInputIsFocused] =
    React.useState<boolean>(false);
  const [showAutocompleteResults, setShowAutocompleteResults] =
    React.useState<boolean>(false);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const searchDebounceTimeout = React.useRef<
    NodeJS.Timeout | undefined
  >(undefined);
  const { currentAccount } = useSession();
  const { deviceID, player } = useSpotify();
  const token = currentAccount?.accessJwt
    ? currentAccount.accessJwt
    : '';
  const { isTabletOrDesktop } = useWebMediaQueries();

  const handleQuery = React.useCallback(
    (text: string) => {
      scrollToTopWeb();

      setQuery(text);

      if (text.length > 0) {
        setIsFetching(true);
        setShowAutocompleteResults(true);

        if (searchDebounceTimeout.current) {
          window.clearTimeout(searchDebounceTimeout.current);
        }

        searchDebounceTimeout.current = setTimeout(async () => {
          const results = await fetch(
            `https://api.spotify.com/v1/search?q=${text}&type=track&locale=en-GB%2Cen-US%3Bq%3D0.9%2Cen%3Bq%3D0.8&offset=0&limit=20`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (results.status === 200) {
            const data = await results.json();

            setSearchResults(data.tracks.items);
            setIsFetching(false);
          }
        }, 300);
      } else {
        if (searchDebounceTimeout.current) {
          window.clearTimeout(searchDebounceTimeout.current);
        }

        setSearchResults([]);
        setIsFetching(false);
        setShowAutocompleteResults(false);
      }
    },
    [setSearchResults, setQuery]
  );

  const onSubmit = React.useCallback(() => {
    scrollToTopWeb();
    setShowAutocompleteResults(false);
  }, []);

  const onPressClearQuery = React.useCallback(() => {
    scrollToTopWeb();
    setQuery('');
    setShowAutocompleteResults(false);
  }, []);

  const hasResults = React.useMemo(() => {
    return searchResults.length > 0;
  }, [searchResults]);

  return (
    <View
      style={[
        {
          backgroundColor: colors.black,
        },
        isWeb ? null : { flex: 1 },
      ]}
    >
      <View
        style={[
          styles.header,
          isTabletOrDesktop && { paddingTop: 10 },
        ]}
      >
        <View
          style={[
            styles.headerSearchContainer,
            inputIsFocused && {
              borderWidth: 2,
              borderColor: colors.neutral300,
            },
          ]}
        >
          <Search
            style={{ marginRight: 6, alignSelf: 'center' }}
            size={27}
            color={colors.neutral900}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={colors.neutral900}
            selectTextOnFocus
            enterKeyHint="search"
            value={query}
            style={{
              flex: 1,
              fontSize: 18,
              borderWidth: 0,
              // @ts-ignore web only -prf
              outline: 'none',
            }}
            onChangeText={handleQuery}
            onSubmitEditing={onSubmit}
            onFocus={() => setInputIsFocused(true)}
            onBlur={() => {
              // HACK
              // give 100ms to not stop click handlers in the search history
              // -prf
              setTimeout(() => setInputIsFocused(false), 100);
            }}
            autoCorrect={false}
            autoFocus={false}
            autoComplete="off"
            autoCapitalize="none"
          />
          {query ? (
            <Pressable
              style={{ marginLeft: 6 }}
              onPress={onPressClearQuery}
            >
              <X size={17} color={colors.neutral900} />
            </Pressable>
          ) : undefined}
        </View>
      </View>
      <>
        {showAutocompleteResults ? (
          <>
            {isFetching ? (
              <Loader />
            ) : (
              <ScrollView
                style={{
                  height: '100%',
                  backgroundColor: colors.black,
                }}
                // @ts-ignore web only -prf
                dataSet={{ stableGutters: '1' }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                {hasResults ? (
                  <>
                    {searchResults.map(
                      ({
                        uri,
                        name,
                        album,
                        artists,
                        duration_ms,
                        id,
                        explicit,
                      }: MusicContent) => (
                        <SearchMusicCard
                          key={id}
                          uri={uri}
                          device={deviceID}
                          name={name}
                          album={album}
                          artists={artists}
                          duration_ms={duration_ms}
                          explicit={explicit}
                        />
                      )
                    )}
                    <View style={{ height: 80 }} />
                  </>
                ) : (
                  <View
                    style={{
                      height: 300,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 18,
                        textAlign: 'center',
                        marginBottom: 8,
                      }}
                    >
                      No result found for "{query}"
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                      }}
                    >
                      please make sure your words are spelled
                      correctly, or use fewer or different keywords
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </>
        ) : (
          <View
            style={[
              isWeb && { height: '100%' },
              {
                maxWidth: 500,
                width: '100%',
                alignSelf: 'center',
              },
            ]}
            // @ts-ignore web only -prf
            //style={{ height: isWeb ? '100%' : undefined }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {explores.map(({ name, id }) => (
                <Pressable
                  key={id}
                  onPress={() => console.info('Click')}
                  style={{
                    width: 150,
                    height: 100,
                    backgroundColor: colors.lime400,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: colors.neutral200,
                      fontSize: 18,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}
                  >
                    {name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </>
    </View>
  );
}

function scrollToTopWeb() {
  if (isWeb) {
    window.scrollTo(0, 0);
  }
}

function Loader() {
  return (
    <View
      // @ts-ignore web only -prf
      style={{
        padding: 18,
        height: isWeb ? '100vh' : undefined,
      }}
    >
      <ActivityIndicator />
    </View>
  );
}

function SearchMusicCard({
  uri,
  device,
  album,
  name,
  explicit,
  artists,
  duration_ms,
}: SearchMusicProps) {
  const { initTrack } = useSpotifyApi();
  const navigation = useNavigation<NavigationProp>();

  const handlePlayingTrack = React.useCallback(
    (uri: string, device: string | undefined) => {
      if (device === undefined) return;

      initTrack(uri, device)
        .then((response) => {
          if (!response) return;

          navigation.dispatch(StackActions.push('Home'));
        })
        .catch((e) => console.error(e));
    },
    []
  );

  if (device === undefined) return;

  return (
    <PressableWithHover
      onPress={() => handlePlayingTrack(uri, device)}
      style={{
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 16,
        borderRadius: 16,
        overflow: 'hidden',
      }}
      hoverStyle={{
        backgroundColor: colors.darkNeutral100,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Image
          source={{
            uri: album.images[2].url,
          }}
          style={{
            width: 40,
            height: 40,
            marginRight: 8,
            borderRadius: 2,
          }}
          contentFit="cover"
          transition={300}
        />
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: colors.neutral0,
              fontSize: 16,
            }}
          >
            {name}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 4,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: colors.neutral600,
              }}
            >
              {explicit ? (
                <Text
                  style={{
                    backgroundColor: colors.neutral400,
                    fontSize: 9,
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    marginRight: 4,
                    borderRadius: 2,
                    color: colors.black,
                  }}
                >
                  E
                </Text>
              ) : undefined}

              {artists.map(
                (
                  {
                    id,
                    name,
                  }: {
                    id: string;
                    name: string;
                  },
                  index
                ) => (
                  <Text
                    key={id}
                    style={{
                      color: colors.neutral400,
                      fontSize: 14,
                    }}
                  >
                    {artists.length <= 0
                      ? name
                      : artists.length - 1 === index
                      ? name
                      : `${name}, `}
                  </Text>
                )
              )}
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ color: 'white' }}>
        {convertMsOnM(duration_ms)}
      </Text>
    </PressableWithHover>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 65,
    // @ts-ignore web only
    position: isWeb ? 'sticky' : '',
    top: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerSearchContainer: {
    maxWidth: 502,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: colors.neutral600,
  },
});
