import { memo, ReactNode, useCallback, useState } from 'react';
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
import SheetHeader from '~shared/components/SheetHeader';
import UiIcon from '~shared/components/UiIcon';
import {
  FREE_ICON_CONCEPTS,
  PREMIUM_ICON_CONCEPTS,
} from '~shared/constants/IconConcepts';
import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';
import IconTile from '../components/IconTile';
import { useEventFormDraft } from '../hooks/useEventFormDraft';
import { IconRef } from '../types/IconRef';

// TODO: wire to a real usePremiumQuery once paywall is ready.
const IS_PREMIUM = true;

const CURATED_EMOJIS = [
  '🎂',
  '🎸',
  '🏖️',
  '🎄',
  '🎉',
  '🌸',
  '⛰️',
  '✈️',
  '🍕',
  '📚',
  '💍',
  '👶',
  '🎁',
  '⚽',
  '🎬',
  '🎨',
];

const isSameIcon = (left: IconRef, right: IconRef): boolean => {
  if (left.family === 'emoji' && right.family === 'emoji') {
    return left.value === right.value;
  }
  if (left.family === 'concept' && right.family === 'concept') {
    return left.concept === right.concept;
  }
  return false;
};

type SectionProps = {
  title: string;
  rightAccessory?: ReactNode;
  items: IconRef[];
  selected: IconRef;
  isLocked: boolean;
  onSelect: (icon: IconRef) => void;
};

const Section = memo((sectionProps: SectionProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{sectionProps.title}</Text>
        {sectionProps.rightAccessory}
      </View>
      <View style={styles.grid}>
        {sectionProps.items.map(item => (
          <View
            key={item.family === 'emoji' ? item.value : item.concept}
            style={styles.gridCell}
          >
            <IconTile
              icon={item}
              isSelected={isSameIcon(sectionProps.selected, item)}
              isLocked={sectionProps.isLocked}
              onPress={sectionProps.onSelect}
            />
          </View>
        ))}
      </View>
    </View>
  );
});

const IconPickerScreen = memo(() => {
  const { draft, setIcon } = useEventFormDraft();

  const [pendingIcon, setPendingIcon] = useState<IconRef>(draft.icon);
  const [emojiInput, setEmojiInput] = useState('');

  const freeItems: IconRef[] = FREE_ICON_CONCEPTS.map(concept => ({
    family: 'concept',
    concept,
  }));
  const premiumItems: IconRef[] = PREMIUM_ICON_CONCEPTS.map(concept => ({
    family: 'concept',
    concept,
  }));
  const emojiItems: IconRef[] = CURATED_EMOJIS.map(value => ({
    family: 'emoji',
    value,
  }));

  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleConfirm = useCallback(() => {
    setIcon(pendingIcon);
    NavigatorUtils.goBack();
  }, [pendingIcon, setIcon]);

  const handleSelectFree = useCallback((icon: IconRef) => {
    setPendingIcon(icon);
  }, []);

  const handleSelectPremium = useCallback((icon: IconRef) => {
    if (!IS_PREMIUM) {
      return;
    }
    setPendingIcon(icon);
  }, []);

  const handleSelectEmoji = useCallback((icon: IconRef) => {
    setPendingIcon(icon);
  }, []);

  const handleSubmitEmoji = useCallback(() => {
    const value = emojiInput.trim();
    if (value.length === 0) {
      return;
    }
    setPendingIcon({ family: 'emoji', value });
    setEmojiInput('');
  }, [emojiInput]);

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <SheetHeader
          title={translate('picker.iconTitle')}
          rightLabel={translate('common.confirm')}
          onPressRight={handleConfirm}
        />
        <View style={styles.backButtonWrap} pointerEvents="box-none">
          <CircleButton
            icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
            onPress={handlePressBack}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Section
            title={`${translate('picker.free')} · ${FREE_ICON_CONCEPTS.length}`}
            items={freeItems}
            selected={pendingIcon}
            isLocked={false}
            onSelect={handleSelectFree}
          />
          <Section
            title={`${translate('picker.premium')} · 60+`}
            rightAccessory={
              <UiIcon name="lock" size={11} color={colors.textSecondary} />
            }
            items={premiumItems}
            selected={pendingIcon}
            isLocked={!IS_PREMIUM}
            onSelect={handleSelectPremium}
          />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {translate('picker.emojiTitle')}
              </Text>
            </View>
            <Text style={styles.emojiHint}>
              {translate('picker.emojiHint')}
            </Text>
            <View style={styles.grid}>
              {emojiItems.map(item => (
                <View
                  key={item.family === 'emoji' ? item.value : ''}
                  style={styles.gridCell}
                >
                  <IconTile
                    icon={item}
                    isSelected={isSameIcon(pendingIcon, item)}
                    isLocked={false}
                    onPress={handleSelectEmoji}
                  />
                </View>
              ))}
            </View>
            <View style={styles.emojiInputRow}>
              <TextInput
                value={emojiInput}
                onChangeText={setEmojiInput}
                onSubmitEditing={handleSubmitEmoji}
                placeholder={translate('picker.emojiPlaceholder')}
                placeholderTextColor={colors.textMuted}
                maxLength={4}
                returnKeyType="done"
                style={styles.emojiInput}
              />
              <Pressable
                onPress={handleSubmitEmoji}
                style={({ pressed }) => [
                  styles.emojiButton,
                  pressed && styles.emojiButtonPressed,
                ]}
              >
                <Text style={styles.emojiButtonLabel}>
                  {translate('common.confirm')}
                </Text>
              </Pressable>
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
  backButtonWrap: {
    position: 'absolute',
    top: 52,
    left: spacing.lg,
    zIndex: 10,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
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
    width: '20%',
    padding: spacing.xs,
  },
  emojiHint: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xs,
  },
  emojiInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  emojiInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    fontSize: 22,
    color: colors.textPrimary,
    ...shadows.card,
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
  emojiButtonPressed: {
    opacity: 0.85,
  },
});

export default IconPickerScreen;
