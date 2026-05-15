export { default as EventIcon } from './components/EventIcon';
export type { Event, EventNotification } from './types/Event';
export type { EventInput } from './types/EventInput';
export type { IconRef } from './types/IconRef';
export { RECURRENCE } from './enums/Recurrence';
export {
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventQuery,
  useEventsQuery,
  useUpdateEventMutation,
} from './services/hook';
