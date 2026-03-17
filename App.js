import React, { useEffect, useState } from 'react';
import {
  AppState,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import 'react-native-gesture-handler';

import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenRequest } from './src/action/index';
import Colors from './src/assests/Colors';
import ImagePath from './src/assests/ImagePath';
import normalise from './src/utils/helpers/Dimens';


import { getProfileRequest } from './src/action/UserAction';

import Splash from './src/components/SplashComponent/Splash';

import Login from './src/components/auth/Login';
import SignUp from './src/components/auth/SignUp';

import _ from 'lodash';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Avatar from './src/components/Avatar';
import AddAnotherSong from './src/components/main/AddAnotherSong';
import AddSongsInMessage from './src/components/main/AddSongsInMessage';
import AddToPlayListScreen from './src/components/main/AddToPlayListScreen';
import SongListScreen from './src/components/main/AppleMusic/SongListScren';
import AssembleSession from './src/components/main/AssembleSession';
import BlockList from './src/components/main/BlockList';
import CommonNotification from './src/components/main/CommonNotification/CommonNotification';
import CreatePlayList from './src/components/main/CreatePlayList';
import CreatePost from './src/components/main/CreatePost';
import EditProfile from './src/components/main/EditProfile';
import FeaturedTrack from './src/components/main/FeaturedTrack';
import Followers from './src/components/main/Followers';
import Following from './src/components/main/Following';
import GenreClicked from './src/components/main/GenreClicked';
import GenreSongClicked from './src/components/main/GenreSongClicked';
import HomeItemComments from './src/components/main/HomeItemComments';
import HomeItemReactions from './src/components/main/HomeItemReactions';
import Inbox from './src/components/main/Inbox';
import InsideaMessage from './src/components/main/InsideaMessage';
import HomeItemList from './src/components/main/ListCells/HomeItemList';
import MySessionDetailScreen from './src/components/main/MySessionDetailScreen';
import MySessionScreen from './src/components/main/MySessionScreen';
import OthersProfile from './src/components/main/OthersProfile';
import Player from './src/components/main/Player';
import PlayerComment from './src/components/main/PlayerComment';
import PlayListDetail from './src/components/main/PlayListDetail';
import PostListForUser from './src/components/main/PostListForUser';
import Profile from './src/components/main/Profile';
import SearchScreen from './src/components/main/SearchScreen';
import SendSongInMessageFinal from './src/components/main/SendSongInMessageFinal';
import SessionActive from './src/components/main/SessionActive';
import SessionDetail from './src/components/main/SessionDetail';
import SessionLaunchScreen from './src/components/main/SessionLaunchScreen';
import SingleSongClick from './src/components/main/SingleSongClick';
import AddSong from './src/components/main/TabNavigator/Add';
import Contact from './src/components/main/TabNavigator/Contact';
import Create from './src/components/main/TabNavigator/Create';
import Home from './src/components/main/TabNavigator/Home';
import Notification from './src/components/main/TabNavigator/Notification';
import Search from './src/components/main/TabNavigator/Search';
import UsersFromContacts from './src/components/main/UsersFromContacts';
import PlayerScreenSelectUser from './src/components/PlayerScreen/PlayerScreenSelectUser';
import {
  AppleMusicContext,
  MusicPlayerProvider,
} from './src/context/AppleMusicContext';
import { usePlayFullAppleMusic } from './src/hooks/usePlayFullAppleMusic';
import { useSessionHosting } from './src/hooks/useSessionHosting';
import {
  requestUserPermission,
  setupNotificationChannels,
  setupNotificationListeners,
} from './src/utils/firebaseService';
import constants from './src/utils/helpers/constants';
import MusicPlayerBar from './src/widgets/MusicPlayerBar';
// import { useIsPlaying } from '@lomray/react-native-apple-music';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const UserReducer = useSelector(state => state.UserReducer);
  const MessageReducer = useSelector(state => state.MessageReducer);
  const TokenReducer = useSelector(state => state.TokenReducer);
  const playingSongRef = useSelector(state => state.SongReducer.playingSongRef);
  const navigation = useNavigation();

  const [showMessageDot, setShowMessageDot] = useState(false);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    let hasUnseenMessage = false;
    var arr = MessageReducer.chatList;

    if (!_.isEmpty(arr) && !_.isEmpty(UserReducer.userProfileResp)) {
      for (var i = 0; i < arr.length; i++) {
        if (UserReducer.userProfileResp._id === arr[i].receiver_id) {
          hasUnseenMessage = !arr[i].read;
          if (hasUnseenMessage) {
            break;
          }
        }
      }

      setShowMessageDot(hasUnseenMessage);
    }
  }, [MessageReducer.chatList, UserReducer.userProfileResp]);

  return (
    <View style={[styles.appStyle]}>
      <Tab.Navigator
        tabBar={props => (
          <View style={{ backgroundColor: 'transparent' }}>
            <MusicPlayerBar
              position="relative"
              onPress={(barActiveSong) => {
                const song = barActiveSong || playingSongRef;
                if (song) {
                  navigation.navigate('Player', {
                    comments: song.commentData || [],
                    song_title: song.song_name,
                    album_name: song.album_name,
                    song_pic: song.song_pic,
                    username: song.username,
                    profile_pic: song.profile_pic,
                    uri: song.uri,
                    reactions: song.reactionData,
                    id: song.id,
                    artist: song.artist,
                    changePlayer: song.changePlayer,
                    originalUri: song.originalUri,
                    isrc: song.isrc,
                    registerType: song.regType,
                    details: song.details,
                    showPlaylist: song.showPlaylist,
                    comingFromMessage: song.comingFromMessage,
                    apple_song_id: song.apple_song_id,
                  });
                }
              }}
            />

            <BottomTabBar {...props} />
          </View>
        )}
        initialRouteName={
          TokenReducer?.isFirstTime ? 'ProfileScreen' : 'Home'
        }
        // tabBarOptions={{
        //   headerShown: false,
        //   activeBackgroundColor: Colors.darkerblack,
        //   inactiveBackgroundColor: Colors.darkerblack,
        //   safeAreaInsets: {bottom: 0},
        //   style: {
        //     height: Platform.OS === 'android' ? normalise(45) : normalise(90),
        //     borderTopColor: Colors.fadeblack,
        //   },
        // }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.darkerblack,
            height: Platform.OS === 'android' ? normalise(45) : normalise(68),
            borderTopColor: Colors.fadeblack,
            borderTopWidth: 1,
          },
          tabBarActiveBackgroundColor: Colors.darkerblack,
          tabBarInactiveBackgroundColor: Colors.darkerblack,
          safeAreaInsets: { bottom: 0 },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          initialParams={{ activeTab: 0 }}
          options={{
            headerShown: false,
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
                  marginTop: normalise(12),
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
          listeners={({ navigation }) => ({
            tabPress: e => {
              // e.preventDefault();
              navigation.navigate('Home', { activeTab: 0 });
            },
          })}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                style={{
                  opacity: focused ? 1 : 0.5,
                  marginTop:
                    Platform.OS === 'android'
                      ? normalise(10)
                      : Dimensions.get('window').height > 736
                        ? normalise(0)
                        : normalise(10),
                  height: normalise(20),
                  width: normalise(20),
                  marginTop: normalise(12),
                }}
                source={ImagePath ? ImagePath.exploreactive : null}
                resizeMode="contain"
              />
            ),
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Add"
          // component={AddSong}
          component={Create}
          options={{
            headerShown: false,
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
                  marginTop: normalise(12),
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
          name="Contact"
          component={Contact}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                style={{
                  opacity: focused ? 1 : 0.5,
                  marginTop:
                    Platform.OS === 'android'
                      ? normalise(10)
                      : Dimensions.get('window').height > 736
                        ? normalise(0)
                        : normalise(10),
                  height: normalise(20),
                  width: normalise(20),
                  marginTop: normalise(12),
                }}
                source={ImagePath ? ImagePath.boxicon : null}
                resizeMode="contain"
              />
            ),
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="ProfileScreen"
          component={Profile}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Avatar
                image={
                  UserReducer?.userProfileResp?.profile_image
                    ? constants.profile_picture_base_url +
                    UserReducer?.userProfileResp?.profile_image
                    : null
                }
                height={24}
                width={24}
                imageWrapper={{
                  marginTop:
                    Platform.OS === 'android' ? normalise(10) : normalise(12),
                  opacity: focused ? 1 : 0.6,
                }}
              />
            ),
            // tabBarButton: props => (
            //   <TouchableOpacity
            //     {...props}
            //     activeOpacity={1}
            //     onPress={() => {
            //       // Do nothing
            //     }}>
            //     {props.children}
            //   </TouchableOpacity>
            // ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const SessionManager = () => {
  useSessionHosting({ enablePlaybackSync: true });
  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const TokenReducer = useSelector(state => state.TokenReducer);
  // console.log(TokenReducer, 'jkfhhhdkf');
  // const userProfile = useSelector(state => state.UserReducer.userProfileResp);
  const userProfile = null;
  const { isAuthorizeToAccessAppleMusic, haveAppleMusicSubscription } =
    usePlayFullAppleMusic();
  // const {isPlaying} = useIsPlaying();

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
      // if (AppState.currentState.match(/inactive|background/)) {
      //   let formdata = new FormData();
      //   formdata.append('badge_count', 0);
      //   isInternetConnected()
      //     .then(() => {
      //       dispatch(editProfileRequest(formdata));
      //     })
      //     .catch(err => {
      //       toast('Oops', 'Please Connect To Internet');
      //     });
      //   console.log('test');
      // } else
      if (AppState.currentState === 'active') {
        // getChatListRequest;
        // dispatch(getChatListRequest());
        dispatch(getProfileRequest());
        console.log('zxcv', 'App is in active Mode.');
      }
    }
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    // return () => {
    //   AppState.removeEventListener('change', _handleAppStateChange);
    //   // unsuscribe();
    // };
    return () => {
      subscription.remove(); // ✅ Proper cleanup
    };
  }, [dispatch]);

  useEffect(() => {
    requestUserPermission();
    setupNotificationChannels();
    setupNotificationListeners();
  }, []);

  // useEffect(() => {
  //   /* O N E S I G N A L   S E T U P */
  //   OneSignal.setAppId('095694b1-0a59-42ec-bd9c-d60a09bd60a9');
  //   OneSignal.setLogLevel(6, 0);
  //   OneSignal.setRequiresUserPrivacyConsent(false);
  //   OneSignal.promptForPushNotificationsWithUserResponse(response => {
  //     console.log('Prompt response:', response);
  //   });
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     const {userId} = await OneSignal.getDeviceState();
  //     console.log(userId,'thsjkhfsf')
  //     AsyncStorage.setItem('deviceToken', userId);
  //   })();
  // });

  // const TabBar = (props) => (
  //   <View>
  //     <MusicPlayerBar />
  //     <BottomTabBar {...props} />
  //   </View>
  // );


  if (TokenReducer.loading) {
    return <Splash />;
  } else {
    return (
      <SafeAreaProvider>
        <MusicPlayerProvider>
          <AppleMusicContext.Provider
            value={{
              isAuthorizeToAccessAppleMusic,
              haveAppleMusicSubscription,
              // isPlaying
            }}>
            <SessionManager />
            <NavigationContainer
              onReady={() => RNBootSplash.hide({ fade: true })}>
              {TokenReducer.token === null ? (
                <Stack.Navigator
                  screenOptions={{ headerShown: false }}
                  initialRouteName={'Login'}>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                  <Stack.Screen name="Profile" component={Profile} />
                </Stack.Navigator>
              ) : (
                <Stack.Navigator
                  // initialRouteName="Profile"
                  screenOptions={{ headerShown: false }}
                  options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route);
                    if (routeName === 'Profile') {
                      return { tabBarStyle: { display: 'none' } };
                    }
                    return {};
                  }}>
                  <Stack.Screen name="bottomTab" component={BottomTab} />
                  <Stack.Screen name="Profile" component={Profile} />
                  <Stack.Screen name="BlockList" component={BlockList} />
                  <Stack.Screen name="EditProfile" component={EditProfile} />
                  <Stack.Screen name="Inbox" component={Inbox} />
                  <Stack.Screen name="Followers" component={Followers} />
                  <Stack.Screen name="Following" component={Following} />
                  <Stack.Screen name="Notification" component={Notification} />
                  <Stack.Screen
                    name="OthersProfile"
                    component={OthersProfile}
                  />
                  <Stack.Screen name="CreatePost" component={CreatePost} />
                  <Stack.Screen name="Contact" component={Contact} />
                  {/* <Stack.Screen name="Inbox" component={Inbox} /> */}
                  <Stack.Screen
                    name="Player"
                    component={Player}
                    options={{
                      cardStyleInterpolator:
                        CardStyleInterpolators.forVerticalIOS,
                    }}
                  />
                  <Stack.Screen
                    name="InsideaMessage"
                    component={InsideaMessage}
                  />
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
                  <Stack.Screen
                    name="FeaturedTrack"
                    component={FeaturedTrack}
                  />
                  <Stack.Screen
                    name="AddAnotherSong"
                    component={AddAnotherSong}
                  />
                  <Stack.Screen
                    name="PostListForUser"
                    component={PostListForUser}
                  />
                  <Stack.Screen
                    name="UsersFromContacts"
                    component={UsersFromContacts}
                  />
                  <Stack.Screen
                    name="AddToPlayListScreen"
                    component={AddToPlayListScreen}
                  />
                  <Stack.Screen
                    name="SingleSongClick"
                    component={SingleSongClick}
                  />
                  <Stack.Screen
                    name="PlayerScreenSelectUser"
                    component={PlayerScreenSelectUser}
                  />
                  <Stack.Screen
                    name="PlayerComment"
                    component={PlayerComment}
                  />
                  <Stack.Screen name="AddSong" component={AddSong} />
                  <Stack.Screen
                    name="CreatePlayList"
                    component={CreatePlayList}
                  />
                  <Stack.Screen
                    name="SessionDetail"
                    component={SessionDetail}
                    options={{
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="AssembleSession"
                    component={AssembleSession}
                  />
                  <Stack.Screen
                    name="SessionLaunchScreen"
                    component={SessionLaunchScreen}
                  />
                  <Stack.Screen
                    name="SessionActive"
                    component={SessionActive}
                  />
                  <Stack.Screen
                    name="PlayListDetail"
                    component={PlayListDetail}
                  />
                  <Stack.Screen
                    name="MySessionDetailScreen"
                    component={MySessionDetailScreen}
                    options={{
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="MySessionScreen"
                    component={MySessionScreen}
                  />
                  <Stack.Screen
                    name="SongListScreen"
                    component={SongListScreen}
                  />
                  <Stack.Screen
                    name="SearchScreen"
                    component={SearchScreen}
                    options={{
                      presentation: 'modal',
                    }}
                  />
                  <Stack.Screen
                    name="CommonNotification"
                    component={CommonNotification}
                  />
                </Stack.Navigator>
              )}
            </NavigationContainer>
          </AppleMusicContext.Provider>
        </MusicPlayerProvider>
      </SafeAreaProvider>
    );
  }
};

const styles = StyleSheet.create({
  appStyle: {
    flex: 1,
    backgroundColor: Colors.darkerblack,
  },
});

export default App;
