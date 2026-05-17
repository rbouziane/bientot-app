import { I18n } from 'i18n-js';
// Kept for the commented-out system-locale detection in `detectedLocale()`.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as RNLocalize from 'react-native-localize';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

// Value used by the commented-out detection logic; the array is still the
// source of truth for the `SupportedLocale` union type below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SUPPORTED_LOCALES = ['fr', 'en', 'es'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const i18n = new I18n({ fr, en, es });

i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

const detectedLocale = (): SupportedLocale => {
  // TODO: re-enable system locale detection once translations are complete
  // across all supported languages. For now, force French.
  return 'fr';

  // const best = RNLocalize.findBestLanguageTag([...SUPPORTED_LOCALES]);
  // if (best == null) {
  //   return 'fr';
  // }
  // return best.languageTag as SupportedLocale;
};

i18n.locale = detectedLocale();

export const translate = (
  key: string,
  params?: Record<string, unknown>,
): string => {
  return i18n.t(key, params);
};

export const getCurrentLocale = (): SupportedLocale => {
  return i18n.locale as SupportedLocale;
};

export const setLocale = (locale: SupportedLocale) => {
  i18n.locale = locale;
};

export const getDateFnsLocale = () => {
  return i18n.locale as SupportedLocale;
};
