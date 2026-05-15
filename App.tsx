import { memo, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from '~/navigators/AppNavigator';
import { navigationRef } from '~/navigators/navigation-utilities';
import { queryClient } from '~shared/services/queryClient';
import { clientPersister } from '~shared/storage/persister';
import { initializeSecureMMKV } from '~shared/storage/mmkv';

const persistOptions = { persister: clientPersister };

const App = memo(() => {
  useEffect(() => {
    initializeSecureMMKV();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
          </NavigationContainer>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
