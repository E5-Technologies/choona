import React, { useEffect, useState } from 'react';
import env from 'react-native-config';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import ImagePath from '../../assests/ImagePath';
import Colors from '../../assests/Colors';
import MyStatusBar from '../../utils/MyStatusBar';
import { loginWithSpotify } from '../../utils/helpers/SpotifyLogin';
// import toast from '../../utils/helpers/ShowErrorAlert';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
} from '../../action/TypeConstants';
import { loginRequest } from '../../action/UserAction';
import { connect } from 'react-redux';
import _ from 'lodash';
import appleAuth, {
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  // AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { getDeviceToken } from '../../utils/helpers/FirebaseToken';
import OneSignal from 'react-native-onesignal';

let user = null;
let status = '';

function SignUp(props) {
  const [token2, setToken] = useState(undefined);
  const [userDetails, setUserDetails] = useState({});
  // const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
  const [loginType, setLoginType] = useState('');

  useEffect(() => {
    (async () => {
      const { userId } = await OneSignal.getDeviceState();
      setToken(userId);
    })();
  });

  // useEffect(() => {
  //   fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
  //     updateCredentialStateForUser(`Error: ${error.code}`),
  //   );
  //   return () => {};
  // }, []);

  function spotifyLogin() {
    console.log(1);
    loginWithSpotify()
      .then(value => {
        console.log(2, !_.isEmpty(value));
        if (!_.isEmpty(value)) {
          setUserDetails(value);

          let payload = {
            social_id: value.id,
            social_type: 'spotify',
            deviceToken: token2,
            deviceType: Platform.OS,
          };
          console.log({ payload });

          props.loginRequest(payload);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  //ON APLLE BUTTON PRESS
  async function onAppleButtonPress() {
    setLoginType('Apple');
    console.warn('Beginning Apple Authentication');
    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      // console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      user = newUser;

      // fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      //   updateCredentialStateForUser(`Error: ${error.code}`),
      // );

      if (identityToken) {
        appleLoginWithOurServer(appleAuthRequestResponse);
        // console.log(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL) {
        // console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  }

  // //FETCH AND UPDATE CRED STATE
  // async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
  //   if (user === null) {
  //     updateCredentialStateForUser('N/A');
  //   } else {
  //     const credentialState = await appleAuth.getCredentialStateForUser(user);
  //     if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
  //       updateCredentialStateForUser('AUTHORIZED');
  //     } else {
  //       updateCredentialStateForUser(credentialState);
  //     }
  //   }
  // }

  //TOKEN FIREBASE
  function appleLoginWithOurServer(appleData) {
    getDeviceToken()
      .then(token => {
        console.log(token);
        signInwithApple(appleData, token);
      })
      .catch(err => {
        signInwithApple(appleData, '');
      });
  }

  // API REQUEST
  function signInwithApple(appleData, token) {
    console.log({ appleData }, { token });
    // isInternetConnected().then(() => {

    var appleSignUpObject = {};

    appleSignUpObject.social_id = 'user' in appleData ? appleData.user : '';
    appleSignUpObject.social_type = 'apple';
    appleSignUpObject.deviceType = Platform.OS;
    appleSignUpObject.deviceToken = token2;

    // console.log('Apple ', appleData);
    props.loginRequest(appleSignUpObject);
    setUserDetails(appleData);

    // }).catch(() => {
    //   // console.log('Error', 'Please connect to internet')
    // });
  }
  //APPLE SIGN IN END

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case USER_LOGIN_REQUEST:
        status = props.status;
        break;

      case USER_LOGIN_SUCCESS:
        status = props.status;
        break;

      case USER_LOGIN_FAILURE:
        status = props.status;

        if (props.error.status === 201) {
          props.navigation.navigate('SignUp', {
            userDetails: userDetails,
            loginType: loginType,
          });
        } else {
          alert(props.error.message);
        }

        break;
    }
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: Colors.black, position: 'relative' }}>
      {Platform.OS === 'android' ? (
        <MyStatusBar />
      ) : (
        <StatusBar
          backgroundColor={Colors.darkerblack}
          barStyle={'light-content'}
        />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
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
      </View>
      <View
        style={{
          position: 'absolute',
          top: normalise(-150),
          right: 0,
          left: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={ImagePath ? ImagePath.splashLogo : null}
          style={{
            height: normalise(40),
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
        {env.IS_PRODUCTION === 'false' && (
          <Text
            style={{
              color: '#fff',
              fontFamily: 'ProximaNova-Bold',
              fontSize: 20,
              marginTop: 10,
              textAlign: 'center',
            }}>
            Staging
          </Text>
        )}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingHorizontal: normalise(32),
          position: 'absolute',
          bottom: normalise(48),
          left: 0,
          right: 0,
        }}>
        <Text
          style={{
            color: Colors.white,
            fontFamily: 'ProximaNova-SemiBold',
            fontSize: normalise(11),
            marginBottom: normalise(12),
          }}>
          SIMPLY SIGN IN WITH ONE OF THE BELOW
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#1ED760',
            borderRadius: normalise(26),
            height: normalise(52),
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: normalise(12),
          }}
          onPress={() => {
            spotifyLogin();
            setLoginType('Spotify');
          }}>
          <Image
            source={ImagePath ? ImagePath.spotifyButtonLogo : null}
            style={{
              height: normalise(28),
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#E74E4C',
              borderRadius: normalise(26),
              height: normalise(52),
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onAppleButtonPress()}>
            <Image
              source={ImagePath ? ImagePath.appleButtonLogo : null}
              style={{
                height: normalise(26),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    error: state.UserReducer.error,
    loginResponse: state.UserReducer.loginResponse,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginRequest: payload => {
      dispatch(loginRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
