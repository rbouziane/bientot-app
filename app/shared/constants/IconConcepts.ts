import { ICON_CONCEPT } from './IconConcept';
import { TIER } from './Tier';

export type IconConceptMapping = {
  sf: string;
  md: string;
  tier: TIER;
};

export const ICON_CONCEPTS: Record<ICON_CONCEPT, IconConceptMapping> = {
  [ICON_CONCEPT.BIRTHDAY]: {
    sf: 'birthday.cake.fill',
    md: 'cake',
    tier: TIER.FREE,
  },
  [ICON_CONCEPT.GIFT]: {
    sf: 'gift.fill',
    md: 'card-giftcard',
    tier: TIER.FREE,
  },
  [ICON_CONCEPT.HEART]: { sf: 'heart.fill', md: 'favorite', tier: TIER.FREE },
  [ICON_CONCEPT.STAR]: { sf: 'star.fill', md: 'star', tier: TIER.FREE },
  [ICON_CONCEPT.CALENDAR]: { sf: 'calendar', md: 'event', tier: TIER.FREE },
  [ICON_CONCEPT.CLOCK]: { sf: 'clock.fill', md: 'schedule', tier: TIER.FREE },
  [ICON_CONCEPT.FLIGHT]: { sf: 'airplane', md: 'flight', tier: TIER.FREE },
  [ICON_CONCEPT.CAR]: { sf: 'car.fill', md: 'directions-car', tier: TIER.FREE },
  [ICON_CONCEPT.HOME]: { sf: 'house.fill', md: 'home', tier: TIER.FREE },
  [ICON_CONCEPT.WORK]: { sf: 'briefcase.fill', md: 'work', tier: TIER.FREE },
  [ICON_CONCEPT.SCHOOL]: {
    sf: 'graduationcap.fill',
    md: 'school',
    tier: TIER.FREE,
  },
  [ICON_CONCEPT.MUSIC]: { sf: 'music.note', md: 'music-note', tier: TIER.FREE },
  [ICON_CONCEPT.SPORT]: {
    sf: 'figure.run',
    md: 'directions-run',
    tier: TIER.FREE,
  },
  [ICON_CONCEPT.FOOD]: { sf: 'fork.knife', md: 'restaurant', tier: TIER.FREE },
  [ICON_CONCEPT.COFFEE]: {
    sf: 'cup.and.saucer.fill',
    md: 'local-cafe',
    tier: TIER.FREE,
  },
  [ICON_CONCEPT.BELL]: {
    sf: 'bell.fill',
    md: 'notifications',
    tier: TIER.FREE,
  },
  [ICON_CONCEPT.FLAG]: { sf: 'flag.fill', md: 'flag', tier: TIER.FREE },
  [ICON_CONCEPT.SUN]: { sf: 'sun.max.fill', md: 'wb-sunny', tier: TIER.FREE },
  [ICON_CONCEPT.MEDICAL]: {
    sf: 'cross.case.fill',
    md: 'medical-services',
    tier: TIER.FREE,
  },
  [ICON_CONCEPT.PERSON]: { sf: 'person.2.fill', md: 'group', tier: TIER.FREE },

  [ICON_CONCEPT.BABY]: {
    sf: 'figure.and.child.holdinghands',
    md: 'child-friendly',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.PETS]: { sf: 'pawprint.fill', md: 'pets', tier: TIER.PREMIUM },
  [ICON_CONCEPT.WEDDING]: {
    sf: 'sparkles',
    md: 'celebration',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.GAMING]: {
    sf: 'gamecontroller.fill',
    md: 'sports-esports',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.CAMERA]: {
    sf: 'camera.fill',
    md: 'photo-camera',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.BOOK]: { sf: 'book.fill', md: 'menu-book', tier: TIER.PREMIUM },
  [ICON_CONCEPT.MOVIE]: { sf: 'film.fill', md: 'movie', tier: TIER.PREMIUM },
  [ICON_CONCEPT.ART]: {
    sf: 'paintbrush.fill',
    md: 'palette',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.TRAIN]: { sf: 'tram.fill', md: 'train', tier: TIER.PREMIUM },
  [ICON_CONCEPT.BOAT]: {
    sf: 'ferry.fill',
    md: 'directions-boat',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.MOUNTAIN]: {
    sf: 'mountain.2.fill',
    md: 'landscape',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.BEACH]: {
    sf: 'beach.umbrella.fill',
    md: 'beach-access',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.TENT]: { sf: 'tent.fill', md: 'cabin', tier: TIER.PREMIUM },
  [ICON_CONCEPT.GYM]: {
    sf: 'dumbbell.fill',
    md: 'fitness-center',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.YOGA]: {
    sf: 'figure.yoga',
    md: 'self-improvement',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.PLANT]: { sf: 'leaf.fill', md: 'eco', tier: TIER.PREMIUM },
  [ICON_CONCEPT.CHART]: {
    sf: 'chart.line.uptrend.xyaxis',
    md: 'trending-up',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.LIGHTBULB]: {
    sf: 'lightbulb.fill',
    md: 'lightbulb',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.TARGET]: {
    sf: 'target',
    md: 'crisis-alert',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.ROCKET]: {
    sf: 'paperplane.fill',
    md: 'rocket-launch',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.CHRISTMAS]: {
    sf: 'tree.fill',
    md: 'celebration',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.FIREWORKS]: {
    sf: 'sparkles',
    md: 'celebration',
    tier: TIER.PREMIUM,
  },
  [ICON_CONCEPT.HALLOWEEN]: {
    sf: 'moon.stars.fill',
    md: 'dark-mode',
    tier: TIER.PREMIUM,
  },
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
