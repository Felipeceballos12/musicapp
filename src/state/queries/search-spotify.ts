import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

export function useSearch() {
  const queryClient = useQueryClient();
  return React.useCallback(
    async ({
      query,
      limit = 10,
      token,
    }: {
      query: string;
      limit?: number;
      token: string;
    }) => {
      query = query.toLowerCase();
      let res;

      if (query) {
        try {
          res = await queryClient.fetchQuery({
            queryKey: ['search', query],
            staleTime: 1e3 * 60,
            queryFn: () => {
              fetch(
                `https://api.spotify.com/v1/search?q=${query}&type=track&locale=en-GB%2Cen-US%3Bq%3D0.9%2Cen%3Bq%3D0.8&offset=0&limit=20`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            },
          });
        } catch (err) {
          console.error(err);
        }
      }

      return {
        query,
      };
    },
    [queryClient]
  );
}
