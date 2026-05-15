import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import {
  getMMKV,
  getModelVersion,
  isMMKVSecureReadyPromise,
} from './mmkv';

type CacheEntry = {
  data: string;
  version: number;
};

const clientStorage = {
  setItem: async (key: string, value: string) => {
    await isMMKVSecureReadyPromise;
    const entry: CacheEntry = { data: value, version: getModelVersion() };

    getMMKV().set(key, JSON.stringify(entry));
  },
  getItem: async (key: string) => {
    await isMMKVSecureReadyPromise;
    const raw = getMMKV().getString(key);

    if (raw == null) {
      return null;
    }

    try {
      const entry = JSON.parse(raw) as CacheEntry;

      if (entry == null || entry.version !== getModelVersion()) {
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  },
  removeItem: async (key: string) => {
    await isMMKVSecureReadyPromise;
    getMMKV().remove(key);
  },
};

export const clientPersister = createAsyncStoragePersister({
  storage: clientStorage,
  key: 'bientot.tanstack.cache',
});
