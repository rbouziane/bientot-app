import { memo, ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '~shared/theme';

type Props = {
  isLast?: boolean;
  children: ReactNode;
  onPress?: () => void;
};

const FieldRow = memo((props: Props) => {
  const handlePress = useCallback(() => {
    if (props.onPress == null) {
      return;
    }
    props.onPress();
  }, [props.onPress]);

  const borderBottom =
    props.isLast === true
      ? null
      : {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderSoft,
        };

  if (props.onPress != null) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.root,
          borderBottom,
          pressed && styles.pressed,
        ]}
      >
        {props.children}
      </Pressable>
    );
  }

  return <View style={[styles.root, borderBottom]}>{props.children}</View>;
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceSoft,
  },
});

export default FieldRow;
