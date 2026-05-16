import { memo, useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import {
  FREE_ICON_CONCEPTS,
  PREMIUM_ICON_CONCEPTS,
} from '~shared/constants/IconConcepts';
import { ICON_CONCEPT } from '~shared/constants/IconConcept';
import { colors, radius, spacing, typography } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';
import EventIcon from '../components/EventIcon';
import { useEventFormDraft } from '../hooks/useEventFormDraft';
import { IconRef } from '../types/IconRef';

// TODO: wire to a real usePremiumQuery once paywall is ready.
const IS_PREMIUM = true;

type CellProps = {
  concept: ICON_CONCEPT;
  isSelected: boolean;
  isLocked: boolean;
  darkColor: string;
  onSelect: (concept: ICON_CONCEPT) => void;
};

const Cell = memo((cellProps: CellProps) => {
  const handlePress = useCallback(() => {
    if (cellProps.isLocked) {
      return;
    }

    cellProps.onSelect(cellProps.concept);
  }, [cellProps.concept, cellProps.isLocked, cellProps.onSelect]);

  const background = cellProps.isSelected
    ? hexA(cellProps.darkColor, 0.2)
    : colors.surfaceSoft;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.cell,
        { backgroundColor: background },
        pressed && styles.cellPressed,
      ]}
    >
      <EventIcon
        icon={{ family: 'concept', concept: cellProps.concept }}
        size={26}
      />
      {cellProps.isLocked && (
        <View style={styles.lockBadge}>
          <UiIcon name="lock" size={10} color={colors.textOnDark} />
        </View>
      )}
    </Pressable>
  );
});

type SectionProps = {
  title: string;
  concepts: ICON_CONCEPT[];
  selectedConcept: ICON_CONCEPT | null;
  isLocked: boolean;
  darkColor: string;
  onSelect: (concept: ICON_CONCEPT) => void;
};

const Section = memo((sectionProps: SectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{sectionProps.title}</Text>
      <View style={styles.grid}>
        {sectionProps.concepts.map(concept => (
          <View key={concept} style={styles.gridCell}>
            <Cell
              concept={concept}
              isSelected={sectionProps.selectedConcept === concept}
              isLocked={sectionProps.isLocked}
              darkColor={sectionProps.darkColor}
              onSelect={sectionProps.onSelect}
            />
          </View>
        ))}
      </View>
    </View>
  );
});

const IconPickerScreen = memo(() => {
  const { draft, setIcon } = useEventFormDraft();
  const [emojiInput, setEmojiInput] = useState('');

  const selectedConcept =
    draft.icon.family === 'concept' ? draft.icon.concept : null;

  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleSelectConcept = useCallback(
    (concept: ICON_CONCEPT) => {
      const nextIcon: IconRef = { family: 'concept', concept };
      setIcon(nextIcon);
      NavigatorUtils.goBack();
    },
    [setIcon],
  );

  const handleSubmitEmoji = useCallback(() => {
    const value = emojiInput.trim();
    if (value.length === 0) {
      return;
    }

    setIcon({ family: 'emoji', value });
    setEmojiInput('');
    NavigatorUtils.goBack();
  }, [emojiInput, setIcon]);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <CircleButton
            icon={<UiIcon name="close" size={18} color={colors.textPrimary} />}
            onPress={handlePressBack}
          />
          <Text style={styles.title}>{translate('picker.iconTitle')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.emojiRow}>
            <Text style={styles.emojiLabel}>
              {translate('picker.emojiLabel')}
            </Text>
            <View style={styles.emojiInputRow}>
              <TextInput
                value={emojiInput}
                onChangeText={setEmojiInput}
                onSubmitEditing={handleSubmitEmoji}
                placeholder="🎂"
                placeholderTextColor={colors.textMuted}
                maxLength={4}
                style={styles.emojiInput}
              />
              <Pressable
                onPress={handleSubmitEmoji}
                style={({ pressed }) => [
                  styles.emojiButton,
                  pressed && styles.cellPressed,
                ]}
              >
                <Text style={styles.emojiButtonLabel}>
                  {translate('common.confirm')}
                </Text>
              </Pressable>
            </View>
          </View>
          <Section
            title={translate('picker.free')}
            concepts={FREE_ICON_CONCEPTS}
            selectedConcept={selectedConcept}
            isLocked={false}
            darkColor={colors.textPrimary}
            onSelect={handleSelectConcept}
          />
          <Section
            title={translate('picker.premium')}
            concepts={PREMIUM_ICON_CONCEPTS}
            selectedConcept={selectedConcept}
            isLocked={!IS_PREMIUM}
            darkColor={colors.textPrimary}
            onSelect={handleSelectConcept}
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
  emojiRow: {
    marginBottom: spacing.xxl,
  },
  emojiLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  emojiInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  emojiInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
    fontSize: 20,
    color: colors.textPrimary,
  },
  emojiButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.inkMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiButtonLabel: {
    ...typography.bodyMedium,
    color: colors.textOnDark,
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
    width: '20%',
    padding: spacing.xs,
  },
  cell: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellPressed: {
    opacity: 0.85,
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconPickerScreen;
