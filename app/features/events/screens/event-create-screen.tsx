import { memo, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { colors, spacing, typography } from '~shared/theme';
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

  const handlePressClose = useCallback(() => {
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
        <View style={styles.header}>
          <CircleButton
            icon={<UiIcon name="close" size={18} color={colors.textPrimary} />}
            onPress={handlePressClose}
          />
          <Text style={styles.title}>{translate('form.createTitle')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <EventForm
            submitLabel={translate('form.create')}
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

export default EventCreateScreen;
