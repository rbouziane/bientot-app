import { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, shadows, spacing } from '~shared/theme';
import { translate } from '~i18n/translate';

type LanguageCode = 'auto' | 'fr' | 'en' | 'es';

type LanguageOption = {
  code: LanguageCode;
  name: string;
  sub: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Automatique', sub: '⚙️' },
  { code: 'fr', name: 'Français', sub: '🇫🇷' },
  { code: 'en', name: 'English', sub: '🇬🇧' },
  { code: 'es', name: 'Español', sub: '🇪🇸' },
];

type RowProps = {
  option: LanguageOption;
  isSelected: boolean;
  isLast: boolean;
  onPress: (code: LanguageCode) => void;
};

const Row = memo((rowProps: RowProps) => {
  const handlePress = useCallback(() => {
    rowProps.onPress(rowProps.option.code);
  }, [rowProps.onPress, rowProps.option.code]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        !rowProps.isLast && styles.rowDivider,
        pressed && styles.rowPressed,
      ]}
    >
      <Text style={styles.flag}>{rowProps.option.sub}</Text>
      <View style={styles.rowText}>
        <Text style={styles.rowName}>{rowProps.option.name}</Text>
        {rowProps.option.code === 'auto' && (
          <Text style={styles.rowSub}>{translate('language.autoSub')}</Text>
        )}
      </View>
      {rowProps.isSelected && (
        <View style={styles.checkBubble}>
          <UiIcon name="check" size={14} color={colors.textOnDark} />
        </View>
      )}
    </Pressable>
  );
});

const LanguageScreen = memo(() => {
  // TODO: persist in MMKV STORAGE_KEY.USER_PREFERENCES + propagate via setLocale.
  const [selected, setSelected] = useState<LanguageCode>('fr');

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
          <Text style={styles.headerTitle}>{translate('language.title')}</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.hint}>{translate('language.hint')}</Text>
          <View style={styles.card}>
            {LANGUAGES.map((option, index) => (
              <Row
                key={option.code}
                option={option}
                isSelected={option.code === selected}
                isLast={index === LANGUAGES.length - 1}
                onPress={setSelected}
              />
            ))}
          </View>
          <Text style={styles.footer}>{translate('language.footer')}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  rowPressed: {
    backgroundColor: colors.surfaceSoft,
  },
  flag: {
    fontSize: 22,
    lineHeight: 26,
    minWidth: 28,
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  rowSub: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
    lineHeight: 18,
  },
});

export default LanguageScreen;
