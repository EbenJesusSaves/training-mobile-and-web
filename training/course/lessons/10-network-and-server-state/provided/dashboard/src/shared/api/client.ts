import axios from 'axios';

import { env } from '../config/env';
import { parseApiError } from './errors';

interface AuthAccessors {
  getToken: () => string | null;
  onUnauthorized: () => void;
}

let authAccessors: AuthAccessors = {
  getToken: () => null,
  onUnauthorized: () => undefined,
};

export function setAuthAccessors(accessors: AuthAccessors) {
  authAccessors = accessors;
}

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  // LIVE 10.5 — Read authAccessors.getToken() and set the Authorization header when a token exists.
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const parsed = parseApiError(error);
    if (parsed.statusCode === 401) authAccessors.onUnauthorized();
    return Promise.reject(parsed);
  },
);
