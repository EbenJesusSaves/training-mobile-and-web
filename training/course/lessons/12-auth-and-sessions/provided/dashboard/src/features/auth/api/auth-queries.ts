import { useQuery } from '@tanstack/react-query';

import { getMe } from './auth-api';
import { authKeys } from './auth-keys';

export function useCurrentUser(enabled: boolean) {
  return useQuery({ queryKey: authKeys.me, queryFn: getMe, enabled, retry: false });
}
