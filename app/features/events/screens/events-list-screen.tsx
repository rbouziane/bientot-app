import { memo, useCallback, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import { SCREEN_NAME, STACK_NAME } from '~shared/constants/Screen';
import ScreenContainer from '~shared/components/ScreenContainer';
import { colors, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';
import EventCard from '../components/EventCard';
import HomeEmpty from '../components/HomeEmpty';
import HomeFreeLimitCard from '../components/HomeFreeLimitCard';
import HomeHeader from '../components/HomeHeader';
import HomeTabs, { HomeTab } from '../components/HomeTabs';
import PassesHero from '../components/PassesHero';
import PastCard from '../components/PastCard';
import { useSeedDemoEvents } from '../hooks/useSeedDemoEvents';
import { useEventsQuery } from '../services/hook';
import { Event } from '../types/Event';
import {
  countPastThisYear,
  groupPastEvents,
  PastEventGroup,
  splitEventsByStatus,
} from '../utils/eventStatus';

const FREE_EVENT_LIMIT = 3;
// TODO: pull from IAP (paywall feature). The price is €3.99 during the
// first 4 launch weeks and switches to €4.99 after. Must come from the
// store, not hardcoded.
const LAUNCH_PRICE = '3,99 €';
const BOTTOM_NAV_SAFE_SPACE = 150;

const PAST_GROUP_LABEL_KEYS: Record<PastEventGroup['key'], string> = {
  thisMonth: 'passes.groupThisMonth',
  earlierThisYear: 'passes.groupEarlierYear',
  older: 'passes.groupOlder',
};

const keyExtractor = (event: Event) => event.id;

const ItemSeparator = memo(() => <View style={styles.separator} />);

const EventsListScreen = memo(() => {
  // TODO: wire to a real usePremiumQuery hook once the paywall is ready.
  const isPremium = false;

  const { events, isEventsPending, refetchEvents } = useEventsQuery();
  const { seedDemoEvents } = useSeedDemoEvents();

  const [tab, setTab] = useState<HomeTab>('active');

  const now = useMemo(() => new Date(), []);

  const { active, past } = useMemo(
    () => splitEventsByStatus(events ?? [], now),
    [events, now],
  );

  const visibleActive = useMemo(() => {
    if (isPremium) {
      return active;
    }
    return active.slice(0, FREE_EVENT_LIMIT);
  }, [active, isPremium]);

  const pastGroups = useMemo(() => groupPastEvents(past, now), [past, now]);
  const pastThisYearCount = useMemo(
    () => countPastThisYear(past, now),
    [past, now],
  );

  const showFreeLimit =
    !isPremium && tab === 'active' && active.length >= FREE_EVENT_LIMIT;

  const handlePressAdd = useCallback(() => {
    NavigatorUtils.navigate(STACK_NAME.DETAILS_STACK, {
      screen: SCREEN_NAME.EVENT_CREATE,
    });
  }, []);

  const handlePressCard = useCallback((eventId: string) => {
    NavigatorUtils.navigate(STACK_NAME.DETAILS_STACK, {
      screen: SCREEN_NAME.EVENT_DETAIL,
      params: { eventId },
    });
  }, []);

  const handlePressPremium = useCallback(() => {
    NavigatorUtils.navigate(STACK_NAME.DETAILS_STACK, {
      screen: SCREEN_NAME.PAYWALL,
    });
  }, []);

  // TODO: dev-only — long-pressing the "Bientôt" title seeds the demo
  // events. Remove (along with useSeedDemoEvents + demoData) once the
  // create-screen is functional.
  const handleLongPressTitle = __DEV__ ? seedDemoEvents : undefined;

  const renderItem = useCallback(
    ({ item }: { item: Event }) => (
      <EventCard event={item} onPress={handlePressCard} />
    ),
    [handlePressCard],
  );

  const renderFooter = useCallback(() => {
    if (!showFreeLimit) {
      return null;
    }

    return (
      <View style={styles.footerSpacing}>
        <HomeFreeLimitCard
          launchPrice={LAUNCH_PRICE}
          onPressPremium={handlePressPremium}
        />
      </View>
    );
  }, [showFreeLimit, handlePressPremium]);

  const isActiveTab = tab === 'active';
  const hasActiveContent = visibleActive.length > 0;
  const hasPastContent = past.length > 0;
  const showActiveEmpty =
    isActiveTab && !isEventsPending && active.length === 0;

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HomeHeader
          onPressAdd={handlePressAdd}
          onLongPressTitle={handleLongPressTitle}
        />
        <HomeTabs
          active={tab}
          activeCount={active.length}
          pastCount={past.length}
          onChange={setTab}
        />

        {isActiveTab && showActiveEmpty && (
          <HomeEmpty onPressCreate={handlePressAdd} />
        )}

        {isActiveTab && hasActiveContent && (
          <FlashList
            data={visibleActive}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isEventsPending}
                onRefresh={refetchEvents}
              />
            }
          />
        )}

        {!isActiveTab && (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isEventsPending}
                onRefresh={refetchEvents}
              />
            }
          >
            {hasPastContent && <PassesHero count={pastThisYearCount} />}
            {!hasPastContent && (
              <View style={styles.pastEmpty}>
                <Text style={styles.pastEmptyTitle}>
                  {translate('passesEmpty.title')}
                </Text>
                <Text style={styles.pastEmptySubtitle}>
                  {translate('passesEmpty.subtitle')}
                </Text>
              </View>
            )}
            {pastGroups.map(group => (
              <View key={group.key} style={styles.group}>
                <Text style={styles.groupLabel}>
                  {translate(PAST_GROUP_LABEL_KEYS[group.key])}
                </Text>
                <View style={styles.groupList}>
                  {group.events.map(event => (
                    <PastCard
                      key={event.id}
                      event={event}
                      onPress={handlePressCard}
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: BOTTOM_NAV_SAFE_SPACE,
    gap: spacing.md,
  },
  separator: {
    height: spacing.md,
  },
  footerSpacing: {
    paddingTop: spacing.md,
  },
  group: {
    marginTop: spacing.md,
  },
  groupLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
  },
  groupList: {
    gap: spacing.md,
  },
  pastEmpty: {
    alignItems: 'center',
    paddingTop: spacing.huge,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  pastEmptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  pastEmptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EventsListScreen;
