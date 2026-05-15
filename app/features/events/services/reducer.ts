import { COLOR_KEY } from '~shared/constants/ColorKey';
import { ICON_CONCEPT } from '~shared/constants/IconConcept';

import { RECURRENCE } from '../enums/Recurrence';
import { Event } from '../types/Event';
import { IconRef } from '../types/IconRef';
import { EventApi, IconRefApi } from './types';

const iconRefReducer = (data: IconRefApi): IconRef => {
  if (data.family === 'emoji') {
    return { family: 'emoji', value: data.value };
  }

  const concept = data.concept as ICON_CONCEPT;

  if (!Object.values(ICON_CONCEPT).includes(concept)) {
    throw new Error(`Invalid icon concept: ${data.concept}`);
  }

  return { family: 'concept', concept };
};

export const eventReducer = (data: EventApi): Event => {
  if (data.id == null || data.title == null || data.target_date == null) {
    throw new Error('Invalid event payload');
  }

  const colorKey = data.color_key as COLOR_KEY;

  if (!Object.values(COLOR_KEY).includes(colorKey)) {
    throw new Error(`Invalid color key: ${data.color_key}`);
  }

  const recurrence = data.recurrence as RECURRENCE;

  if (!Object.values(RECURRENCE).includes(recurrence)) {
    throw new Error(`Invalid recurrence: ${data.recurrence}`);
  }

  return {
    id: data.id,
    title: data.title,
    targetDate: data.target_date,
    createdAt: data.created_at,
    icon: iconRefReducer(data.icon),
    colorKey,
    recurrence,
    notes: data.notes,
    notification: data.notification,
    groupId: data.group_id,
  };
};

export const eventsReducer = (data: EventApi[]): Event[] => {
  return data.map(eventReducer);
};
