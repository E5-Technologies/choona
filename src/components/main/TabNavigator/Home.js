import React, { useState, useEffect } from 'react';
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
} from 'react-native';

import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HomeHeaderComponent from '../../../widgets/HomeHeaderComponent';
import _ from 'lodash';
import HomeItemList from '../ListCells/HomeItemList';
import StatusBar from '../../../utils/MyStatusBar';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import MusicPlayerBar from '../../../widgets/MusicPlayerBar';
import updateToken from '../../main/ListCells/UpdateToken';
import LinearGradient from 'react-native-linear-gradient';

import { useInfiniteQuery } from 'react-query';

import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

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
} from '../../../action/TypeConstants';
import {
  getProfileRequest,
  homePageReq,
  reactionOnPostRequest,
  userFollowUnfollowRequest,
  getUsersFromHome,
  dummyRequest,
  loadMoreRequest,
  loadMoreData,
} from '../../../action/UserAction';
import { saveSongRequest, saveSongRefReq } from '../../../action/SongAction';
import { deletePostReq } from '../../../action/PostAction';
import { connect } from 'react-redux';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import Loader from '../../../widgets/AuthLoader';
import constants from '../../../utils/helpers/constants';
import { useScrollToTop } from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import { getSpotifyToken } from '../../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../../utils/helpers/AppleDevToken';
import axios from 'axios';
import MusicPlayer from '../../../widgets/MusicPlayer';
import Timer from '../Timer';
import EmptyComponent from '../../Empty/EmptyComponent';

import AsyncStorage from '@react-native-community/async-storage';

import CompleteProfileBlock from '../../HomeScreen/CompleteProfileBlock';
import MoreModal from '../../Posts/MoreModal';

let status = '';
let songStatus = '';
let postStatus = '';

