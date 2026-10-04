// Course version (lesson 10) — lesson 12 adds sign-out on 401.
import { create } from 'axios';

import { appConfig, defaultApiUrl } from '@/config/app-config';
import { usePreferencesStore } from '@/store/preferences-store';
import { useSessionStore } from '@/store/session-store';

import { toApiError } from './errors';

export const getApiBaseUrl = () => usePreferencesStore.getState().apiUrlOverride || defaultApiUrl;

export const apiClient = create({
  timeout: appConfig.requestTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  // LIVE 10.1 — Attach the base URL and bearer token to every request.
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    // Lesson 12 signs the passenger out here when the API answers 401.
    return Promise.reject(apiError);
  },
);
