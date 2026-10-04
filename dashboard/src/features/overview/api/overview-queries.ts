import { useQuery } from '@tanstack/react-query';

import { queryTimings } from '../../../shared/constants';
import { getOverview } from './overview-api';
import { overviewKeys } from './overview-keys';

export function useOverview() {
  return useQuery({ queryKey: overviewKeys.all, queryFn: getOverview, refetchInterval: queryTimings.overviewRefetchMs });
}
