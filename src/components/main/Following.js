import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import Seperator from './ListCells/Seperator';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import ActivityListItem from '../../components/main/ListCells/ActivityListItem';
import StatusBar from '../../utils/MyStatusBar';
import {
  FOLLOWING_LIST_REQUEST,
  FOLLOWING_LIST_SUCCESS,
  FOLLOWING_LIST_FAILURE,
  USER_FOLLOW_UNFOLLOW_REQUEST,
  USER_FOLLOW_UNFOLLOW_SUCCESS,
  USER_FOLLOW_UNFOLLOW_FAILURE,
  TOP_5_FOLLOWED_USER_REQUEST,
  TOP_5_FOLLOWED_USER_SUCCESS,
  TOP_5_FOLLOWED_USER_FAILURE,
} from '../../action/TypeConstants';
import {
  followingListReq,
  userFollowUnfollowRequest,
  getTop5FollowedUserRequest,
  followingSearchReq,
} from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux';
import _ from 'lodash';

import EmptyComponent from '../Empty/EmptyComponent';

let status;

const Following = props => {
  const [type, setType] = useState(props.route.params.type);
  const [id, setId] = useState(props.route.params.id);
  // const [following, setFollowing] = useState("")
  const [search, setSearch] = useState('');
  const [bool, setBool] = useState(false);
  // const [followingList, setFollowingList] = useState([]);
  const [top5followingList, setTop5FollowingList] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      isInternetConnected()
        .then(() => {
          props.followingListReq(type, id);
        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet');
        });
    });

    return () => {
      unsuscribe();
    };
  }, []);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case FOLLOWING_LIST_REQUEST:
        status = props.status;
        break;

      case FOLLOWING_LIST_SUCCESS:
        status = props.status;
        // setFollowing(props.followingData.length);
        // setFollowingList(props.followingData);
        if (_.isEmpty(props.followingData)) {
          props.top5followingListReq();
        }
        break;

      case FOLLOWING_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case USER_FOLLOW_UNFOLLOW_REQUEST:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_SUCCESS:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_FAILURE:
        status = props.status;
        break;

      case TOP_5_FOLLOWED_USER_REQUEST:
        status = props.status;
        break;

      case TOP_5_FOLLOWED_USER_SUCCESS:
        status = props.status;
        setTop5FollowingList(props.top5FollowedResponse);
        break;

      case TOP_5_FOLLOWED_USER_FAILURE:
        status = props.status;
        break;
    }
  }

  // function filterArray(keyword) {

  //     let data = _.filter(props.followingData, (item) => {
  //         return item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
  //     });
  //     // console.log(data);
  //     setFollowingList([]);
  //     setBool(true);
  //     setTimeout(() => {
  //         setFollowingList(data);
  //         setBool(false);
  //     }, 800);
  // };

  function renderFollowersItem(data) {
    if (props.userProfileResp._id === data.item._id) {
      return (
        <ActivityListItem
          image={constants.profile_picture_base_url + data.item.profile_image}
          user={data.item.username}
          type={false}
          image2={'123'}
          marginBottom={
            data.index === props.followingData.length - 1 ? normalise(20) : 0
          }
          onPressImage={() => {
            props.navigation.push('Profile', { fromAct: false });
          }}
          TouchableOpacityDisabled={false}
        />
      );
    } else {
      return (
        <ActivityListItem
          image={constants.profile_picture_base_url + data.item.profile_image}
          user={data.item.username}
          type={true}
          userId={data.item.user_id}
          loginUserId={props.userProfileResp._id}
          follow={data.item.isFollowing ? false : true}
          marginBottom={
            data.index === props.followingData.length - 1 ? normalise(20) : 0
          }
          onPressImage={() => {
            props.navigation.push('OthersProfile', {
              id: data.item._id,
              following: data.item.isFollowing,
            });
          }}
          onPress={() => {
            props.followReq({ follower_id: data.item._id });
          }}
          TouchableOpacityDisabled={false}
        />
      );
    }
  }

  function rendertop5FollowersItem(data) {
    if (props.userProfileResp._id === data.item._id) {
      return (
        <ActivityListItem
          image={constants.profile_picture_base_url + data.item.profile_image}
          user={data.item.username}
          type={false}
          image2={'123'}
          marginBottom={
            data.index === props.top5FollowedResponse.length - 1
              ? normalise(20)
              : 0
          }
          onPressImage={() => {
            props.navigation.navigate('Profile', { fromAct: false });
          }}
          TouchableOpacityDisabled={false}
        />
      );
    } else {
      return (
        <ActivityListItem
          image={constants.profile_picture_base_url + data.item.profile_image}
          user={data.item.username}
          type={true}
          follow={data.item.isFollowing ? false : true}
          marginBottom={
            data.index === props.top5FollowedResponse.length - 1
              ? normalise(20)
              : 0
          }
          onPressImage={() => {
            props.navigation.replace('OthersProfile', {
              id: data.item._id,
              following: data.item.isFollowing,
            });
          }}
          onPress={() => {
            props.followReq({ follower_id: data.item._id });
          }}
          TouchableOpacityDisabled={false}
        />
      );
    }
  }

  function hideKeyboard() {
    if (typingTimeout) {
      clearInterval(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        Keyboard.dismiss();
      }, 1500),
    );
  }

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.newDarkBlack }}>
      <StatusBar backgroundColor={Colors.newDarkBlack} />

      <Loader visible={props.status === FOLLOWING_LIST_REQUEST} />
      <Loader visible={bool} />

      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}> */}
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={`FOLLOWING (${props.followingData.length})`}
          thirditemtext={true}
          texttwo={''}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />
        <View
          style={{
            marginHorizontal: normalise(12),
            paddingTop: normalise(12),
          }}>
          <TextInput
            autoCorrect={false}
            keyboardAppearance={'dark'}
            style={{
              height: normalise(35),
              backgroundColor: Colors.white,
              borderRadius: normalise(6),
              padding: normalise(10),
              color: Colors.black,
              paddingLeft: normalise(30),
            }}
            value={search}
            placeholder={'Search'}
            placeholderTextColor={Colors.darkgrey}
            onChangeText={text => {
              setSearch(text), props.followingSearch(text);
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

          {search === '' ? null : (
            <TouchableOpacity
              onPress={() => {
                setSearch(''), props.followingSearch('');
              }}
              style={{
                backgroundColor: Colors.grey_text,
                padding: 6,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 2,
                position: 'absolute',
                right: 0,
                bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
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
        {_.isEmpty(props.followingData) ? (
          !isKeyboardVisible && (
            <>
              <EmptyComponent
                text={
                  "Choona is a lonely place when you aren't following anyone. See if you already have friends by connecting below."
                }
                title={"You don't follow anyone"}
              />
              <View style={{ flex: 1 }}>
                <FlatList
                  data={top5followingList}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item._id}
                  renderItem={rendertop5FollowersItem}
                  ItemSeparatorComponent={Seperator}
                />
              </View>
            </>
          )
        ) : (
          <FlatList
            data={props.followingData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={renderFollowersItem}
            ItemSeparatorComponent={Seperator}
          />
        )}
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    followingData: state.UserReducer.followingData,
    userProfileResp: state.UserReducer.userProfileResp,
    top5FollowedResponse: state.UserReducer.top5FollowedResponse,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    followingListReq: (usertype, id) => {
      dispatch(followingListReq(usertype, id));
    },

    followReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },

    top5followingListReq: () => {
      dispatch(getTop5FollowedUserRequest());
    },

    followingSearch: search => {
      dispatch(followingSearchReq(search));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Following);
