import { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '~shared/theme';

type Props = {
  children: ReactNode;
  backgroundColor?: string;
};

const GRADIENT_COLORS = [colors.background, colors.backgroundEnd];

const ScreenContainer = memo((props: Props) => {
  if (props.backgroundColor != null) {
    return (
      <View style={[styles.root, { backgroundColor: props.backgroundColor }]}>
        {props.children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1 }}
      style={styles.root}
    >
      {props.children}
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default ScreenContainer;
