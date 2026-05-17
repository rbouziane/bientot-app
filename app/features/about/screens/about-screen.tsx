import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import BientotLogo from '~shared/assets/icons/bientot-logo.svg';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

type PrincipleProps = {
  emoji: string;
  title: string;
  body: string;
};

const Principle = memo((props: PrincipleProps) => {
  return (
    <View style={styles.principleCard}>
      <Text style={styles.principleEmoji}>{props.emoji}</Text>
      <View style={styles.principleText}>
        <Text style={styles.principleTitle}>{props.title}</Text>
        <Text style={styles.principleBody}>{props.body}</Text>
      </View>
    </View>
  );
});

const AboutScreen = memo(() => {
  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerRow}>
          <CircleButton
            icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
            onPress={handlePressBack}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.heroLogoWrap}>
              <BientotLogo width={88} height={88} />
            </View>
            <Text style={styles.heroTitle}>{translate('about.tagline')}</Text>
            <Text style={styles.heroSubtitle}>
              {translate('about.subtitle')}
            </Text>
          </View>

          <View style={styles.developerCard}>
            <View style={styles.developerRow}>
              <View style={styles.developerAvatar}>
                <Text style={styles.developerAvatarLetter}>R</Text>
              </View>
              <View style={styles.developerHeader}>
                <Text style={styles.developerName}>
                  {translate('about.developerName')}
                </Text>
                <Text style={styles.developerRole}>
                  {translate('about.developerRole')}
                </Text>
              </View>
            </View>
            <Text style={styles.developerBio}>
              {translate('about.developerBio')}
            </Text>
          </View>

          <View style={styles.principles}>
            <Principle
              emoji="🔒"
              title={translate('about.principleDataTitle')}
              body={translate('about.principleDataBody')}
            />
            <Principle
              emoji="✨"
              title={translate('about.principleNoAdsTitle')}
              body={translate('about.principleNoAdsBody')}
            />
            <Principle
              emoji="🛠"
              title={translate('about.principleHandmadeTitle')}
              body={translate('about.principleHandmadeBody')}
            />
          </View>

          <Text style={styles.sectionLabel}>
            {translate('about.creditsTitle')}
          </Text>
          <View style={styles.creditsCard}>
            <Text style={styles.creditsText}>
              {translate('about.creditsBody')}
            </Text>
          </View>

          <Text style={styles.footer}>{translate('about.footer')}</Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl - 4,
  },
  heroLogoWrap: {
    marginBottom: spacing.lg + 2,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 35,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 20,
    textAlign: 'center',
  },
  developerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg + 2,
    ...shadows.card,
  },
  developerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  developerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEE0E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  developerAvatarLetter: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5E3F8F',
  },
  developerHeader: {
    flex: 1,
  },
  developerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  developerRole: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  developerBio: {
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  principles: {
    gap: 10,
    marginBottom: spacing.xxl,
  },
  principleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    ...shadows.card,
  },
  principleEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  principleText: {
    flex: 1,
  },
  principleTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  principleBody: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 19,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  creditsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  creditsText: {
    fontSize: 13.5,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.xxl,
  },
});

export default AboutScreen;
