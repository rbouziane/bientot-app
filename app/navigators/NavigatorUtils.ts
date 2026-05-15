import { CommonActions } from '@react-navigation/native';

import { navigationRef } from './navigation-utilities';

class NavigatorUtils {
  static navigate(name: string, params?: Record<string, unknown>) {
    if (!navigationRef.isReady()) {
      return;
    }

    navigationRef.navigate({ name, params, merge: true } as never);
  }

  static goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }

  static popToTop() {
    if (!navigationRef.isReady()) {
      return;
    }

    navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name: navigationRef.getRootState().routes[0].name }] }));
  }

  static reset(name: string, params?: Record<string, unknown>) {
    if (!navigationRef.isReady()) {
      return;
    }

    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      }),
    );
  }
}

export default NavigatorUtils;
