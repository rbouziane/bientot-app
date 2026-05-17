import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, tabular } from '~shared/theme';
import { daysFromNow, formatLongDate } from '~shared/utils/date';
import { translate } from '~i18n/translate';
import { Event } from '../types/Event';
import IconBadge from './IconBadge';

type Props = {
  event: Event;
  waitedMonths?: number;
  onPress: (eventId: string) => void;
};

const PastCard = memo((props: Props) => {
  const days = Math.abs(daysFromNow(props.event.targetDate));
  const dateLabel = formatLongDate(props.event.targetDate);

  const handlePress = useCallback(() => {
    props.onPress(props.event.id);
  }, [props.event.id, props.onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <IconBadge icon={props.event.icon} size={34} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {props.event.title}
        </Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.date}>{dateLabel}</Text>
          {props.waitedMonths != null && (
            <>
              <Text style={styles.separator}>·</Text>
              <Text style={styles.waited}>
                {translate('passes.waitedMonths', {
                  count: props.waitedMonths,
                })}
              </Text>
            </>
          )}
        </View>
      </View>
      <Text style={[styles.daysAgo, tabular]}>
        {translate('date.daysAgoBig', { count: days })}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
    opacity: 0.92,
    ...shadows.card,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
    color: colors.textPrimary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  date: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  separator: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
  waited: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  daysAgo: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default PastCard;
