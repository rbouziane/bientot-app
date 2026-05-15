export type IconRefApi =
  | { family: 'concept'; concept: string }
  | { family: 'emoji'; value: string };

export type EventNotificationApi = {
  enabled: boolean;
  offsets: number[];
};

export type EventApi = {
  id: string;
  title: string;
  target_date: string;
  created_at: string;
  icon: IconRefApi;
  color_key: string;
  recurrence: string;
  notes: string | null;
  notification: EventNotificationApi | null;
  group_id: string | null;
};
