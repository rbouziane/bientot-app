import { memo, ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { darken, lighten } from '~shared/utils/colorUtils';

type Tone = 'ink' | 'color' | 'glass';

type Props = {
  label: string;
  tone?: Tone;
  color?: string;
  icon?: ReactNode;
  subLabel?: string;
  isDisabled?: boolean;
  onPress: () => void;
};

const INK_COLORS = [colors.inkStart, colors.inkMid, colors.inkEnd];

const Button = memo((props: Props) => {
  const tone: Tone = props.tone ?? 'ink';
  const isColor = tone === 'color' && props.color != null;
  const isGlass = tone === 'glass';

  const handlePress = useCallback(() => {
    if (props.isDisabled) {
      return;
    }

    props.onPress();
  }, [props]);

  const colorGradient = props.color != null
    ? [lighten(props.color, 0.08), props.color, darken(props.color, 0.06)]
    : INK_COLORS;

  const textColor = isGlass ? colors.textPrimary : colors.textOnDark;

  const renderInner = () => {
    return (
      <View style={styles.inner}>
        <View style={styles.row}>
          {props.icon != null && <View style={styles.icon}>{props.icon}</View>}
          <Text style={[typography.button, { color: textColor }]}>
            {props.label}
          </Text>
        </View>
        {props.subLabel != null && (
          <Text style={[styles.subLabel, { color: textColor }]}>
            {props.subLabel}
          </Text>
        )}
      </View>
    );
  };

  if (isGlass) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={props.isDisabled}
        style={({ pressed }) => [
          styles.root,
          styles.glass,
          pressed && styles.pressed,
        ]}
      >
        {renderInner()}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={props.isDisabled}
      style={({ pressed }) => [
        styles.root,
        isColor ? shadows.ctaColor : shadows.ctaInk,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={isColor ? colorGradient : INK_COLORS}
        locations={isColor ? [0, 0.55, 1] : [0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {renderInner()}
      </LinearGradient>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 56,
    borderRadius: radius.xxxl,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    minHeight: 56,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glass: {
    backgroundColor: colors.surfaceTranslucentStrong,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    justifyContent: 'center',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.65,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.92,
  },
});

export default Button;
