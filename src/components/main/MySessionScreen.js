import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  AppState,
  Image,
  Modal,
  Platform,
  Linking,
  RefreshControl,
  FlatList,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HomeHeaderComponent from '../../widgets/HomeHeaderComponent';
import _ from 'lodash';
import HomeItemList from './ListCells/HomeItemList';
import StatusBar from '../../utils/MyStatusBar';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import MusicPlayerBar from '../../widgets/MusicPlayerBar';
import updateToken from '../main/ListCells/UpdateToken';
import LinearGradient from 'react-native-linear-gradient';

import {useInfiniteQuery, useQueryClient} from 'react-query';

// import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  HOME_PAGE_REQUEST,
  HOME_PAGE_SUCCESS,
  HOME_PAGE_FAILURE,
  SAVE_SONGS_REQUEST,
  SAVE_SONGS_SUCCESS,
  SAVE_SONGS_FAILURE,
  REACTION_ON_POST_SUCCESS,
  USER_FOLLOW_UNFOLLOW_REQUEST,
  USER_FOLLOW_UNFOLLOW_SUCCESS,
  USER_FOLLOW_UNFOLLOW_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  GET_USER_FROM_HOME_REQUEST,
  GET_USER_FROM_HOME_SUCCESS,
  GET_USER_FROM_HOME_FAILURE,
  COUNTRY_CODE_SUCCESS,
  OTHERS_PROFILE_SUCCESS,
  EDIT_PROFILE_SUCCESS,
  DUMMY_ACTION_SUCCESS,
  DUMMY_ACTION_REQUEST,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_REQUEST,
  CREATE_SESSION_LIST_REQUEST,
  CREATE_SESSION_LIST_SUCCESS,
  CREATE_SESSION_LIST_FAILURE,
} from '../../action/TypeConstants';
import {
  getProfileRequest,
  homePageReq,
  reactionOnPostRequest,
  userFollowUnfollowRequest,
  getUsersFromHome,
  dummyRequest,
  loadMoreRequest,
  loadMoreData,
} from '../../action/UserAction';
import {saveSongRequest, saveSongRefReq} from '../../../action/SongAction';
import {deletePostReq} from '../../../action/PostAction';
import {connect} from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import {useScrollToTop} from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import {getSpotifyToken} from '../../utils/helpers/SpotifyLogin';
import {getAppleDevToken} from '../../utils/helpers/AppleDevToken';
import axios from 'axios';
import MusicPlayer from '../../widgets/MusicPlayer';
import EmptyComponent from '../Empty/EmptyComponent';

import AsyncStorage from '@react-native-community/async-storage';

import HomeSessionItem from './ListCells/HomeSessionItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  createSessionListRequest,
  fetchSessionListRequestStatusIdle,
} from '../../action/SessionAction';
import HeaderComponent from '../../widgets/HeaderComponent';
// import {useQueryClient} from '@tanstack/react-query';

let status = '';
let songStatus = '';
let postStatus = '';

const MySessionScreen = props => {
  const token = props.header.token;
  const postsUrl = constants.BASE_URL + '/post/list?page=';
  const [activeTab, setActiveTab] = useState(0);
  const [sessionListStatus, setSessionListStatus] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    handleNavigation();
  }, [props.sessionReducerData.status]);

  //helpers************************************************************

  const handleNavigation = () => {
    if (
      sessionListStatus === '' ||
      sessionListStatus !== props.sessionReducerData.status
    ) {
      switch (props.sessionReducerData.status) {
        case CREATE_SESSION_LIST_REQUEST:
          setSessionListStatus(CREATE_SESSION_LIST_REQUEST);
          props.fetchSessionListRequestStatusIdleHandle({status: ''}); //to set status back to idle
          break;
        case CREATE_SESSION_LIST_SUCCESS:
          setSessionListStatus(CREATE_SESSION_LIST_SUCCESS);
          props.fetchSessionListRequestStatusIdleHandle({status: ''});
          break;
        case CREATE_SESSION_LIST_FAILURE:
          setSessionListStatus(CREATE_SESSION_LIST_FAILURE);
          toast('Error', 'Something Went Wrong, Please Try Again');
          props.fetchSessionListRequestStatusIdleHandle({status: ''});
          break;
        default:
          setSessionListStatus('');
          break;
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.darkerblack,
      }}>
      {Platform.OS == 'android' && (
        <StatusBar backgroundColor={Colors.darkerblack} />
      )}
      <Loader visible={props.sessionReducerData?.loading} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.darkerblack}}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={'MY SESSIONS'}
          thirditemtext={true}
          //   texttwo={'SAVE'}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
          //   onPressThirdItem={() => {
          //     updateProfile();
          //   }}
        />
        <View style={{flex: 1}}>
          {_.isEmpty(props.sessionListData?.data) ? (
            <EmptyComponent
              buttonPress={() => {
                setContactsLoading(true);
                getContacts();
              }}
              buttonText={'Check for friends'}
              image={ImagePath ? ImagePath.emptyPost : null}
              text={
                'You don’t follow anyone yet, check your phonebook below to see if anyone you know is already on Choona.'
              }
              title={'No Session Found'}
            />
          ) : (
            <FlatList
              // data={Array(10).fill('')}
              data={props.sessionListData?.data}
              renderItem={({item}) => {
                return (
                  <HomeSessionItem
                    item={item}
                    userId={props.userProfileResp?._id}
                  />
                );
              }}
              showsVerticalScrollIndicator={false}
              // keyExtractor={item => item._id}
              // ref={flatlistRef}
              // onEndReached={() => fetchNextPage()}
              // onEndReachedThreshold={2}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={refreshing}
              //     onRefresh={onRefresh}
              //     colors={[Colors.black]}
              //     progressBackgroundColor={Colors.white}
              //     title={'Refreshing...'}
              //     titleColor={Colors.white}
              //   />
              // }
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapperStyle: {
    backgroundColor: Colors.darkerblack,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: normalise(40),
    // borderBottomColor: Colors.fadeblack,
    // borderBottomWidth: 1,
  },
  tabBarButtonStyle: {
    width: '50%',
    height: normalise(40),
    alignItems: 'center',
    justifyContent: 'center',
    // borderRightWidth: normalise(1),
    // borderRightColor: Colors.darkerblack,
  },
  tabBarTextStyle: {
    fontFamily: 'Kallisto',
    fontSize: normalise(10),
    textTransform: 'uppercase',
  },
  ActiveTabBar: {
    width: '100%',
    height: normalise(3),
    position: 'absolute',
    bottom: 0,
  },
});

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    postData: state.UserReducer.postData,
    reactionResp: state.UserReducer.reactionResp,
    songStatus: state.SongReducer.status,
    savedSongResponse: state.SongReducer.savedSongResponse,
    playingSongRef: state.SongReducer.playingSongRef,
    chatList: state.MessageReducer.chatList,
    messageStatus: state.MessageReducer.status,
    postStatus: state.PostReducer.status,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
    registerType: state.TokenReducer.registerType,
    currentPage: state.UserReducer.currentPage,
    SuccessToken: state.TokenReducer.token,
    loadData: state.UserReducer.loadData,
    header: state.TokenReducer,
    sessionListData: state.SessionReducer.sessionListData,
    sessionReducerData: state.SessionReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createSessionListReq: () => {
      dispatch(createSessionListRequest());
    },
    fetchSessionListRequestStatusIdleHandle: payload => {
      dispatch(fetchSessionListRequestStatusIdle(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MySessionScreen);
