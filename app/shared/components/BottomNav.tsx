import { memo, ReactNode, useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { STACK_NAME } from '~shared/constants/Screen';
import { colors, radius, shadows, spacing } from '~shared/theme';

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

const renderIcon = (id: NavTabId, color: string) => {
  if (id === 'events') {
    return (
      <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
        <Rect
          x={3}
          y={4.5}
          width={16}
          height={14}
          rx={3}
          stroke={color}
          strokeWidth={1.8}
        />
        <Path d="M3 9h16" stroke={color} strokeWidth={1.8} />
        <Path
          d="M7 3v3M15 3v3"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <Circle cx={8} cy={13.5} r={1.2} fill={color} />
        <Circle cx={14} cy={13.5} r={1.2} fill={color} />
      </Svg>
    );
  }

  if (id === 'widgets') {
    return (
      <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
        <Rect
          x={3}
          y={3}
          width={7}
          height={7}
          rx={1.8}
          stroke={color}
          strokeWidth={1.8}
        />
        <Rect
          x={12}
          y={3}
          width={7}
          height={7}
          rx={1.8}
          stroke={color}
          strokeWidth={1.8}
        />
        <Rect
          x={3}
          y={12}
          width={7}
          height={7}
          rx={1.8}
          stroke={color}
          strokeWidth={1.8}
        />
        <Rect x={12} y={12} width={7} height={7} rx={1.8} fill={color} />
      </Svg>
    );
  }

  const dotFill = color === colors.textOnDark ? colors.inkMid : colors.surface;
  return (
    <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
      <Path
        d="M3 6h11M3 11h8M3 16h13"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle
        cx={16}
        cy={6}
        r={2.2}
        fill={dotFill}
        stroke={color}
        strokeWidth={1.8}
      />
      <Circle
        cx={13}
        cy={11}
        r={2.2}
        fill={dotFill}
        stroke={color}
        strokeWidth={1.8}
      />
      <Circle
        cx={18}
        cy={16}
        r={2.2}
        fill={dotFill}
        stroke={color}
        strokeWidth={1.8}
      />
    </Svg>
  );
};

const INK_COLORS = [colors.inkStart, colors.inkMid, colors.inkEnd];

type TabItemProps = {
  spec: TabSpec;
  isActive: boolean;
  onPress: (id: NavTabId) => void;
};

const TabItem = memo((itemProps: TabItemProps) => {
  const handlePress = useCallback(() => {
    itemProps.onPress(itemProps.spec.id);
  }, [itemProps.onPress, itemProps.spec.id]);

  const iconColor = itemProps.isActive ? colors.textOnDark : colors.textPrimary;
  const flexValue = itemProps.isActive ? 1.45 : 1;

  if (itemProps.isActive) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.tabBase,
          { flex: flexValue },
          pressed && styles.tabPressed,
        ]}
      >
        <LinearGradient
          colors={INK_COLORS}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.tabActiveFill}
        >
          {renderIcon(itemProps.spec.id, iconColor)}
          <Text style={styles.activeLabel}>{itemProps.spec.label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.tabBase,
        styles.tabInactive,
        { flex: flexValue },
        pressed && styles.tabPressed,
      ]}
    >
      {renderIcon(itemProps.spec.id, iconColor)}
    </Pressable>
  );
});

const Container = memo((containerProps: { children: ReactNode }) => {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        blurType="xlight"
        blurAmount={20}
        reducedTransparencyFallbackColor={colors.surfaceTranslucentStrong}
        style={[styles.shell, styles.shellIos]}
      >
        {containerProps.children}
      </BlurView>
    );
  }

  return (
    <View style={[styles.shell, styles.shellAndroid]}>
      {containerProps.children}
    </View>
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
        route => route.name === spec.stack,
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

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <Container>
        {TABS.map(spec => (
          <TabItem
            key={spec.id}
            spec={spec}
            isActive={spec.stack === activeRouteName}
            onPress={handlePress}
          />
        ))}
      </Container>
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
  tabBase: {
    minHeight: 44,
    borderRadius: radius.xxxl,
    overflow: 'hidden',
  },
  tabInactive: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActiveFill: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  activeLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
    color: colors.textOnDark,
  },
  tabPressed: {
    opacity: 0.85,
  },
});

export default BottomNav;
