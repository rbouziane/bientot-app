import { QueryClient } from '@tanstack/react-query';

import { CACHE_TIME } from '~shared/constants/CacheTime';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIME.MINUTE_1,
      gcTime: CACHE_TIME.HOURS_24,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
