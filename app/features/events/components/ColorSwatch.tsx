import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PaletteEntry } from '~shared/constants/Palette';
import { colors } from '~shared/theme';
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

  const dotOpacity = props.isLocked ? 0.5 : 0.65;
  const wrapperOpacity = props.isLocked ? 0.55 : 1;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        { opacity: wrapperOpacity },
        props.isSelected && styles.rootSelected,
        pressed && styles.pressed,
      ]}
    >
      {props.isSelected && (
        <View
          style={[styles.halo, { borderColor: hexA(props.palette.dark, 0.5) }]}
        />
      )}
      <View
        style={[
          styles.circle,
          { backgroundColor: props.palette.light },
          !props.isSelected && styles.circleIdleBorder,
        ]}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: props.palette.dark, opacity: dotOpacity },
          ]}
        />
        {props.isLocked && (
          <View style={styles.lockBubble}>
            <UiIcon name="lock" size={8} color={colors.textPrimary} />
          </View>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootSelected: {
    transform: [{ scale: 1.08 }],
  },
  halo: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 999,
    borderWidth: 2.5,
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIdleBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  dot: {
    width: '38%',
    height: '38%',
    borderRadius: 999,
  },
  lockBubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 3,
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default ColorSwatch;
