import { memo, useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import FieldGroup from '~shared/components/FieldGroup';
import FieldRow from '~shared/components/FieldRow';
import PremiumBadge from '~shared/components/PremiumBadge';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { FREE_COLOR_KEYS, PALETTE } from '~shared/constants/Palette';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { colors, radius, spacing, tabular } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { formatShortDate, formatTime } from '~shared/utils/date';
import { translate } from '~i18n/translate';
import { RECURRENCE } from '../enums/Recurrence';
import { useEventFormDraft } from '../hooks/useEventFormDraft';
import CompactEventPreview from './CompactEventPreview';
import IconBadge from './IconBadge';

const TITLE_MAX_LENGTH = 40;

const IOS_BLUE = '#0A84FF';
const IOS_BLUE_BACKGROUND = 'rgba(10,132,255,0.10)';
const IOS_SWITCH_ON = '#30D158';

const INLINE_COLOR_KEYS: COLOR_KEY[] = FREE_COLOR_KEYS.slice(0, 6);

const RECURRENCE_OPTIONS: RECURRENCE[] = [
  RECURRENCE.NONE,
  RECURRENCE.YEARLY,
  RECURRENCE.MONTHLY,
  RECURRENCE.WEEKLY,
];

const recurrenceLabel = (value: RECURRENCE): string => {
  if (value === RECURRENCE.YEARLY) {
    return translate('recurrence.yearly');
  }
  if (value === RECURRENCE.MONTHLY) {
    return translate('recurrence.monthly');
  }
  if (value === RECURRENCE.WEEKLY) {
    return translate('recurrence.weekly');
  }
  return translate('recurrence.none');
};

type RecurrencePillProps = {
  value: RECURRENCE;
  isActive: boolean;
  onPress: (value: RECURRENCE) => void;
};

const RecurrencePill = memo((pillProps: RecurrencePillProps) => {
  const handlePress = useCallback(() => {
    pillProps.onPress(pillProps.value);
  }, [pillProps.onPress, pillProps.value]);

  const background = pillProps.isActive
    ? colors.textPrimary
    : 'rgba(26,26,26,0.05)';
  const labelColor = pillProps.isActive
    ? colors.textOnDark
    : colors.textPrimary;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.recurrencePill,
        { backgroundColor: background },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.recurrencePillLabel, { color: labelColor }]}>
        {recurrenceLabel(pillProps.value)}
      </Text>
    </Pressable>
  );
});

