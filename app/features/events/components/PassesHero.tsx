import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PALETTE } from '~shared/constants/Palette';
import { colors, radius, shadows, spacing, tabular } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

type Props = {
  count: number;
};

const PassesHero = memo((props: Props) => {
  const accent = PALETTE[COLOR_KEY.PEACH].dark;

  return (
    <View style={styles.root}>
      <View
        style={[styles.emojiBlock, { backgroundColor: hexA(accent, 0.12) }]}
      >
        <Text style={styles.emoji}>✨</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>
          <Text style={tabular}>{props.count}</Text>{' '}
          {translate('passes.heroCount', { count: props.count })
            .replace(/^\{count\}\s*/, '')
            .replace(/^\d+\s*/, '')}
        </Text>
        <Text style={styles.subtitle}>{translate('passes.heroSubtitle')}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  emojiBlock: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 3,
  },
});

export default PassesHero;
