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




// import React from 'react';
// import { AppRegistry, LogBox } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import { Provider } from 'react-redux';
// import store from './src/utils/Store';
// <<<<<<< HEAD
// =======
// // import { NativeModules } from 'react-native';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import ReactionsProvider from './src/components/Reactions/UseReactions/ReactionsProvider';

// const queryClient = new QueryClient();
// console.warn = console.error = () => {};

// // if (__DEV__) {
// //   NativeModules.DevSettings.setIsDebuggingRemotely(true);
// // }
// >>>>>>> e7323a6d908b001a9b5f817b4c3a308616bb636d

// LogBox.ignoreAllLogs();

// const Choona = () => {
//   return (
//     <Provider store={store}>
// <<<<<<< HEAD
//       <App />
// =======
//       <QueryClientProvider client={queryClient}>
//         <ReactionsProvider>
//           <App />
//         </ReactionsProvider>
//       </QueryClientProvider>
// >>>>>>> e7323a6d908b001a9b5f817b4c3a308616bb636d
//     </Provider>
//   );
// };

// AppRegistry.registerComponent(appName, () => {
//   return Choona;
// });




// import React from 'react';
// import { AppRegistry, LogBox } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import { Provider } from 'react-redux';
// import store from './src/utils/Store';

// LogBox.ignoreAllLogs();

// const Choona = () => {
//   return (
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );
// };

// AppRegistry.registerComponent(appName, () => {
//   return Choona;
// });