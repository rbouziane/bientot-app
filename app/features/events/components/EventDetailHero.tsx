import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, tabular, typography } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { formatCountdown, formatLongDate } from '~shared/utils/date';
import { translate } from '~i18n/translate';
import { RECURRENCE } from '../enums/Recurrence';
import { Event } from '../types/Event';
import EventIcon from './EventIcon';

type Props = {
  event: Event;
  darkColor: string;
};

const recurrenceSuffix = (recurrence: RECURRENCE): string => {
  if (recurrence === RECURRENCE.YEARLY) {
    return ` · ${translate('date.yearlySuffix')}`;
  }

  if (recurrence === RECURRENCE.MONTHLY) {
    return ` · ${translate('date.monthlySuffix')}`;
  }

  if (recurrence === RECURRENCE.WEEKLY) {
    return ` · ${translate('date.weeklySuffix')}`;
  }

  return '';
};

const EventDetailHero = memo((props: Props) => {
  const countdown = useMemo(
    () => formatCountdown(props.event.targetDate),
    [props.event.targetDate],
  );

  const dateLabel = useMemo(
    () => formatLongDate(props.event.targetDate),
    [props.event.targetDate],
  );

  const iconBackground = hexA(props.darkColor, 0.12);

  return (
    <View style={styles.root}>
      <View style={[styles.iconBlock, { backgroundColor: iconBackground }]}>
        <EventIcon icon={props.event.icon} size={44} />
      </View>
      <Text style={styles.title}>{props.event.title}</Text>
      <Text style={styles.dateLabel}>
        {dateLabel}
        {recurrenceSuffix(props.event.recurrence)}
      </Text>
      <View style={styles.countdownRow}>
        <Text style={[styles.countdownBig, tabular]}>{countdown.big}</Text>
        {countdown.unit !== '' && (
          <Text style={styles.countdownUnit}>{countdown.unit}</Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  iconBlock: {
    width: 80,
    height: 80,
    borderRadius: radius.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  dateLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs + 2,
    textTransform: 'lowercase',
  },
  countdownRow: {
    marginTop: spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    columnGap: spacing.md,
  },
  countdownBig: {
    ...typography.display,
    color: colors.textPrimary,
  },
  countdownUnit: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: -0.5,
  },
});

export default EventDetailHero;
