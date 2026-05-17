import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import BientotLogo from '~shared/assets/icons/bientot-logo.svg';
import Button from '~shared/components/Button';
import ScreenContainer from '~shared/components/ScreenContainer';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PALETTE } from '~shared/constants/Palette';
import { SCREEN_NAME, STACK_NAME } from '~shared/constants/Screen';
import { STORAGE_KEY } from '~shared/constants/Storage';
import { getMMKV } from '~shared/storage/mmkv';
import { colors, radius, shadows, spacing, tabular } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

const TOTAL_PAGES = 3;
const ORBIT_RADIUS = 95;
const ORBIT_SIZE = 220;

type PageProps = {
  title: string;
  body: string;
};

const OnboardingDots = memo((dotsProps: { activeIndex: number }) => {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === dotsProps.activeIndex
              ? styles.dotActive
              : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
});

const PageText = memo((textProps: PageProps) => {
  return (
    <View style={styles.textBlock}>
      <Text style={styles.title}>{textProps.title}</Text>
      <Text style={styles.body}>{textProps.body}</Text>
    </View>
  );
});

const ConceptIllustration = memo(() => {
  const cards = [
    {
      colorKey: COLOR_KEY.PINK,
      title: 'Anniversaire de Léa',
      big: '7',
      unit: 'jours',
      fill: 0.98,
    },
    {
      colorKey: COLOR_KEY.PURPLE,
      title: 'Concert',
      big: '2',
      unit: 'mois',
      fill: 0.84,
    },
    {
      colorKey: COLOR_KEY.SKY,
      title: 'Voyage à Tokyo',
      big: '6',
      unit: 'mois',
      fill: 0.51,
    },
    {
      colorKey: COLOR_KEY.ROSE,
      title: 'Mariage',
      big: '11',
      unit: 'mois',
      fill: 0.05,
    },
  ];

  return (
    <View style={styles.conceptStack}>
      {cards.map((card, index) => {
        const palette = PALETTE[card.colorKey];
        return (
          <View
            key={index}
            style={[
              styles.conceptCard,
              { marginLeft: index * 6, backgroundColor: palette.light },
            ]}
          >
            <View
              style={[
                styles.conceptCardFill,
                {
                  width: `${card.fill * 100}%`,
                  backgroundColor: hexA(palette.dark, 0.16),
                },
              ]}
            />
            <View style={styles.conceptCardContent}>
              <View
                style={[
                  styles.conceptCardBadge,
                  { backgroundColor: hexA(palette.dark, 0.12) },
                ]}
              />
              <Text style={styles.conceptCardTitle} numberOfLines={1}>
                {card.title}
              </Text>
              <View style={styles.conceptCardCountdown}>
                <Text style={[styles.conceptCardBig, tabular]}>{card.big}</Text>
                <Text style={styles.conceptCardUnit}>{card.unit}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
});

const WidgetsIllustration = memo(() => {
  return (
    <View style={styles.phoneFrame}>
      <LinearGradient
        colors={['#FEC6A0', '#E89BB8', '#A78BCF']}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={styles.phoneInner}
      >
        <View style={styles.phoneWidget}>
          <View
            style={[
              styles.phoneWidgetBadge,
              { backgroundColor: hexA(PALETTE[COLOR_KEY.PINK].dark, 0.12) },
            ]}
          />
          <Text style={styles.phoneWidgetTitle}>Anniversaire de Léa</Text>
          <Text style={[styles.phoneWidgetBig, tabular]}>7</Text>
          <Text style={styles.phoneWidgetUnit}>jours</Text>
        </View>
        <View style={styles.phoneIconsGrid}>
          {[
            '#5C9EFF',
            '#5BCAFF',
            '#FF7C66',
            '#9B7FFF',
            '#FFD45C',
            '#7DD27A',
            '#FF85A8',
            '#A0A0A0',
          ].map(color => (
            <View
              key={color}
              style={[styles.phoneIcon, { backgroundColor: color }]}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
});

const ActionIllustration = memo(() => {
  const orbitColors: COLOR_KEY[] = [
    COLOR_KEY.PINK,
    COLOR_KEY.LAVENDER,
    COLOR_KEY.SKY,
    COLOR_KEY.PEACH,
    COLOR_KEY.MINT,
    COLOR_KEY.SAND,
  ];

  return (
    <View style={styles.orbitWrap}>
      {orbitColors.map((key, index) => {
        const palette = PALETTE[key];
        const angle = (index / orbitColors.length) * Math.PI * 2 - Math.PI / 2;
        const center = ORBIT_SIZE / 2;
        const tileSize = 36;
        const left = center + ORBIT_RADIUS * Math.cos(angle) - tileSize / 2;
        const top = center + ORBIT_RADIUS * Math.sin(angle) - tileSize / 2;

        return (
          <View
            key={key}
            style={[
              styles.orbitTile,
              {
                width: tileSize,
                height: tileSize,
                left,
                top,
                backgroundColor: palette.light,
                transform: [{ rotate: `${index * 12}deg` }],
              },
            ]}
          >
            <View
              style={[
                styles.orbitTileDot,
                { backgroundColor: palette.dark, opacity: 0.5 },
              ]}
            />
          </View>
        );
      })}
      <View style={styles.orbitCenter}>
        <BientotLogo width={68} height={68} />
      </View>
    </View>
  );
});

const OnboardingScreen = memo(() => {
  const [page, setPage] = useState(0);

  const goToHome = useCallback(() => {
    getMMKV().set(STORAGE_KEY.ONBOARDING_COMPLETED, true);
    NavigatorUtils.reset(STACK_NAME.TAB_NAVIGATOR);
  }, []);

  const handleSkip = useCallback(() => {
    goToHome();
  }, [goToHome]);

  const handleNext = useCallback(() => {
    if (page < TOTAL_PAGES - 1) {
      setPage(page + 1);
      return;
    }
    goToHome();
  }, [goToHome, page]);

  const handleCreate = useCallback(() => {
    goToHome();
    NavigatorUtils.navigate(STACK_NAME.DETAILS_STACK, {
      screen: SCREEN_NAME.EVENT_CREATE,
    });
  }, [goToHome]);

  const pageContent = useMemo(() => {
    if (page === 0) {
      return {
        illustration: <ConceptIllustration />,
        title: translate('onboarding.concept1Title'),
        body: translate('onboarding.concept1Body'),
      };
    }
    if (page === 1) {
      return {
        illustration: <WidgetsIllustration />,
        title: translate('onboarding.concept2Title'),
        body: translate('onboarding.concept2Body'),
      };
    }
    return {
      illustration: <ActionIllustration />,
      title: translate('onboarding.concept3Title'),
      body: translate('onboarding.concept3Body'),
    };
  }, [page]);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {page < TOTAL_PAGES - 1 && (
          <Pressable
            onPress={handleSkip}
            hitSlop={12}
            style={styles.skipButton}
          >
            <Text style={styles.skipLabel}>{translate('onboarding.skip')}</Text>
          </Pressable>
        )}
        <View style={styles.illustrationWrap}>{pageContent.illustration}</View>
        <PageText title={pageContent.title} body={pageContent.body} />
        <View style={styles.footer}>
          <OnboardingDots activeIndex={page} />
          {page === TOTAL_PAGES - 1 ? (
            <Button
              label={translate('onboarding.cta')}
              onPress={handleCreate}
            />
          ) : (
            <Pressable
              onPress={handleNext}
              hitSlop={12}
              style={styles.nextWrap}
            >
              <Text style={styles.nextLabel}>
                {translate('onboarding.next')}
              </Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.huge,
    right: spacing.xl,
    zIndex: 10,
  },
  skipLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  textBlock: {
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    gap: spacing.xxl,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.textPrimary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(26,26,26,0.18)',
  },
  nextWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  nextLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  conceptStack: {
    width: '100%',
    gap: 14,
  },
  conceptCard: {
    height: 64,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  conceptCardFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  conceptCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  conceptCardBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
  },
  conceptCardTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  conceptCardCountdown: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  conceptCardBig: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  conceptCardUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(26,26,26,0.55)',
  },
  phoneFrame: {
    width: 260,
    height: 380,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: colors.inkMid,
    ...shadows.ctaInk,
  },
  phoneInner: {
    flex: 1,
    padding: 14,
  },
  phoneWidget: {
    width: 110,
    height: 110,
    borderRadius: 22,
    backgroundColor: colors.surface,
    padding: 12,
    marginTop: 14,
    ...shadows.card,
  },
  phoneWidgetBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
  },
  phoneWidgetTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 6,
  },
  phoneWidgetBig: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.8,
    marginTop: 8,
  },
  phoneWidgetUnit: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  phoneIconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  phoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    ...shadows.card,
  },
  orbitWrap: {
    width: ORBIT_SIZE,
    height: ORBIT_SIZE,
    position: 'relative',
  },
  orbitTile: {
    position: 'absolute',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  orbitTileDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  orbitCenter: {
    position: 'absolute',
    left: ORBIT_SIZE / 2 - 50,
    top: ORBIT_SIZE / 2 - 50,
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.ctaColor,
  },
});

export default OnboardingScreen;
