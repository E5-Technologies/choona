import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import Seperator from './ListCells/Seperator';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import ActivityListItem from '../../components/main/ListCells/ActivityListItem';
import StatusBar from '../../utils/MyStatusBar';
import {
  FOLLOWER_LIST_REQUEST,
  FOLLOWER_LIST_SUCCESS,
  FOLLOWER_LIST_FAILURE,
  USER_FOLLOW_UNFOLLOW_REQUEST,
  USER_FOLLOW_UNFOLLOW_SUCCESS,
  USER_FOLLOW_UNFOLLOW_FAILURE,
} from '../../action/TypeConstants';
import {
  followerListReq,
  userFollowUnfollowRequest,
  followerSearchReq,
} from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux';

let status;

const Followers = props => {
  const [type, setType] = useState(props.route.params.type);
  const [id, setId] = useState(props.route.params.id);
  const [search, setSearch] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(0);

  const [bool, setBool] = useState(false);

  // const [followerList, setFollowerList] = useState([]);

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      isInternetConnected()
        .then(() => {
          props.followListReq(type, id);
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
      case FOLLOWER_LIST_REQUEST:
        status = props.status;
        break;

      case FOLLOWER_LIST_SUCCESS:
        status = props.status;
        // setFollowerList(props.followerData);
        break;

      case FOLLOWER_LIST_FAILURE:
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
    }
  }

  // function filterArray(keyword) {

  //     let data = _.filter(props.followerData, (item) => {
  //         return item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
  //     });
  //     // console.log(data);
  //     setFollowerList([]);
  //     setBool(true);
  //     setTimeout(() => {
  //         setFollowerList(data);
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
            data.index === props.followerData.length - 1 ? normalise(20) : 0
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
          follow={!data.item.isFollowing}
          marginBottom={
            data.index === props.followerData.length - 1 ? normalise(20) : 0
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <Loader visible={props.status === FOLLOWER_LIST_REQUEST} />
      <Loader visible={bool} />
      <StatusBar backgroundColor={Colors.darkerblack} />
      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}> */}
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={`FOLLOWERS (${props.followerData.length})`}
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
              setSearch(text), props.followerSearch(text);
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
                setSearch(''), props.followerSearch('');
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
        <FlatList
          data={props.followerData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={renderFollowersItem}
          ItemSeparatorComponent={Seperator}
        />
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    followerData: state.UserReducer.followerData,
    userProfileResp: state.UserReducer.userProfileResp,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    followListReq: (usertype, id) => {
      dispatch(followerListReq(usertype, id));
    },

    followReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },

    followerSearch: search => {
      dispatch(followerSearchReq(search));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
