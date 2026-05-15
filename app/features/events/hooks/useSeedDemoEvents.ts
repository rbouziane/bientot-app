// TODO: dev-only — visual seed hook, see demoData.ts. Remove along
// with its call-site (events-list-screen → handleLongPressTitle) once
// the create-screen is testable.

import { useCallback } from 'react';
import { DEMO_EVENT_INPUTS } from '../services/demoData';
import { useCreateEventMutation } from '../services/hook';

export const useSeedDemoEvents = () => {
  const { createEventMutate } = useCreateEventMutation();

  const seedDemoEvents = useCallback(async () => {
    for (const input of DEMO_EVENT_INPUTS) {
      await createEventMutate(input);
    }
  }, [createEventMutate]);

  return { seedDemoEvents };
};
