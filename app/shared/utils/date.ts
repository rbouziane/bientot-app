import { differenceInCalendarDays, differenceInHours, format } from 'date-fns';
import { enUS, es, fr } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { getCurrentLocale, translate } from '~i18n/translate';

const DATE_FNS_LOCALES: Record<string, Locale> = {
  fr,
  en: enUS,
  es,
};

const localeForCurrentLanguage = (): Locale => {
  return DATE_FNS_LOCALES[getCurrentLocale()] ?? fr;
};

export type CountdownDisplay = {
  big: string;
  unit: string;
  isToday: boolean;
  isPast: boolean;
  isSoon: boolean;
};

export const daysFromNow = (iso: string, now: Date = new Date()): number => {
  return differenceInCalendarDays(new Date(iso), now);
};

export const hoursFromNow = (iso: string, now: Date = new Date()): number => {
  return differenceInHours(new Date(iso), now);
};

export const formatCountdown = (
  iso: string,
  now: Date = new Date(),
): CountdownDisplay => {
  const days = daysFromNow(iso, now);

  if (days === 0) {
    return {
      big: translate('date.today'),
      unit: '',
      isToday: true,
      isPast: false,
      isSoon: false,
    };
  }

  if (days < 0) {
    const abs = Math.abs(days);

    return {
      big: translate('date.daysAgoBig', { count: abs }),
      unit:
        abs === 1
          ? translate('date.daysAgoUnit')
          : translate('date.daysAgoUnitOther'),
      isToday: false,
      isPast: true,
      isSoon: false,
    };
  }

  if (days === 1) {
    return {
      big: translate('date.tomorrow'),
      unit: '',
      isToday: false,
      isPast: false,
      isSoon: true,
    };
  }

  if (days < 60) {
    return {
      big: `${days}`,
      unit: translate('date.daysUnit'),
      isToday: false,
      isPast: false,
      isSoon: false,
    };
  }

  if (days < 365) {
    const months = Math.round(days / 30.4);

    return {
      big: `${months}`,
      unit: translate('date.monthsUnit'),
      isToday: false,
      isPast: false,
      isSoon: false,
    };
  }

  const years = days / 365;
  const formatted = years
    .toFixed(1)
    .replace('.', getCurrentLocale() === 'en' ? '.' : ',');
  const unit =
    Math.round(years * 10) === 10
      ? translate('date.yearsUnitOne')
      : translate('date.yearsUnit');

  return {
    big: formatted,
    unit,
    isToday: false,
    isPast: false,
    isSoon: false,
  };
};

export const formatCompact = (iso: string, now: Date = new Date()): string => {
  const days = daysFromNow(iso, now);

  if (days === 0) {
    return translate('date.today');
  }

  if (days < 0) {
    return `+${Math.abs(days)}j`;
  }

  if (days < 100) {
    return `${days}j`;
  }

  if (days < 365) {
    return `${Math.round(days / 30.4)}m`;
  }

  return `${(days / 365).toFixed(1).replace('.', ',')}a`;
};

export const progressFill = (iso: string, now: Date = new Date()): number => {
  const ms = new Date(iso).getTime() - now.getTime();
  const days = ms / (1000 * 60 * 60 * 24);

  if (days < 0) {
    return 1;
  }

  if (days > 365) {
    return 0;
  }

  return Math.max(0, Math.min(1, 1 - days / 365));
};

export const formatLongDate = (iso: string): string => {
  return format(new Date(iso), 'EEEE d MMMM', {
    locale: localeForCurrentLanguage(),
  });
};

export const formatShortDate = (iso: string): string => {
  return format(new Date(iso), 'EEE d MMM', {
    locale: localeForCurrentLanguage(),
  });
};

export const formatTime = (iso: string): string => {
  return format(new Date(iso), 'HH:mm', { locale: localeForCurrentLanguage() });
};
