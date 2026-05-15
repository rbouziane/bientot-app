import { COLOR_KEY } from './ColorKey';
import { TIER } from './Tier';

export type PaletteEntry = {
  light: string;
  dark: string;
  tier: TIER;
};

export const PALETTE: Record<COLOR_KEY, PaletteEntry> = {
  [COLOR_KEY.BLUE]: { light: '#DFEEFF', dark: '#1E4D80', tier: TIER.FREE },
  [COLOR_KEY.GREEN]: { light: '#E5F9EB', dark: '#2A6B3D', tier: TIER.FREE },
  [COLOR_KEY.PURPLE]: { light: '#ECE4F7', dark: '#5E3F8F', tier: TIER.FREE },
  [COLOR_KEY.ORANGE]: { light: '#FCE8DC', dark: '#A05A2C', tier: TIER.FREE },
  [COLOR_KEY.PINK]: { light: '#FFE7E7', dark: '#B8383E', tier: TIER.FREE },
  [COLOR_KEY.YELLOW]: { light: '#FFF9E2', dark: '#8A6D1F', tier: TIER.FREE },
  [COLOR_KEY.GRAY]: { light: '#EDE7DF', dark: '#5C544A', tier: TIER.FREE },

  [COLOR_KEY.MINT]: { light: '#E2F4EE', dark: '#2F6B5C', tier: TIER.PREMIUM },
  [COLOR_KEY.SKY]: { light: '#E4F0F7', dark: '#2E5F7A', tier: TIER.PREMIUM },
  [COLOR_KEY.LAVENDER]: { light: '#EBE7F5', dark: '#574A85', tier: TIER.PREMIUM },
  [COLOR_KEY.ROSE]: { light: '#FBE6EF', dark: '#A8466C', tier: TIER.PREMIUM },
  [COLOR_KEY.PEACH]: { light: '#FCEAE0', dark: '#A85B3A', tier: TIER.PREMIUM },
  [COLOR_KEY.SAND]: { light: '#F5EBDC', dark: '#8B6A3D', tier: TIER.PREMIUM },
  [COLOR_KEY.SAGE]: { light: '#E8EDDE', dark: '#5E6B3D', tier: TIER.PREMIUM },
  [COLOR_KEY.TERRACOTTA]: { light: '#F2DDD0', dark: '#9B4D33', tier: TIER.PREMIUM },
  [COLOR_KEY.CREAM]: { light: '#FAF3E8', dark: '#7A6948', tier: TIER.PREMIUM },
  [COLOR_KEY.INDIGO]: { light: '#E2E4F5', dark: '#3D4685', tier: TIER.PREMIUM },
  [COLOR_KEY.LILAC]: { light: '#F0E4F2', dark: '#7A4080', tier: TIER.PREMIUM },
  [COLOR_KEY.FOREST]: { light: '#DEEAE0', dark: '#2E5A3D', tier: TIER.PREMIUM },
  [COLOR_KEY.CORAL]: { light: '#FCDFDA', dark: '#A04438', tier: TIER.PREMIUM },
  [COLOR_KEY.SLATE]: { light: '#E4E7EC', dark: '#475569', tier: TIER.PREMIUM },
};

export const FREE_COLOR_KEYS: COLOR_KEY[] = Object.keys(PALETTE).filter(
  (k) => PALETTE[k as COLOR_KEY].tier === TIER.FREE,
) as COLOR_KEY[];

export const PREMIUM_COLOR_KEYS: COLOR_KEY[] = Object.keys(PALETTE).filter(
  (k) => PALETTE[k as COLOR_KEY].tier === TIER.PREMIUM,
) as COLOR_KEY[];
