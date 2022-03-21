import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './src/utils/Store';
// import { NativeModules } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactionsProvider from './src/components/Reactions/UseReactions/ReactionsProvider';

const queryClient = new QueryClient();
console.warn = console.error = () => {};

// if (__DEV__) {
//   NativeModules.DevSettings.setIsDebuggingRemotely(true);
// }

LogBox.ignoreAllLogs();

const Choona = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactionsProvider>
          <App />
        </ReactionsProvider>
      </QueryClientProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => {
  return Choona;
});
