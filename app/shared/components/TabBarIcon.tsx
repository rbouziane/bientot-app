import { memo } from 'react';
import { Platform } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

type Props = {
  iosName: string;
  androidName: string;
  size: number;
  color: string;
};

const TabBarIcon = memo((props: Props) => {
  if (Platform.OS === 'ios') {
    return (
      <SFSymbol
        name={props.iosName}
        size={props.size}
        color={props.color}
        weight="regular"
        resizeMode="scale-aspect-fit"
        style={{ width: props.size, height: props.size }}
      />
    );
  }

  return (
    <MaterialIcons
      // @ts-expect-error — runtime mapping
      name={props.androidName}
      size={props.size}
      color={props.color}
    />
  );
});

export default TabBarIcon;
