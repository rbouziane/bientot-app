import { memo, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DetailsStackParamList } from '~/navigators/DetailsStack';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { colors, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';
import EventForm from '../components/EventForm';
import { useEventFormDraft } from '../hooks/useEventFormDraft';
import { useEventQuery, useUpdateEventMutation } from '../services/hook';

type EventEditRoute = RouteProp<DetailsStackParamList, SCREEN_NAME.EVENT_EDIT>;

const EventEditScreen = memo(() => {
  const route = useRoute<EventEditRoute>();
  const eventId = route.params.eventId;

  const { event } = useEventQuery(eventId);
  const { draft, resetDraft } = useEventFormDraft();
  const { updateEventMutate, isUpdateEventPending } = useUpdateEventMutation();

  useEffect(() => {
    if (event == null) {
      return;
    }

    resetDraft({
      title: event.title,
      targetDate: event.targetDate,
      icon: event.icon,
      colorKey: event.colorKey,
      recurrence: event.recurrence,
      notes: event.notes,
      notification: event.notification,
      groupId: event.groupId,
    });
  }, [event, resetDraft]);

  const handlePressClose = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (draft.title.trim().length === 0) {
      return;
    }

    await updateEventMutate({ eventId, input: draft });
    NavigatorUtils.goBack();
  }, [draft, eventId, updateEventMutate]);

  const isSubmitDisabled =
    draft.title.trim().length === 0 || isUpdateEventPending;

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <CircleButton
            icon={<UiIcon name="close" size={18} color={colors.textPrimary} />}
            onPress={handlePressClose}
          />
          <Text style={styles.title}>{translate('form.editTitle')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <EventForm
            submitLabel={translate('form.update')}
            isSubmitDisabled={isSubmitDisabled}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
});

export default EventEditScreen;
