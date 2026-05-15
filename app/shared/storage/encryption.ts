import * as Keychain from 'react-native-keychain';

import crashlytics from '~shared/services/crashlytics';
import { logError } from '~shared/services/logger';

const SERVICE_KEY = 'bientot.mmkv.encryption-key';

declare const crypto: {
  getRandomValues: <T extends ArrayBufferView>(array: T) => T;
};

const generateRandomKey = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const getEncryptionKey = async (): Promise<string> => {
  try {
    const creds = await Keychain.getGenericPassword({ service: SERVICE_KEY });

    if (creds !== false && creds.password) {
      return creds.password;
    }

    const newKey = generateRandomKey();

    await Keychain.setGenericPassword('mmkv', newKey, { service: SERVICE_KEY });

    return newKey;
  } catch (error: any) {
    logError(`[Error] getEncryptionKey: ${error.message}`, error);
    crashlytics.recordError(error, '[Error] getEncryptionKey');
    throw error;
  }
};
