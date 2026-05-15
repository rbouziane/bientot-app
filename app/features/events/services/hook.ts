import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CACHE_TIME } from '~shared/constants/CacheTime';
import { QUERY_KEY } from '~shared/constants/QueryKey';
import crashlytics from '~shared/services/crashlytics';
import { logError } from '~shared/services/logger';
import { translate } from '~i18n/translate';
import { Event } from '../types/Event';
import { EventInput } from '../types/EventInput';
import {
  createEventApi,
  deleteEventApi,
  getEventApi,
  getEventsApi,
  updateEventApi,
} from './api';
import { eventReducer, eventsReducer } from './reducer';

type UpdateEventParams = {
  eventId: string;
  input: EventInput;
};

export const useEventsQuery = () => {
  const {
    data: events,
    isPending: isEventsPending,
    error: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: [QUERY_KEY.EVENTS],
    queryFn: async () => {
      const response = await getEventsApi();

      try {
        return eventsReducer(response);
      } catch (error: any) {
        logError(`[Error] eventsReducer: ${error.message}`, error);
        crashlytics.recordError(error, '[Error] eventsReducer');
        throw new Error(translate('error.event.notFound'));
      }
    },
    staleTime: CACHE_TIME.MINUTE_1,
    gcTime: CACHE_TIME.HOURS_24,
  });

  return {
    events,
    isEventsPending,
    eventsError,
    refetchEvents,
  };
};

export const useEventQuery = (eventId: string) => {
  const {
    data: event,
    isPending: isEventPending,
    error: eventError,
  } = useQuery({
    queryKey: [QUERY_KEY.EVENT, eventId],
    queryFn: async () => {
      const response = await getEventApi(eventId);

      try {
        return eventReducer(response);
      } catch (error: any) {
        logError(`[Error] eventReducer: ${error.message}`, error);
        crashlytics.recordError(error, '[Error] eventReducer');
        throw new Error(translate('error.event.notFound'));
      }
    },
    staleTime: CACHE_TIME.MINUTE_1,
    gcTime: CACHE_TIME.HOURS_24,
  });

  return {
    event,
    isEventPending,
    eventError,
  };
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createEventMutate,
    isPending: isCreateEventPending,
    error: createEventError,
  } = useMutation({
    mutationFn: (input: EventInput) => createEventApi(input),

    onMutate: async input => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.EVENTS] });

      const previousEvents =
        queryClient.getQueryData<Event[]>([QUERY_KEY.EVENTS]) ?? [];

      const optimistic: Event = {
        id: `temp-${Date.now()}`,
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

      queryClient.setQueryData<Event[]>(
        [QUERY_KEY.EVENTS],
        [...previousEvents, optimistic],
      );

      return { previousEvents };
    },

    onError: (error: any, _input, context) => {
      logError(`[Error] createEventMutate: ${error.message}`, error);
      crashlytics.recordError(error, '[Error] createEventMutate');

      if (context?.previousEvents) {
        queryClient.setQueryData([QUERY_KEY.EVENTS], context.previousEvents);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS] });
    },
  });

  return {
    createEventMutate,
    isCreateEventPending,
    createEventError,
  };
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateEventMutate,
    isPending: isUpdateEventPending,
    error: updateEventError,
  } = useMutation({
    mutationFn: (params: UpdateEventParams) =>
      updateEventApi(params.eventId, params.input),

    onMutate: async params => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.EVENTS] });
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.EVENT, params.eventId],
      });

      const previousEvents =
        queryClient.getQueryData<Event[]>([QUERY_KEY.EVENTS]) ?? [];
      const previousEvent = queryClient.getQueryData<Event>([
        QUERY_KEY.EVENT,
        params.eventId,
      ]);

      const futureEvent: Event = {
        id: params.eventId,
        title: params.input.title,
        targetDate: params.input.targetDate,
        createdAt: previousEvent?.createdAt ?? new Date().toISOString(),
        icon: params.input.icon,
        colorKey: params.input.colorKey,
        recurrence: params.input.recurrence,
        notes: params.input.notes,
        notification: params.input.notification,
        groupId: params.input.groupId,
      };

      queryClient.setQueryData<Event[]>(
        [QUERY_KEY.EVENTS],
        previousEvents.map(e => (e.id === params.eventId ? futureEvent : e)),
      );
      queryClient.setQueryData([QUERY_KEY.EVENT, params.eventId], futureEvent);

      return { previousEvents, previousEvent };
    },

    onError: (error: any, params, context) => {
      logError(`[Error] updateEventMutate: ${error.message}`, error);
      crashlytics.recordError(error, '[Error] updateEventMutate');

      if (context?.previousEvents) {
        queryClient.setQueryData([QUERY_KEY.EVENTS], context.previousEvents);
      }

      if (context?.previousEvent) {
        queryClient.setQueryData(
          [QUERY_KEY.EVENT, params.eventId],
          context.previousEvent,
        );
      }
    },

    onSettled: (_data, _error, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.EVENT, params.eventId],
      });
    },
  });

  return {
    updateEventMutate,
    isUpdateEventPending,
    updateEventError,
  };
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteEventMutate,
    isPending: isDeleteEventPending,
    error: deleteEventError,
  } = useMutation({
    mutationFn: (eventId: string) => deleteEventApi(eventId),

    onMutate: async eventId => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.EVENTS] });

      const previousEvents =
        queryClient.getQueryData<Event[]>([QUERY_KEY.EVENTS]) ?? [];

      queryClient.setQueryData<Event[]>(
        [QUERY_KEY.EVENTS],
        previousEvents.filter(e => e.id !== eventId),
      );

      return { previousEvents };
    },

    onError: (error: any, _eventId, context) => {
      logError(`[Error] deleteEventMutate: ${error.message}`, error);
      crashlytics.recordError(error, '[Error] deleteEventMutate');

      if (context?.previousEvents) {
        queryClient.setQueryData([QUERY_KEY.EVENTS], context.previousEvents);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS] });
    },
  });

  return {
    deleteEventMutate,
    isDeleteEventPending,
    deleteEventError,
  };
};
