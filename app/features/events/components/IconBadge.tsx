import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconRef } from '../types/IconRef';
import EventIcon from './EventIcon';

type Props = {
  icon: IconRef;
  size: number;
};

const IconBadge = memo((props: Props) => {
  return (
    <View style={[styles.root, { width: props.size, height: props.size }]}>
      <EventIcon icon={props.icon} size={props.size * 0.78} />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});

export default IconBadge;
