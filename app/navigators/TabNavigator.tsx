import { memo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { STACK_NAME } from '~shared/constants/Screen';
import NativeIcon from '~shared/components/NativeIcon';
import { colors } from '~shared/theme';
import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';
import WidgetsStack from './WidgetsStack';

export type TabNavigatorParamList = {
  [STACK_NAME.HOME_STACK]: undefined;
  [STACK_NAME.WIDGETS_STACK]: undefined;
  [STACK_NAME.SETTINGS_STACK]: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const renderHomeIcon = ({ color, size }: { color: string; size: number }) => (
  <NativeIcon
    iosName="list.bullet"
    androidName="list"
    size={size}
    color={color}
  />
);

const renderWidgetsIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => (
  <NativeIcon
    iosName="rectangle.on.rectangle"
    androidName="widgets"
    size={size}
    color={color}
  />
);

const renderSettingsIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => (
  <NativeIcon
    iosName="gearshape.fill"
    androidName="settings"
    size={size}
    color={color}
  />
);

const TabNavigator = memo(() => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSoft,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={STACK_NAME.HOME_STACK}
        component={HomeStack}
        options={{ tabBarIcon: renderHomeIcon }}
      />
      <Tab.Screen
        name={STACK_NAME.WIDGETS_STACK}
        component={WidgetsStack}
        options={{ tabBarIcon: renderWidgetsIcon }}
      />
      <Tab.Screen
        name={STACK_NAME.SETTINGS_STACK}
        component={SettingsStack}
        options={{ tabBarIcon: renderSettingsIcon }}
      />
    </Tab.Navigator>
  );
});

export default TabNavigator;
