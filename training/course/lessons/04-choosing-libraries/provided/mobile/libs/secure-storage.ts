import type { StateStorage } from 'zustand/middleware';

/**
 * Zustand-compatible storage backed by the device keychain/keystore.
 * We only persist small values (session token, preferences), which suits SecureStore's size limits.
 */
export const secureStorage: StateStorage = {
  // LIVE 04.1 — Wrap expo-secure-store behind the Storage adapter.
  getItem: async (_name) => null,
  setItem: async (_name, _value) => undefined,
  removeItem: async (_name) => undefined,
};
