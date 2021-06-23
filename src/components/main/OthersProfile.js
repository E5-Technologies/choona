import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import {
  OTHERS_PROFILE_REQUEST,
  OTHERS_PROFILE_SUCCESS,
  OTHERS_PROFILE_FAILURE,
  USER_FOLLOW_UNFOLLOW_REQUEST,
  USER_FOLLOW_UNFOLLOW_SUCCESS,
  USER_FOLLOW_UNFOLLOW_FAILURE,
  HOME_PAGE_SUCCESS,
  COUNTRY_CODE_REQUEST,
  COUNTRY_CODE_SUCCESS,
  COUNTRY_CODE_FAILURE,
} from '../../action/TypeConstants';
import {
  othersProfileRequest,
  userFollowUnfollowRequest,
  getCountryCodeRequest,
} from '../../action/UserAction';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import { connect } from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from 'lodash';

import useSWR from 'swr';
import axios from 'axios';
import { set } from 'react-native-reanimated';

let status;
let changePlayer = true;
let TotalCount = '0';

function OthersProfile(props) {
  const [id, setId] = useState(props.route.params.id);
  const [isFollowing, setIsFollowing] = useState(false);
  const [postCount, setPostCount] = useState('');
  const [flag, setFlag] = useState('');

  const postsUrl = constants.BASE_URL + `/user/posts/${id}`;

  const getPosts = async pageId => {
    console.log('logcat:' + `${postsUrl}?page=${pageId}`);
    const response = await axios.get(`${postsUrl}?page=${pageId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });
    console.log('resposse' + JSON.stringify(response));
    setIsLoading(false);

    response.data.data.length === 0
      ? (TotalCount = TotalCount)
      : (TotalCount = response.data.postCount);

    setProfilePosts([...profilePosts, ...response.data.data]);

    console.log('logcat response:' + JSON.stringify(response.data.postCount));
    return await response.data;
  };

  const [pageId, setPageId] = useState(1);
  const key = `${postsUrl}?page=${pageId}`;
  // const { data: posts, mutate } = useSWR(key, () => getPosts(pageId));
  const [isLoading, setIsLoading] = useState(true);

  const [profilePosts, setProfilePosts] = useState([]);

  const onEndReached = async () => {
    setPageId(pageId + 1);
    const response = await axios.get(`${postsUrl}?page=${pageId + 1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });
    // profilePosts.push(response.data.data)
    setIsLoading(false);
    setProfilePosts([...profilePosts, ...response.data.data]);
  };

  useEffect(() => {
    // const unsuscribe = props.navigation.addListener('focus', payload => {
    isInternetConnected()
      .then(async () => {
        props.othersProfileReq(id);
        props.getCountryCode();
        // mutate();

        const response = await axios.get(`${postsUrl}?page=${1}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': props.header.token,
          },
        });
        console.log('resposse' + JSON.stringify(response));
        setIsLoading(false);

        response.data.data.length === 0
          ? (TotalCount = TotalCount)
          : (TotalCount = response.data.postCount);
        profilePosts.length === 0
          ? setProfilePosts([...profilePosts, ...response.data.data])
          : null;
      })
      .catch(() => {
        toast('Error', 'Please Connect to Internet');
      });

    // },[]);

    return () => {
      // unsuscribe();
    };
  }, [isFollowing]);

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

      case USER_FOLLOW_UNFOLLOW_REQUEST:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_SUCCESS:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case HOME_PAGE_SUCCESS:
        status = props.status;
        props.othersProfileReq(props.othersProfileresp._id);
        break;

      case COUNTRY_CODE_REQUEST:
        status = props.status;
        break;

      case COUNTRY_CODE_SUCCESS:
        status = props.status;
        getLocationFlag(props.othersProfileresp.location);
        break;

      case COUNTRY_CODE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  function getLocationFlag(country) {
    let index = props.countryCode.findIndex(obj => obj.name === country);
    if (index !== -1) {
      setFlag(props.countryCode[index].flag);
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
              : normalise(5),
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
            width: Dimensions.get('window').width / 2.1,
            height: Dimensions.get('window').height * 0.22,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  return isLoading ? (
    <View style={{ flex: 1, backgroundColor: Colors.black, paddingTop: '6%' }}>
      <HeaderComponent
        firstitemtext={false}
        imageone={ImagePath.backicon}
        title=""
        thirditemtext={true}
        texttwo={''}
        onPressFirstItem={() => {
          props.navigation.goBack();
        }}
      />
      <ActivityIndicator
        size="large"
        color="#ffffff"
        style={{
          alignSelf: 'center',
          marginTop: 5 * normalise(60),
        }}
      />
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      {/* <Loader visible={props.status === OTHERS_PROFILE_REQUEST} /> */}

      {/* <Loader visible={props.status === HOME_PAGE_REQUEST} /> */}

      {/* <Loader visible={props.status === COUNTRY_CODE_REQUEST} /> */}

      <StatusBar backgroundColor={Colors.darkerblack} />

      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={props.othersProfileresp.username}
          thirditemtext={true}
          texttwo={''}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />

        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: normalise(15),
          }}>
          <Image
            source={{
              uri:
                constants.profile_picture_base_url +
                props.othersProfileresp.profile_image,
            }}
            style={{
              height: normalise(68),
              width: normalise(68),
              borderRadius: normalise(40),
            }}
          />

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: normalise(20),
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: normalise(15),
                fontFamily: 'ProximaNova-Bold',
              }}>
              {props.othersProfileresp.full_name}
            </Text>

            <Text
              style={{
                // marginTop: normalise(2),
                color: Colors.darkgrey,
                fontSize: normalise(11),
                fontFamily: 'ProximaNova-Regular',
              }}>
              {profilePosts !== undefined
                ? `${TotalCount} ${TotalCount > 1 ? 'Posts' : 'Post'}`
                : null}
            </Text>

            <Text
              style={{
                marginTop: normalise(1),
                color: Colors.darkgrey,
                fontSize: normalise(11),
                fontFamily: 'ProximaNova-Regular',
              }}>
              {props.othersProfileresp.location}
              {/* {flag} */}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: normalise(2),
              }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.push('Following', {
                    type: 'public',
                    id: props.othersProfileresp._id,
                  });
                }}>
                <Text
                  style={{
                    color: Colors.darkgrey,
                    fontSize: normalise(11),
                    fontFamily: 'ProximaNova-Regular',
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    {props.othersProfileresp.following}
                  </Text>{' '}
                  Following
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  props.navigation.push('Followers', {
                    type: 'public',
                    id: props.othersProfileresp._id,
                  });
                }}>
                <Text
                  style={{
                    marginLeft: normalise(10),
                    color: Colors.darkgrey,
                    fontSize: normalise(11),
                    fontFamily: 'ProximaNova-Regular',
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    {props.othersProfileresp.follower}
                  </Text>{' '}
                  Followers
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            marginTop: normalise(20),
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{
              height: normalise(30),
              width: '100%',
              marginRight: normalise(8),
              maxWidth: normalise(120),
              borderRadius: normalise(15),
              backgroundColor: Colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('AddAnotherSong', {
                othersProfile: true,
                index: 0,
                users: [
                  {
                    _id: props.othersProfileresp._id,
                    username: props.othersProfileresp.username,
                    full_name: props.othersProfileresp.full_name,
                    profile_image: props.othersProfileresp.profile_image,
                  },
                ],
              });
            }}>
            <Text
              style={{
                fontSize: normalise(10),
                color: Colors.black,
                fontFamily: 'ProximaNova-SemiBold',
              }}>
              SEND A SONG
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: normalise(30),
              width: '100%',
              maxWidth: normalise(120),

              borderRadius: normalise(15),
              backgroundColor: isFollowing ? Colors.fadeblack : Colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              console.log('val:' + isFollowing);
              setIsFollowing(!isFollowing);
              props.followReq({ follower_id: id });
            }}>
            <Text
              style={{
                fontSize: normalise(10),
                color: isFollowing ? Colors.white : Colors.black,
                fontFamily: 'ProximaNova-Bold',
              }}>
              {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
            </Text>
          </TouchableOpacity>
        </View>

        <ImageBackground
          source={ImagePath.gradientbar}
          style={{
            width: '100%',
            height: normalise(50),
            marginTop: normalise(15),
          }}>
          {_.isEmpty(props.othersProfileresp.feature_song) ? (
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: normalise(50),
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(9),
                  fontFamily: 'ProximaNova-Bold',
                }}>
                NO FEATURED TRACK
              </Text>
            </View>
          ) : (
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                height: normalise(50),
              }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Player', {
                    song_title: JSON.parse(
                      props.othersProfileresp.feature_song,
                    )[0].song_name,
                    album_name: JSON.parse(
                      props.othersProfileresp.feature_song,
                    )[0].album_name,
                    song_pic: JSON.parse(
                      props.othersProfileresp.feature_song,
                    )[0].song_pic,
                    uri: JSON.parse(props.othersProfileresp.feature_song)[0]
                      .song_uri,
                    // originalUri: JSON.parse(props.othersProfileresp.feature_song)[0].original_song_uri,
                    artist: JSON.parse(props.othersProfileresp.feature_song)[0]
                      .artist_name,
                    changePlayer: changePlayer,
                    originalUri: JSON.parse(
                      props.othersProfileresp.feature_song,
                    )[0].hasOwnProperty('original_song_uri')
                      ? JSON.parse(props.othersProfileresp.feature_song)[0]
                          .original_song_uri
                      : undefined,
                    registerType: props.othersProfileresp.register_type,
                    isrc: JSON.parse(props.othersProfileresp.feature_song)[0]
                      .isrc_code,
                  });
                }}>
                <Image
                  source={{
                    uri: JSON.parse(props.othersProfileresp.feature_song)[0]
                      .song_pic,
                  }}
                  style={{ height: normalise(40), width: normalise(40) }}
                />

                <Image
                  source={ImagePath.play}
                  style={{
                    height: normalise(25),
                    width: normalise(25),
                    position: 'absolute',
                    marginLeft: normalise(8),
                    marginTop: normalise(8),
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginStart: normalise(10),
                  width: '80%',
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(9),
                    fontFamily: 'ProximaNova-Bold',
                  }}>
                  FEATURED TRACK
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    color: Colors.white,
                    fontSize: normalise(10),
                    fontFamily: 'ProximaNova-Bold',
                  }}>
                  {
                    JSON.parse(props.othersProfileresp.feature_song)[0]
                      .song_name
                  }
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    color: Colors.white,
                    fontSize: normalise(9),
                    fontFamily: 'ProximaNova-Regular',
                    fontWeight: '400',
                  }}>
                  {
                    JSON.parse(props.othersProfileresp.feature_song)[0]
                      .album_name
                  }
                </Text>
              </View>
            </View>
          )}
        </ImageBackground>

        {_.isEmpty(profilePosts) ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: normalise(15),
                fontWeight: 'bold',
              }}>
              Profile is Empty
            </Text>

            <Text
              style={{
                marginTop: normalise(10),
                color: Colors.grey,
                fontSize: normalise(15),
                width: '60%',
                textAlign: 'center',
              }}>
              {props.othersProfileresp.username} has not posted any songs yet
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ paddingTop: normalise(10) }}
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
}

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    othersProfileresp: state.UserReducer.othersProfileresp,
    countryCode: state.UserReducer.countryCodeOject,
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
    getCountryCode: () => {
      dispatch(getCountryCodeRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfile);
