import { TextStyle } from 'react-native';

type TypographyKey =
  | 'display'
  | 'displayMedium'
  | 'appTitle'
  | 'h1'
  | 'h2'
  | 'countdownLarge'
  | 'countdownMedium'
  | 'countdownSmall'
  | 'bodyLarge'
  | 'body'
  | 'bodyMedium'
  | 'cardTitle'
  | 'caption'
  | 'captionMedium'
  | 'label'
  | 'button';

export const typography: Record<TypographyKey, TextStyle> = {
  display: {
    fontSize: 84,
    fontWeight: '700',
    letterSpacing: -3,
    lineHeight: 80,
  },
  displayMedium: {
    fontSize: 76,
    fontWeight: '700',
    letterSpacing: -2.5,
    lineHeight: 76,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 32,
  },
  h1: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  countdownLarge: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  countdownMedium: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  countdownSmall: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  button: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
};
