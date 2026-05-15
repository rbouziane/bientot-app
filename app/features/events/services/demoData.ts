// TODO: dev-only — seed data used to visually test screens before the
// create-screen is functional. Remove (along with useSeedDemoEvents and
// the long-press handler on HomeHeader) once event creation is wired
// up and tested.

import { COLOR_KEY } from '~shared/constants/ColorKey';
import { ICON_CONCEPT } from '~shared/constants/IconConcept';
import { RECURRENCE } from '../enums/Recurrence';
import { EventInput } from '../types/EventInput';

// Dev-only seed data. Dates are intentionally relative to "now"
// so the demo always covers the relevant visual states.
const daysFromNow = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);

  return d.toISOString();
};

export const DEMO_EVENT_INPUTS: EventInput[] = [
  {
    title: 'Anniversaire de Léa',
    targetDate: daysFromNow(7),
    icon: { family: 'concept', concept: ICON_CONCEPT.BIRTHDAY },
    colorKey: COLOR_KEY.PINK,
    recurrence: RECURRENCE.YEARLY,
    notes: 'Prévoir le gâteau au chocolat et appeler Marie pour le cadeau.',
    notification: null,
    groupId: null,
  },
  {
    title: 'Concert Arctic Monkeys',
    targetDate: daysFromNow(58),
    icon: { family: 'concept', concept: ICON_CONCEPT.MUSIC },
    colorKey: COLOR_KEY.PURPLE,
    recurrence: RECURRENCE.NONE,
    notes: null,
    notification: null,
    groupId: null,
  },
  {
    title: 'Voyage à Tokyo',
    targetDate: daysFromNow(177),
    icon: { family: 'concept', concept: ICON_CONCEPT.FLIGHT },
    colorKey: COLOR_KEY.SKY,
    recurrence: RECURRENCE.NONE,
    notes: null,
    notification: null,
    groupId: null,
  },
  {
    title: 'Mariage Pierre & Jules',
    targetDate: daysFromNow(345),
    icon: { family: 'concept', concept: ICON_CONCEPT.WEDDING },
    colorKey: COLOR_KEY.ROSE,
    recurrence: RECURRENCE.NONE,
    notes: null,
    notification: null,
    groupId: null,
  },
  {
    title: 'Deadline mémoire',
    targetDate: daysFromNow(0),
    icon: { family: 'concept', concept: ICON_CONCEPT.FLAG },
    colorKey: COLOR_KEY.YELLOW,
    recurrence: RECURRENCE.NONE,
    notes: null,
    notification: null,
    groupId: null,
  },
  {
    title: 'Noël en famille',
    targetDate: daysFromNow(224),
    icon: { family: 'emoji', value: '🎄' },
    colorKey: COLOR_KEY.GREEN,
    recurrence: RECURRENCE.YEARLY,
    notes: null,
    notification: null,
    groupId: null,
  },
];
