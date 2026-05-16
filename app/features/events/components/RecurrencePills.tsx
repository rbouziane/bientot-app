import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Pill from '~shared/components/Pill';
import { spacing } from '~shared/theme';
import { translate } from '~i18n/translate';
import { RECURRENCE } from '../enums/Recurrence';

const OPTIONS: RECURRENCE[] = [
  RECURRENCE.NONE,
  RECURRENCE.YEARLY,
  RECURRENCE.MONTHLY,
  RECURRENCE.WEEKLY,
];

const labelFor = (recurrence: RECURRENCE): string => {
  if (recurrence === RECURRENCE.YEARLY) {
    return translate('recurrence.yearly');
  }

  if (recurrence === RECURRENCE.MONTHLY) {
    return translate('recurrence.monthly');
  }

  if (recurrence === RECURRENCE.WEEKLY) {
    return translate('recurrence.weekly');
  }

  return translate('recurrence.none');
};

type ItemProps = {
  recurrence: RECURRENCE;
  isActive: boolean;
  onSelect: (recurrence: RECURRENCE) => void;
};

const Item = memo((itemProps: ItemProps) => {
  const handlePress = useCallback(() => {
    itemProps.onSelect(itemProps.recurrence);
  }, [itemProps.onSelect, itemProps.recurrence]);

  return (
    <Pill
      label={labelFor(itemProps.recurrence)}
      isActive={itemProps.isActive}
      onPress={handlePress}
    />
  );
});

type Props = {
  value: RECURRENCE;
  onChange: (recurrence: RECURRENCE) => void;
};

const RecurrencePills = memo((props: Props) => {
  return (
    <View style={styles.root}>
      {OPTIONS.map(option => (
        <Item
          key={option}
          recurrence={option}
          isActive={props.value === option}
          onSelect={props.onChange}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});

export default RecurrencePills;
