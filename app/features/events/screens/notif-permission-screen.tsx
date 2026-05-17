import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import { colors, shadows, spacing } from '~shared/theme';
import { translate } from '~i18n/translate';

const IOS_BLUE = '#007AFF';

const NotifPermissionScreen = memo(() => {
  const handleDismiss = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />
      <View style={styles.context}>
        <Text style={styles.contextText}>
          {translate('notifPermission.context')}
        </Text>
      </View>
      <View style={styles.modal}>
        <View style={styles.modalBody}>
          <Text style={styles.systemTitle}>
            {translate('notifPermission.systemTitle')}
          </Text>
          <Text style={styles.systemBody}>
            {translate('notifPermission.systemBody')}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [
              styles.action,
              pressed && styles.actionPressed,
            ]}
          >
            <Text style={styles.actionLabel}>
              {translate('notifPermission.deny')}
            </Text>
          </Pressable>
          <View style={styles.actionDivider} />
          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [
              styles.action,
              pressed && styles.actionPressed,
            ]}
          >
            <Text style={[styles.actionLabel, styles.actionLabelStrong]}>
              {translate('notifPermission.allow')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  context: {
    position: 'absolute',
    top: 120,
    left: spacing.xxl,
    right: spacing.xxl,
  },
  contextText: {
    fontSize: 13,
    color: colors.textOnDark,
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 20,
  },
  modal: {
    width: '100%',
    backgroundColor: 'rgba(245,243,238,0.96)',
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.sheet,
  },
  modalBody: {
    padding: spacing.xxl - 2,
    alignItems: 'center',
  },
  systemTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  systemBody: {
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    lineHeight: 19,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(26,26,26,0.18)',
  },
  actionsRow: {
    flexDirection: 'row',
  },
  action: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  actionPressed: {
    opacity: 0.5,
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(26,26,26,0.18)',
  },
  actionLabel: {
    fontSize: 17,
    color: IOS_BLUE,
  },
  actionLabelStrong: {
    fontWeight: '600',
  },
});

export default NotifPermissionScreen;
