import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '~shared/components/Button';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

type Props = {
  launchPrice: string;
  onPressPremium: () => void;
};

const HomeFreeLimitCard = memo((props: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.lock}>
          <UiIcon name="lock" size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{translate('events.freeLimitTitle')}</Text>
          <Text style={styles.subtitle}>
            {translate('events.freeLimitSubtitle')}
          </Text>
        </View>
      </View>
      <View style={styles.cta}>
        <Button
          label={translate('events.freeLimitCta', { price: props.launchPrice })}
          onPress={props.onPressPremium}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderDashed,
  },
  lock: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.surfacePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cta: {
    width: '100%',
  },
});

export default HomeFreeLimitCard;
