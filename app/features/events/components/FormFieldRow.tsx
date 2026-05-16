import { memo, ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, spacing, typography } from '~shared/theme';

type Props = {
  label: string;
  value: string;
  trailing?: ReactNode;
  onPress: () => void;
};

const FormFieldRow = memo((props: Props) => {
  const handlePress = useCallback(() => {
    props.onPress();
  }, [props.onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.right}>
        {props.trailing}
        <Text style={styles.value}>{props.value}</Text>
        <UiIcon name="chevronRight" size={14} color={colors.textMuted} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default FormFieldRow;
