import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '~shared/components/Button';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

type Props = {
  onPressCreate: () => void;
};

const HomeEmpty = memo((props: Props) => {
  return (
    <View style={styles.root}>
      <View style={styles.ghosts}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[styles.ghost, { opacity: 1 - i * 0.25, marginLeft: i * 8 }]}
          />
        ))}
      </View>
      <Text style={styles.title}>{translate('events.emptyTitle')}</Text>
      <Text style={styles.subtitle}>{translate('events.emptySubtitle')}</Text>
      <View style={styles.cta}>
        <Button
          label={translate('events.emptyCta')}
          icon={<UiIcon name="plus" size={16} color={colors.white} />}
          onPress={props.onPressCreate}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingBottom: 80,
  },
  ghosts: {
    width: 220,
    gap: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  ghost: {
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: colors.borderDashed,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  cta: {
    marginTop: spacing.xxl,
    width: '100%',
  },
});

export default HomeEmpty;
