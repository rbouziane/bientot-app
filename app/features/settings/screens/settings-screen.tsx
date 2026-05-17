import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import FieldGroup from '~shared/components/FieldGroup';
import FieldRow from '~shared/components/FieldRow';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { colors, radius, spacing, tabular, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

const BOTTOM_NAV_SAFE_SPACE = 150;
const IOS_SWITCH_ON = '#30D158';

// TODO: wire to a real usePremiumQuery once paywall is ready.
const IS_PREMIUM = true;

type RowChevronProps = {
  value?: string;
};

const RowChevron = memo((props: RowChevronProps) => {
  return (
    <View style={styles.rowRight}>
      {props.value != null && (
        <Text style={styles.rowValue}>{props.value}</Text>
      )}
      <UiIcon name="chevronRight" size={12} color={colors.textMuted} />
    </View>
  );
});

const PremiumBanner = memo(() => {
  return (
    <View style={styles.premiumBanner}>
      <View style={styles.premiumCheck}>
        <UiIcon name="check" size={22} color={colors.textOnDark} />
      </View>
      <View style={styles.premiumText}>
        <Text style={styles.premiumTitle}>
          {translate('settings.premiumActive')}
        </Text>
        <Text style={styles.premiumSubtitle}>
          {translate('settings.premiumThanks')}
        </Text>
      </View>
    </View>
  );
});

const SettingsScreen = memo(() => {
  const handleOpenLanguage = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.SETTINGS_LANGUAGE);
  }, []);

  const handleOpenNotifications = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.SETTINGS_NOTIFICATIONS);
  }, []);

  const handleOpenAbout = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.ABOUT);
  }, []);

  const handleOpenHelp = useCallback(() => {
    NavigatorUtils.navigate(SCREEN_NAME.HELP);
  }, []);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{translate('settings.title')}</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {IS_PREMIUM && <PremiumBanner />}

          <FieldGroup label={translate('settings.sectionAppearance')}>
            <FieldRow onPress={handleOpenLanguage}>
              <Text style={styles.rowLabel}>
                {translate('settings.rowLanguage')}
              </Text>
              <RowChevron value={translate('settings.valueFrench')} />
            </FieldRow>
            <FieldRow>
              <Text style={styles.rowLabel}>
                {translate('settings.rowFirstDayOfWeek')}
              </Text>
              <RowChevron value={translate('settings.valueMonday')} />
            </FieldRow>
            <FieldRow isLast>
              <View style={styles.rowLabelWithBadge}>
                <Text style={styles.rowLabel}>
                  {translate('settings.rowTheme')}
                </Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonLabel}>
                    {translate('settings.valueDarkSoon')}
                  </Text>
                </View>
              </View>
              <RowChevron value={translate('settings.valueLight')} />
            </FieldRow>
          </FieldGroup>

          <FieldGroup label={translate('settings.sectionNotifications')}>
            <FieldRow>
              <Text style={styles.rowLabel}>
                {translate('settings.rowGlobalNotifications')}
              </Text>
              <Switch
                value
                trackColor={{
                  false: 'rgba(26,26,26,0.12)',
                  true: IOS_SWITCH_ON,
                }}
                thumbColor={colors.surface}
                ios_backgroundColor="rgba(26,26,26,0.12)"
              />
            </FieldRow>
            <FieldRow isLast onPress={handleOpenNotifications}>
              <Text style={styles.rowLabel}>
                {translate('settings.rowDefaultReminders')}
              </Text>
              <RowChevron value={translate('settings.valueThreeOffsets')} />
            </FieldRow>
          </FieldGroup>

          <FieldGroup label={translate('settings.sectionData')}>
            <FieldRow>
              <Text style={styles.rowLabel}>
                {translate('settings.rowExport')}
              </Text>
              <RowChevron />
            </FieldRow>
            <FieldRow isLast>
              <Text style={[styles.rowLabel, styles.rowLabelDanger]}>
                {translate('settings.rowDeleteData')}
              </Text>
            </FieldRow>
          </FieldGroup>

          <FieldGroup label={translate('settings.sectionHelpContact')}>
            <FieldRow onPress={handleOpenHelp}>
              <Text style={styles.rowLabel}>
                {translate('settings.rowHelpCenter')}
              </Text>
              <RowChevron />
            </FieldRow>
            <FieldRow>
              <Text style={styles.rowLabel}>
                {translate('settings.rowSuggestFeature')}
              </Text>
              <RowChevron />
            </FieldRow>
            <FieldRow isLast>
              <Text style={styles.rowLabel}>
                {translate('settings.rowReportBug')}
              </Text>
              <RowChevron />
            </FieldRow>
          </FieldGroup>

          <FieldGroup label={translate('settings.sectionAbout')}>
            <FieldRow onPress={handleOpenAbout}>
              <Text style={styles.rowLabel}>
                {translate('settings.rowAbout')}
              </Text>
              <RowChevron />
            </FieldRow>
            <FieldRow>
              <Text style={styles.rowLabel}>
                {translate('settings.rowPrivacy')}
              </Text>
              <RowChevron />
            </FieldRow>
            <FieldRow isLast>
              <Text style={styles.rowLabel}>
                {translate('settings.rowVersion')}
              </Text>
              <Text style={[styles.versionValue, tabular]}>
                {translate('settings.valueVersion')}
              </Text>
            </FieldRow>
          </FieldGroup>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: BOTTOM_NAV_SAFE_SPACE,
    gap: spacing.lg,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.inkMid,
  },
  premiumCheck: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnDark,
  },
  premiumSubtitle: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  rowLabelDanger: {
    color: '#B8383E',
  },
  rowLabelWithBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowValue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  comingSoonBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfacePressed,
  },
  comingSoonLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: colors.textSecondary,
  },
  versionValue: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default SettingsScreen;
