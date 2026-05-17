import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RefreshIcon from '~shared/assets/icons/refresh.svg';
import { colors, radius } from '~shared/theme';
import { translate } from '~i18n/translate';
import { RECURRENCE } from '../enums/Recurrence';

type Props = {
  recurrence: RECURRENCE;
};

const labelFor = (recurrence: RECURRENCE): string | null => {
  if (recurrence === RECURRENCE.YEARLY) {
    return translate('date.yearlySuffix');
  }
  if (recurrence === RECURRENCE.MONTHLY) {
    return translate('date.monthlySuffix');
  }
  if (recurrence === RECURRENCE.WEEKLY) {
    return translate('date.weeklySuffix');
  }
  return null;
};

const RecurrenceChip = memo((props: Props) => {
  const label = labelFor(props.recurrence);

  if (label == null) {
    return null;
  }

  return (
    <View style={styles.root}>
      <RefreshIcon width={9} height={9} color={colors.textPrimary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingLeft: 6,
    paddingRight: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(26,26,26,0.06)',
  },
  label: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0,
  },
});

export default RecurrenceChip;
