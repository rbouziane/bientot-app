import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { ICON_CONCEPT } from '~shared/constants/IconConcept';
import { QUERY_KEY } from '~shared/constants/QueryKey';
import { RECURRENCE } from '../enums/Recurrence';
import { EventInput } from '../types/EventInput';
import { IconRef } from '../types/IconRef';

const buildDefaultDraft = (): EventInput => {
  const target = new Date();
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 30);

  return {
    title: '',
    targetDate: target.toISOString(),
    icon: { family: 'concept', concept: ICON_CONCEPT.STAR },
    colorKey: COLOR_KEY.PINK,
    recurrence: RECURRENCE.NONE,
    notes: null,
    notification: null,
    groupId: null,
  };
};

export const useEventFormDraft = () => {
  const queryClient = useQueryClient();

  const { data: draft } = useQuery({
    queryKey: [QUERY_KEY.EVENT_FORM_DRAFT],
    queryFn: () =>
      queryClient.getQueryData<EventInput>([QUERY_KEY.EVENT_FORM_DRAFT]) ??
      buildDefaultDraft(),
    initialData: buildDefaultDraft,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setDraft = useCallback(
    (update: Partial<EventInput>) => {
      const current =
        queryClient.getQueryData<EventInput>([QUERY_KEY.EVENT_FORM_DRAFT]) ??
        buildDefaultDraft();
      queryClient.setQueryData<EventInput>([QUERY_KEY.EVENT_FORM_DRAFT], {
        ...current,
        ...update,
      });
    },
    [queryClient],
  );

  const resetDraft = useCallback(
    (initial?: EventInput) => {
      queryClient.setQueryData<EventInput>(
        [QUERY_KEY.EVENT_FORM_DRAFT],
        initial ?? buildDefaultDraft(),
      );
    },
    [queryClient],
  );

  const setColor = useCallback(
    (colorKey: COLOR_KEY) => {
      setDraft({ colorKey });
    },
    [setDraft],
  );

  const setIcon = useCallback(
    (icon: IconRef) => {
      setDraft({ icon });
    },
    [setDraft],
  );

  return {
    draft,
    setDraft,
    resetDraft,
    setColor,
    setIcon,
  };
};
