import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './src/utils/Store';
import ErrorBoundary from './src/components/ErrorBoundary';

LogBox.ignoreAllLogs();

const Choona = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => {
  return Choona;
});
