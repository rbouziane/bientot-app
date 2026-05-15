import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, tabular } from '~shared/theme';

export type HomeTab = 'active' | 'past';

type TabProps = {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
};

const Tab = memo((tabProps: TabProps) => {
  const backgroundColor = tabProps.isActive
    ? colors.textPrimary
    : 'transparent';
  const labelColor = tabProps.isActive
    ? colors.textOnDark
    : colors.textSecondary;
  const countColor = tabProps.isActive
    ? 'rgba(255,255,255,0.6)'
    : colors.textMuted;

  return (
    <Pressable
      onPress={tabProps.onPress}
      style={({ pressed }) => [
        styles.tab,
        { backgroundColor },
        pressed && styles.tabPressed,
      ]}
    >
      <Text style={[styles.tabLabel, { color: labelColor }]}>
        {tabProps.label}
      </Text>
      <Text style={[styles.tabCount, tabular, { color: countColor }]}>
        {tabProps.count}
      </Text>
    </Pressable>
  );
});

type Props = {
  active: HomeTab;
  activeCount: number;
  pastCount: number;
  onChange: (tab: HomeTab) => void;
};

const HomeTabs = memo((props: Props) => {
  const handlePressActive = useCallback(() => {
    props.onChange('active');
  }, [props.onChange]);

  const handlePressPast = useCallback(() => {
    props.onChange('past');
  }, [props.onChange]);

  return (
    <View style={styles.root}>
      <Tab
        label="Actifs"
        count={props.activeCount}
        isActive={props.active === 'active'}
        onPress={handlePressActive}
      />
      <Tab
        label="Passés"
        count={props.pastCount}
        isActive={props.active === 'past'}
        onPress={handlePressPast}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    padding: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    gap: spacing.xs,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabCount: {
    fontSize: 12,
  },
  tabPressed: {
    opacity: 0.85,
  },
});

export default HomeTabs;
