import { TextStyle, ViewStyle } from 'react-native';

type ShadowKey = 'card' | 'ctaInk' | 'ctaColor' | 'circle' | 'sheet';

export const shadows: Record<ShadowKey, ViewStyle> = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ctaInk: {
    shadowColor: '#141810',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 8,
  },
  ctaColor: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 8,
  },
  circle: {
    shadowColor: '#141810',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  sheet: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const tabular: TextStyle = {
  fontVariant: ['tabular-nums'],
};

export const style = {
  shadows,
  tabular,
};
