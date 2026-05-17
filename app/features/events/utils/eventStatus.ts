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

export type PastEventGroup = {
  key: 'thisMonth' | 'earlierThisYear' | 'older';
  events: Event[];
};

export const groupPastEvents = (
  events: Event[],
  now: Date,
): PastEventGroup[] => {
  const thisMonth: Event[] = [];
  const earlierThisYear: Event[] = [];
  const older: Event[] = [];

  for (const event of events) {
    const target = new Date(event.targetDate);
    const sameYear = target.getFullYear() === now.getFullYear();
    const sameMonth = sameYear && target.getMonth() === now.getMonth();

    if (sameMonth) {
      thisMonth.push(event);
      continue;
    }
    if (sameYear) {
      earlierThisYear.push(event);
      continue;
    }
    older.push(event);
  }

  const groups: PastEventGroup[] = [];
  if (thisMonth.length > 0) {
    groups.push({ key: 'thisMonth', events: thisMonth });
  }
  if (earlierThisYear.length > 0) {
    groups.push({ key: 'earlierThisYear', events: earlierThisYear });
  }
  if (older.length > 0) {
    groups.push({ key: 'older', events: older });
  }

  return groups;
};

export const countPastThisYear = (events: Event[], now: Date): number => {
  return events.filter(event => {
    const target = new Date(event.targetDate);
    return target.getFullYear() === now.getFullYear();
  }).length;
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
