import { ICON_CONCEPT } from '~shared/constants/IconConcept';
import { ICON_CONCEPTS } from '~shared/constants/IconConcepts';

export const resolveConceptEmoji = (concept: ICON_CONCEPT): string => {
  return ICON_CONCEPTS[concept].emoji;
};
