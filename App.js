import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Dimensions,
  AppState,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenRequest } from './src/action/index';
import Colors from './src/assests/Colors';
import ImagePath from './src/assests/ImagePath';
import normalise from './src/utils/helpers/Dimens';

import { getChatListRequest } from './src/action/MessageAction';

import { getProfileRequest } from './src/action/UserAction';

import Splash from './src/components/SplashComponent/Splash';

import Login from './src/components/auth/Login';
import SignUp from './src/components/auth/SignUp';

import Home from './src/components/main/TabNavigator/Home';
import Search from './src/components/main/TabNavigator/Search';
import AddSong from './src/components/main/TabNavigator/Add';
import Notification from './src/components/main/TabNavigator/Notification';
import Contact from './src/components/main/TabNavigator/Contact';
import HomeItemList from './src/components/main/ListCells/HomeItemList';
import Profile from './src/components/main/Profile';
import EditProfile from './src/components/main/EditProfile';
import Followers from './src/components/main/Followers';
import Following from './src/components/main/Following';
import HomeItemComments from './src/components/main/HomeItemComments';
import HomeItemReactions from './src/components/main/HomeItemReactions';
import OthersProfile from './src/components/main/OthersProfile';
import CreatePost from './src/components/main/CreatePost';
import Inbox from './src/components/main/Inbox';
import Player from './src/components/main/Player';
import InsideaMessage from './src/components/main/InsideaMessage';
import AddSongsInMessage from './src/components/main/AddSongsInMessage';
import SendSongInMessageFinal from './src/components/main/SendSongInMessageFinal';
import GenreClicked from './src/components/main/GenreClicked';
import GenreSongClicked from './src/components/main/GenreSongClicked';
import FeaturedTrack from './src/components/main/FeaturedTrack';
import AddAnotherSong from './src/components/main/AddAnotherSong';
import PostListForUser from './src/components/main/PostListForUser';
import UsersFromContacts from './src/components/main/UsersFromContacts';
import isInternetConnected from './src/utils/helpers/NetInfo';
import AddToPlayListScreen from './src/components/main/AddToPlayListScreen';
import { editProfileRequest } from './src/action/UserAction';
import _ from 'lodash';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
import PlayerComment from './src/components/main/PlayerComment';
import SingleSongClick from './src/components/main/SingleSongClick';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const dispatch = useDispatch();
  const TokenReducer = useSelector(state => state.TokenReducer);
  //const UserReducer = useSelector(state => state.UserReducer)

  useEffect(() => {
    setTimeout(() => {
      dispatch(getTokenRequest());
    }, 3000);

    // const unsuscribe = firebase().onMessage(async () => {
    //   dispatch(getChatListRequest());
    //   dispatch(getProfileRequest());
    // });

    function _handleAppStateChange() {
      if (AppState.currentState.match(/inactive|background/)) {
        let formdata = new FormData();
        formdata.append('badge_count', 0);
        isInternetConnected()
          .then(() => {
            dispatch(editProfileRequest(formdata));
          })
          .catch(err => {
            toast('Oops', 'Please Connect To Internet');
          });
      } else if (AppState.currentState === 'active') {
        getChatListRequest, dispatch(getChatListRequest());
        dispatch(getProfileRequest());
        console.log('zxcv', 'App is in active Mode.');
      }
    }
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
      // unsuscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    /* O N E S I G N A L   S E T U P */
    OneSignal.setAppId('095694b1-0a59-42ec-bd9c-d60a09bd60a9');
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      // console.log('Prompt response:', response);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { userId } = await OneSignal.getDeviceState();
      AsyncStorage.setItem('deviceToken', userId);
    })();
  });

  // const TabBar = (props) => (
  //   <View>
  //     <MusicPlayerBar />
  //     <BottomTabBar {...props} />
  //   </View>
  // );

  const BottomTab = () => {
    const UserReducer = useSelector(state => state.UserReducer);

    return (
      <View style={styles.appStyle}>
        <Tab.Navigator
          initialRouteName={'Home'}
          tabBarOptions={{
            activeBackgroundColor: Colors.darkerblack,
            inactiveBackgroundColor: Colors.darkerblack,
            safeAreaInsets: { bottom: 0 },
            style: {
              height: Platform.OS === 'android' ? normalise(45) : normalise(68),
              borderTopColor: Colors.fadeblack,
            },
          }}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  style={{
                    marginTop:
                      Platform.OS === 'android'
                        ? normalise(10)
                        : Dimensions.get('window').height > 736
                        ? normalise(0)
                        : normalise(10),
                    height: normalise(20),
                    width: normalise(20),
                  }}
                  source={
                    ImagePath
                      ? focused
                        ? ImagePath.homeactive
                        : ImagePath.homeinactive
                      : null
                  }
                  resizeMode="contain"
                />
              ),
              tabBarLabel: '',
            }}
          />
          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  style={{
                    marginTop:
                      Platform.OS === 'android'
                        ? normalise(10)
                        : Dimensions.get('window').height > 736
                        ? normalise(0)
                        : normalise(10),
                    height: normalise(20),
                    width: normalise(20),
                  }}
                  source={
                    ImagePath
                      ? focused
                        ? ImagePath.searchactive
                        : ImagePath.searchinactive
                      : null
                  }
                  resizeMode="contain"
                />
              ),
              tabBarLabel: '',
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddSong}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  style={{
                    marginTop:
                      Platform.OS === 'android'
                        ? normalise(10)
                        : Dimensions.get('window').height > 736
                        ? normalise(0)
                        : normalise(10),
                    height: normalise(40),
                    width: normalise(40),
                  }}
                  source={
                    ImagePath
                      ? focused
                        ? ImagePath.addButton
                        : ImagePath.addButton
                      : null
                  }
                  resizeMode="contain"
                />
              ),
              tabBarLabel: '',
            }}
          />
          <Tab.Screen
            name="Notification"
            component={Notification}
            options={{
              tabBarIcon: ({ focused }) => (
                <View>
                  <Image
                    style={{
                      marginTop:
                        Platform.OS === 'android'
                          ? normalise(10)
                          : Dimensions.get('window').height > 736
                          ? normalise(0)
                          : normalise(10),
                      height: normalise(20),
                      width: normalise(20),
                    }}
                    source={
                      ImagePath
                        ? focused
                          ? ImagePath.notificationactive
                          : ImagePath.notificationinactive
                        : null
                    }
                    resizeMode="contain"
                  />
                  {!_.isEmpty(UserReducer.userProfileResp) ? (
                    UserReducer.userProfileResp.isActivity ? (
                      <View
                        style={{
                          position: 'absolute',
                          right: normalise(-2),
                          top: normalise(-2),
                          backgroundColor: Colors.red,
                          borderRadius: normalize(8),
                          height: 10,
                          width: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      />
                    ) : null
                  ) : null}
                </View>
              ),
              tabBarLabel: '',
            }}
          />

          <Tab.Screen
            name="Contact"
            component={Contact}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  style={{
                    marginTop:
                      Platform.OS === 'android'
                        ? normalise(10)
                        : Dimensions.get('window').height > 736
                        ? normalise(0)
                        : normalise(10),
                    height: normalise(22),
                    width: normalise(22),
                  }}
                  source={
                    ImagePath
                      ? focused
                        ? ImagePath.boxactive
                        : ImagePath.boxinactive
                      : null
                  }
                  resizeMode="contain"
                />
              ),
              tabBarLabel: '',
            }}
          />
        </Tab.Navigator>
      </View>
    );
  };

  if (TokenReducer.loading) {
    return <Splash />;
  } else {
    return (
      <NavigationContainer>
        {TokenReducer.token === null ? (
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={'Login'}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="bottomTab" component={BottomTab} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Followers" component={Followers} />
            <Stack.Screen name="Following" component={Following} />
            <Stack.Screen name="OthersProfile" component={OthersProfile} />
            <Stack.Screen name="CreatePost" component={CreatePost} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen
              name="Player"
              component={Player}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              }}
            />
            <Stack.Screen name="InsideaMessage" component={InsideaMessage} />
            <Stack.Screen name="HomeItemList" component={HomeItemList} />
            <Stack.Screen
              name="HomeItemComments"
              component={HomeItemComments}
            />
            <Stack.Screen
              name="HomeItemReactions"
              component={HomeItemReactions}
            />
            <Stack.Screen
              name="AddSongsInMessage"
              component={AddSongsInMessage}
            />
            <Stack.Screen
              name="SendSongInMessageFinal"
              component={SendSongInMessageFinal}
            />
            <Stack.Screen name="GenreClicked" component={GenreClicked} />
            <Stack.Screen
              name="GenreSongClicked"
              component={GenreSongClicked}
            />
            <Stack.Screen name="FeaturedTrack" component={FeaturedTrack} />
            <Stack.Screen name="AddAnotherSong" component={AddAnotherSong} />
            <Stack.Screen name="PostListForUser" component={PostListForUser} />
            <Stack.Screen
              name="UsersFromContacts"
              component={UsersFromContacts}
            />
            <Stack.Screen
              name="AddToPlayListScreen"
              component={AddToPlayListScreen}
            />
            <Stack.Screen name="SingleSongClick" component={SingleSongClick} />
            <Stack.Screen name="PlayerComment" component={PlayerComment} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  appStyle: { flex: 1, backgroundColor: '#000000' },
});

export default App;
