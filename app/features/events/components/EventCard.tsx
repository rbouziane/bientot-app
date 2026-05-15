import { memo, useCallback, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import NativeIcon from '~shared/components/NativeIcon';
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
  daysFromNow,
  formatCountdown,
  formatLongDate,
  progressFill,
} from '~shared/utils/date';
import { RECURRENCE } from '../enums/Recurrence';
import { Event } from '../types/Event';
import IconBadge from './IconBadge';

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
  const absoluteDays = useMemo(
    () => Math.abs(daysFromNow(props.event.targetDate)),
    [props.event.targetDate],
  );

  const isRecurrent =
    props.event.recurrence !== RECURRENCE.NONE && !countdown.isPast;

  const pulse = useSharedValue(0.35);

  useEffect(() => {
    if (!countdown.isToday) {
      return;
    }

    pulse.value = withRepeat(withTiming(0.6, { duration: 1500 }), -1, true);

    return () => {
      cancelAnimation(pulse);
      pulse.value = 0.35;
    };
  }, [countdown.isToday, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

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
  const ringColor = hexA(color.dark, 0.45);
  const daysSubtitle =
    countdown.isToday || countdown.isSoon ? null : `${absoluteDays} jours`;

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
      {countdown.isToday && (
        <Animated.View
          pointerEvents="none"
          style={[styles.pulseRing, { borderColor: ringColor }, pulseStyle]}
        />
      )}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <IconBadge icon={props.event.icon} darkColor={color.dark} size={38} />
          <View style={styles.titleColumn}>
            <Text style={styles.title} numberOfLines={1}>
              {props.event.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {dateLabel}
            </Text>
          </View>
          {isRecurrent && (
            <View style={styles.recurrenceIcon}>
              <NativeIcon
                iosName="arrow.2.circlepath"
                androidName="autorenew"
                size={14}
                color={hexA(color.dark, 0.7)}
              />
            </View>
          )}
        </View>
        <View style={styles.countdownRow}>
          <Text style={[styles.countdownBig, tabular]}>{countdown.big}</Text>
          {countdown.unit !== '' && (
            <Text style={styles.countdownUnit}>{countdown.unit}</Text>
          )}
          {daysSubtitle != null && (
            <Text style={styles.countdownSub}>· {daysSubtitle}</Text>
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
  pulseRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.xxl,
    borderWidth: 2,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
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
  subtitle: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'lowercase',
  },
  recurrenceIcon: {
    paddingTop: spacing.xs,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  countdownBig: {
    ...typography.countdownMedium,
    color: colors.textPrimary,
  },
  countdownUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  countdownSub: {
    fontSize: 13,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.92,
  },
});

export default EventCard;