const EventForm = memo(() => {
  const { draft, setDraft } = useEventFormDraft();

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [hasTime, setHasTime] = useState(false);
  const [hasNotification, setHasNotification] = useState(
    draft.notification != null && draft.notification.enabled,
  );

  const targetDate = useMemo(
    () => new Date(draft.targetDate),
    [draft.targetDate],
  );

  const palette = PALETTE[draft.colorKey];

  const handleChangeTitle = useCallback(
    (next: string) => {
      setDraft({ title: next.slice(0, TITLE_MAX_LENGTH) });
    },
    [setDraft],
  );

  const handlePressDateField = useCallback(() => {
    setDatePickerVisible(visible => !visible);
    setTimePickerVisible(false);
  }, []);

  const handlePressTimeField = useCallback(() => {
    if (!hasTime) {
      return;
    }
    setTimePickerVisible(visible => !visible);
    setDatePickerVisible(false);
  }, [hasTime]);

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, selected?: Date) => {
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
    (_event: DateTimePickerEvent, selected?: Date) => {
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

  const handleToggleHasTime = useCallback(
    (next: boolean) => {
      setHasTime(next);
      if (!next) {
        setTimePickerVisible(false);
        const cleared = new Date(draft.targetDate);
        cleared.setHours(0, 0, 0, 0);
        setDraft({ targetDate: cleared.toISOString() });
      }
    },
    [draft.targetDate, setDraft],
  );

  const handleSelectRecurrence = useCallback(
    (value: RECURRENCE) => {
      setDraft({ recurrence: value });
    },
    [setDraft],
  );

  const handlePressColorRow = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.COLOR_PICKER);
  }, []);

  const handlePressIconRow = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.ICON_PICKER);
  }, []);

  const handleToggleNotification = useCallback(
    (next: boolean) => {
      setHasNotification(next);
      setDraft({
        notification: next
          ? { enabled: true, offsets: [10080, 1440, 0] }
          : null,
      });
    },
    [setDraft],
  );

  const dateLabel = formatShortDate(draft.targetDate);
  const titleCount = draft.title.length;

  return (
    <View style={styles.root}>
      <CompactEventPreview
        title={
          draft.title.length > 0
            ? draft.title
            : translate('form.titlePlaceholder')
        }
        targetDate={draft.targetDate}
        icon={draft.icon}
        palette={palette}
      />

      <FieldGroup label={translate('form.titleSection')}>
        <FieldRow isLast>
          <TextInput
            value={draft.title}
            onChangeText={handleChangeTitle}
            placeholder={translate('form.titlePlaceholder')}
            placeholderTextColor={colors.textMuted}
            maxLength={TITLE_MAX_LENGTH}
            autoFocus={draft.title.length === 0}
            style={styles.titleInput}
          />
          <Text style={[styles.titleCounter, tabular]}>
            {translate('form.charCount', { count: titleCount })}
          </Text>
        </FieldRow>
      </FieldGroup>

      <FieldGroup label={translate('form.whenSection')}>
        <FieldRow onPress={handlePressDateField}>
          <Text style={styles.rowLabel}>{translate('form.fieldDate')}</Text>
          <View style={styles.dateChip}>
            <Text style={styles.dateChipLabel}>{dateLabel}</Text>
          </View>
        </FieldRow>
        {isDatePickerVisible && (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              mode="date"
              value={targetDate}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
            />
          </View>
        )}
        <FieldRow onPress={handlePressTimeField}>
          <Text style={styles.rowLabel}>{translate('form.fieldTime')}</Text>
          <Text style={styles.timeValue}>
            {hasTime ? formatTime(draft.targetDate) : translate('form.noTime')}
          </Text>
          <Switch
            value={hasTime}
            onValueChange={handleToggleHasTime}
            trackColor={{ false: 'rgba(26,26,26,0.12)', true: IOS_SWITCH_ON }}
            thumbColor={colors.surface}
            ios_backgroundColor="rgba(26,26,26,0.12)"
          />
        </FieldRow>
        {isTimePickerVisible && hasTime && (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              mode="time"
              value={targetDate}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          </View>
        )}
        <FieldRow isLast>
          <Text style={styles.rowLabel}>
            {translate('form.fieldRecurrence')}
          </Text>
          <View style={styles.recurrenceRow}>
            {RECURRENCE_OPTIONS.map(option => (
              <RecurrencePill
                key={option}
                value={option}
                isActive={draft.recurrence === option}
                onPress={handleSelectRecurrence}
              />
            ))}
          </View>
        </FieldRow>
      </FieldGroup>

      <FieldGroup label={translate('form.styleSection')}>
        <FieldRow onPress={handlePressColorRow}>
          <Text style={styles.rowLabel}>{translate('form.fieldColor')}</Text>
          <View style={styles.colorRow}>
            {INLINE_COLOR_KEYS.map(colorKey => {
              const entry = PALETTE[colorKey];
              const isSelected = draft.colorKey === colorKey;
              return (
                <View
                  key={colorKey}
                  style={[
                    styles.colorDot,
                    { backgroundColor: entry.light },
                    isSelected && styles.colorDotSelected,
                    isSelected && {
                      borderColor: entry.dark,
                      transform: [{ scale: 1.1 }],
                    },
                  ]}
                />
              );
            })}
            <UiIcon name="chevronRight" size={14} color={colors.textMuted} />
          </View>
        </FieldRow>
        <FieldRow isLast onPress={handlePressIconRow}>
          <Text style={styles.rowLabel}>{translate('form.fieldIcon')}</Text>
          <IconBadge icon={draft.icon} darkColor={palette.dark} size={30} />
          <UiIcon name="chevronRight" size={14} color={colors.textMuted} />
        </FieldRow>
      </FieldGroup>

      <FieldGroup label={translate('form.remindersSection')}>
        <FieldRow>
          <Text style={styles.rowLabel}>{translate('form.notifyMe')}</Text>
          <Switch
            value={hasNotification}
            onValueChange={handleToggleNotification}
            trackColor={{ false: 'rgba(26,26,26,0.12)', true: IOS_SWITCH_ON }}
            thumbColor={colors.surface}
            ios_backgroundColor="rgba(26,26,26,0.12)"
          />
        </FieldRow>
        <FieldRow isLast>
          <View style={styles.beforeColumn}>
            <Text style={styles.rowLabel}>{translate('form.beforeEvent')}</Text>
            {hasNotification && (
              <View style={styles.beforeTags}>
                {[
                  translate('reminder.oneWeek'),
                  translate('reminder.oneDay'),
                  translate('reminder.dayOf'),
                ].map(tagLabel => (
                  <View
                    key={tagLabel}
                    style={[
                      styles.beforeTag,
                      { backgroundColor: hexA(palette.dark, 0.1) },
                    ]}
                  >
                    <Text
                      style={[styles.beforeTagLabel, { color: palette.dark }]}
                    >
                      {tagLabel}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          {hasNotification && (
            <UiIcon name="chevronRight" size={14} color={colors.textMuted} />
          )}
        </FieldRow>
      </FieldGroup>

      <FieldGroup label={translate('form.plusSection')}>
        <FieldRow>
          <View style={styles.lockedRow}>
            <Text style={styles.rowLabel}>{translate('form.fieldNotes')}</Text>
            <PremiumBadge />
          </View>
          <UiIcon name="lock" size={14} color={colors.textMuted} />
        </FieldRow>
        <FieldRow isLast>
          <View style={styles.lockedRow}>
            <Text style={styles.rowLabel}>{translate('form.fieldGroup')}</Text>
            <PremiumBadge />
          </View>
          <UiIcon name="lock" size={14} color={colors.textMuted} />
        </FieldRow>
      </FieldGroup>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    gap: spacing.xl,
  },
  rowLabel: {
    fontSize: 17,
    color: colors.textPrimary,
    flex: 1,
  },
  titleInput: {
    flex: 1,
    fontSize: 17,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  titleCounter: {
    fontSize: 12,
    color: colors.textMuted,
  },
  dateChip: {
    backgroundColor: IOS_BLUE_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  dateChipLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: IOS_BLUE,
  },
  pickerWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  timeValue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  recurrenceRow: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  recurrencePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  recurrencePillLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  colorDotSelected: {
    borderWidth: 2,
  },
  beforeColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  beforeTags: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  beforeTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  beforeTagLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  lockedRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default EventForm;
