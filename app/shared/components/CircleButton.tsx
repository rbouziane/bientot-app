import { memo, ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, shadows } from '~shared/theme';

type Tone = 'ink' | 'soft' | 'glass';

type Props = {
  icon: ReactNode;
  tone?: Tone;
  size?: number;
  onPress?: () => void;
};

const INK_COLORS = [colors.inkStart, colors.inkMid, colors.inkEnd];

const CircleButton = memo((props: Props) => {
  const tone: Tone = props.tone ?? 'soft';
  const size = props.size ?? 40;

  const handlePress = useCallback(() => {
    if (props.onPress == null) {
      return;
    }

    props.onPress();
  }, [props]);

  const radius = size / 2;
  const containerStyle = { width: size, height: size, borderRadius: radius };

  if (tone === 'ink') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.root,
          containerStyle,
          shadows.circle,
          pressed && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={INK_COLORS}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.fill, containerStyle]}
        >
          {props.icon}
        </LinearGradient>
      </Pressable>
    );
  }

  const bg = tone === 'glass'
    ? colors.surfaceTranslucentStrong
    : colors.surfacePressed;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        containerStyle,
        { backgroundColor: bg },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconWrap}>{props.icon}</View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default CircleButton;
