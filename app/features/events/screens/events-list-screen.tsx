import { memo, useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import { SCREEN_NAME, STACK_NAME } from '~shared/constants/Screen';
import ScreenContainer from '~shared/components/ScreenContainer';
import { spacing } from '~shared/theme';
import EventCard from '../components/EventCard';
import HomeEmpty from '../components/HomeEmpty';
import HomeFreeLimitCard from '../components/HomeFreeLimitCard';
import HomeHeader from '../components/HomeHeader';
import HomeTabs, { HomeTab } from '../components/HomeTabs';
import { useSeedDemoEvents } from '../hooks/useSeedDemoEvents';
import { useEventsQuery } from '../services/hook';
import { Event } from '../types/Event';
import { splitEventsByStatus } from '../utils/eventStatus';

const FREE_EVENT_LIMIT = 3;
// TODO: pull from IAP (paywall feature). The price is €3.99 during the
// first 4 launch weeks and switches to €4.99 after. Must come from the
// store, not hardcoded.
const LAUNCH_PRICE = '3,99 €';

const keyExtractor = (event: Event) => event.id;

const ItemSeparator = memo(() => <View style={styles.separator} />);

const EventsListScreen = memo(() => {
  // TODO: wire to a real usePremiumQuery hook once the paywall is ready.
  const isPremium = true;

  const { events, isEventsPending, refetchEvents } = useEventsQuery();
  const { seedDemoEvents } = useSeedDemoEvents();

  const [tab, setTab] = useState<HomeTab>('active');

  const { active, past } = useMemo(
    () => splitEventsByStatus(events ?? [], new Date()),
    [events],
  );

  const displayedEvents = tab === 'active' ? active : past;

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

  const hasContent = displayedEvents.length > 0;

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HomeHeader
          count={active.length}
          isPremium={isPremium}
          onPressAdd={handlePressAdd}
          onLongPressTitle={handleLongPressTitle}
        />
        <HomeTabs
          active={tab}
          activeCount={active.length}
          pastCount={past.length}
          onChange={setTab}
        />
        {!hasContent && !isEventsPending && tab === 'active' && (
          <HomeEmpty onPressCreate={handlePressAdd} />
        )}
        {hasContent && (
          <FlashList
            data={displayedEvents}
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
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.md,
  },
  footerSpacing: {
    paddingTop: spacing.md,
  },
});

export default EventsListScreen;
