import { memo, useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import Button from '~shared/components/Button';
import { PALETTE } from '~shared/constants/Palette';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { colors, radius, spacing, typography } from '~shared/theme';
import {
  formatLongDate,
  formatShortDate,
  formatTime,
} from '~shared/utils/date';
import { translate } from '~i18n/translate';
import { useEventFormDraft } from '../hooks/useEventFormDraft';
import { Event } from '../types/Event';
import EventCard from './EventCard';
import EventIcon from './EventIcon';
import FormFieldRow from './FormFieldRow';
import RecurrencePills from './RecurrencePills';

const TITLE_MAX_LENGTH = 40;

type Props = {
  submitLabel: string;
  isSubmitDisabled: boolean;
  onSubmit: () => void;
};

const EventForm = memo((props: Props) => {
  const { draft, setDraft } = useEventFormDraft();

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const targetDate = useMemo(
    () => new Date(draft.targetDate),
    [draft.targetDate],
  );

  const palette = PALETTE[draft.colorKey];

  const previewEvent = useMemo<Event>(
    () => ({
      id: 'preview',
      title:
        draft.title.length > 0
          ? draft.title
          : translate('form.titlePlaceholder'),
      targetDate: draft.targetDate,
      createdAt: new Date().toISOString(),
      icon: draft.icon,
      colorKey: draft.colorKey,
      recurrence: draft.recurrence,
      notes: draft.notes,
      notification: draft.notification,
      groupId: draft.groupId,
    }),
    [draft],
  );

  const handleNoopPreviewPress = useCallback(() => {}, []);

  const handleChangeTitle = useCallback(
    (next: string) => {
      setDraft({ title: next.slice(0, TITLE_MAX_LENGTH) });
    },
    [setDraft],
  );

  const handleDateChange = useCallback(
    (_: DateTimePickerEvent, selected?: Date) => {
      if (Platform.OS !== 'ios') {
        setDatePickerVisible(false);
      }

      if (selected == null) {
        return;
      }

      const next = new Date(draft.targetDate);
      next.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
      );
      setDraft({ targetDate: next.toISOString() });
    },
    [draft.targetDate, setDraft],
  );

  const handleTimeChange = useCallback(
    (_: DateTimePickerEvent, selected?: Date) => {
      if (Platform.OS !== 'ios') {
        setTimePickerVisible(false);
      }

      if (selected == null) {
        return;
      }

      const next = new Date(draft.targetDate);
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setDraft({ targetDate: next.toISOString() });
    },
    [draft.targetDate, setDraft],
  );

  const handlePressDateField = useCallback(() => {
    setDatePickerVisible(visible => !visible);
    setTimePickerVisible(false);
  }, []);

  const handlePressTimeField = useCallback(() => {
    setTimePickerVisible(visible => !visible);
    setDatePickerVisible(false);
  }, []);

  const handleChangeRecurrence = useCallback(
    (recurrence: Event['recurrence']) => {
      setDraft({ recurrence });
    },
    [setDraft],
  );

  const handlePressColor = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.COLOR_PICKER);
  }, []);

  const handlePressIcon = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.ICON_PICKER);
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.previewWrap}>
        <EventCard event={previewEvent} onPress={handleNoopPreviewPress} />
      </View>
      <TextInput
        value={draft.title}
        onChangeText={handleChangeTitle}
        placeholder={translate('form.titlePlaceholder')}
        placeholderTextColor={colors.textMuted}
        maxLength={TITLE_MAX_LENGTH}
        autoFocus={draft.title.length === 0}
        style={styles.titleInput}
      />
      <FormFieldRow
        label={translate('form.fieldDate')}
        value={formatLongDate(draft.targetDate)}
        onPress={handlePressDateField}
      />
      {isDatePickerVisible && (
        <DateTimePicker
          mode="date"
          value={targetDate}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}
      <FormFieldRow
        label={translate('form.fieldTime')}
        value={formatTime(draft.targetDate)}
        onPress={handlePressTimeField}
      />
      {isTimePickerVisible && (
        <DateTimePicker
          mode="time"
          value={targetDate}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          {translate('form.fieldRecurrence')}
        </Text>
        <RecurrencePills
          value={draft.recurrence}
          onChange={handleChangeRecurrence}
        />
      </View>
      <FormFieldRow
        label={translate('form.fieldColor')}
        value={draft.colorKey}
        trailing={
          <View style={[styles.colorChip, { backgroundColor: palette.light }]}>
            <View
              style={[styles.colorAccent, { backgroundColor: palette.dark }]}
            />
          </View>
        }
        onPress={handlePressColor}
      />
      <FormFieldRow
        label={translate('form.fieldIcon')}
        value={
          draft.icon.family === 'emoji' ? draft.icon.value : draft.icon.concept
        }
        trailing={
          <View style={styles.iconChip}>
            <EventIcon icon={draft.icon} size={18} />
          </View>
        }
        onPress={handlePressIcon}
      />
      <View style={styles.submit}>
        <Button
          label={props.submitLabel}
          tone="color"
          color={palette.dark}
          isDisabled={props.isSubmitDisabled}
          onPress={props.onSubmit}
        />
      </View>
      <Text style={styles.shortDateHint}>
        {formatShortDate(draft.targetDate)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  previewWrap: {
    marginBottom: spacing.md,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
    letterSpacing: -0.3,
  },
  section: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  colorChip: {
    width: 24,
    height: 24,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  colorAccent: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  iconChip: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    marginTop: spacing.xxl,
  },
  shortDateHint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default EventForm;
