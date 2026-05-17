import { memo } from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAME, STACK_NAME } from '~shared/constants/Screen';
import { STORAGE_KEY } from '~shared/constants/Storage';
import { getMMKV } from '~shared/storage/mmkv';
import OnboardingScreen from '~features/onboarding/screens/onboarding-screen';
import DetailsStack, { DetailsStackParamList } from './DetailsStack';
import TabNavigator from './TabNavigator';
import { HIDE_HEADER } from './screen-options';

export type AppNavigatorParamList = {
  [SCREEN_NAME.ONBOARDING]: undefined;
  [STACK_NAME.TAB_NAVIGATOR]: undefined;
  [STACK_NAME.DETAILS_STACK]: NavigatorScreenParams<DetailsStackParamList>;
};

const Stack = createNativeStackNavigator<AppNavigatorParamList>();

const resolveInitialRoute = ():
  | SCREEN_NAME.ONBOARDING
  | STACK_NAME.TAB_NAVIGATOR => {
  const completed = getMMKV().getBoolean(STORAGE_KEY.ONBOARDING_COMPLETED);
  return completed === true ? STACK_NAME.TAB_NAVIGATOR : SCREEN_NAME.ONBOARDING;
};

const AppNavigator = memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={resolveInitialRoute()}
      screenOptions={HIDE_HEADER}
    >
      <Stack.Screen
        name={SCREEN_NAME.ONBOARDING}
        component={OnboardingScreen}
      />
      <Stack.Screen name={STACK_NAME.TAB_NAVIGATOR} component={TabNavigator} />
      <Stack.Screen name={STACK_NAME.DETAILS_STACK} component={DetailsStack} />
    </Stack.Navigator>
  );
});

export default AppNavigator;
