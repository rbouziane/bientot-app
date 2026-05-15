import { createMMKV, MMKV } from 'react-native-mmkv';
import crashlytics from '~shared/services/crashlytics';
import { logError } from '~shared/services/logger';
import { getEncryptionKey } from './encryption';

const MODEL_VERSION = 1;

let fallbackMMKV: MMKV | null = createMMKV({ id: 'bientot.fallback' });
let secureMMKV: MMKV | null = null;

const migrateData = (from: MMKV, to: MMKV) => {
  const keys = from.getAllKeys();

  for (const key of keys) {
    const value = from.getString(key);

    if (value != null) {
      to.set(key, value);
      from.remove(key);
    }
  }
};

let resolveSecureReady: (() => void) | null = null;

export const isMMKVSecureReadyPromise = new Promise<void>(resolve => {
  resolveSecureReady = resolve;
});

export const initializeSecureMMKV = async () => {
  if (secureMMKV) {
    return;
  }

  try {
    const encryptionKey = await getEncryptionKey();
    secureMMKV = createMMKV({ id: 'bientot.secure', encryptionKey });

    if (fallbackMMKV) {
      migrateData(fallbackMMKV, secureMMKV);
      fallbackMMKV = null;
    }

    if (resolveSecureReady) {
      resolveSecureReady();
      resolveSecureReady = null;
    }
  } catch (error: any) {
    logError(`[Error] initializeSecureMMKV: ${error.message}`, error);
    crashlytics.recordError(error, '[Error] initializeSecureMMKV');
  }
};

export const getMMKV = (): MMKV => {
  if (secureMMKV) {
    return secureMMKV;
  }

  if (fallbackMMKV) {
    return fallbackMMKV;
  }

  throw new Error('MMKV not initialized');
};

export const getModelVersion = () => MODEL_VERSION;
