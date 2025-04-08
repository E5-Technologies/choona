import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import { connect } from 'react-redux';
import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  FOLLOWER_LIST_FAILURE,
  FOLLOWER_LIST_SUCCESS,
  FOLLOWER_LIST_REQUEST,
  FOLLOWING_LIST_REQUEST,
  FOLLOWING_LIST_SUCCESS,
  FOLLOWING_LIST_FAILURE,
} from '../../action/TypeConstants';
import { createPostRequest } from '../../action/PostAction';
import { followingListReq, followerListReq } from '../../action/UserAction';

import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import axios from 'axios';
import constants from '../../utils/helpers/constants';
import isInternetConnected from '../../utils/helpers/NetInfo';
import ImagePath from '../../assests/ImagePath';
// import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

let status;

function AddSong(props) {
  const [search, setSearch] = useState('');
  const [imgsource, setImgSource] = useState(props.route.params.image);
  const [title1, setTitle1] = useState(props.route.params.title);
  const [title2, setTitle2] = useState(props.route.params.title2);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [bool, setBool] = useState(false);
  const [followingList, setFollowingList] = useState(props.followingData);
  const [followerList, setFollower] = useState(props.followerData);

  const [tagFriend, setTagFriend] = useState([]);
  const [showmention, setShowMention] = useState(false);
  const [Selection, setSelection] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (props.route.params.registerType === 'spotify') {
      setBool(true);
      const getSpotifyApi = async () => {
        try {
          const res = await callApi();
          if (res.data.status === 200) {
            let suc = res.data.data.audio;
            setSpotifyUrl(suc);
            setBool(false);
          } else {
            setBool(false);
            toast('Oops', 'Something Went Wrong');
            props.navigation.goBack();
          }
        } catch (error) {
          console.log(error, 'its error while calling getSpotify');
          setBool(false);
        }
      };

      isInternetConnected()
        .then(() => {
          getSpotifyApi();
          props.followingListReq('user', '');
          props.followListReq('user', '');
        })
        .catch(() => {
          toast('', 'Please Connect To Internet');
        });
    }
  }, []);
  console.log(props.route.params.details.id, 'its song id')

  // GET SPOTIFY SONG URL
  const callApi = async () => {
    return await axios.get(
      `${constants.BASE_URL
      }/${`song/spotify/${props.route.params.details.id}`}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      },
    );
  };

  const createPost = async () => {
    let tapUser = [];
    await props.followingData.map((item, index) => {
      if (search.search(item.username) !== -1) {
        tagFriend.map(items => {
          if (items === item.username) {
            tapUser.push(item.username);
          }
        });
      }
      if (index === props.followingData.length - 1) {
        setTagFriend([]);
      }
    });

    var payload = {
      tag: tapUser,
      post_content: search,
      social_type:
        props.route.params.registerType === 'spotify' ? 'spotify' : 'apple',
      songs: [
        {
          song_uri:
            props.route.params.registerType === 'spotify'
              ? spotifyUrl
              : props.route.params.details.attributes.previews[0].url,
          original_song_uri:
            props.route.params.registerType === 'spotify'
              ? props.route.params.details.external_urls.spotify
              : props.route.params.details.attributes.url,
          song_name: title1,
          song_image: imgsource,
          artist_name: title2,
          isrc_code:
            props.route.params.registerType === 'spotify'
              ? props.route.params.details.external_ids.isrc
              : props.route.params.details.attributes.isrc,
          album_name:
            props.route.params.registerType === 'spotify'
              ? props.route.params.details.album.name
              : props.route.params.details.attributes.albumName,
        }
      ],
    };
    console.log(payload, 'its playlod <<')
    // return
    props.createPostRequest(payload);
  };

  if (status === '' || status !== props.status) {
    switch (props.status) {
      case CREATE_POST_REQUEST:
        status = props.status;
        break;

      case CREATE_POST_SUCCESS:
        props.navigation.popToTop();
        props.navigation.replace('bottomTab', { screen: 'Home' });
        status = props.status;
        break;

      case CREATE_POST_FAILURE:
        toast('Error', 'Something Went Wong, Please Try Again');
        status = props.status;
        break;
      case FOLLOWER_LIST_REQUEST:
        status = props.status;
        alert('status' + props.status);
        break;

      case FOLLOWER_LIST_SUCCESS:
        status = props.status;
        setFollowingList(props.followingData);
        break;

      case FOLLOWER_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case FOLLOWING_LIST_REQUEST:
        status = props.status;
        break;

      case FOLLOWING_LIST_SUCCESS:
        status = props.status;
        setFollower(props.followerData);
        break;

      case FOLLOWING_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  let delimiter = /\s+/;

  //split string
  let _text = search;
  let token,
    index,
    parts = [];
  while (_text) {
    delimiter.lastIndex = 0;
    token = delimiter.exec(_text);
    if (token === null) {
      break;
    }
    index = token.index;
    if (token[0].length === 0) {
      index = 1;
    }
    parts.push(_text.substr(0, index));
    parts.push(token[0]);
    index = index + token[0].length;
    _text = _text.slice(index);
  }
  parts.push(_text);

  //highlight hashtags
  parts = parts.map(text => {
    if (/^@/.test(text)) {
      return (
        <Text key={text} style={{ color: '#3DB2EB' }}>
          {text}
        </Text>
      );
    } else {
      return text;
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
      {/* <Loader visible={props.status === CREATE_POST_REQUEST} /> */}
      <Loader visible={bool} />
      <StatusBar backgroundColor={Colors.darkerblack} />
      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}> */}
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={true}
          textone={'CANCEL'}
          title={'CREATE POST'}
          thirditemtext={true}
          texttwo={'POST'}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
          onPressThirdItem={() => {
            createPost();
          }}
        />
        <View
          style={{
            marginTop: normalise(20),
            marginHorizontal: normalise(16),
            flex: 1,
            // width: '95%',
            // alignSelf: 'center',
          }}>
          <TextInput
            style={{
              width: '100%',
              // borderRadius: normalise(8),
              // padding: normalise(10),
              color: Colors.white,

              fontWeight: '400',
              marginHorizontal: normalise(10),
              marginBottom: normalise(10),
            }}
            keyboardAppearance="dark"
            scrollEnabled={false}
            multiline={true}
            placeholder={'Add a caption...'}
            placeholderTextColor={Colors.darkgrey}
            onChangeText={text => {
              let indexvalue = text.lastIndexOf('@');
              let newString = text.substr(text.lastIndexOf('@'));

              if (indexvalue !== -1) {
                if (newString.length === 1) {
                  if (
                    search.substr(indexvalue - 1) === ' ' ||
                    search.substr(indexvalue - 1) === ''
                  ) {
                    setFollowingList([...props.followingData]);
                    setFollower([...props.followerData]);
                    props.followingData.length === 0
                      ? setShowMention(false)
                      : setShowMention(true);
                  } else {
                    setShowMention(false);
                  }
                } else {
                  let newSubString = newString.substr(1, newString.length - 1);
                  let newArray = [];
                  let newFollowArray = [];
                  if (props.followingData.length !== 0) {
                    props.followingData.map((item, index) => {
                      //  console.log("mapItem"+item.full_name)
                      if (item.username.includes(newSubString)) {
                        newArray.push(item);
                      }
                      if (index === props.followingData.length - 1) {
                        if (props.followerData.length !== 0) {
                          props.followerData.map((items, indexs) => {
                            if (items.username.includes(newSubString)) {
                              newFollowArray.push(items);
                            }
                            if (indexs === props.followerData.length - 1) {
                              newFollowArray.length === 0
                                ? setShowMention(false)
                                : (setFollowingList(newArray),
                                  setFollower(newFollowArray),
                                  setShowMention(true));
                            }
                          });
                        } else {
                          setFollowingList(newArray), setShowMention(true);
                        }
                      }
                    });
                  } else {
                    props.followerData.map((items, indexs) => {
                      if (items.username.includes(newSubString)) {
                        newFollowArray.push(items);
                      }
                      if (indexs === props.followerData.length - 1) {
                        newArray.length === 0
                          ? setShowMention(false)
                          : (setFollower(newFollowArray), setShowMention(true));
                      }
                    });
                  }
                }
              } else {
                setShowMention(false);
              }
              setSearch(text);
            }}>
            <Text>{parts}</Text>
          </TextInput>

          <View style={{ height: 300 }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: normalise(5),
                backgroundColor: Colors.fadeblack,
                height: normalise(65),
                width: '100%',
                borderRadius: normalise(6),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <TouchableOpacity>
                  <Image
                    source={{ uri: imgsource }}
                    style={{
                      height: normalise(40),
                      width: normalise(40),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <View
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: '85%',
                  }}>
                  <Text
                    style={{
                      marginLeft: normalise(10),
                      fontWeight: '600',
                      color: Colors.white,
                      fontSize: normalise(11),
                      marginBottom: normalise(2),
                    }}
                    numberOfLines={1}>
                    {title1}
                  </Text>

                  <Text
                    style={{
                      marginLeft: normalise(10),
                      color: Colors.grey,
                      fontSize: normalise(10),
                      width: '80%',
                    }}
                    numberOfLines={1}>
                    {title2}
                  </Text>
                </View>
              </View>
            </View>
            {showmention ? (
              <View
                style={{
                  backgroundColor: '#000000',
                  borderRadius: 10,
                  marginRight: '20%',
                  height:
                    followingList.length + followerList.length === 2 ||
                      followingList.length + followerList.length === 1
                      ? Dimensions.get('window').height / 8
                      : followingList.length + followerList.length === 3
                        ? Dimensions.get('window').height / 3
                        : Dimensions.get('window').height / 3.5,

                  position: 'absolute',
                  top: 0,
                  width: Dimensions.get('window').width / 1.25,
                }}>
                <FlatList
                  data={followerList.concat(followingList).filter(function (o) {
                    return this[o.username] ? false : (this[o.username] = true);
                  }, {})}
                  keyboardShouldPersistTaps="always"
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        style={{ flexDirection: 'row', paddingTop: '3%' }}
                        onPress={() => {
                          // setSelection({start:commentText.lastIndexOf("@"),end:Selection.end})
                          let newString = search.substr(
                            0,
                            search.lastIndexOf('@') + 1,
                          );
                          setSearch(newString + item.username + ' ');
                          setShowMention(false);
                          tagFriend.push(item.username);
                        }}>
                        <Image
                          source={
                            item.profile_image
                              ? {
                                uri:
                                  constants.profile_picture_base_url +
                                  item.profile_image,
                              }
                              : ImagePath.userPlaceholder
                          }
                          resizeMode="contain"
                          style={{
                            height: Dimensions.get('window').width / 12,
                            width: Dimensions.get('window').width / 12,
                            borderRadius: Dimensions.get('window').width,
                            marginLeft: '5%',
                            marginRight: '4%',
                            marginBottom: '3%',
                          }}
                        />
                        <View
                          style={{
                            flex: 1,
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#25262A',
                            justifyContent: 'center',
                          }}>
                          <Text style={{ fontSize: 14, color: 'white' }}>
                            {item.full_name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              color: 'grey',
                              marginBottom: '5%',
                              textTransform: 'lowercase',
                            }}>
                            @{item.username}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <BannerAd
            unitId={
              Platform.OS === 'android'
                ? 'ca-app-pub-2232736176622960/2335890938'
                : 'ca-app-pub-2232736176622960/3492936227'
            }
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdLoaded={() => {
              // console.log('Advert loaded');
            }}
            onAdFailedToLoad={error => {
              console.error('Advert failed to load: ', error);
            }}
          />
        </View> */}
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
}

const mapStateToProps = state => {
  return {
    status: state.PostReducer.status,
    createPostResponse: state.PostReducer.createPostResponse,
    followingData: state.UserReducer.followingData,
    followerData: state.UserReducer.followerData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPostRequest: payload => {
      dispatch(createPostRequest(payload));
    },
    followingListReq: (usertype, id) => {
      dispatch(followingListReq(usertype, id));
    },
    followListReq: (usertype, id) => {
      dispatch(followerListReq(usertype, id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSong);
