import { memo, useCallback, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';
import EventsIcon from '~shared/assets/icons/nav/events.svg';
import SettingsIcon from '~shared/assets/icons/nav/settings.svg';
import WidgetsIcon from '~shared/assets/icons/nav/widgets.svg';
import { STACK_NAME } from '~shared/constants/Screen';
import { colors, shadows, spacing } from '~shared/theme';

type NavTabId = 'events' | 'widgets' | 'settings';

type TabSpec = {
  id: NavTabId;
  label: string;
  stack: STACK_NAME;
};

const TABS: TabSpec[] = [
  { id: 'events', label: 'Dates', stack: STACK_NAME.HOME_STACK },
  { id: 'widgets', label: 'Widgets', stack: STACK_NAME.WIDGETS_STACK },
  { id: 'settings', label: 'Réglages', stack: STACK_NAME.SETTINGS_STACK },
];

const ICON_BY_ID = {
  events: EventsIcon,
  widgets: WidgetsIcon,
  settings: SettingsIcon,
};

const INK_COLORS = [colors.inkStart, colors.inkMid, colors.inkEnd];

const ICON_SIZE = 20;
const TAB_RADIUS = 24;
const TRANSITION_DURATION = 280;
const TRANSITION_EASING = Easing.bezier(0.2, 0.7, 0.3, 1);
const FLEX_INACTIVE = 1;
const FLEX_ACTIVE = 1.45;

type TabItemProps = {
  spec: TabSpec;
  isActive: boolean;
  onPress: (id: NavTabId) => void;
};

const TabItem = memo((itemProps: TabItemProps) => {
  const Icon = ICON_BY_ID[itemProps.spec.id];

  const handlePress = useCallback(() => {
    itemProps.onPress(itemProps.spec.id);
  }, [itemProps.onPress, itemProps.spec.id]);

  const progress = useSharedValue(itemProps.isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(itemProps.isActive ? 1 : 0, {
      duration: TRANSITION_DURATION,
      easing: TRANSITION_EASING,
    });
  }, [itemProps.isActive, progress]);

  const flexStyle = useAnimatedStyle(() => ({
    flex: interpolate(progress.value, [0, 1], [FLEX_INACTIVE, FLEX_ACTIVE]),
  }));

  const fillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const darkIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const lightIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <Animated.View style={[styles.tab, flexStyle]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <Animated.View pointerEvents="none" style={[styles.fill, fillStyle]}>
          <LinearGradient
            colors={INK_COLORS}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.fillGradient}
          />
        </Animated.View>
        <View style={styles.row}>
          <View style={styles.iconSlot}>
            <Animated.View style={[styles.iconLayer, darkIconStyle]}>
              <Icon
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={colors.textPrimary}
              />
            </Animated.View>
            <Animated.View style={[styles.iconLayer, lightIconStyle]}>
              <Icon
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={colors.textOnDark}
              />
            </Animated.View>
          </View>
          {itemProps.isActive && (
            <Animated.Text
              entering={FadeIn.duration(160).delay(80)}
              exiting={FadeOut.duration(80)}
              style={styles.label}
            >
              {itemProps.spec.label}
            </Animated.Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});

const BottomNav = memo((props: BottomTabBarProps) => {
  const activeRouteName = props.state.routes[props.state.index]?.name;

  const handlePress = useCallback(
    (id: NavTabId) => {
      const spec = TABS.find(tab => tab.id === id);
      if (spec == null) {
        return;
      }

      const target = props.state.routes.find(
        (route: NavigationRoute<ParamListBase, string>) =>
          route.name === spec.stack,
      );
      if (target == null) {
        return;
      }

      const event = props.navigation.emit({
        type: 'tabPress',
        target: target.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        return;
      }

      props.navigation.navigate(target.name, target.params);
    },
    [props.navigation, props.state.routes],
  );

  const tabs = TABS.map(spec => (
    <TabItem
      key={spec.id}
      spec={spec}
      isActive={spec.stack === activeRouteName}
      onPress={handlePress}
    />
  ));

  return (
    <View pointerEvents="box-none" style={styles.root}>
      {Platform.OS === 'ios' ? (
        <BlurView
          blurType="xlight"
          blurAmount={20}
          reducedTransparencyFallbackColor={colors.surfaceTranslucentStrong}
          style={[styles.shell, styles.shellIos]}
        >
          {tabs}
        </BlurView>
      ) : (
        <View style={[styles.shell, styles.shellAndroid]}>{tabs}</View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 38,
    left: spacing.xl,
    right: spacing.xl,
  },
  shell: {
    borderRadius: 30,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    ...shadows.ctaInk,
  },
  shellIos: {
    backgroundColor: 'rgba(255,253,250,0.4)',
  },
  shellAndroid: {
    backgroundColor: 'rgba(255,253,250,0.92)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
  },
  tab: {
    minHeight: 44,
    borderRadius: TAB_RADIUS,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: TAB_RADIUS,
    overflow: 'hidden',
  },
  fillGradient: {
    flex: 1,
    borderRadius: TAB_RADIUS,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  iconSlot: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
    color: colors.textOnDark,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default BottomNav;
