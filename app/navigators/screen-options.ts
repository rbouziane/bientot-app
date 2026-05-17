import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors } from '~shared/theme';

type ScreenOptionsParams = {
  title?: string;
  showBackButton?: boolean;
  showHeader?: boolean;
};

export const ScreenOptions = (
  params: ScreenOptionsParams,
): NativeStackNavigationOptions => {
  return {
    title: params.title,
    headerShown: params.showHeader === true,
    headerBackVisible: params.showBackButton === true,
    headerTitleStyle: {
      fontWeight: '600',
    },
    headerTintColor: colors.textPrimary,
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: 'transparent',
    },
  };
};

export const HIDE_HEADER: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: 'transparent' },
};

export const TRANSPARENT_MODAL: NativeStackNavigationOptions = {
  headerShown: false,
  presentation: 'transparentModal',
  animation: 'fade',
  contentStyle: { backgroundColor: 'transparent' },
};
