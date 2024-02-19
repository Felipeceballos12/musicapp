import { saveString, loadString, save } from '../storage';

export type ResponseToken = {
  accessJwt: string;
  refreshJwt: string;
  expiresIn: number;
  expires: Date;
};

const tokenEndpoint = 'https://accounts.spotify.com/api/token';

export const currentToken = {
  get access_token() {
    return (async function () {
      return await loadString('access_token');
    })();
  },
  get refresh_token() {
    return (async function () {
      return await loadString('refresh_token');
    })();
  },
  get expires_in() {
    return (async function () {
      return await loadString('refresh_in');
    })();
  },
  get expires() {
    return (async function () {
      return await loadString('expires');
    })();
  },

  save: async function (response: ResponseToken) {
    const { accessJwt, refreshJwt, expiresIn, expires } = response;
    await saveString('access_token', accessJwt);
    await saveString('refresh_token', refreshJwt);
    await save('expires_in', expiresIn);
    await save('expires', expires);
  },
};

type Token = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export async function token(
  code: string,
  redirectUri: string,
  clientId: string,
  codeVerifier: string
): Promise<Token | null> {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }).toString(),
  });

  return await response.json();
}

export async function refreshToken(refreshToken: string) {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: '34bac0dcfa7f49d0a0cf6f8b713af47c',
    }).toString(),
  });

  return await response.json();
}

export async function getCurrentDevice(
  device: string,
  token: string
) {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        device_ids: [device],
        play: false,
      }),
    }
  );

  return response;
}
