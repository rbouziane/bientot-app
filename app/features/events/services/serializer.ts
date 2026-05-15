import { Event } from '../types/Event';
import { EventApi, IconRefApi } from './types';

const iconRefSerializer = (icon: Event['icon']): IconRefApi => {
  if (icon.family === 'emoji') {
    return { family: 'emoji', value: icon.value };
  }

  return { family: 'concept', concept: icon.concept };
};

export const eventSerializer = (event: Event): EventApi => {
  return {
    id: event.id,
    title: event.title,
    target_date: event.targetDate,
    created_at: event.createdAt,
    icon: iconRefSerializer(event.icon),
    color_key: event.colorKey,
    recurrence: event.recurrence,
    notes: event.notes,
    notification: event.notification,
    group_id: event.groupId,
  };
};
