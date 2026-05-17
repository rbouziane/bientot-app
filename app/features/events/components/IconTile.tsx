import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, shadows } from '~shared/theme';
import EventIcon from './EventIcon';
import { IconRef } from '../types/IconRef';

type Props = {
  icon: IconRef;
  isSelected: boolean;
  isLocked: boolean;
  onPress: (icon: IconRef) => void;
};

const IconTile = memo((props: Props) => {
  const handlePress = useCallback(() => {
    if (props.isLocked) {
      return;
    }
    props.onPress(props.icon);
  }, [props.icon, props.isLocked, props.onPress]);

  const wrapperOpacity = props.isLocked ? 0.45 : 1;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        props.isSelected ? styles.rootSelected : styles.rootIdle,
        { opacity: wrapperOpacity },
        pressed && styles.pressed,
      ]}
    >
      <EventIcon icon={props.icon} size={26} />
      {props.isLocked && (
        <View style={styles.lockBadge}>
          <UiIcon name="lock" size={9} color={colors.textPrimary} />
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootIdle: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  rootSelected: {
    backgroundColor: colors.textPrimary,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.surface,
    padding: 2,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default IconTile;
