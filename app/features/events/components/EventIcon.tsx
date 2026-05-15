import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { resolveIconNativeName } from '~shared/utils/iconResolver';
import { IconRef } from '~features/events/types/IconRef';

type Props = {
  icon: IconRef;
  size: number;
  color: string;
};

const EventIcon = memo((props: Props) => {
  if (props.icon.family === 'emoji') {
    return (
      <View style={styles.emojiWrap}>
        <Text style={{ fontSize: props.size * 0.95, lineHeight: props.size }}>
          {props.icon.value}
        </Text>
      </View>
    );
  }

  if (Platform.OS === 'ios') {
    const name = resolveIconNativeName(props.icon.concept, 'ios');

    return (
      <SFSymbol
        name={name}
        size={props.size}
        color={props.color}
        weight="regular"
        resizeMode="scale-aspect-fit"
        style={{ width: props.size, height: props.size }}
      />
    );
  }

  const name = resolveIconNativeName(props.icon.concept, 'android');

  return (
    <MaterialIcons
      // @ts-expect-error — runtime mapping from spec; glyphs validated at build time
      name={name}
      size={props.size}
      color={props.color}
    />
  );
});

const styles = StyleSheet.create({
  emojiWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventIcon;
