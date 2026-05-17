import { memo, ReactNode, useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import SheetHeader from '~shared/components/SheetHeader';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import {
  FREE_COLOR_KEYS,
  PALETTE,
  PREMIUM_COLOR_KEYS,
} from '~shared/constants/Palette';
import { colors, spacing, typography } from '~shared/theme';
import { formatCountdown } from '~shared/utils/date';
import { translate } from '~i18n/translate';
import ColorPickerPreview from '../components/ColorPickerPreview';
import ColorSwatch from '../components/ColorSwatch';
import { useEventFormDraft } from '../hooks/useEventFormDraft';

// TODO: wire to a real usePremiumQuery once paywall is ready.
const IS_PREMIUM = true;

type SectionProps = {
  title: string;
  rightAccessory?: ReactNode;
  colorKeys: COLOR_KEY[];
  selectedKey: COLOR_KEY;
  isLocked: boolean;
  onSelect: (colorKey: COLOR_KEY) => void;
};

const Section = memo((sectionProps: SectionProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{sectionProps.title}</Text>
        {sectionProps.rightAccessory}
      </View>
      <View style={styles.grid}>
        {sectionProps.colorKeys.map(colorKey => (
          <View key={colorKey} style={styles.gridCell}>
            <ColorSwatch
              colorKey={colorKey}
              palette={PALETTE[colorKey]}
              isSelected={sectionProps.selectedKey === colorKey}
              isLocked={sectionProps.isLocked}
              onPress={sectionProps.onSelect}
            />
          </View>
        ))}
      </View>
    </View>
  );
});

const ColorPickerScreen = memo(() => {
  const { draft, setColor } = useEventFormDraft();

  const [pendingColor, setPendingColor] = useState<COLOR_KEY>(draft.colorKey);

  const countdown = useMemo(
    () => formatCountdown(draft.targetDate),
    [draft.targetDate],
  );

  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleSelectFree = useCallback((colorKey: COLOR_KEY) => {
    setPendingColor(colorKey);
  }, []);

  const handleSelectPremium = useCallback((colorKey: COLOR_KEY) => {
    if (!IS_PREMIUM) {
      return;
    }
    setPendingColor(colorKey);
  }, []);

  const handleConfirm = useCallback(() => {
    setColor(pendingColor);
    NavigatorUtils.goBack();
  }, [pendingColor, setColor]);

  const palette = PALETTE[pendingColor];

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <SheetHeader
          title={translate('picker.colorTitle')}
          rightLabel={translate('common.confirm')}
          onPressRight={handleConfirm}
        />
        <View style={styles.backButtonWrap} pointerEvents="box-none">
          <CircleButton
            icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
            onPress={handlePressBack}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ColorPickerPreview
            icon={draft.icon}
            palette={palette}
            countdownValue={countdown.big}
            countdownUnit={countdown.unit}
          />
          <Section
            title={`${translate('picker.free')} · ${FREE_COLOR_KEYS.length}`}
            colorKeys={FREE_COLOR_KEYS}
            selectedKey={pendingColor}
            isLocked={false}
            onSelect={handleSelectFree}
          />
          <Section
            title={`${translate('picker.premium')} · ${
              PREMIUM_COLOR_KEYS.length
            }`}
            rightAccessory={
              <UiIcon name="lock" size={11} color={colors.textSecondary} />
            }
            colorKeys={PREMIUM_COLOR_KEYS}
            selectedKey={pendingColor}
            isLocked={!IS_PREMIUM}
            onSelect={handleSelectPremium}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  backButtonWrap: {
    position: 'absolute',
    top: 52,
    left: spacing.lg,
    zIndex: 10,
  },
  scroll: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: `${100 / 7}%`,
    padding: spacing.xs,
  },
});

export default ColorPickerScreen;
