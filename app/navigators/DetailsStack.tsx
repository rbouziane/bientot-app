import { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAME } from '~shared/constants/Screen';
import AboutScreen from '~features/about/screens/about-screen';
import ColorPickerScreen from '~features/events/screens/color-picker-screen';
import DeleteConfirmScreen from '~features/events/screens/delete-confirm-screen';
import EventCreateScreen from '~features/events/screens/event-create-screen';
import EventDetailScreen from '~features/events/screens/event-detail-screen';
import EventEditScreen from '~features/events/screens/event-edit-screen';
import EventsPassedScreen from '~features/events/screens/events-passed-screen';
import GroupsScreen from '~features/groups/screens/groups-screen';
import HelpScreen from '~features/help/screens/help-screen';
import IconPickerScreen from '~features/events/screens/icon-picker-screen';
import LanguageScreen from '~features/settings/screens/language-screen';
import NotifPermissionScreen from '~features/events/screens/notif-permission-screen';
import NotificationsScreen from '~features/settings/screens/notifications-screen';
import PaymentErrorScreen from '~features/events/screens/payment-error-screen';
import PaywallScreen from '~features/paywall/screens/paywall-screen';
import ShareCardScreen from '~features/events/screens/share-card-screen';
import SortFilterScreen from '~features/events/screens/sort-filter-screen';
import { HIDE_HEADER, TRANSPARENT_MODAL } from './screen-options';

export type DetailsStackParamList = {
  [SCREEN_NAME.EVENT_DETAIL]: { eventId: string };
  [SCREEN_NAME.EVENT_CREATE]: undefined;
  [SCREEN_NAME.EVENT_EDIT]: { eventId: string };
  [SCREEN_NAME.EVENTS_PASSED]: undefined;
  [SCREEN_NAME.COLOR_PICKER]: undefined;
  [SCREEN_NAME.ICON_PICKER]: undefined;
  [SCREEN_NAME.PAYWALL]: undefined;
  [SCREEN_NAME.SETTINGS_LANGUAGE]: undefined;
  [SCREEN_NAME.SETTINGS_NOTIFICATIONS]: undefined;
  [SCREEN_NAME.ABOUT]: undefined;
  [SCREEN_NAME.HELP]: undefined;
  [SCREEN_NAME.GROUPS]: undefined;
  [SCREEN_NAME.SHARE_CARD]: { eventId: string };
  [SCREEN_NAME.DELETE_CONFIRM]: { eventId: string };
  [SCREEN_NAME.SORT_FILTER]: undefined;
  [SCREEN_NAME.PAYMENT_ERROR]: undefined;
  [SCREEN_NAME.NOTIF_PERMISSION]: undefined;
};

const Stack = createNativeStackNavigator<DetailsStackParamList>();

const DetailsStack = memo(() => {
  return (
    <Stack.Navigator screenOptions={HIDE_HEADER}>
      <Stack.Screen
        name={SCREEN_NAME.EVENT_DETAIL}
        component={EventDetailScreen}
      />
      <Stack.Screen
        name={SCREEN_NAME.EVENT_CREATE}
        component={EventCreateScreen}
      />
      <Stack.Screen name={SCREEN_NAME.EVENT_EDIT} component={EventEditScreen} />
      <Stack.Screen
        name={SCREEN_NAME.EVENTS_PASSED}
        component={EventsPassedScreen}
      />
      <Stack.Screen
        name={SCREEN_NAME.COLOR_PICKER}
        component={ColorPickerScreen}
      />
      <Stack.Screen
        name={SCREEN_NAME.ICON_PICKER}
        component={IconPickerScreen}
      />
      <Stack.Screen name={SCREEN_NAME.PAYWALL} component={PaywallScreen} />
      <Stack.Screen
        name={SCREEN_NAME.SETTINGS_LANGUAGE}
        component={LanguageScreen}
      />
      <Stack.Screen
        name={SCREEN_NAME.SETTINGS_NOTIFICATIONS}
        component={NotificationsScreen}
      />
      <Stack.Screen name={SCREEN_NAME.ABOUT} component={AboutScreen} />
      <Stack.Screen name={SCREEN_NAME.HELP} component={HelpScreen} />
      <Stack.Screen name={SCREEN_NAME.GROUPS} component={GroupsScreen} />
      <Stack.Screen name={SCREEN_NAME.SHARE_CARD} component={ShareCardScreen} />
      <Stack.Screen
        name={SCREEN_NAME.DELETE_CONFIRM}
        component={DeleteConfirmScreen}
        options={TRANSPARENT_MODAL}
      />
      <Stack.Screen
        name={SCREEN_NAME.SORT_FILTER}
        component={SortFilterScreen}
        options={TRANSPARENT_MODAL}
      />
      <Stack.Screen
        name={SCREEN_NAME.PAYMENT_ERROR}
        component={PaymentErrorScreen}
        options={TRANSPARENT_MODAL}
      />
      <Stack.Screen
        name={SCREEN_NAME.NOTIF_PERMISSION}
        component={NotifPermissionScreen}
        options={TRANSPARENT_MODAL}
      />
    </Stack.Navigator>
  );
});

export default DetailsStack;
