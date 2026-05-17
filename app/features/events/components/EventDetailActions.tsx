import { memo, ReactNode, useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Svg, { Rect } from 'react-native-svg';
import UiIcon from '~shared/components/UiIcon';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { PALETTE } from '~shared/constants/Palette';
import { colors, radius, spacing } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

type ActionShellProps = {
  children: ReactNode;
};

const ActionShell = memo((shellProps: ActionShellProps) => {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        blurType="xlight"
        blurAmount={18}
        reducedTransparencyFallbackColor="rgba(255,255,255,0.78)"
        style={styles.shellIos}
      >
        {shellProps.children}
      </BlurView>
    );
  }

  return <View style={styles.shellAndroid}>{shellProps.children}</View>;
});

type ActionProps = {
  icon: ReactNode;
  label: string;
  tint: string;
  onPress: () => void;
};

const Action = memo((actionProps: ActionProps) => {
  const handlePress = useCallback(() => {
    actionProps.onPress();
  }, [actionProps.onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <ActionShell>
        <View
          style={[
            styles.iconBlock,
            {
              backgroundColor: hexA(actionProps.tint, 0.14),
              borderColor: hexA(actionProps.tint, 0.12),
            },
          ]}
        >
          {actionProps.icon}
        </View>
        <Text style={styles.label}>{actionProps.label}</Text>
      </ActionShell>
    </Pressable>
  );
});

const ICON_SIZE = 20;

const WidgetIcon = memo((widgetProps: { color: string }) => (
  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 22 22" fill="none">
    <Rect
      x={3}
      y={3}
      width={7}
      height={7}
      rx={1.8}
      stroke={widgetProps.color}
      strokeWidth={1.7}
    />
    <Rect
      x={12}
      y={3}
      width={7}
      height={7}
      rx={1.8}
      stroke={widgetProps.color}
      strokeWidth={1.7}
    />
    <Rect
      x={3}
      y={12}
      width={7}
      height={7}
      rx={1.8}
      stroke={widgetProps.color}
      strokeWidth={1.7}
    />
    <Rect
      x={12}
      y={12}
      width={7}
      height={7}
      rx={1.8}
      fill={widgetProps.color}
    />
  </Svg>
));

type Props = {
  onPressEdit: () => void;
  onPressWidget: () => void;
  onPressShare: () => void;
  onPressDelete: () => void;
};

const EventDetailActions = memo((props: Props) => {
  const editTint = PALETTE[COLOR_KEY.INDIGO].dark;
  const widgetTint = PALETTE[COLOR_KEY.SAGE].dark;
  const shareTint = PALETTE[COLOR_KEY.PEACH].dark;
  const deleteTint = PALETTE[COLOR_KEY.PINK].dark;

  return (
    <View style={styles.root}>
      <Action
        icon={<UiIcon name="edit" size={ICON_SIZE} color={editTint} />}
        label={translate('detail.actionEdit')}
        tint={editTint}
        onPress={props.onPressEdit}
      />
      <Action
        icon={<WidgetIcon color={widgetTint} />}
        label={translate('detail.actionWidget')}
        tint={widgetTint}
        onPress={props.onPressWidget}
      />
      <Action
        icon={<UiIcon name="share" size={ICON_SIZE} color={shareTint} />}
        label={translate('detail.actionShare')}
        tint={shareTint}
        onPress={props.onPressShare}
      />
      <Action
        icon={<UiIcon name="trash" size={ICON_SIZE} color={deleteTint} />}
        label={translate('detail.actionDelete')}
        tint={deleteTint}
        onPress={props.onPressDelete}
      />
    </View>
  );
});

const SHELL_BASE = {
  borderRadius: radius.xl,
  padding: spacing.md,
  paddingBottom: 11,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: 7,
  overflow: 'hidden' as const,
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.xxl,
  },
  pressable: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  shellIos: {
    ...SHELL_BASE,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  shellAndroid: {
    ...SHELL_BASE,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
  },
  iconBlock: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default EventDetailActions;
