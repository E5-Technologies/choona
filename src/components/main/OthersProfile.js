import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import {
  OTHERS_PROFILE_REQUEST,
  OTHERS_PROFILE_SUCCESS,
  OTHERS_PROFILE_FAILURE,
} from '../../action/TypeConstants';
import {
  othersProfileRequest,
  userFollowUnfollowRequest,
  // getCountryCodeRequest,
} from '../../action/UserAction';
import constants from '../../utils/helpers/constants';
import { connect } from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from 'lodash';

import axios from 'axios';

import ProfileHeader from '../Profile/ProfileHeader';
import ProfileHeaderButtons from '../Profile/ProfileHeaderButtons';
import ProfileHeaderFeatured from '../Profile/ProfileHeaderFeatured';

import normalise from '../../utils/helpers/Dimens';
import EmptyComponent from '../Empty/EmptyComponent';

let status;
// let changePlayer = true;
let totalCount = '0';

const OthersProfile = props => {
  console.log({ othersProfile: props.othersProfileresp });
  const othersProfileReq = props.othersProfileReq;
  const token = props.header.token;

  const [id] = useState(props.route.params.id);
  const [isFollowing, setIsFollowing] = useState(false);
  const [pageId, setPageId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePosts, setProfilePosts] = useState([]);
  const postsUrl = constants.BASE_URL + `/user/posts/${id}`;

  const onEndReached = async () => {
    setPageId(pageId + 1);
    const response = await axios.get(`${postsUrl}?page=${pageId + 1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });
    setIsLoading(false);
    setProfilePosts([...profilePosts, ...response.data.data]);
  };

  console.log(props, props.status);
  const getProfilePosts = useCallback(async () => {
    const response = await axios.get(`${postsUrl}?page=${1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });
    setIsLoading(false);
    console.log(response);
    if (response) {
      console.log({ totalCount: response.data.postCount });
      setProfilePosts(response.data.data);
      totalCount = response.data.postCount;
    }
  }, [postsUrl, token]);

  useEffect(() => {
    getProfilePosts();
  }, [getProfilePosts]);

  useEffect(() => {
    isInternetConnected()
      .then(async () => {
        othersProfileReq(id);
      })
      .catch(() => {
        toast('Error', 'Please Connect to Internet');
      });
  }, [id, othersProfileReq]);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case OTHERS_PROFILE_REQUEST:
        status = props.status;
        break;

      case OTHERS_PROFILE_SUCCESS:
        setIsFollowing(props.othersProfileresp.isFollowing);
        status = props.status;
        break;

      case OTHERS_PROFILE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  function renderProfileData(data) {
    let array = [];
    array.push(data.item);
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('PostListForUser', {
            profile_name: props.othersProfileresp.full_name,
            posts: array,
            index: '0',
          });
        }}
        style={{
          margin: normalise(4),
          marginBottom:
            data.index === profilePosts.length - 1
              ? normalise(30)
              : normalise(4),
        }}>
        <Image
          source={{
            uri:
              props.othersProfileresp.register_type === 'spotify'
                ? data.item.song_image
                : data.item.song_image.replace(
                  '100x100bb.jpg',
                  '500x500bb.jpg',
                ),
          }}
          style={{
            width: Math.floor(Dimensions.get('window').width / 2.1),
            height: Math.floor(Dimensions.get('window').width / 2.1),
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.othersProfileContainer}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={props.othersProfileresp.full_name}
          thirditemtext={true}
          texttwo={''}
          onPressFirstItem={() => {
            totalCount = 0;
            props.navigation.goBack();
          }}
        />
        <ProfileHeader
          navigation={props.navigation}
          profile={props.othersProfileresp}
          totalCount={totalCount ?? 0}
        />
        <ProfileHeaderButtons
          followReq={props.followReq}
          id={id}
          isFollowing={isFollowing}
          navigation={props.navigation}
          othersProfileresp={props.othersProfileresp}
          setIsFollowing={setIsFollowing}
        />
        <ProfileHeaderFeatured
          navigation={props.navigation}
          profile={props.othersProfileresp}
        />
        {isLoading ? (
          <View>
            <ActivityIndicator
              color="#ffffff"
              size="large"
              style={{ marginTop: normalise(25) }}
            />
          </View>
        ) : _.isEmpty(profilePosts) ? (
          <EmptyComponent
            image={ImagePath ? ImagePath.emptyPost : null}
            text={`${props.othersProfileresp.username
                ? props.othersProfileresp.username
                : 'User'
              } has not posted any songs yet`}
            title={`${props.othersProfileresp.username
                ? props.othersProfileresp.username
                : 'User'
              }'s Profile is empty`}
          />
        ) : (
          <FlatList
            data={profilePosts}
            renderItem={renderProfileData}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            onEndReached={() => onEndReached()}
            onEndReachedThreshold={0.5}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    othersProfileresp: state.UserReducer.othersProfileresp,
    // countryCode: state.UserReducer.countryCodeOject,
    header: state.TokenReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    othersProfileReq: id => {
      dispatch(othersProfileRequest(id));
    },
    followReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },
    // getCountryCode: () => {
    //   dispatch(getCountryCodeRequest());
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfile);

const styles = StyleSheet.create({
  othersProfileContainer: { flex: 1, backgroundColor: Colors.black },
});
