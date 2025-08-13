import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

export const setupNotificationChannels = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });
};

export const requestUserPermission = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('Permission granted:', settings);
    getFCMToken(); // Only get the FCM token if the permission is granted
  } else {
    console.log('User declined permissions');
  }
};

export const getFCMToken = async () => {
  try {
    const fcmToken = await AsyncStorage.getItem('deviceToken');
    console.log('FCM token:', fcmToken);
    if (!fcmToken) {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('deviceToken', token);
      console.log('FCM token:', fcmToken);
    }
  } catch (error) {
    console.error('Error fetching FCM token:', error);
  }
};

export const setupNotificationListeners = (dispatch = null) => {
  // Handle notification when app is in background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened from background', remoteMessage);
    // handleNotificationNavigation(remoteMessage);
  });

  // Handle notification when app is opened from killed state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification opened from killed state', remoteMessage);
        // handleNotificationNavigation(remoteMessage);
      }
    });

  // Handle foreground notifications (only call displayNotification if necessary)
  messaging().onMessage(async remoteMessage => {
    console.log('Remote message in foreground', remoteMessage);
    if (remoteMessage?.notification) {
      displayNotification(remoteMessage?.notification, remoteMessage?.data);
    }
  });

  // Handle notification click event in the foreground
  notifee.onForegroundEvent(({type, detail}) => {
    const data = {
      page: 1,
      limit: 40,
    };

    // if (dispatch) {
    //   dispatch(getNotifications(data));
    // }

    // if (type === EventType.PRESS && detail?.notification) {
    //   handleNotificationNavigation(detail?.notification);
    // }
  });

  // Handle background event
  notifee.onBackgroundEvent(async ({type, detail}) => {
    const data = {
      page: 1,
      limit: 40,
    };

    // if (dispatch) {
    //   dispatch(getNotifications(data));
    // }

    // if (type === EventType.PRESS && detail?.notification) {
    //   handleNotificationNavigation(detail?.notification);
    // }
  });
};

const displayNotification = async (notification, data) => {
  // To prevent multiple notifications from being shown
  if (notification && !notification.isDisplayed) {
    // Set `isDisplayed` flag to true to prevent duplicate notifications
    notification.isDisplayed = true;

    await notifee.displayNotification({
      title: notification?.title,
      body: notification?.body,
      ios: {
        sound: 'default',
      },
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
        sound: 'default',
      },
      data,
    });
  }
};
