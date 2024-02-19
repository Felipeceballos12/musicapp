import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { useLoggedOutView } from '../../../../state/shell/logged-out';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useSessionApi } from '../../../../state/session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const CLIENT_ID = '34bac0dcfa7f49d0a0cf6f8b713af47c';

export const Login = ({
  onPressBack,
}: {
  onPressBack: () => void;
}) => {
  const { getToken } = useSessionApi();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [
        'user-read-email',
        'playlist-modify-public',
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'user-library-modify',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
      ],
      usePKCE: true,
      redirectUri: makeRedirectUri({
        scheme: 'musicapp',
      }),
    },
    discovery
  );

  React.useEffect(() => {
    async function runEffect() {
      if (response?.type === 'success' && request?.codeVerifier) {
        const { code } = response.params;

        await getToken(
          code,
          makeRedirectUri({
            scheme: 'musicapp',
          }),
          CLIENT_ID,
          request?.codeVerifier
        );
      }
    }

    runEffect();
  }, [response, request]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Pressable
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text style={{ color: 'white' }}>Login Home</Text>
      </Pressable>
    </View>
  );
};
