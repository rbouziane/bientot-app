// TODO: stub — temporary wrapper that only logs in dev. Wire it up to
// @react-native-firebase/crashlytics once the Firebase project is
// configured (infra side). Keep the public API (recordError, log) so
// call-sites don't break.

type RecordableError = Error | { message: string; name?: string };

const recordError = (error: RecordableError, context?: string) => {
  if (__DEV__) {
    console.warn(`[crashlytics] ${context ?? 'error'}:`, error);
  }
};

const log = (message: string) => {
  if (__DEV__) {
    console.log(`[crashlytics] ${message}`);
  }
};

const crashlytics = {
  recordError,
  log,
};

export default crashlytics;
