import { QueryClient } from '@tanstack/react-query';

import { queryTimings } from '../shared/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (typeof error === 'object' && error && 'statusCode' in error && error.statusCode === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: queryTimings.staleMs,
    },
  },
});
