import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CircleButton from '~shared/components/CircleButton';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

type Props = {
  count: number;
  isPremium: boolean;
  onLongPressTitle?: () => void;
  onPressAdd: () => void;
  onPressFilter?: () => void;
};

const HomeHeader = memo((props: Props) => {
  const subtitle =
    props.count > 1
      ? translate('events.activeCountOther', { count: props.count })
      : translate('events.activeCount', { count: props.count });

  const handleLongPress = useCallback(() => {
    if (props.onLongPressTitle == null) {
      return;
    }

    props.onLongPressTitle();
  }, [props.onLongPressTitle]);

  return (
    <View style={styles.root}>
      <View style={styles.left}>
        <Pressable onLongPress={handleLongPress} delayLongPress={600}>
          <Text style={styles.title}>{translate('events.title')}</Text>
        </Pressable>
        {props.count > 0 && (
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {props.isPremium && (
              <View style={styles.premiumPill}>
                <Text style={styles.premiumLabel}>
                  {translate('common.premium').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <CircleButton
          icon={<UiIcon name="filter" size={17} color={colors.textPrimary} />}
          onPress={props.onPressFilter}
        />
        <CircleButton
          icon={<UiIcon name="plus" size={18} color={colors.white} />}
          tone="ink"
          onPress={props.onPressAdd}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.appTitle,
    color: colors.textPrimary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  premiumPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfacePressed,
  },
  premiumLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

export default HomeHeader;
