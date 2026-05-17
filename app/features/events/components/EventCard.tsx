import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PALETTE } from '~shared/constants/Palette';
import {
  colors,
  radius,
  shadows,
  spacing,
  tabular,
  typography,
} from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import {
  formatCountdown,
  formatLongDate,
  progressFill,
} from '~shared/utils/date';
import { RECURRENCE } from '../enums/Recurrence';
import { Event } from '../types/Event';
import IconBadge from './IconBadge';
import RecurrenceChip from './RecurrenceChip';

type Variant = 'horizontal' | 'vertical';

type Props = {
  event: Event;
  variant?: Variant;
  onPress: (eventId: string) => void;
};

const EventCard = memo((props: Props) => {
  const variant: Variant = props.variant ?? 'horizontal';
  const color = PALETTE[props.event.colorKey];

  const countdown = useMemo(
    () => formatCountdown(props.event.targetDate),
    [props.event.targetDate],
  );
  const fill = useMemo(
    () => progressFill(props.event.targetDate),
    [props.event.targetDate],
  );
  const dateLabel = useMemo(
    () => formatLongDate(props.event.targetDate),
    [props.event.targetDate],
  );

  const showRecurrence =
    props.event.recurrence !== RECURRENCE.NONE && !countdown.isPast;

  const fillStyle = useMemo(() => {
    if (variant === 'vertical') {
      return {
        left: 0,
        right: 0,
        bottom: 0,
        height: `${fill * 100}%` as `${number}%`,
      };
    }
    return {
      left: 0,
      top: 0,
      bottom: 0,
      width: `${fill * 100}%` as `${number}%`,
    };
  }, [variant, fill]);

  const handlePress = useCallback(() => {
    props.onPress(props.event.id);
  }, [props.event.id, props.onPress]);

  const cardBackground = hexA(color.dark, 0.06);
  const fillBackground = hexA(color.dark, 0.16);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        shadows.card,
        { backgroundColor: cardBackground },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: color.light }]}
      />
      <View
        style={[styles.fill, fillStyle, { backgroundColor: fillBackground }]}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <IconBadge icon={props.event.icon} size={38} />
          <View style={styles.titleColumn}>
            <Text style={styles.title} numberOfLines={1}>
              {props.event.title}
            </Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle} numberOfLines={1}>
                {dateLabel}
              </Text>
              {showRecurrence && (
                <RecurrenceChip recurrence={props.event.recurrence} />
              )}
            </View>
          </View>
        </View>
        <View style={styles.countdownRow}>
          <Text
            style={[
              styles.countdownBig,
              tabular,
              countdown.isToday && styles.countdownBigToday,
            ]}
          >
            {countdown.big}
          </Text>
          {countdown.unit !== '' && (
            <Text style={styles.countdownUnit}>{countdown.unit}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 3,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textTransform: 'lowercase',
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  countdownBig: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 30,
    color: colors.textPrimary,
  },
  countdownBigToday: {
    fontSize: 32,
    lineHeight: 32,
  },
  countdownUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  pressed: {
    opacity: 0.92,
  },
});

export default EventCard;
