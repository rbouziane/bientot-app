import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaletteEntry } from '~shared/constants/Palette';
import { colors, radius, spacing, tabular } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { formatCompact, formatLongDate } from '~shared/utils/date';
import { IconRef } from '../types/IconRef';
import IconBadge from './IconBadge';

type Props = {
  title: string;
  targetDate: string;
  icon: IconRef;
  palette: PaletteEntry;
};

const CompactEventPreview = memo((props: Props) => {
  const dateLabel = useMemo(
    () => formatLongDate(props.targetDate),
    [props.targetDate],
  );
  const countdownShort = useMemo(
    () => formatCompact(props.targetDate),
    [props.targetDate],
  );

  // Splits "7j" into "7" + "j" so we can style the unit smaller.
  const match = countdownShort.match(/^(\D*)(\d+(?:[.,]\d+)?)(\D*)$/);
  const big = match != null ? `${match[1]}${match[2]}` : countdownShort;
  const unit = match != null ? match[3] : '';

  return (
    <View style={[styles.root, { backgroundColor: props.palette.light }]}>
      <View
        style={[
          styles.fillAccent,
          { backgroundColor: hexA(props.palette.dark, 0.18) },
        ]}
      />
      <IconBadge icon={props.icon} darkColor={props.palette.dark} size={42} />
      <View style={styles.textColumn}>
        <Text style={styles.title} numberOfLines={1}>
          {props.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {dateLabel}
        </Text>
      </View>
      <View style={styles.countdownColumn}>
        <Text style={[styles.countdownBig, tabular]}>
          {big}
          {unit !== '' && <Text style={styles.countdownUnit}> {unit}</Text>}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  fillAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '8%',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'lowercase',
  },
  countdownColumn: {
    alignItems: 'flex-end',
  },
  countdownBig: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  countdownUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

export default CompactEventPreview;
