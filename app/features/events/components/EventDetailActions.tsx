import { memo, ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import NativeIcon from '~shared/components/NativeIcon';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, spacing } from '~shared/theme';
import { translate } from '~i18n/translate';

type ActionProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
};

const Action = memo((actionProps: ActionProps) => {
  const handlePress = useCallback(() => {
    actionProps.onPress();
  }, [actionProps.onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
    >
      {actionProps.icon}
      <Text style={styles.label}>{actionProps.label}</Text>
    </Pressable>
  );
});

type Props = {
  onPressEdit: () => void;
  onPressWidget: () => void;
  onPressShare: () => void;
  onPressDelete: () => void;
};

const ICON_SIZE = 20;

const EventDetailActions = memo((props: Props) => {
  return (
    <View style={styles.root}>
      <Action
        icon={
          <UiIcon name="edit" size={ICON_SIZE} color={colors.textPrimary} />
        }
        label={translate('detail.actionEdit')}
        onPress={props.onPressEdit}
      />
      <Action
        icon={
          <NativeIcon
            iosName="rectangle.on.rectangle"
            androidName="widgets"
            size={ICON_SIZE}
            color={colors.textPrimary}
          />
        }
        label={translate('detail.actionWidget')}
        onPress={props.onPressWidget}
      />
      <Action
        icon={
          <UiIcon name="share" size={ICON_SIZE} color={colors.textPrimary} />
        }
        label={translate('detail.actionShare')}
        onPress={props.onPressShare}
      />
      <Action
        icon={
          <UiIcon name="trash" size={ICON_SIZE} color={colors.textPrimary} />
        }
        label={translate('detail.actionDelete')}
        onPress={props.onPressDelete}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
  cell: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceTranslucent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  cellPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

export default EventDetailActions;
