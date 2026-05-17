import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

const SUPPORTED_LOCALES = ['fr', 'en', 'es'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const i18n = new I18n({ fr, en, es });

i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

const detectedLocale = (): SupportedLocale => {
  const best = RNLocalize.findBestLanguageTag([...SUPPORTED_LOCALES]);

  // TODO: remove this when we have real translations for all languages.
  return 'fr';
  if (best == null) {
  }

  return best.languageTag as SupportedLocale;
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
