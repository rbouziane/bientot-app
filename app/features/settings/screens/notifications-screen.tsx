import { memo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import BientotLogo from '~shared/assets/icons/bientot-logo.svg';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import {
  colors,
  radius,
  shadows,
  spacing,
  tabular,
  typography,
} from '~shared/theme';
import { translate } from '~i18n/translate';

const IOS_SWITCH_ON = '#30D158';

type OffsetKey =
  | 'oneWeekBefore'
  | 'threeDaysBefore'
  | 'oneDayBefore'
  | 'oneHourBefore'
  | 'fifteenMinBefore'
  | 'dayOfAtTime';

type Offset = {
  key: OffsetKey;
  labelKey: string;
};

const OFFSETS: Offset[] = [
  { key: 'oneWeekBefore', labelKey: 'notifConfig.oneWeekBefore' },
  { key: 'threeDaysBefore', labelKey: 'notifConfig.threeDaysBefore' },
  { key: 'oneDayBefore', labelKey: 'notifConfig.oneDayBefore' },
  { key: 'oneHourBefore', labelKey: 'notifConfig.oneHourBefore' },
  { key: 'fifteenMinBefore', labelKey: 'notifConfig.fifteenMinBefore' },
  { key: 'dayOfAtTime', labelKey: 'notifConfig.dayOfAtTime' },
];

type RowProps = {
  label: string;
  isLast: boolean;
  isEnabled: boolean;
  onToggle: (next: boolean) => void;
};

const OffsetRow = memo((rowProps: RowProps) => {
  return (
    <View style={[styles.row, !rowProps.isLast && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{rowProps.label}</Text>
      <Switch
        value={rowProps.isEnabled}
        onValueChange={rowProps.onToggle}
        trackColor={{ false: 'rgba(26,26,26,0.12)', true: IOS_SWITCH_ON }}
        thumbColor={colors.surface}
        ios_backgroundColor="rgba(26,26,26,0.12)"
      />
    </View>
  );
});

const NotificationsScreen = memo(() => {
  // TODO: persist in MMKV STORAGE_KEY.USER_PREFERENCES + sync with notifee
  // scheduled defaults.
  const [enabled, setEnabled] = useState<Record<OffsetKey, boolean>>({
    oneWeekBefore: true,
    threeDaysBefore: false,
    oneDayBefore: true,
    oneHourBefore: false,
    fifteenMinBefore: false,
    dayOfAtTime: true,
  });

  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleToggle = useCallback((key: OffsetKey, next: boolean) => {
    setEnabled(current => ({ ...current, [key]: next }));
  }, []);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerRow}>
          <CircleButton
            icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
            onPress={handlePressBack}
          />
          <Text style={styles.headerTitle}>
            {translate('notifConfig.title')}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.hint}>{translate('notifConfig.hint')}</Text>

          <View style={styles.card}>
            {OFFSETS.map((offset, index) => {
              const handle = (next: boolean) => handleToggle(offset.key, next);
              return (
                <OffsetRow
                  key={offset.key}
                  label={translate(offset.labelKey)}
                  isLast={index === OFFSETS.length - 1}
                  isEnabled={enabled[offset.key]}
                  onToggle={handle}
                />
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
            {translate('notifConfig.previewLabel')}
          </Text>
          <View style={styles.previewCard}>
            <BientotLogo width={36} height={36} />
            <View style={styles.previewBody}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>
                  {translate('notifConfig.previewTitle')}
                </Text>
                <Text style={[styles.previewTime, tabular]}>
                  {translate('notifConfig.previewTime')}
                </Text>
              </View>
              <Text style={styles.previewMessage}>
                {translate('notifConfig.previewBody')}
              </Text>
            </View>
          </View>
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
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionLabelSpaced: {
    marginTop: spacing.xxl,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    gap: spacing.md,
    ...shadows.card,
  },
  previewBody: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  previewTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  previewMessage: {
    fontSize: 13.5,
    color: colors.textPrimary,
    marginTop: 2,
  },
});

export default NotificationsScreen;
