import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaletteEntry } from '~shared/constants/Palette';
import { colors, radius, spacing, tabular, typography } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { IconRef } from '../types/IconRef';
import IconBadge from './IconBadge';

type Props = {
  icon: IconRef;
  palette: PaletteEntry;
  countdownValue: string;
  countdownUnit: string;
};

const ColorPickerPreview = memo((props: Props) => {
  return (
    <View style={[styles.root, { backgroundColor: props.palette.light }]}>
      <View
        style={[
          styles.fill,
          { backgroundColor: hexA(props.palette.dark, 0.16) },
        ]}
      />
      <IconBadge icon={props.icon} darkColor={props.palette.dark} size={56} />
      <View style={styles.textColumn}>
        <Text style={[styles.value, tabular]}>{props.countdownValue}</Text>
        {props.countdownUnit !== '' && (
          <Text style={styles.unit}>{props.countdownUnit}</Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.xxxl - 6,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '60%',
  },
  textColumn: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  unit: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default ColorPickerPreview;
