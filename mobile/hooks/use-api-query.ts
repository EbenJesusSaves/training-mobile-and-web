import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { useFocusEffect } from 'expo-router';

import { type ApiError, toApiError } from '@/api/errors';

interface Options<T> {
  /** Refetch whenever the screen regains focus (e.g. returning from checkout). */
  refetchOnFocus?: boolean;
  /** Poll while the screen is focused. */
  refetchIntervalMs?: number;
  /** Runs after every successful fetch: the place to react to fresh server data (instead of an effect). */
  onSuccess?: (data: T) => void;
}

type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

interface QueryEntry {
  data: unknown;
  error: ApiError | null;
  isFetching: boolean;
  updatedAt: number;
  controller?: AbortController;
  fetcher?: Fetcher<unknown>;
}

/*
 * A tiny query store shared by every screen. React reads it with useSyncExternalStore, so screens
 * that use the same key (e.g. "bookings:upcoming" on Home and Tickets) share one cache entry.
 * This is the core idea behind libraries such as TanStack Query, in about a hundred lines.
 */
const EMPTY: QueryEntry = { data: undefined, error: null, isFetching: false, updatedAt: 0 };
const entries = new Map<string, QueryEntry>();
const listeners = new Map<string, Set<() => void>>();

const getEntry = (key: string) => entries.get(key) ?? EMPTY;

function updateEntry(key: string, patch: Partial<QueryEntry>) {
  entries.set(key, { ...getEntry(key), ...patch });
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: () => void) {
  const set = listeners.get(key) ?? new Set();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) listeners.delete(key);
  };
}

/** Fetches into the store. A newer request for the same key cancels the older one. */
async function fetchQuery<T>(key: string, fetcher: Fetcher<T>): Promise<T | undefined> {
  getEntry(key).controller?.abort();
  const controller = new AbortController();
  updateEntry(key, { isFetching: true, error: null, controller, fetcher: fetcher as Fetcher<unknown> });
  try {
    const data = await fetcher(controller.signal);
    if (controller.signal.aborted) return undefined;
    updateEntry(key, { data, isFetching: false, updatedAt: Date.now(), controller: undefined });
    return data;
  } catch (caught) {
    if (!controller.signal.aborted) updateEntry(key, { error: toApiError(caught), isFetching: false, controller: undefined });
    return undefined;
  }
}

/**
 * Marks data as out of date after a mutation (e.g. a booking). Queries a mounted screen is showing
 * are refetched now; the rest are dropped and load fresh next time they are used.
 */
export function invalidateQueries(prefix: string) {
  for (const [key, entry] of entries) {
    if (!key.startsWith(prefix)) continue;
    if (listeners.has(key) && entry.fetcher) void fetchQuery(key, entry.fetcher);
    else entries.delete(key);
  }
}

const noopUnsubscribe = () => undefined;

/**
 * Minimal "stale-while-revalidate" data hook built on Axios: cached data shows instantly while it
 * revalidates, out-of-order responses are ignored, and screens can refetch on focus or poll.
 * The dashboard uses TanStack Query for the same job; see docs/architecture.md ("Mobile state and data fetching").
 *
 * Pass `key = null` to skip fetching (e.g. until the user has chosen both stations).
 */
export function useApiQuery<T>(key: string | null, fetcher: Fetcher<T>, options: Options<T> = {}) {
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(options.onSuccess);
  const isFirstFocus = useRef(true);

  // Keep the latest callbacks without re-running effects when inline functions change identity.
  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = options.onSuccess;
  });

  const entry = useSyncExternalStore(
    useCallback((listener: () => void) => (key ? subscribe(key, listener) : noopUnsubscribe), [key]),
    () => (key ? getEntry(key) : EMPTY),
  );

  const refetch = useCallback(async () => {
    if (!key) return;
    const data = await fetchQuery(key, (signal) => fetcherRef.current(signal));
    if (data !== undefined) onSuccessRef.current?.(data);
  }, [key]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
      } else if (options.refetchOnFocus) {
        void refetch();
      }
      if (!options.refetchIntervalMs) return undefined;
      const timer = setInterval(() => void refetch(), options.refetchIntervalMs);
      return () => clearInterval(timer);
    }, [options.refetchOnFocus, options.refetchIntervalMs, refetch]),
  );

  const data = entry.data as T | undefined;
  return {
    data,
    error: entry.error,
    /** True only when there is nothing to show yet. */
    isLoading: entry.isFetching && data === undefined,
    isRefreshing: entry.isFetching && data !== undefined,
    refetch,
  };
}
