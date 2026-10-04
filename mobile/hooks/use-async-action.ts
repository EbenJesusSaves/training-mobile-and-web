import { useCallback, useRef, useState } from 'react';

import { type ApiError, toApiError } from '@/api/errors';

/** Wraps a submit/mutation: tracks pending state and the last error, and ignores double taps. */
export function useAsyncAction<TArgs extends unknown[], TResult>(action: (...args: TArgs) => Promise<TResult>) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const pendingRef = useRef(false);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      if (pendingRef.current) return undefined;
      pendingRef.current = true;
      setIsPending(true);
      setError(null);
      try {
        return await action(...args);
      } catch (caught) {
        setError(toApiError(caught));
        return undefined;
      } finally {
        pendingRef.current = false;
        setIsPending(false);
      }
    },
    [action],
  );

  return { run, isPending, error, clearError: () => setError(null) };
}
