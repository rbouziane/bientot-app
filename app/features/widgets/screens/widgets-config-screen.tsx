import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ScreenContainer from '~shared/components/ScreenContainer';
import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

const BOTTOM_NAV_SAFE_SPACE = 150;

type StepProps = {
  number: string;
  text: string;
};

const Step = memo((props: StepProps) => {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberLabel}>{props.number}</Text>
      </View>
      <Text style={styles.stepText}>{props.text}</Text>
    </View>
  );
});

const WidgetMockup = memo(() => {
  return (
    <View style={styles.widgetMockup}>
      <Text style={styles.widgetMockupEmoji}>🎂</Text>
      <Text style={styles.widgetMockupTitle}>Anniversaire de Léa</Text>
      <View style={styles.widgetMockupCountdownRow}>
        <Text style={styles.widgetMockupBig}>7</Text>
        <Text style={styles.widgetMockupUnit}>j</Text>
      </View>
    </View>
  );
});

const WidgetsConfigScreen = memo(() => {
  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{translate('widgets.title')}</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.hint}>{translate('widgets.hint')}</Text>

          <Text style={styles.sectionLabel}>
            {translate('widgets.previewLabel')}
          </Text>
          <LinearGradient
            colors={['#FEC6A0', '#E89BB8', '#A78BCF']}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={styles.previewBackground}
          >
            <WidgetMockup />
          </LinearGradient>

          <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
            {translate('widgets.tutoTitle')}
          </Text>
          <View style={styles.tutoCard}>
            <Step number="1" text={translate('widgets.tutoStep1')} />
            <Step number="2" text={translate('widgets.tutoStep2')} />
            <Step number="3" text={translate('widgets.tutoStep3')} />
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: BOTTOM_NAV_SAFE_SPACE,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  sectionLabelSpaced: {
    marginTop: spacing.xxl,
  },
  previewBackground: {
    borderRadius: radius.xxxl,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetMockup: {
    width: 140,
    height: 140,
    borderRadius: 22,
    backgroundColor: colors.surface,
    padding: 14,
    ...shadows.card,
  },
  widgetMockupEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  widgetMockupTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs + 2,
  },
  widgetMockupCountdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 'auto',
  },
  widgetMockupBig: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: colors.textPrimary,
  },
  widgetMockupUnit: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tutoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textOnDark,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
});

export default WidgetsConfigScreen;
