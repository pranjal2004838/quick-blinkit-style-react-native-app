import React, {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // track app lifecycle transitions for debugging
    // could also dispatch a refresh action when app comes back to foreground
    const sub = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come back to foreground');
          // good place to re-fetch stale data if we had a real api
        }
        appState.current = nextAppState;
      },
    );

    return () => sub.remove();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
