import { ICON_CONCEPTS } from '~shared/constants/IconConcepts';
import { ICON_CONCEPT } from '~shared/constants/IconConcept';

type Platform = 'ios' | 'android';

export const resolveIconNativeName = (
  concept: ICON_CONCEPT,
  platform: Platform,
): string => {
  const mapping = ICON_CONCEPTS[concept];

  if (platform === 'ios') {
    return mapping.sf;
  }

  return mapping.md;
};
