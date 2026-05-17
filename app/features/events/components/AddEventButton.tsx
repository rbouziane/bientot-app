import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PlusIcon from '~shared/assets/icons/plus-small.svg';
import { colors, radius, shadows, spacing } from '~shared/theme';
import { translate } from '~i18n/translate';

type Props = {
  onPress: () => void;
};

const INK_COLORS = [colors.inkStart, colors.inkMid, colors.inkEnd];

const AddEventButton = memo((props: Props) => {
  const handlePress = useCallback(() => {
    props.onPress();
  }, [props.onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={INK_COLORS}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fill}
      >
        <PlusIcon width={14} height={14} color={colors.textOnDark} />
        <Text style={styles.label}>{translate('common.add')}</Text>
      </LinearGradient>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadows.circle,
  },
  fill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    paddingLeft: spacing.md,
  },
  label: {
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.1,
    color: colors.textOnDark,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default AddEventButton;