const Home = props => {
  const token = props.header.token;

  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState('');
  const [modal1Visible, setModal1Visible] = useState(false);
  const [positionInArray, setPositionInArray] = useState(0);

  const [contactsLoading, setContactsLoading] = useState(false);
  const [bool, setBool] = useState(false);
  const [postArray, setPostArray] = useState([]);
  const [timeoutVar, setTimeoutVar] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loadMoreVisible, setLoadMoreVisible] = useState(false);
  const [visibleminiPlayer, setVisibleMiniPlayer] = useState(true);
  const [isShown, setIsShown] = useState(true);

  const [firstTimeModalShow, setFirstTimeModalShow] = useState(false);
  const [andyProfile, setAndyProfile] = useState(false);
  const [followButtonPressed, setFollowButtonPressed] = useState(false);

  const [posts, setPosts] = useState([]);
  const postsUrl = constants.BASE_URL + '/post/list?page=';

  const {
    data: newPosts,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery(
    'homePosts',
    async ({ pageParam = 1 }) => {
      const res = await axios
        .get(postsUrl + pageParam, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        })
        .catch(error => console.log(error));

      return res.data;
    },
    {
      getPreviousPageParam: pageParam => pageParam.page - 1,
      getNextPageParam: pageParam => pageParam.page + 1,
    },
  );

  useEffect(() => {
    if (props.status === 'REACTION_ON_POST_SUCCESS') {
      setTimeout(() => {
        refetch();
      }, 1000);
    }

    if (props.status === 'USER_FOLLOW_UNFOLLOW_SUCCESS') {
      setTimeout(() => {
        refetch();
      }, 1000);
    }

    if (props.postStatus === 'DELETE_POST_SUCCESS') {
      setTimeout(() => {
        refetch();
      }, 1000);
    }
  }, [props.postStatus, props.status, refetch]);

  useEffect(() => {
    if (newPosts) {
      var merged = [].concat.apply(
        [],
        newPosts.pages.map(page => page.data),
      );
      setPosts(merged);
    }
  }, [newPosts]);

  useEffect(() => {
    async function getModalData() {
      const isFirstOpen = await AsyncStorage.getItem('IS_FIRST_OPEN');
      if (!isFirstOpen || isFirstOpen !== 'true') {
        setFirstTimeModalShow(true);
      }
    }

    getModalData();
  }, []);

  React.useEffect(() => {
    const subscribe = props.navigation.addListener('focus', () => {
      refetch();
    });

    return subscribe;
  }, [props.navigation, refetch]);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, [refetch]);

  let changePlayer = false;

  var handleAppStateChange = state => {
    if (state !== 'active') {
      if (global.playerReference !== null) {
        if (global.playerReference?.isPlaying()) {
          global.playerReference.pause();

          findPlayingSong(posts);
        }
      }
    }
  };

  const flatlistRef = React.useRef(null);

  useScrollToTop(flatlistRef);

  useEffect(() => {
    isInternetConnected().then(async () => {
      const response = await axios.get(
        `${constants.BASE_URL}/user/profile/60efd72851da7dee96c570ad`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        },
      );

      if (response.data.data) {
        setAndyProfile(response.data.data);
      }
    });
  }, [token]);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    updateToken(props.SuccessToken);
    const unsuscribe = props.navigation.addListener('focus', payload => {
      isInternetConnected()
        .then(() => {
          props.getProfileReq();
          // if (!isFetching) {
          // props.dummyRequest();
          // }
        })
        .catch(_err => {
          toast('Error', 'Please Connect To Internet');
        });
    });

    return () => {
      unsuscribe();
    };
  }, []);

  useEffect(() => {
    if (props.registerType === 'apple') {
      AsyncStorage.getItem('isShown').then(value => {
        if (value === null) {
          // Whatever you want to do just once.
          AsyncStorage.setItem('isShown', 'false');
          setIsShown(false);
        }
      });
    }
  }, [props.registerType]);

  const loadMore = async () => {
    setLoadMoreVisible(false);
    refetch();
    props.loadMoreData();
    flatlistRef.current.scrollToIndex({
      animated: true,
      index: 0,
      viewPosition: 0,
    });
  };

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case USER_PROFILE_REQUEST:
        status = props.status;
        break;

      case LOAD_MORE_REQUEST:
        status = props.status;
        break;

      case USER_PROFILE_SUCCESS:
        status = props.status;
        break;

      case USER_PROFILE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case LOAD_MORE_SUCCESS:
        status = props.status;
        props.homePage(1);
        if (props.loadData.length !== 0) {
          const intersection = posts.filter(item1 =>
            props.loadData.some(item2 => item1._id === item2._id),
          );
          if (intersection.length <= 0) {
            setLoadMoreVisible(true);
          }

          // props.loadMoreData()
        }

        break;

      case HOME_PAGE_REQUEST:
        status = props.status;
        break;

      case HOME_PAGE_SUCCESS:
        status = props.status;
        findPlayingSong(posts);
        props.getProfileReq();
        break;

      case HOME_PAGE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case REACTION_ON_POST_SUCCESS:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_REQUEST:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_SUCCESS:
        status = props.status;
        setPositionInArray(0);
        break;

      case USER_FOLLOW_UNFOLLOW_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case GET_USER_FROM_HOME_REQUEST:
        status = props.status;
        break;

      case GET_USER_FROM_HOME_SUCCESS:
        status = props.status;
        // setUserSearchData(props.userSearchFromHome);
        break;

      case GET_USER_FROM_HOME_FAILURE:
        status = props.status;
        break;

      case DUMMY_ACTION_REQUEST:
        status = props.status;
        break;

      case DUMMY_ACTION_SUCCESS:
        status = props.status;
        findPlayingSong(posts);
        break;
    }
  }

  if (songStatus === '' || props.songStatus !== songStatus) {
    switch (props.songStatus) {
      case SAVE_SONGS_REQUEST:
        songStatus = props.songStatus;
        break;

      case SAVE_SONGS_SUCCESS:
        songStatus = props.songStatus;
        if (props.savedSongResponse.status === 200) {
          toast('Success', props.savedSongResponse.message);
        } else {
          toast('Success', props.savedSongResponse.message);
        }
        break;

      case SAVE_SONGS_FAILURE:
        songStatus = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  if (postStatus === '' || props.postStatus !== postStatus) {
    switch (props.postStatus) {
      case DELETE_POST_REQUEST:
        postStatus = props.postStatus;
        break;

      case DELETE_POST_SUCCESS:
        postStatus = props.postStatus;
        setPositionInArray(0);
        break;

      case DELETE_POST_FAILURE:
        postStatus = props.postStatus;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];

  function hitreact(x, rindex) {
    if (!_.isEmpty(posts[rindex].reaction)) {
      const present = posts[rindex].reaction.some(
        obj =>
          obj.user_id.includes(props.userProfileResp._id) &&
          obj.text.includes(x),
      );

      if (present) {
      } else {
        setVisible(true);
        setModalReact(x);
        setTimeout(() => {
          setVisible(false);
        }, 2000);
      }
    } else {
      setVisible(true);
      setModalReact(x);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  }

  function hitreact1() {
    if (modal1Visible === true) {
      setModal1Visible(false);
    } else {
      setModal1Visible(true);
    }
  }

  function sendReaction(id, reaction) {
    const myReaction =
      reaction === react[0]
        ? 'A'
        : reaction === react[1]
          ? 'B'
          : reaction === react[2]
            ? 'C'
            : reaction === react[3]
              ? 'D'
              : reaction === react[4]
                ? 'E'
                : 'F';

    let reactionObject = {
      post_id: id,
      text: reaction,
      text_match: myReaction,
    };
    isInternetConnected()
      .then(() => {
        props.reactionOnPostRequest(reactionObject);
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
  }

  const getContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err) {
      } else {
        let contactsArray = contacts;
        let finalArray = [];
        setContactsLoading(false);

        contactsArray.map((item, index) => {
          item.phoneNumbers.map((item, index) => {
            let number = item.number.replace(/[- )(]/g, '');
            let check = number.charAt(0);
            let number1 = parseInt(number);
            if (check === 0) {
              finalArray.push(number1);
            } else {
              const converToString = number1.toString();
              const myVar = number1.toString().substring(0, 2);
              const threeDigitVar = number1.toString().substring(0, 3);

              if (threeDigitVar === '440') {
                let backToInt = converToString.replace(threeDigitVar, '0');
                finalArray.push(backToInt);
              } else {
                if (myVar === '44' || myVar === '91') {
                  let backToInt = converToString.replace(myVar, '0');
                  finalArray.push(backToInt);
                } else {
                  let updatednumber = `0${number1}`;
                  finalArray.push(updatednumber);
                }
              }
            }
          });
        });

        props.navigation.navigate('UsersFromContacts', { data: finalArray });
      }
    });
  };

  const playSong = data => {
    if (props.playingSongRef === '') {
      MusicPlayer(data.item.song_uri, true)
        .then(track => {
          let saveSongResObj = {};
          (saveSongResObj.uri = data.item.song_uri),
            (saveSongResObj.song_name = data.item.song_name),
            (saveSongResObj.album_name = data.item.album_name),
            (saveSongResObj.song_pic = data.item.song_image),
            (saveSongResObj.username = data.item.userDetails.username),
            (saveSongResObj.profile_pic = data.item.userDetails.profile_image),
            (saveSongResObj.commentData = data.item.comment);
          saveSongResObj.reactionData = data.item.reaction;
          (saveSongResObj.id = data.item._id),
            (saveSongResObj.artist = data.item.artist_name),
            (saveSongResObj.changePlayer = changePlayer);
          (saveSongResObj.originalUri =
            data.item.original_song_uri !== ''
              ? data.item.original_song_uri
              : undefined),
            (saveSongResObj.isrc = data.item.isrc_code),
            (saveSongResObj.regType = data.item.userDetails.register_type),
            (saveSongResObj.details = data.item),
            (saveSongResObj.showPlaylist = true),
            (saveSongResObj.comingFromMessage = undefined);

          props.saveSongRefReq(saveSongResObj);
          props.dummyRequest();
        })
        .catch(err => { });
    } else {
      if (global.playerReference !== null) {
        if (global.playerReference._filename === data.item.song_uri) {
          if (global.playerReference.isPlaying()) {
            global.playerReference.pause();

            setTimeout(() => {
              findPlayingSong(posts);
            }, 500);
          } else {
            global.playerReference.play(success => {
              if (success) {
              } else {
              }
            });

            setTimeout(() => {
              findPlayingSong(posts);
            }, 500);
          }
        } else {
          global.playerReference.release();
          global.playerReference = null;
          MusicPlayer(data.item.song_uri, true)
            .then(track => {
              let saveSongResObj = {};
              (saveSongResObj.uri = data.item.song_uri),
                (saveSongResObj.song_name = data.item.song_name),
                (saveSongResObj.album_name = data.item.album_name),
                (saveSongResObj.song_pic = data.item.song_image),
                (saveSongResObj.username = data.item.userDetails.username),
                (saveSongResObj.profile_pic =
                  data.item.userDetails.profile_image),
                (saveSongResObj.commentData = data.item.comment);
              saveSongResObj.reactionData = data.item.reaction;
              (saveSongResObj.id = data.item._id),
                (saveSongResObj.artist = data.item.artist_name),
                (saveSongResObj.changePlayer = changePlayer);
              (saveSongResObj.originalUri =
                data.item.original_song_uri !== ''
                  ? data.item.original_song_uri
                  : undefined),
                (saveSongResObj.isrc = data.item.isrc_code),
                (saveSongResObj.regType = data.item.userDetails.register_type),
                (saveSongResObj.details = data.item),
                (saveSongResObj.showPlaylist = true),
                (saveSongResObj.comingFromMessage = undefined);

              props.saveSongRefReq(saveSongResObj);
              props.dummyRequest();
            })
            .catch(err => { });
        }
      } else {
        MusicPlayer(data.item.song_uri, true)
          .then(track => {
            let saveSongResObj = {};
            (saveSongResObj.uri = data.item.song_uri),
              (saveSongResObj.song_name = data.item.song_name),
              (saveSongResObj.album_name = data.item.album_name),
              (saveSongResObj.song_pic = data.item.song_image),
              (saveSongResObj.username = data.item.userDetails.username),
              (saveSongResObj.profile_pic =
                data.item.userDetails.profile_image),
              (saveSongResObj.commentData = data.item.comment);
            saveSongResObj.reactionData = data.item.reaction;
            (saveSongResObj.id = data.item._id),
              (saveSongResObj.artist = data.item.artist_name),
              (saveSongResObj.changePlayer = changePlayer);
            (saveSongResObj.originalUri =
              data.item.original_song_uri !== ''
                ? data.item.original_song_uri
                : undefined),
              (saveSongResObj.isrc = data.item.isrc_code),
              (saveSongResObj.regType = data.item.userDetails.register_type),
              (saveSongResObj.details = data.item),
              (saveSongResObj.showPlaylist = true),
              (saveSongResObj.comingFromMessage = undefined);

            props.saveSongRefReq(saveSongResObj);
            props.dummyRequest();
          })
          .catch(err => { });
      }
    }
  };

  function _onSelectBack(ID, comment) {
    posts.map((item, index) => {
      if (item._id === ID) {
        posts[index].comment_count = comment;
      }
    });
  }

  function _onReaction(ID, reaction) {
    posts.map((item, index) => {
      if (item._id === ID) {
        posts[index].reaction_count = reaction;
      }
    });
  }

  function renderItem(data) {
    return (
      <>
        <HomeItemList
          image={data.item.song_image}
          play={
            _.isEmpty(postArray)
              ? false
              : posts.length === postArray.length
                ? postArray[data.index].playing
                : false
          }
          picture={data.item.userDetails.profile_image}
          name={data.item.userDetails.username}
          comment_count={data.item.comment_count ? data.item.comment_count : 0}
          reaction_count={
            data.item.reaction_count ? data.item.reaction_count : 0
          }
          reactions={{
            fire_count: data.item.fire_count,
            love_count: data.item.love_count,
            dancer_count: data.item.dancer_count,
            man_dancing_count: data.item.man_dancing_count,
            face_count: data.item.face_count,
            thumbsup_count: data.item.thumbsup_count,
          }}
          navi={props}
          content={data.item.post_content}
          time={data.item.createdAt}
          title={data.item.song_name}
          singer={data.item.artist_name}
          songUri={data.item.song_uri}
          modalVisible={modal1Visible}
          postType={data.item.social_type === 'spotify'}
          onReactionPress={reaction => {
            if (!isFetching) {
              hitreact(reaction, data.index);
              sendReaction(data.item._id, reaction);
            }
          }}
          onPressImage={() => {
            if (!isFetching) {
              if (props.userProfileResp._id === data.item.user_id) {
                props.navigation.navigate('Profile', { fromAct: false });
              } else {
                props.navigation.navigate('OthersProfile', {
                  id: data.item.user_id,
                });
              }
            }
          }}
          onAddReaction={() => {
            hitreact1(modal1Visible);
          }}
          onPressMusicbox={() => {
            if (!isFetching) {
              playSong(data);
              setVisibleMiniPlayer(true);
            }
          }}
          onPressReactionbox={() => {
            if (!isFetching) {
              props.navigation.navigate('HomeItemReactions', {
                reactionCount: data.item.reaction_count
                  ? data.item.reaction_count
                  : 0,
                post_id: data.item._id,
                onSelectReaction: (ID, reaction) => _onReaction(ID, reaction),
              });
            }
          }}
          onPressCommentbox={() => {
            if (!isFetching) {
              props.navigation.navigate('HomeItemComments', {
                index: data.index,
                comment: data.item.comment,
                image: data.item.song_image,
                username: data.item.userDetails.username,
                userComment: data.item.post_content,
                time: data.item.createdAt,
                id: data.item._id,
                onSelect: (ID, comment) => _onSelectBack(ID, comment),
              });
            }
          }}
          onPressSecondImage={() => {
            if (!isFetching) {
              setPositionInArray(data.index);
              setModalVisible(true);
            }
          }}
          marginBottom={data.index === posts.length - 1 ? normalise(60) : 0}
        // playingSongRef={props.playingSongRef}
        />
        {data.index % 4 === 0 && data.index !== 0 && (
          <View
            style={{
              marginVertical: normalise(24),
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <BannerAd
              unitId={
                Platform.OS === 'android'
                  ? 'ca-app-pub-2232736176622960/5949774256'
                  : 'ca-app-pub-2232736176622960/6141345945'
              }
              size={BannerAdSize.MEDIUM_RECTANGLE}
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
          </View>
        )}
      </>
    );
  }

  function findIsNotRead() {
    let hasUnseenMessage = false;
    var arr = props.chatList;

    if (!_.isEmpty(arr) && !_.isEmpty(props.userProfileResp)) {
      for (var i = 0; i < arr.length; i++) {
        if (props.userProfileResp._id === arr[i].receiver_id) {
          hasUnseenMessage = !arr[i].read;
          if (hasUnseenMessage) {
            break;
          }
        }
      }

      return hasUnseenMessage;
    }
  }

  // GET PLAYER PLAYING STATE FOR PAUSE/PLAY ICON IN FEED
  function getPlayerState() {
    let isPlaying = null;
    if (
      global.playerReference !== null &&
      global.playerReference !== undefined
    ) {
      isPlaying = global.playerReference.isPlaying();
    }
    return isPlaying;
  }

  // FIND THE PLAYING SONG AND ADD THE PAUSE/PLAY ICON TO FEED
  function findPlayingSong(postData) {
    const res = getPlayerState();

    // IF PLAYING
    if (res === true && !props.playingSongRef.changePlayer) {
      const myindex = postData.findIndex(
        obj => obj.song_uri === props.playingSongRef.uri,
      );
      let array = [...postData];
      let i;
      for (i = 0; i < array.length; i++) {
        if (i === myindex) {
          array[i].playing = true;
          let duration = global.playerReference.getDuration();
          global.playerReference.getCurrentTime(seconds => {
            let timeout = (duration - seconds) * 1000;

            clearTimeout(timeoutVar);
            setTimeoutFunc(timeout);
          });
        } else {
          array[i].playing = false;
        }
      }
      setPostArray(array);
    }
    // NOT PLAYING
    else {
      let array = [...postData];
      let i;
      for (i = 0; i < array.length; i++) {
        array[i].playing = false;
      }
      //  setVisibleMiniPlayer(false)
      setPostArray(array);
    }
  }

  //SET TIMEOUT FOR PAUSE/PLAY ICON
  function setTimeoutFunc(timeout) {
    setTimeoutVar(
      setTimeout(() => {
        findPlayingSong(postArray);
      }, timeout),
    );
  }

  // GET ISRC CODE
  const callApi = async () => {
    if (props.registerType === 'spotify') {
      const spotifyToken = await getSpotifyToken();

      return await axios.get(
        `https://api.spotify.com/v1/search?q=isrc:${posts[positionInArray].isrc_code}&type=track`,
        {
          headers: {
            Authorization: spotifyToken,
          },
        },
      );
    } else {
      const AppleToken = await getAppleDevToken();

      return await axios.get(
        `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${posts[positionInArray].isrc_code}`,
        {
          headers: {
            Authorization: AppleToken,
          },
        },
      );
    }
  };

  //OPEN IN APPLE / SPOTIFY
  const openInAppleORSpotify = async () => {
    try {
      const res = await callApi();

      if (res.status === 200) {
        if (
          !_.isEmpty(
            props.registerType === 'spotify'
              ? res.data.tracks.items
              : res.data.data,
          )
        ) {
          if (props.userProfileResp.register_type === 'spotify') {
            Linking.canOpenURL(res.data.tracks.items[0].external_urls.spotify)
              .then(() => {
                Linking.openURL(res.data.tracks.items[0].external_urls.spotify)
                  .then(() => {
                    setBool(false);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
            setBool(false);
          } else {
            console.log(2);
            Linking.canOpenURL(res.data.data[0].attributes.url)
              .then(() => {
                Linking.openURL(res.data.data[0].attributes.url)
                  .then(() => {
                    setBool(false);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(() => { });
            setBool(false);
          }
        } else {
          setBool(false);
          toast('', 'No Song Found');
        }
      } else {
        setBool(false);
        toast('Oops', 'Something Went Wrong');
      }
    } catch (error) {
      console.log({ error });
      setBool(false);
    }
  };

  function onfinish() {
    if (posts.length !== 0) {
      let loadData = { offset: 1, create: posts[0].createdAt };
      props.loadMorePost(loadData);
    } else {
      console.log('empty');
    }
  }

  // VIEW
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.black,
      }}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <SafeAreaView style={{ flex: 1, position: 'relative' }}>
        <Timer
          onFinish={() => {
            onfinish();
          }}
        />
        <Loader visible={isFetching && !isFetchingNextPage && !isRefetching} />
        <Loader visible={contactsLoading} />
        <Loader visible={bool} />
        <HomeHeaderComponent
          firstitemtext={false}
          marginTop={0}
          imageone={
            _.isEmpty(props.userProfileResp)
              ? ''
              : props.userProfileResp.profile_image
                ? constants.profile_picture_base_url +
                props.userProfileResp.profile_image
                : null
          }
          staticFirstImage={false}
          imageoneheight={normalise(26)}
          imageonewidth={normalise(26)}
          borderRadius={normalise(30)}
          title={'CHOONA'}
          thirditemtext={false}
          imagetwo={ImagePath.inbox}
          imagetwoheight={25}
          imagetwowidth={25}
          middleImageReq={true}
          notRead={findIsNotRead()}
          onIconPress={true}
          pressLogo={() => {
            flatlistRef.current.scrollToIndex({
              animated: true,
              index: 0,
              viewPosition: 0,
            });
          }}
          onPressFirstItem={() => {
            props.navigation.navigate('Profile', { fromAct: false });
          }}
          onPressThirdItem={() => {
            props.navigation.navigate('Inbox');
            //  props.navigation.navigate('BlankScreen');
          }}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={firstTimeModalShow}
          presentationStyle="overFullScreen">
          <LinearGradient
            colors={['rgba(159, 0, 255, 0.8)', 'rgba(3, 150, 91, 0.8)']}
            locations={[0, 0.5, 1]}
            useAngle={true}
            angle={315}
            angleCenter={{ x: -4, y: 1 }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: normalise(12),
            }}>
            <View
              style={{
                backgroundColor: '#121317',
                borderRadius: normalise(8),
                boxShadow: '0px -8px 40px rgba(0, 0, 0, 0.4)',
                padding: normalise(16),
                width: '100%',
              }}>
              <View
                style={{
                  alignItems: 'flex-start',
                  borderBottomColor: '#25262A',
                  borderBottomWidth: normalise(1),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'ProximaNova-Bold',
                    fontSize: normalise(14),
                    marginBottom: normalise(12),
                  }}>
                  Welcome to Choona’s Beta
                </Text>
                <Pressable
                  onPress={() => {
                    setFirstTimeModalShow(false);
                    AsyncStorage.setItem('IS_FIRST_OPEN', 'true');
                  }}>
                  <Image
                    source={ImagePath.modalClose}
                    style={{
                      height: normalise(24),
                      right: normalise(-4),
                      top: normalise(-4),
                      width: normalise(24),
                    }}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  borderBottomColor: '#25262A',
                  borderBottomWidth: normalise(1),
                  paddingTop: normalise(12),
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'ProximaNova-Regular',
                    fontSize: normalise(11),
                    marginBottom: normalise(16),
                  }}>
                  Firstly, thank you so much for joining our public beta.
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'ProximaNova-Regular',
                    fontSize: normalise(11),
                    marginBottom: normalise(16),
                  }}>
                  Choona is made by a tiny team and is currently bootstrapped;
                  so please help us, to help you. We have created this platform
                  for music lovers, like yourself, to share their music.
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'ProximaNova-Regular',
                    fontSize: normalise(11),
                    marginBottom: normalise(16),
                  }}>
                  We have released Choona to a wider audience, in order to get
                  some feedback from people like you. It won’t be perfect yet,
                  but please reach out with any bugs or feature requests to
                  contact@choona.com{' '}
                  <Text
                    style={{
                      color: '#979797',
                    }}>
                    (this is also in the setting menu should you need it going
                    forward)
                  </Text>
                  .
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'ProximaNova-Regular',
                    fontSize: normalise(11),
                    marginBottom: normalise(16),
                  }}>
                  Choona is better with friends; so please share it. Also, check
                  your phonebook to see if any of your friends are already on
                  here. Failing that, you can follow our founder below to see
                  his{' '}
                  <Text
                    style={{
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    }}>
                    awful
                  </Text>{' '}
                  taste in music.
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: normalise(12),
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Image
                    source={{
                      uri:
                        constants.profile_picture_base_url +
                        andyProfile.profile_image,
                    }}
                    style={{
                      borderRadius: normalise(16),
                      height: normalise(32),
                      marginRight: normalise(8),
                      width: normalise(32),
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'ProximaNova-SemiBold',
                        fontSize: normalise(12),
                      }}>
                      {andyProfile.full_name}
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'ProximaNova-Regular',
                        fontSize: normalise(10),
                        opacity: 0.5,
                      }}>
                      Founder
                    </Text>
                  </View>
                </View>
                {!andyProfile.isFollowing && (
                  <Pressable
                    onPress={() => {
                      props.followUnfollowReq({ follower_id: andyProfile._id });
                      setFollowButtonPressed(true);
                    }}
                    disabled={followButtonPressed}
                    style={{
                      alignItems: 'center',
                      backgroundColor: followButtonPressed ? '#25262a' : '#fff',
                      borderRadius: normalise(16),
                      height: normalise(30),
                      justifyContent: 'center',
                      width: normalise(100),
                    }}>
                    <Text
                      style={{
                        color: followButtonPressed ? '#fff' : '#25262a',
                        fontFamily: 'ProximaNova-Bold',
                        fontSize: normalise(10),
                        textTransform: 'uppercase',
                      }}>
                      {followButtonPressed ? 'Following' : 'Follow Me'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </LinearGradient>
        </Modal>

        {!isShown && (
          <CompleteProfileBlock
            navigation={props.navigation}
            setIsShown={setIsShown}
          />
        )}

        {_.isEmpty(posts) ? (
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
            title={'Your Feed is empty'}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={posts}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              ref={flatlistRef}
              onEndReached={() => fetchNextPage()}
              onEndReachedThreshold={2}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.black]}
                  progressBackgroundColor={Colors.white}
                  title={'Refreshing...'}
                  titleColor={Colors.white}
                />
              }
            />
            {loadMoreVisible ? (
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  alignSelf: 'center',
                  position: 'absolute',
                  top: 20,
                }}
                onPress={() => loadMore()}>
                <LinearGradient
                  colors={['#008373', '#4950AC', '#7A1FD4']}
                  start={{ x: 1.0, y: 5.1 }}
                  end={{ x: 2.0, y: 2.5 }}
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: '2.7%',
                    paddingHorizontal: '4.3%',
                  }}>
                  <Text style={{ color: 'white', fontSize: normalise(10) }}>
                    Load Newer Posts
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : null}

            {visibleminiPlayer === true ? (
              <MusicPlayerBar
                onPress={() => {
                  props.navigation.navigate('Player', {
                    comments: [],
                    song_title: props.playingSongRef.song_name,
                    album_name: props.playingSongRef.album_name,
                    song_pic: props.playingSongRef.song_pic,
                    username: props.playingSongRef.username,
                    profile_pic: props.playingSongRef.profile_pic,
                    uri: props.playingSongRef.uri,
                    reactions: props.playingSongRef.reactionData,
                    id: props.playingSongRef.id,
                    artist: props.playingSongRef.artist,
                    changePlayer: props.playingSongRef.changePlayer,
                    originalUri: props.playingSongRef.originalUri,
                    isrc: props.playingSongRef.isrc,
                    registerType: props.playingSongRef.regType,
                    details: props.playingSongRef.details,
                    showPlaylist: props.playingSongRef.showPlaylist,
                    comingFromMessage: props.playingSongRef.comingFromMessage,
                  });
                }}
                onPressPlayOrPause={() => {
                  setTimeout(() => {
                    findPlayingSong(posts);
                  }, 500);
                }}
              />
            ) : null}
            <Modal
              animationType="fade"
              transparent={true}
              visible={visible}
              onRequestClose={() => {
                //Alert.alert("Modal has been closed.");
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#000000',
                  opacity: 0.9,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize:
                      Platform.OS === 'android'
                        ? normalise(70)
                        : normalise(100),
                  }}>
                  {modalReact}
                </Text>
              </View>
            </Modal>
            {modalVisible && (
              <MoreModal
                setBool={setBool}
                index={positionInArray}
                setIndex={setPositionInArray}
                navigation={props.navigation}
                openInAppleORSpotify={openInAppleORSpotify}
                postData={posts}
                show={modalVisible}
                setShow={setModalVisible}
              />
            )}
          </View>
        )}
        {modal1Visible === true ? (
          <View
            style={{
              position: 'absolute',
              margin: 20,
              height: normalise(280),
              width: '92%',
              alignSelf: 'center',
              marginHorizontal: normalise(15),
              backgroundColor: Colors.white,
              borderRadius: 20,
              padding: 35,
              bottom: 50,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <EmojiSelector
              category={Categories.history}
              showHistory={true}
              onEmojiSelected={emoji => {
                setVisible(true);
                setModalReact(emoji);
                setTimeout(() => {
                  setVisible(false);
                }, 2000);
              }}
            />
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfileReq: () => {
      dispatch(getProfileRequest());
    },

    homePage: offset => {
      dispatch(homePageReq(offset));
    },

    loadMorePost: data => {
      dispatch(loadMoreRequest(data));
    },

    loadMoreData: () => {
      dispatch(loadMoreData());
    },

    saveSongReq: payload => {
      dispatch(saveSongRequest(payload));
    },

    reactionOnPostRequest: payload => {
      dispatch(reactionOnPostRequest(payload));
    },

    followUnfollowReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },

    deletePostReq: payload => {
      dispatch(deletePostReq(payload));
    },

    getusersFromHome: payload => {
      dispatch(getUsersFromHome(payload));
    },

    dummyRequest: () => {
      dispatch(dummyRequest());
    },

    saveSongRefReq: object => {
      dispatch(saveSongRefReq(object));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
