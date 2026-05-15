import { RECURRENCE } from '../enums/Recurrence';
import { Event } from '../types/Event';

export const isPastEvent = (event: Event, now: Date): boolean => {
  if (event.recurrence !== RECURRENCE.NONE) {
    return false;
  }

  return new Date(event.targetDate).getTime() < now.getTime();
};

export type EventsByStatus = {
  active: Event[];
  past: Event[];
};

export const splitEventsByStatus = (
  events: Event[],
  now: Date,
): EventsByStatus => {
  const active: Event[] = [];
  const past: Event[] = [];

  for (const event of events) {
    if (isPastEvent(event, now)) {
      past.push(event);
      continue;
    }

    active.push(event);
  }

  active.sort(
    (a, b) =>
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
  );
  past.sort(
    (a, b) =>
      new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime(),
  );

  return { active, past };
};
