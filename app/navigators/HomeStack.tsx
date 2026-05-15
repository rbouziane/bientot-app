import { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAME } from '~shared/constants/Screen';
import EventsListScreen from '~features/events/screens/events-list-screen';
import { HIDE_HEADER } from './screen-options';

export type HomeStackParamList = {
  [SCREEN_NAME.EVENTS_LIST]: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAME.EVENTS_LIST}
      screenOptions={HIDE_HEADER}
    >
      <Stack.Screen
        name={SCREEN_NAME.EVENTS_LIST}
        component={EventsListScreen}
      />
    </Stack.Navigator>
  );
});

export default HomeStack;
