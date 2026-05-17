import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, tabular } from '~shared/theme';
import { translate } from '~i18n/translate';

export type HomeTab = 'active' | 'past';

type TabProps = {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
};

const Tab = memo((tabProps: TabProps) => {
  const labelColor = tabProps.isActive
    ? colors.textPrimary
    : colors.textSecondary;
  const countColor = tabProps.isActive ? colors.textPrimary : colors.textMuted;
  const countBackground = tabProps.isActive
    ? 'rgba(26,26,26,0.08)'
    : 'rgba(26,26,26,0.04)';

  return (
    <Pressable
      onPress={tabProps.onPress}
      style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
    >
      <View style={styles.tabRow}>
        <Text
          style={[
            styles.tabLabel,
            { color: labelColor },
            tabProps.isActive && styles.tabLabelActive,
          ]}
        >
          {tabProps.label}
        </Text>
        <View style={[styles.countChip, { backgroundColor: countBackground }]}>
          <Text style={[styles.countLabel, tabular, { color: countColor }]}>
            {tabProps.count}
          </Text>
        </View>
      </View>
      {tabProps.isActive && <View style={styles.underline} />}
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
        label={translate('events.tabActive')}
        count={props.activeCount}
        isActive={props.active === 'active'}
        onPress={handlePressActive}
      />
      <Tab
        label={translate('events.tabPassed')}
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
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xxl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tab: {
    position: 'relative',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: 2,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  countChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  countLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
  },
  tabPressed: {
    opacity: 0.85,
  },
});

export default HomeTabs;
