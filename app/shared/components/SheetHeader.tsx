import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '~shared/theme';

type Props = {
  title: string;
  leftLabel?: string;
  rightLabel?: string;
  isRightDisabled?: boolean;
  onPressLeft?: () => void;
  onPressRight?: () => void;
};

const SheetHeader = memo((props: Props) => {
  const handleLeft = useCallback(() => {
    if (props.onPressLeft == null) {
      return;
    }
    props.onPressLeft();
  }, [props.onPressLeft]);

  const handleRight = useCallback(() => {
    if (props.onPressRight == null || props.isRightDisabled === true) {
      return;
    }
    props.onPressRight();
  }, [props.onPressRight, props.isRightDisabled]);

  const rightColor = props.isRightDisabled
    ? colors.textMuted
    : colors.textPrimary;

  return (
    <View style={styles.root}>
      <View style={styles.side}>
        {props.leftLabel != null && props.leftLabel.length > 0 && (
          <Pressable
            onPress={handleLeft}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.leftLabel}>{props.leftLabel}</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.title}>{props.title}</Text>
      <View style={[styles.side, styles.sideRight]}>
        {props.rightLabel != null && props.rightLabel.length > 0 && (
          <Pressable
            onPress={handleRight}
            disabled={props.isRightDisabled === true}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={[styles.rightLabel, { color: rightColor }]}>
              {props.rightLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  side: {
    minWidth: 70,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  leftLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  rightLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.5,
  },
});

export default SheetHeader;
