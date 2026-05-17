import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DetailsStackParamList } from '~/navigators/DetailsStack';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import Button from '~shared/components/Button';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { PALETTE } from '~shared/constants/Palette';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { colors, radius, shadows, spacing, tabular } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { formatCountdown, formatLongDate } from '~shared/utils/date';
import { translate } from '~i18n/translate';
import EventIcon from '../components/EventIcon';
import { useEventQuery } from '../services/hook';

type ShareCardRoute = RouteProp<DetailsStackParamList, SCREEN_NAME.SHARE_CARD>;

type FormatId = 'stories' | 'post' | 'slack';

type FormatSpec = {
  id: FormatId;
  labelKey: string;
  ratio: string;
};

const FORMATS: FormatSpec[] = [
  { id: 'stories', labelKey: 'share.formatStories', ratio: '9:16' },
  { id: 'post', labelKey: 'share.formatPost', ratio: '1:1' },
  { id: 'slack', labelKey: 'share.formatSlack', ratio: '16:9' },
];

type FormatOptionProps = {
  spec: FormatSpec;
  isActive: boolean;
  onPress: (id: FormatId) => void;
};

const FormatOption = memo((optionProps: FormatOptionProps) => {
  const handlePress = useCallback(() => {
    optionProps.onPress(optionProps.spec.id);
  }, [optionProps.onPress, optionProps.spec.id]);

  const background = optionProps.isActive
    ? colors.textPrimary
    : colors.surfaceSoft;
  const labelColor = optionProps.isActive
    ? colors.textOnDark
    : colors.textPrimary;
  const ratioColor = optionProps.isActive
    ? 'rgba(255,255,255,0.55)'
    : colors.textMuted;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.formatOption,
        { backgroundColor: background },
        pressed && styles.formatOptionPressed,
      ]}
    >
      <Text style={[styles.formatLabel, { color: labelColor }]}>
        {translate(optionProps.spec.labelKey)}
      </Text>
      <Text style={[styles.formatRatio, tabular, { color: ratioColor }]}>
        {optionProps.spec.ratio}
      </Text>
    </Pressable>
  );
});

const ShareCardScreen = memo(() => {
  const route = useRoute<ShareCardRoute>();
  const eventId = route.params.eventId;

  const { event } = useEventQuery(eventId);
  const [format, setFormat] = useState<FormatId>('stories');

  const countdown = useMemo(() => {
    if (event == null) {
      return null;
    }
    return formatCountdown(event.targetDate);
  }, [event]);

  const palette = event != null ? PALETTE[event.colorKey] : null;

  const handleClose = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleShare = useCallback(() => {
    // TODO: render the social card and trigger react-native-share.
  }, []);

  if (event == null || palette == null || countdown == null) {
    return null;
  }

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerRow}>
          <CircleButton
            icon={<UiIcon name="close" size={18} color={colors.textPrimary} />}
            onPress={handleClose}
          />
          <Text style={styles.headerTitle}>{translate('share.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.hint}>{translate('share.hint')}</Text>

          <View style={[styles.card, { backgroundColor: palette.light }]}>
            <View
              style={[
                styles.cardFill,
                { backgroundColor: hexA(palette.dark, 0.15) },
              ]}
            />
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.cardIconBlock,
                  { backgroundColor: hexA(palette.dark, 0.18) },
                ]}
              >
                <EventIcon icon={event.icon} size={32} />
              </View>
              <View style={styles.cardSpacer} />
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardDate}>
                {formatLongDate(event.targetDate)}
              </Text>
              <View style={styles.cardCountdownRow}>
                <Text style={[styles.cardBig, tabular]}>{countdown.big}</Text>
                {countdown.unit !== '' && (
                  <Text style={styles.cardUnit}>{countdown.unit}</Text>
                )}
              </View>
              <Text style={styles.cardWatermark}>Bientôt</Text>
            </View>
          </View>

          <View style={styles.formatsRow}>
            {FORMATS.map(spec => (
              <FormatOption
                key={spec.id}
                spec={spec}
                isActive={spec.id === format}
                onPress={setFormat}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={translate('share.cta')}
            tone="color"
            color={palette.dark}
            icon={<UiIcon name="share" size={18} color={colors.textOnDark} />}
            onPress={handleShare}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 19,
  },
  card: {
    width: 250,
    aspectRatio: 9 / 16,
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.ctaColor,
  },
  cardFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '98%',
  },
  cardContent: {
    flex: 1,
    padding: spacing.xxl,
  },
  cardIconBlock: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSpacer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardCountdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  cardBig: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 60,
    color: colors.textPrimary,
  },
  cardUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  cardWatermark: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    opacity: 0.5,
    marginTop: spacing.md,
  },
  formatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  formatOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: 1,
  },
  formatOptionPressed: {
    opacity: 0.85,
  },
  formatLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  formatRatio: {
    fontSize: 10,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});

export default ShareCardScreen;
