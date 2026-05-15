import { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAME } from '~shared/constants/Screen';
import WidgetsConfigScreen from '~features/widgets/screens/widgets-config-screen';
import { HIDE_HEADER } from './screen-options';

export type WidgetsStackParamList = {
  [SCREEN_NAME.WIDGETS_CONFIG]: undefined;
};

const Stack = createNativeStackNavigator<WidgetsStackParamList>();

const WidgetsStack = memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAME.WIDGETS_CONFIG}
      screenOptions={HIDE_HEADER}
    >
      <Stack.Screen
        name={SCREEN_NAME.WIDGETS_CONFIG}
        component={WidgetsConfigScreen}
      />
    </Stack.Navigator>
  );
});

export default WidgetsStack;
