import { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SCREEN_NAME } from '~shared/constants/Screen';
import SettingsScreen from '~features/settings/screens/settings-screen';

import { HIDE_HEADER } from './screen-options';

export type SettingsStackParamList = {
  [SCREEN_NAME.SETTINGS]: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStack = memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAME.SETTINGS}
      screenOptions={HIDE_HEADER}
    >
      <Stack.Screen name={SCREEN_NAME.SETTINGS} component={SettingsScreen} />
    </Stack.Navigator>
  );
});

export default SettingsStack;
