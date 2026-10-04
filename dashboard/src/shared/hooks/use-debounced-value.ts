import { useDebouncedValue as useMantineDebouncedValue } from '@mantine/hooks';

import { queryTimings } from '../constants';

export function useDebouncedValue<T>(value: T, delay = queryTimings.debounceMs) {
  const [debounced] = useMantineDebouncedValue(value, delay);
  return debounced;
}
