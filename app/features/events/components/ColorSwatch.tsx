import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PaletteEntry } from '~shared/constants/Palette';
import { colors, radius } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';

type Props = {
  colorKey: COLOR_KEY;
  palette: PaletteEntry;
  isSelected: boolean;
  isLocked: boolean;
  onPress: (colorKey: COLOR_KEY) => void;
};

const ColorSwatch = memo((props: Props) => {
  const handlePress = useCallback(() => {
    props.onPress(props.colorKey);
  }, [props.colorKey, props.onPress]);

  const ringColor = props.isSelected ? props.palette.dark : 'transparent';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        { borderColor: ringColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.swatch, { backgroundColor: props.palette.light }]}>
        <View
          style={[
            styles.accent,
            { backgroundColor: hexA(props.palette.dark, 0.25) },
          ]}
        />
        <View style={[styles.dot, { backgroundColor: props.palette.dark }]} />
        {props.isLocked && (
          <View style={styles.lockBadge}>
            <UiIcon name="lock" size={10} color={colors.textOnDark} />
          </View>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: 2,
  },
  swatch: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '55%',
  },
  dot: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default ColorSwatch;
