import { memo, useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { DetailsStackParamList } from '~/navigators/DetailsStack';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import Button from '~shared/components/Button';
import Confetti from '~shared/components/Confetti';
import { PALETTE } from '~shared/constants/Palette';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { colors, spacing, typography } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { formatCountdown, formatTime, progressFill } from '~shared/utils/date';
import { translate } from '~i18n/translate';
import EventDetailActions from '../components/EventDetailActions';
import EventDetailHeader from '../components/EventDetailHeader';
import EventDetailHero from '../components/EventDetailHero';
import EventDetailNotes from '../components/EventDetailNotes';
import EventIcon from '../components/EventIcon';
import { useEventQuery } from '../services/hook';
import { Event } from '../types/Event';

type EventDetailRoute = RouteProp<
  DetailsStackParamList,
  SCREEN_NAME.EVENT_DETAIL
>;

const FILL_ENTER_DURATION = 700;

const TodayContent = memo((todayProps: { event: Event; darkColor: string }) => {
  const iconBackground = hexA(todayProps.darkColor, 0.18);
  const ctaLabel = translate('detail.actionEdit');

  const handlePressEdit = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.EVENT_EDIT, {
      eventId: todayProps.event.id,
    });
  }, [todayProps.event.id]);

  return (
    <>
      <View style={styles.todayContent}>
        <View
          style={[styles.todayIconBlock, { backgroundColor: iconBackground }]}
        >
          <EventIcon icon={todayProps.event.icon} size={52} />
        </View>
        <Text style={styles.todayTitle}>{todayProps.event.title}</Text>
        <Text style={styles.todayBig}>{translate('detail.todayBig')}</Text>
        <Text style={styles.todayDate}>
          {formatTime(todayProps.event.targetDate)}
        </Text>
      </View>
      <View style={styles.todayCta}>
        <Button
          label={ctaLabel}
          tone="color"
          color={todayProps.darkColor}
          onPress={handlePressEdit}
        />
      </View>
    </>
  );
});

const EventDetailScreen = memo(() => {
  const route = useRoute<EventDetailRoute>();
  const eventId = route.params.eventId;

  const { event, isEventPending, eventError } = useEventQuery(eventId);

  const color = useMemo(() => {
    if (event == null) {
      return null;
    }

    return PALETTE[event.colorKey];
  }, [event]);

  const targetFill = useMemo(() => {
    if (event == null) {
      return 0;
    }

    return progressFill(event.targetDate);
  }, [event]);

  const countdown = useMemo(() => {
    if (event == null) {
      return null;
    }

    return formatCountdown(event.targetDate);
  }, [event]);

  const fillProgress = useSharedValue(0);

  useEffect(() => {
    if (event == null) {
      return;
    }

    fillProgress.value = withTiming(targetFill, {
      duration: FILL_ENTER_DURATION,
    });
  }, [event, targetFill, fillProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillProgress.value * 100}%`,
  }));

  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handlePressEdit = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.EVENT_EDIT, { eventId });
  }, [eventId]);

  const handlePressWidget = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.WIDGETS_CONFIG);
  }, []);

  const handlePressShare = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.SHARE_CARD, { eventId });
  }, [eventId]);

  const handlePressDelete = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.DELETE_CONFIRM, { eventId });
  }, [eventId]);

  if (isEventPending) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.textPrimary} />
      </View>
    );
  }

  if (
    eventError != null ||
    event == null ||
    color == null ||
    countdown == null
  ) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>
          {translate('error.event.notFound')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: color.light }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          { backgroundColor: hexA(color.dark, 0.13) },
          fillStyle,
        ]}
      />
      {countdown.isToday && <Confetti baseColor={color.dark} />}
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <EventDetailHeader onPressBack={handlePressBack} />
        {countdown.isToday && (
          <TodayContent event={event} darkColor={color.dark} />
        )}
        {!countdown.isToday && (
          <View style={styles.body}>
            <EventDetailHero event={event} darkColor={color.dark} />
            {event.notes != null && event.notes.length > 0 && (
              <EventDetailNotes notes={event.notes} />
            )}
            <View style={styles.actionsWrap}>
              <EventDetailActions
                onPressEdit={handlePressEdit}
                onPressWidget={handlePressWidget}
                onPressShare={handlePressShare}
                onPressDelete={handlePressDelete}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  safe: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  body: {
    flex: 1,
  },
  actionsWrap: {
    marginTop: 'auto',
    paddingBottom: spacing.xxl,
  },
  todayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  todayIconBlock: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  todayTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  todayBig: {
    ...typography.displayMedium,
    color: colors.textPrimary,
    marginTop: spacing.xxxl,
    textAlign: 'center',
  },
  todayDate: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
  todayCta: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
});

export default EventDetailScreen;
