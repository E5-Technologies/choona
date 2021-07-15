import constants from '../../../utils/helpers/constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';

const updateToken = async token => {
  try {
    const { userId } = await OneSignal.getDeviceState();

    updatetoken(token, userId);
  } catch (error) {
    console.log(error);
  }
};

const updatetoken = async (tokenvalue, value) => {
  try {
    if (value !== null) {
      const formData = new FormData();
      formData.append('deviceToken', value);
      formData.append('deviceType', Platform.OS);
      fetch(constants.BASE_URL + '/user/token', {
        method: 'POST',
        headers: {
          'x-access-token': tokenvalue,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(resjson => {
          if (resjson.status === 200) {
            setToken();
          }
        })
        .catch(error => {
          console.error(error);
          return 'error';
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const setToken = async () => {
  try {
    await AsyncStorage.setItem('@UpdateToken', 'true');
  } catch (error) {
    console.log(error);
  }
};

export default updateToken;
