import { create } from 'axios';

import { appConfig, defaultApiUrl } from '@/config/app-config';
import { usePreferencesStore } from '@/store/preferences-store';
import { useSessionStore } from '@/store/session-store';

import { HTTP_STATUS, toApiError } from './errors';

export const getApiBaseUrl = () => usePreferencesStore.getState().apiUrlOverride || defaultApiUrl;

export const apiClient = create({
  timeout: appConfig.requestTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = useSessionStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    // LIVE 12.1 — Sign out on 401 only when a token was sent.
    return Promise.reject(apiError);
  },
);
