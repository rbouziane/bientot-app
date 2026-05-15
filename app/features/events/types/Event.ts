import { COLOR_KEY } from '~shared/constants/ColorKey';
import { RECURRENCE } from '../enums/Recurrence';
import { IconRef } from './IconRef';

export type EventNotification = {
  enabled: boolean;
  offsets: number[];
};

export type Event = {
  id: string;
  title: string;
  targetDate: string;
  createdAt: string;
  icon: IconRef;
  colorKey: COLOR_KEY;
  recurrence: RECURRENCE;
  notes: string | null;
  notification: EventNotification | null;
  groupId: string | null;
};
