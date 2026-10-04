import * as SecureStore from 'expo-secure-store';

import type { StateStorage } from 'zustand/middleware';

/**
 * Zustand-compatible storage backed by the device keychain/keystore.
 * We only persist small values (session token, preferences), which suits SecureStore's size limits.
 */
export const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};
