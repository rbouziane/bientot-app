import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DetailsStackParamList } from '~/navigators/DetailsStack';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import Button from '~shared/components/Button';
import UiIcon from '~shared/components/UiIcon';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';
import { useDeleteEventMutation, useEventQuery } from '../services/hook';

type DeleteConfirmRoute = RouteProp<
  DetailsStackParamList,
  SCREEN_NAME.DELETE_CONFIRM
>;

const DANGER_COLOR = '#B8383E';

const DeleteConfirmScreen = memo(() => {
  const route = useRoute<DeleteConfirmRoute>();
  const eventId = route.params.eventId;

  const { event } = useEventQuery(eventId);
  const { deleteEventMutate, isDeleteEventPending } = useDeleteEventMutation();

  const handleCancel = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleConfirm = useCallback(async () => {
    await deleteEventMutate(eventId);
    NavigatorUtils.goBack();
    NavigatorUtils.goBack();
  }, [deleteEventMutate, eventId]);

  const title = event?.title ?? '';

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
      <View style={styles.sheet}>
        <View style={styles.row}>
          <View style={styles.iconBubble}>
            <UiIcon name="trash" size={24} color={DANGER_COLOR} />
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>{translate('deleteConfirm.title')}</Text>
            <Text style={styles.body}>
              {translate('deleteConfirm.body', { title })}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <View style={styles.actionFlex}>
            <Button
              label={translate('common.cancel')}
              tone="glass"
              onPress={handleCancel}
            />
          </View>
          <View style={styles.actionFlexLarge}>
            <Button
              label={translate('common.delete')}
              tone="color"
              color={DANGER_COLOR}
              isDisabled={isDeleteEventPending}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'flex-end',
  },
  sheet: {
    margin: 12,
    marginBottom: 50,
    backgroundColor: 'rgba(245,243,238,0.96)',
    borderRadius: radius.xxxl - 4,
    padding: spacing.xl,
    gap: 14,
    ...shadows.sheet,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: hexA(DANGER_COLOR, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionFlex: {
    flex: 1,
  },
  actionFlexLarge: {
    flex: 1.2,
  },
});

export default DeleteConfirmScreen;
