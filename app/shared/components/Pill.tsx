import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '~shared/theme';

type Props = {
  label: string;
  isActive?: boolean;
  activeColor?: string;
  onPress?: () => void;
};

const Pill = memo((props: Props) => {
  const handlePress = useCallback(() => {
    if (props.onPress == null) {
      return;
    }

    props.onPress();
  }, [props.onPress]);

  const backgroundColor = props.isActive
    ? props.activeColor ?? colors.textPrimary
    : colors.surfaceSoft;
  const labelColor = props.isActive ? colors.textOnDark : colors.textPrimary;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: labelColor }]}>{props.label}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default Pill;
