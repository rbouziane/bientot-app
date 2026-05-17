import { memo, ReactNode, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import BientotLogo from '~shared/assets/icons/bientot-logo.svg';
import Button from '~shared/components/Button';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PALETTE } from '~shared/constants/Palette';
import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

// TODO: pull launch-offer countdown from real launch date config.
const LAUNCH_DAYS_LEFT = 18;

type BenefitProps = {
  icon: ReactNode;
  title: string;
  body: string;
};

const Benefit = memo((props: BenefitProps) => {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}>{props.icon}</View>
      <View style={styles.benefitText}>
        <Text style={styles.benefitTitle}>{props.title}</Text>
        <Text style={styles.benefitBody}>{props.body}</Text>
      </View>
    </View>
  );
});

const PaywallScreen = memo(() => {
  const accent = PALETTE[COLOR_KEY.PINK].dark;

  const handleBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handlePurchase = useCallback(() => {
    // TODO: trigger react-native-iap purchase flow.
  }, []);

  const handleRestore = useCallback(() => {
    // TODO: trigger react-native-iap restore flow.
  }, []);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerRow}>
          <CircleButton
            icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
            onPress={handleBack}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <BientotLogo width={56} height={56} />
            <View style={styles.heroText}>
              <Text style={styles.eyebrow}>{translate('paywall.eyebrow')}</Text>
              <Text style={styles.title}>{translate('paywall.title')}</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>{translate('paywall.subtitle')}</Text>

          <View style={styles.benefits}>
            <Benefit
              icon={<Text style={styles.symbolIcon}>∞</Text>}
              title={translate('paywall.benefitUnlimitedTitle')}
              body={translate('paywall.benefitUnlimitedBody')}
            />
            <Benefit
              icon={<Text style={styles.emojiIcon}>📱</Text>}
              title={translate('paywall.benefitWidgetsTitle')}
              body={translate('paywall.benefitWidgetsBody')}
            />
            <Benefit
              icon={<Text style={styles.emojiIcon}>🎨</Text>}
              title={translate('paywall.benefitColorsTitle')}
              body={translate('paywall.benefitColorsBody')}
            />
            <Benefit
              icon={
                <UiIcon name="share" size={22} color={colors.textPrimary} />
              }
              title={translate('paywall.benefitExtrasTitle')}
              body={translate('paywall.benefitExtrasBody')}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View
            style={[styles.launchOffer, { backgroundColor: hexA(accent, 0.1) }]}
          >
            <Text style={[styles.launchOfferLabel, { color: accent }]}>
              {translate('paywall.launchOffer', { days: LAUNCH_DAYS_LEFT })}
            </Text>
          </View>
          <Button
            label={`${translate('paywall.ctaPrefix')} ${translate(
              'paywall.launchPrice',
            )}`}
            tone="color"
            color={accent}
            onPress={handlePurchase}
          />
          <Pressable
            onPress={handleRestore}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.restorePressed}
          >
            <Text style={styles.restore}>{translate('paywall.restore')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  heroText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 29,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  benefits: {
    gap: 10,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  benefitBody: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  symbolIcon: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emojiIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: 10,
  },
  launchOffer: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  launchOfferLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  restore: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  restorePressed: {
    opacity: 0.6,
  },
});

export default PaywallScreen;
