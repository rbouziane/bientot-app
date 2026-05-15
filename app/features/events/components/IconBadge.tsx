import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { hexA } from '~shared/utils/colorUtils';
import { IconRef } from '../types/IconRef';
import EventIcon from './EventIcon';

type Props = {
  icon: IconRef;
  darkColor: string;
  size: number;
  opacity?: number;
};

const IconBadge = memo((props: Props) => {
  const opacity = props.opacity ?? 0.12;
  const backgroundColor = hexA(props.darkColor, opacity);
  const borderRadius = props.size * 0.32;

  return (
    <View
      style={[
        styles.badge,
        {
          width: props.size,
          height: props.size,
          borderRadius,
          backgroundColor,
        },
      ]}
    >
      <EventIcon
        icon={props.icon}
        size={props.size * 0.55}
        color={props.darkColor}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconBadge;
