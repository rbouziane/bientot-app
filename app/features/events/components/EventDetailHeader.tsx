import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import CircleButton from '~shared/components/CircleButton';
import UiIcon from '~shared/components/UiIcon';
import { colors, spacing } from '~shared/theme';

type Props = {
  onPressBack: () => void;
};

const EventDetailHeader = memo((props: Props) => {
  return (
    <View style={styles.root}>
      <CircleButton
        icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
        tone="glass"
        onPress={props.onPressBack}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
});

export default EventDetailHeader;
