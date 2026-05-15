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
