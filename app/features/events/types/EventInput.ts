import { COLOR_KEY } from '~shared/constants/ColorKey';
import { RECURRENCE } from '../enums/Recurrence';
import { EventNotification } from './Event';
import { IconRef } from './IconRef';

export type EventInput = {
  title: string;
  targetDate: string;
  icon: IconRef;
  colorKey: COLOR_KEY;
  recurrence: RECURRENCE;
  notes: string | null;
  notification: EventNotification | null;
  groupId: string | null;
};
