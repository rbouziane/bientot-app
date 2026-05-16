import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { resolveConceptEmoji } from '~shared/utils/iconResolver';
import { IconRef } from '~features/events/types/IconRef';

type Props = {
  icon: IconRef;
  size: number;
};

const EventIcon = memo((props: Props) => {
  const emoji =
    props.icon.family === 'emoji'
      ? props.icon.value
      : resolveConceptEmoji(props.icon.concept);

  return (
    <View style={styles.wrap}>
      <Text
        style={{ fontSize: props.size, lineHeight: props.size * 1.1 }}
        allowFontScaling={false}
      >
        {emoji}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventIcon;
