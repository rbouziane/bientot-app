import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import {
  FREE_COLOR_KEYS,
  PALETTE,
  PREMIUM_COLOR_KEYS,
} from '~shared/constants/Palette';
import { colors, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';
import ColorSwatch from '../components/ColorSwatch';
import { useEventFormDraft } from '../hooks/useEventFormDraft';

// TODO: wire to a real usePremiumQuery once paywall is ready.
const IS_PREMIUM = true;

type SectionProps = {
  title: string;
  colorKeys: COLOR_KEY[];
  selectedKey: COLOR_KEY;
  isPremium: boolean;
  onSelect: (colorKey: COLOR_KEY) => void;
};

const Section = memo((sectionProps: SectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{sectionProps.title}</Text>
      <View style={styles.grid}>
        {sectionProps.colorKeys.map(colorKey => (
          <View key={colorKey} style={styles.gridCell}>
            <ColorSwatch
              colorKey={colorKey}
              palette={PALETTE[colorKey]}
              isSelected={sectionProps.selectedKey === colorKey}
              isLocked={!sectionProps.isPremium}
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

  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleSelectFree = useCallback(
    (colorKey: COLOR_KEY) => {
      setColor(colorKey);
      NavigatorUtils.goBack();
    },
    [setColor],
  );

  const handleSelectPremium = useCallback(
    (colorKey: COLOR_KEY) => {
      if (!IS_PREMIUM) {
        return;
      }

      setColor(colorKey);
      NavigatorUtils.goBack();
    },
    [setColor],
  );

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <CircleButton
            icon={<UiIcon name="close" size={18} color={colors.textPrimary} />}
            onPress={handlePressBack}
          />
          <Text style={styles.title}>{translate('picker.colorTitle')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Section
            title={translate('picker.free')}
            colorKeys={FREE_COLOR_KEYS}
            selectedKey={draft.colorKey}
            isPremium
            onSelect={handleSelectFree}
          />
          <Section
            title={translate('picker.premium')}
            colorKeys={PREMIUM_COLOR_KEYS}
            selectedKey={draft.colorKey}
            isPremium={IS_PREMIUM}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridCell: {
    width: '14.2857%',
    padding: spacing.xs,
  },
});

export default ColorPickerScreen;
