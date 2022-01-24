import React, { useEffect } from 'react';
import { Dimensions, View, Image, PermissionsAndroid } from 'react-native';
import ImagePath from '../../assests/ImagePath';
import Colors from '../../assests/Colors';
import StatusBar from '../../utils/MyStatusBar';
import normalise from '../../utils/helpers/Dimens';

export default function Splash(props) {
  useEffect(() => {
    requestAllpermissions();
  }, []);

  //REQUEST CAMERA PERMISSION
  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Choona Camera Permission',
          message: 'Choona needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.PERMISSIONS.GRANTED) {
        // console.log('Camera Permission Given');
      } else {
        // console.log('Camera Permisiion Denied');
      }
    } catch (error) {
      // console.log(error);
    }
  }

  // REQUEST READ PERMISSION
  async function requestExternalReadPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Choona External Storage Read Permission',
          message: 'Choona needs access to read data from your SD Card ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.PERMISSIONS.GRANTED) {
        // console.log('External Read Permisiion Given');
      } else {
        // console.log('External Read Permisiion Denied');
      }
    } catch (error) {
      // console.log(error);
    }
  }

  // REQUEST CONTACT READ PERMISSION
  async function contactReadPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Choona Contacts Permission',
          message: 'Choona needs access to your contacts',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.PERMISSIONS.GRANTED) {
        // console.log('Contacts Read Permisiion Given');
      } else {
        // console.log('Contacts Read Permisiion Denied');
      }
    } catch (error) {
      // console.log(error);
    }
  }

  //MERGING FUNCTIONS
  async function requestAllpermissions() {
    await requestCameraPermission();
    await requestExternalReadPermission();
    await contactReadPermission();
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.darkerblack,
      }}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <View
        style={{
          top: normalise(-38),
        }}>
        <Image
          source={ImagePath ? ImagePath.choonaSplashBg : null}
          style={{
            height: Dimensions.get('window').height + normalise(200),
            width: Dimensions.get('window').width,
          }}
          resizeMode="cover"
        />

        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>

          <Image
            source={ImagePath ? ImagePath.splashLogo : null}
            style={{
              height: 237.53,
              width: 51,

            }}
            resizeMode="cover"
          />

        </View>



      </View>
      {/* <Text
        style={{
          color: Colors.white,
          fontSize: normalise(10),
          position: 'absolute',
          fontFamily: 'ProximaNova-Bold',
          bottom: 20,
        }}>
        Copyright ©{new Date().getFullYear()} CHOONA
      </Text> */}
    </View>
  );
}
