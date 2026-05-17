import { memo, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import ScreenContainer from '~shared/components/ScreenContainer';
import SheetHeader from '~shared/components/SheetHeader';
import { spacing } from '~shared/theme';
import { translate } from '~i18n/translate';
import EventForm from '../components/EventForm';
import { useEventFormDraft } from '../hooks/useEventFormDraft';
import { useCreateEventMutation } from '../services/hook';

const EventCreateScreen = memo(() => {
  const { draft, resetDraft } = useEventFormDraft();
  const { createEventMutate, isCreateEventPending } = useCreateEventMutation();

  useEffect(() => {
    resetDraft();
  }, [resetDraft]);

  const handleCancel = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (draft.title.trim().length === 0) {
      return;
    }

    await createEventMutate(draft);
    NavigatorUtils.goBack();
  }, [createEventMutate, draft]);

  const isSubmitDisabled =
    draft.title.trim().length === 0 || isCreateEventPending;

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <SheetHeader
          title={translate('form.createTitle')}
          leftLabel={translate('common.cancel')}
          rightLabel={translate('form.update')}
          isRightDisabled={isSubmitDisabled}
          onPressLeft={handleCancel}
          onPressRight={handleSubmit}
        />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <EventForm />
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
  },
});

export default EventCreateScreen;
