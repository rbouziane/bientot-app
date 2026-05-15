import { v4 as uuidv4 } from 'uuid';

import { STORAGE_KEY } from '~shared/constants/Storage';
import crashlytics from '~shared/services/crashlytics';
import { logError } from '~shared/services/logger';
import { getMMKV, isMMKVSecureReadyPromise } from '~shared/storage/mmkv';

import { Event } from '../types/Event';
import { EventInput } from '../types/EventInput';
import { eventSerializer } from './serializer';
import { EventApi } from './types';

const readRaw = (): EventApi[] => {
  const raw = getMMKV().getString(STORAGE_KEY.EVENTS);

  if (raw == null) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as EventApi[];
  } catch (error: any) {
    logError(`[Error] readEventsRaw: ${error.message}`, error);
    crashlytics.recordError(error, '[Error] readEventsRaw');
    return [];
  }
};

const writeRaw = (events: EventApi[]) => {
  getMMKV().set(STORAGE_KEY.EVENTS, JSON.stringify(events));
};

export const getEventsApi = async (): Promise<EventApi[]> => {
  await isMMKVSecureReadyPromise;
  return readRaw();
};

export const getEventApi = async (eventId: string): Promise<EventApi> => {
  await isMMKVSecureReadyPromise;
  const events = readRaw();
  const event = events.find((e) => e.id === eventId);

  if (event == null) {
    throw new Error(`Event ${eventId} not found`);
  }

  return event;
};

export const createEventApi = async (input: EventInput): Promise<EventApi> => {
  await isMMKVSecureReadyPromise;

  const event: Event = {
    id: uuidv4(),
    title: input.title,
    targetDate: input.targetDate,
    createdAt: new Date().toISOString(),
    icon: input.icon,
    colorKey: input.colorKey,
    recurrence: input.recurrence,
    notes: input.notes,
    notification: input.notification,
    groupId: input.groupId,
  };

  const serialized = eventSerializer(event);
  const events = readRaw();

  writeRaw([...events, serialized]);

  return serialized;
};

export const updateEventApi = async (
  eventId: string,
  input: EventInput,
): Promise<EventApi> => {
  await isMMKVSecureReadyPromise;
  const events = readRaw();
  const index = events.findIndex((e) => e.id === eventId);

  if (index === -1) {
    throw new Error(`Event ${eventId} not found`);
  }

  const previous = events[index];
  const updated: EventApi = {
    ...previous,
    title: input.title,
    target_date: input.targetDate,
    icon: input.icon.family === 'emoji'
      ? { family: 'emoji', value: input.icon.value }
      : { family: 'concept', concept: input.icon.concept },
    color_key: input.colorKey,
    recurrence: input.recurrence,
    notes: input.notes,
    notification: input.notification,
    group_id: input.groupId,
  };

  events[index] = updated;
  writeRaw(events);

  return updated;
};

export const deleteEventApi = async (eventId: string): Promise<void> => {
  await isMMKVSecureReadyPromise;
  const events = readRaw();
  const filtered = events.filter((e) => e.id !== eventId);

  writeRaw(filtered);
};
