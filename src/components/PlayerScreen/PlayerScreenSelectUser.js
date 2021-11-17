import React, { useEffect, useState } from 'react';
import useStateWithCallback from 'use-state-with-callback';
import { connect } from 'react-redux';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import _ from 'lodash';

import {
  CREATE_CHAT_TOKEN_REQUEST,
  CREATE_CHAT_TOKEN_SUCCESS,
  CREATE_CHAT_TOKEN_FAILURE,
  FOLLOWING_LIST_REQUEST,
  FOLLOWING_LIST_SUCCESS,
  FOLLOWING_LIST_FAILURE,
} from '../../action/TypeConstants';
import {
  getUsersFromHome,
  followingListReq,
  followingSearchReq,
} from '../../action/UserAction';
import { createChatTokenRequest } from '../../action/MessageAction';

import Colors from '../../assests/Colors';
import constants from '../../utils/helpers/constants';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import toast from '../../utils/helpers/ShowErrorAlert';

import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import Avatar from '../Avatar';

let status;
let messageStatus;

function PlayerScreenSelectUser(props) {
  const [bool, setBool] = useState(false);
  const [userSearch, setUserSearch] = useState(null);
  const [usersToSendSong, setUsersToSendSong] = useStateWithCallback(
    [],
    usersToSendSong => {
      if (usersToSendSong.length > 0) {
        sendMessagesToUsers();
      }
    },
  );

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      isInternetConnected()
        .then(() => {
          props.followingListReq('user', '');
        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet');
        });
    });

    return () => {
      unsuscribe();
    };
  }, [props]);

  const sendMessagesToUsers = () => {
    setBool(false);
    var userIds = [];
    usersToSendSong.map(users => {
      userIds.push(users._id);
    });

    props.createChatTokenRequest(userIds);
  };

  const searchUser = text => {
    props.followingSearch(text);
  };

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case FOLLOWING_LIST_REQUEST:
        status = props.status;
        break;

      case FOLLOWING_LIST_SUCCESS:
        status = props.status;
        break;

      case FOLLOWING_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  if (messageStatus === '' || props.messageStatus !== messageStatus) {
    switch (props.messageStatus) {
      case CREATE_CHAT_TOKEN_REQUEST:
        messageStatus = props.messageStatus;
        break;

      case CREATE_CHAT_TOKEN_SUCCESS:
        messageStatus = props.messageStatus;
        setUsersToSendSong([]);
        setUserSearch('');
        props.navigation.navigate('SendSongInMessageFinal', {
          image: props.route.params.item.song_image
            ? props.route.params.item.song_image
            : props.route.params.item.image,
          preview_url: props.route.params.item.preview_url,
          title: props.route.params.item.song_name,
          title2: props.route.params.item.artist_name,
          users: usersToSendSong,
          details: props.route.params.item,
          registerType:
            props.route.params.item.original_reg_type ??
            props.route.params.item.register_type ??
            props.registerType,
          fromAddAnotherSong: false,
          index: 0,
          fromHome: true,
          goBack: 3,
          fromPlayer:
            props.route.params.page === 'player'
              ? true
              : props.route.params.fromPlayer,
        });
        break;

      case CREATE_CHAT_TOKEN_FAILURE:
        messageStatus = props.messageStatus;
        toast('Error', 'Something Went Wong, Please Try Again');
        break;
    }
  }

  // RENDER USER SEARCH FLATLIST DATA
  function renderAddUsersToMessageItem(data) {
    return (
      <TouchableOpacity
        style={{
          marginTop: normalise(10),
          width: '87%',
          alignSelf: 'center',
        }}
        onPress={() => {
          setBool(true);
          setUsersToSendSong([data.item]);
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Avatar
              image={
                data.item.profile_image
                  ? constants.profile_picture_base_url + data.item.profile_image
                  : null
              }
              height={28}
              width={28}
            />
            <View style={{ marginStart: normalise(10) }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(12),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                {data.item.full_name}
              </Text>
              <Text
                style={{
                  color: Colors.grey_text,
                  fontSize: normalise(10),
                  fontFamily: 'ProximaNova-Regular',
                  textTransform: 'lowercase',
                }}>
                {data.item.username}
              </Text>
            </View>
          </View>
          <View>
            <Image
              source={ImagePath.sendIcon}
              style={{
                height: normalise(32),
                width: normalise(32),
              }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors.activityBorderColor,
            height: 0.5,
            marginTop: normalise(10),
          }}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}> */}
      <SafeAreaView style={{ flex: 1 }}>
        <Loader visible={bool} />
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={'SELECT USER TO SEND TO'}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            height: normalise(35),
            marginTop: normalise(20),
            borderRadius: normalise(8),
            backgroundColor: Colors.white,
          }}>
          <TextInput
            style={{
              height: normalise(35),
              width: '85%',
              padding: normalise(10),
              // color: Colors.white,
              paddingLeft: normalise(30),
            }}
            value={userSearch}
            placeholder={'Select User to Message'}
            placeholderTextColor={Colors.grey_text}
            onChangeText={text => {
              setUserSearch(text);
              searchUser(text);
            }}
          />
          <Image
            source={ImagePath.searchicongrey}
            style={{
              height: normalise(15),
              width: normalise(15),
              bottom: normalise(25),
              paddingLeft: normalise(30),
            }}
            resizeMode="contain"
          />
          {userSearch === '' ? null : (
            <TouchableOpacity
              onPress={() => {
                setUserSearch('');
              }}
              style={{
                backgroundColor: Colors.fordGray,
                padding: 8,
                paddingTop: 4,
                paddingBottom: 4,
                position: 'absolute',
                right: 0,
                borderRadius: 5,
                bottom: Platform.OS === 'ios' ? normalise(8) : normalise(7),
                marginRight: normalise(10),
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(10),
                  fontWeight: 'bold',
                }}>
                CLEAR
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList // USER SEARCH FLATLIST
          style={{
            height: '65%',
            marginTop: normalise(5),
          }}
          data={props.followingData}
          renderItem={renderAddUsersToMessageItem}
          keyExtractor={(item, index) => {
            item._id.toString();
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
}

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    followingData: state.UserReducer.followingData,
    registerType: state.TokenReducer.registerType,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
    messageStatus: state.MessageReducer.status,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getusersFromHome: payload => {
      dispatch(getUsersFromHome(payload));
    },
    createChatTokenRequest: payload => {
      dispatch(createChatTokenRequest(payload));
    },
    followingListReq: (usertype, id) => {
      dispatch(followingListReq(usertype, id));
    },
    followingSearch: search => {
      dispatch(followingSearchReq(search));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerScreenSelectUser);
