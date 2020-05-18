import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Platform,
  Dimensions

} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux'
import { getTokenRequest } from './src/action/index';
import Colors from './src/assests/Colors';
import ImagePath from './src/assests/ImagePath';
import normalise from './src/utils/helpers/Dimens';

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
import MusicPlayerBar from './src/widgets/MusicPlayerBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const App = () => {


  const dispatch = useDispatch();
  const TokenReducer = useSelector(state => state.TokenReducer);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getTokenRequest())
    }, 3000)
  }, []);

  // const TabBar = (props) => (
  //   <View>
  //     <MusicPlayerBar />
  //     <BottomTabBar {...props} />
  //   </View>
  // );

  const BottomTab = () => {
    return (
      <Tab.Navigator initialRouteName={"Home"}
        tabBarOptions={{
          activeBackgroundColor: Colors.darkerblack, inactiveBackgroundColor: Colors.darkerblack,
          safeAreaInsets: { bottom: 0 }, style: {
            height: Platform.OS === "android" ? normalise(45) : normalise(60),
            borderTopColor: Colors.darkerblack,
          }
        }}

        // tabBar={TabBar}
      >

        <Tab.Screen name="Home" component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image style={{
                marginTop: Platform.OS === 'android' ? normalise(10) :  
                Dimensions.get('window').height > 736 ? normalise(0) : normalise(10),
                height: normalize(20), width: normalize(20),
                height: normalize(20), width: normalize(20)
              }}
                source={focused ? ImagePath.homeactive : ImagePath.homeinactive}
                resizeMode='contain' />
            ),
            tabBarLabel: ""

          }} />

        <Tab.Screen name="Search" component={Search}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image style={{
                marginTop: Platform.OS === 'android' ? normalise(10) :
                  Dimensions.get('window').height > 736 ? normalise(0) : normalise(10),
                height: normalize(20), width: normalize(20)
              }}
                source={focused ? ImagePath.searchactive : ImagePath.searchinactive}
                resizeMode='contain' />
            ),
            tabBarLabel: ""

          }} />

        <Tab.Screen name="Add" component={AddSong}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image style={{
                marginTop: Platform.OS === 'android' ? normalise(10) :
                  Dimensions.get('window').height > 736 ? normalise(0) : normalise(10),
                height: normalize(20), width: normalize(20),
                height: normalize(35), width: normalize(35)
              }}
                source={focused ? ImagePath.addbtn : ImagePath.addbtn}
                resizeMode='contain' />

            ),
            tabBarLabel: ""
          }} />

        <Tab.Screen name="Notification" component={Notification}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image style={{
                marginTop: Platform.OS === 'android' ? normalise(10) : 
               Dimensions.get('window').height > 736 ? normalise(0) : normalise(10),
                height: normalize(20), width: normalize(20),
                height: normalize(20), width: normalize(20),
                marginRight: focused ? normalise(2) : null
              }}
                source={focused ? ImagePath.notificationactive : ImagePath.notificationinactive}
                resizeMode='contain' />
            ),
            tabBarLabel: ""
          }} />

        <Tab.Screen name="Contact" component={Contact}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image style={{
                marginTop: Platform.OS === 'android' ? normalise(10) : 
                 Dimensions.get('window').height > 736 ? normalise(0) : normalise(10),
                height: normalize(20), width: normalize(20),
                height: normalize(20), width: normalize(20)
              }}
                source={focused ? ImagePath.boxactive : ImagePath.boxinactive}
                resizeMode='contain' />
            ),
            tabBarLabel: ""
          }} />

      </Tab.Navigator>
    )
  }


  if (TokenReducer.loading) {
    return (
      <Splash />
    )

  } else {
    return (
      <NavigationContainer>
        {TokenReducer.token === null ?

          <Stack.Navigator screenOptions={{ headerShown: false }}
            initialRouteName={"Login"}>

            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </Stack.Navigator>
          :
          <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="bottomTab" component={BottomTab} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Followers" component={Followers} />
            <Stack.Screen name="Following" component={Following} />
            <Stack.Screen name="OthersProfile" component={OthersProfile} />
            <Stack.Screen name="CreatePost" component={CreatePost} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen name="Player" component={Player} />
            <Stack.Screen name="InsideaMessage" component={InsideaMessage} />
            <Stack.Screen name="HomeItemList" component={HomeItemList} />
            <Stack.Screen name="HomeItemComments" component={HomeItemComments} />
            <Stack.Screen name="HomeItemReactions" component={HomeItemReactions} />
            <Stack.Screen name="AddSongsInMessage" component={AddSongsInMessage} />
            <Stack.Screen name="SendSongInMessageFinal" component={SendSongInMessageFinal} />
            <Stack.Screen name="GenreClicked" component={GenreClicked} />
            <Stack.Screen name="GenreSongClicked" component={GenreSongClicked} />
          </Stack.Navigator>
        }

      </NavigationContainer>
    );
  }
};



export default App;
