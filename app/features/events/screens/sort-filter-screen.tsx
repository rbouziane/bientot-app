import { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import Button from '~shared/components/Button';
import PremiumBadge from '~shared/components/PremiumBadge';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PALETTE } from '~shared/constants/Palette';
import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

type SortOptionId = 'closest' | 'furthest' | 'alpha' | 'color';

type SortOption = {
  id: SortOptionId;
  labelKey: string;
  isPremium: boolean;
};

const SORT_OPTIONS: SortOption[] = [
  { id: 'closest', labelKey: 'sort.sortClosest', isPremium: false },
  { id: 'furthest', labelKey: 'sort.sortFurthest', isPremium: false },
  { id: 'alpha', labelKey: 'sort.sortAlpha', isPremium: false },
  { id: 'color', labelKey: 'sort.sortColor', isPremium: true },
];

type GroupFilterId = 'all' | 'family' | 'travel' | 'pro' | 'concerts';

type GroupFilter = {
  id: GroupFilterId;
  labelKey: string;
  colorKey?: COLOR_KEY;
};

const GROUP_FILTERS: GroupFilter[] = [
  { id: 'all', labelKey: 'sort.groupAll' },
  {
    id: 'family',
    labelKey: 'groups.sampleFamily',
    colorKey: COLOR_KEY.LAVENDER,
  },
  { id: 'travel', labelKey: 'groups.sampleTravel', colorKey: COLOR_KEY.SKY },
  { id: 'pro', labelKey: 'groups.samplePro', colorKey: COLOR_KEY.SAGE },
  {
    id: 'concerts',
    labelKey: 'groups.sampleConcerts',
    colorKey: COLOR_KEY.PURPLE,
  },
];

// TODO: wire to a real usePremiumQuery once paywall is ready.
const IS_PREMIUM = false;

type SortRowProps = {
  option: SortOption;
  isSelected: boolean;
  isLast: boolean;
  onPress: (id: SortOptionId) => void;
};

const SortRow = memo((rowProps: SortRowProps) => {
  const isLocked = rowProps.option.isPremium && !IS_PREMIUM;

  const handlePress = useCallback(() => {
    if (isLocked) {
      return;
    }
    rowProps.onPress(rowProps.option.id);
  }, [isLocked, rowProps.onPress, rowProps.option.id]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.sortRow,
        !rowProps.isLast && styles.sortRowDivider,
        pressed && styles.sortRowPressed,
      ]}
    >
      <View style={styles.sortRowText}>
        <Text style={styles.sortRowLabel}>
          {translate(rowProps.option.labelKey)}
        </Text>
        {rowProps.option.isPremium && <PremiumBadge />}
      </View>
      {rowProps.isSelected && !isLocked && (
        <View style={styles.checkBubble}>
          <UiIcon name="check" size={13} color={colors.textOnDark} />
        </View>
      )}
      {isLocked && <UiIcon name="lock" size={14} color={colors.textMuted} />}
    </Pressable>
  );
});

type GroupChipProps = {
  filter: GroupFilter;
  isActive: boolean;
  onPress: (id: GroupFilterId) => void;
};

const GroupChip = memo((chipProps: GroupChipProps) => {
  const palette =
    chipProps.filter.colorKey != null
      ? PALETTE[chipProps.filter.colorKey]
      : null;

  const handlePress = useCallback(() => {
    chipProps.onPress(chipProps.filter.id);
  }, [chipProps.onPress, chipProps.filter.id]);

  let backgroundColor: string = colors.surfaceSoft;
  if (chipProps.isActive) {
    backgroundColor = colors.textPrimary;
  } else if (palette != null) {
    backgroundColor = palette.light;
  }

  const labelColor = chipProps.isActive
    ? colors.textOnDark
    : colors.textPrimary;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.groupChip,
        { backgroundColor },
        pressed && styles.groupChipPressed,
      ]}
    >
      {palette != null && !chipProps.isActive && (
        <View style={[styles.groupDot, { backgroundColor: palette.dark }]} />
      )}
      <Text style={[styles.groupChipLabel, { color: labelColor }]}>
        {translate(chipProps.filter.labelKey)}
      </Text>
    </Pressable>
  );
});

const SortFilterScreen = memo(() => {
  const [sort, setSort] = useState<SortOptionId>('closest');
  const [group, setGroup] = useState<GroupFilterId>('all');

  const handleClose = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleReset = useCallback(() => {
    setSort('closest');
    setGroup('all');
  }, []);

  const handleApply = useCallback(() => {
    // TODO: propagate to events query.
    NavigatorUtils.goBack();
  }, []);

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      <View style={styles.sheet}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <Text style={styles.title}>{translate('sort.title')}</Text>
            <Pressable onPress={handleReset} hitSlop={8}>
              <Text style={styles.resetLabel}>{translate('sort.reset')}</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>{translate('sort.sortBy')}</Text>
            <View style={styles.card}>
              {SORT_OPTIONS.map((option, index) => (
                <SortRow
                  key={option.id}
                  option={option}
                  isSelected={option.id === sort}
                  isLast={index === SORT_OPTIONS.length - 1}
                  onPress={setSort}
                />
              ))}
            </View>

            <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
              {translate('sort.filterByGroup')}
            </Text>
            <View style={styles.groupsRow}>
              {GROUP_FILTERS.map(filter => (
                <GroupChip
                  key={filter.id}
                  filter={filter}
                  isActive={filter.id === group}
                  onPress={setGroup}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.applyWrap}>
            <Button label={translate('sort.apply')} onPress={handleApply} />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: spacing.md,
    ...shadows.sheet,
  },
  handle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(26,26,26,0.18)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  resetLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md - 2,
  },
  sectionLabelSpaced: {
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
  },
  sortRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  sortRowPressed: {
    backgroundColor: colors.surfaceSoft,
  },
  sortRowText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sortRowLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  checkBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  groupChipPressed: {
    opacity: 0.85,
  },
  groupChipLabel: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  applyWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
});

export default SortFilterScreen;
