import { ICON_CONCEPT } from './IconConcept';
import { TIER } from './Tier';

export type IconConceptMapping = {
  emoji: string;
  tier: TIER;
};

export const ICON_CONCEPTS: Record<ICON_CONCEPT, IconConceptMapping> = {
  [ICON_CONCEPT.BIRTHDAY]: { emoji: '🎂', tier: TIER.FREE },
  [ICON_CONCEPT.GIFT]: { emoji: '🎁', tier: TIER.FREE },
  [ICON_CONCEPT.HEART]: { emoji: '❤️', tier: TIER.FREE },
  [ICON_CONCEPT.STAR]: { emoji: '⭐', tier: TIER.FREE },
  [ICON_CONCEPT.CALENDAR]: { emoji: '📅', tier: TIER.FREE },
  [ICON_CONCEPT.CLOCK]: { emoji: '🕐', tier: TIER.FREE },
  [ICON_CONCEPT.FLIGHT]: { emoji: '✈️', tier: TIER.FREE },
  [ICON_CONCEPT.CAR]: { emoji: '🚗', tier: TIER.FREE },
  [ICON_CONCEPT.HOME]: { emoji: '🏠', tier: TIER.FREE },
  [ICON_CONCEPT.WORK]: { emoji: '💼', tier: TIER.FREE },
  [ICON_CONCEPT.SCHOOL]: { emoji: '🎓', tier: TIER.FREE },
  [ICON_CONCEPT.MUSIC]: { emoji: '🎵', tier: TIER.FREE },
  [ICON_CONCEPT.SPORT]: { emoji: '🏃', tier: TIER.FREE },
  [ICON_CONCEPT.FOOD]: { emoji: '🍴', tier: TIER.FREE },
  [ICON_CONCEPT.COFFEE]: { emoji: '☕', tier: TIER.FREE },
  [ICON_CONCEPT.BELL]: { emoji: '🔔', tier: TIER.FREE },
  [ICON_CONCEPT.FLAG]: { emoji: '🚩', tier: TIER.FREE },
  [ICON_CONCEPT.SUN]: { emoji: '☀️', tier: TIER.FREE },
  [ICON_CONCEPT.MEDICAL]: { emoji: '🏥', tier: TIER.FREE },
  [ICON_CONCEPT.PERSON]: { emoji: '👥', tier: TIER.FREE },
  [ICON_CONCEPT.BABY]: { emoji: '👶', tier: TIER.PREMIUM },
  [ICON_CONCEPT.PETS]: { emoji: '🐾', tier: TIER.PREMIUM },
  [ICON_CONCEPT.WEDDING]: { emoji: '💍', tier: TIER.PREMIUM },
  [ICON_CONCEPT.GAMING]: { emoji: '🎮', tier: TIER.PREMIUM },
  [ICON_CONCEPT.CAMERA]: { emoji: '📷', tier: TIER.PREMIUM },
  [ICON_CONCEPT.BOOK]: { emoji: '📚', tier: TIER.PREMIUM },
  [ICON_CONCEPT.MOVIE]: { emoji: '🎬', tier: TIER.PREMIUM },
  [ICON_CONCEPT.ART]: { emoji: '🎨', tier: TIER.PREMIUM },
  [ICON_CONCEPT.TRAIN]: { emoji: '🚆', tier: TIER.PREMIUM },
  [ICON_CONCEPT.BOAT]: { emoji: '🚢', tier: TIER.PREMIUM },
  [ICON_CONCEPT.MOUNTAIN]: { emoji: '⛰️', tier: TIER.PREMIUM },
  [ICON_CONCEPT.BEACH]: { emoji: '🏖️', tier: TIER.PREMIUM },
  [ICON_CONCEPT.TENT]: { emoji: '⛺', tier: TIER.PREMIUM },
  [ICON_CONCEPT.GYM]: { emoji: '🏋️', tier: TIER.PREMIUM },
  [ICON_CONCEPT.YOGA]: { emoji: '🧘', tier: TIER.PREMIUM },
  [ICON_CONCEPT.PLANT]: { emoji: '🌱', tier: TIER.PREMIUM },
  [ICON_CONCEPT.CHART]: { emoji: '📈', tier: TIER.PREMIUM },
  [ICON_CONCEPT.LIGHTBULB]: { emoji: '💡', tier: TIER.PREMIUM },
  [ICON_CONCEPT.TARGET]: { emoji: '🎯', tier: TIER.PREMIUM },
  [ICON_CONCEPT.ROCKET]: { emoji: '🚀', tier: TIER.PREMIUM },
  [ICON_CONCEPT.CHRISTMAS]: { emoji: '🎄', tier: TIER.PREMIUM },
  [ICON_CONCEPT.FIREWORKS]: { emoji: '🎆', tier: TIER.PREMIUM },
  [ICON_CONCEPT.HALLOWEEN]: { emoji: '🎃', tier: TIER.PREMIUM },
};

export const FREE_ICON_CONCEPTS: ICON_CONCEPT[] = Object.keys(
  ICON_CONCEPTS,
).filter(
  k => ICON_CONCEPTS[k as ICON_CONCEPT].tier === TIER.FREE,
) as ICON_CONCEPT[];

export const PREMIUM_ICON_CONCEPTS: ICON_CONCEPT[] = Object.keys(
  ICON_CONCEPTS,
).filter(
  k => ICON_CONCEPTS[k as ICON_CONCEPT].tier === TIER.PREMIUM,
) as ICON_CONCEPT[];
