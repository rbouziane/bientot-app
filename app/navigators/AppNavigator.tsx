import { memo } from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { STACK_NAME } from '~shared/constants/Screen';
import DetailsStack, { DetailsStackParamList } from './DetailsStack';
import TabNavigator from './TabNavigator';
import { HIDE_HEADER } from './screen-options';

export type AppNavigatorParamList = {
  [STACK_NAME.TAB_NAVIGATOR]: undefined;
  [STACK_NAME.DETAILS_STACK]: NavigatorScreenParams<DetailsStackParamList>;
};

const Stack = createNativeStackNavigator<AppNavigatorParamList>();

const AppNavigator = memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={STACK_NAME.TAB_NAVIGATOR}
      screenOptions={HIDE_HEADER}
    >
      <Stack.Screen name={STACK_NAME.TAB_NAVIGATOR} component={TabNavigator} />
      <Stack.Screen name={STACK_NAME.DETAILS_STACK} component={DetailsStack} />
    </Stack.Navigator>
  );
});

export default AppNavigator;
