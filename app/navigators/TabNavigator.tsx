import { memo } from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { STACK_NAME } from '~shared/constants/Screen';
import BottomNav from '~shared/components/BottomNav';
import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';
import WidgetsStack from './WidgetsStack';

export type TabNavigatorParamList = {
  [STACK_NAME.HOME_STACK]: undefined;
  [STACK_NAME.WIDGETS_STACK]: undefined;
  [STACK_NAME.SETTINGS_STACK]: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const renderTabBar = (props: BottomTabBarProps) => <BottomNav {...props} />;

const TabNavigator = memo(() => {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name={STACK_NAME.HOME_STACK} component={HomeStack} />
      <Tab.Screen name={STACK_NAME.WIDGETS_STACK} component={WidgetsStack} />
      <Tab.Screen name={STACK_NAME.SETTINGS_STACK} component={SettingsStack} />
    </Tab.Navigator>
  );
});

export default TabNavigator;
