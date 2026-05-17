import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PALETTE } from '~shared/constants/Palette';
import { colors, radius, shadows, spacing } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

type GroupSample = {
  id: string;
  nameKey: string;
  colorKey: COLOR_KEY;
  count: number;
  pastilleColors: COLOR_KEY[];
};

const SAMPLE_GROUPS: GroupSample[] = [
  {
    id: 'family',
    nameKey: 'groups.sampleFamily',
    colorKey: COLOR_KEY.LAVENDER,
    count: 4,
    pastilleColors: [COLOR_KEY.PINK, COLOR_KEY.GREEN, COLOR_KEY.ORANGE],
  },
  {
    id: 'travel',
    nameKey: 'groups.sampleTravel',
    colorKey: COLOR_KEY.SKY,
    count: 3,
    pastilleColors: [COLOR_KEY.PEACH, COLOR_KEY.PURPLE, COLOR_KEY.MINT],
  },
  {
    id: 'pro',
    nameKey: 'groups.samplePro',
    colorKey: COLOR_KEY.SAGE,
    count: 2,
    pastilleColors: [COLOR_KEY.YELLOW, COLOR_KEY.PINK],
  },
  {
    id: 'concerts',
    nameKey: 'groups.sampleConcerts',
    colorKey: COLOR_KEY.PURPLE,
    count: 5,
    pastilleColors: [COLOR_KEY.ROSE, COLOR_KEY.SKY, COLOR_KEY.GREEN],
  },
];

type RowProps = {
  group: GroupSample;
};

const GroupRow = memo((props: RowProps) => {
  const palette = PALETTE[props.group.colorKey];
  const visiblePastilles = props.group.pastilleColors.slice(0, 3);

  return (
    <View style={[styles.row, { backgroundColor: palette.light }]}>
      <View style={[styles.spine, { backgroundColor: palette.dark }]} />
      <View
        style={[
          styles.iconBubble,
          { backgroundColor: hexA(palette.dark, 0.18) },
        ]}
      >
        <Text style={[styles.iconEmoji, { color: palette.dark }]}>👥</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.name}>{translate(props.group.nameKey)}</Text>
        <Text style={styles.count}>
          {translate(
            props.group.count > 1 ? 'groups.count' : 'groups.countOne',
            { count: props.group.count },
          )}
        </Text>
      </View>
      <View style={styles.pastilles}>
        {visiblePastilles.map((key, index) => (
          <View
            key={key}
            style={[
              styles.pastille,
              {
                backgroundColor: PALETTE[key].dark,
                borderColor: palette.light,
                marginLeft: index === 0 ? 0 : -8,
              },
            ]}
          />
        ))}
      </View>
      <UiIcon name="chevronRight" size={12} color={colors.textMuted} />
    </View>
  );
});

const GroupsScreen = memo(() => {
  const handleBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleAdd = useCallback(() => {
    // TODO: open create-group flow.
  }, []);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerRow}>
          <CircleButton
            icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
            onPress={handleBack}
          />
          <Text style={styles.headerTitle}>{translate('groups.title')}</Text>
          <CircleButton
            icon={<UiIcon name="plus" size={18} color={colors.textOnDark} />}
            tone="ink"
            onPress={handleAdd}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.hint}>{translate('groups.hint')}</Text>
          {SAMPLE_GROUPS.map(group => (
            <GroupRow key={group.id} group={group} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
    gap: 10,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.card,
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    opacity: 0.7,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  iconEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  text: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  count: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pastilles: {
    flexDirection: 'row',
    marginRight: 6,
  },
  pastille: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
});

export default GroupsScreen;
