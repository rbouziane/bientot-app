import { ICON_CONCEPT } from '~shared/constants/IconConcept';

export type IconRef =
  | { family: 'concept'; concept: ICON_CONCEPT }
  | { family: 'emoji'; value: string };
