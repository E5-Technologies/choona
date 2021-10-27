import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Slider,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Linking,
  Keyboard,
  BackHandler,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import normalise from '../../utils/helpers/Dimens';
import normaliseNew from '../../utils/helpers/DimensNew';

import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import CommentList from '../main/ListCells/CommentList';
import StatusBar from '../../utils/MyStatusBar';
import RBSheet from 'react-native-raw-bottom-sheet';
import { commentOnPostReq, dummyRequest } from '../../action/UserAction';

import { fetchCommentsOnPost } from '../../helpers/post';

import Sound from 'react-native-sound';
import toast from '../../utils/helpers/ShowErrorAlert';
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import moment from 'moment';
import {
  COMMENT_ON_POST_REQUEST,
  COMMENT_ON_POST_SUCCESS,
  COMMENT_ON_POST_FAILURE,
  SAVE_SONGS_REQUEST,
  SAVE_SONGS_SUCCESS,
  SAVE_SONGS_FAILURE,
  GET_SONG_FROM_ISRC_REQUEST,
  GET_SONG_FROM_ISRC_SUCCESS,
  GET_SONG_FROM_ISRC_FAILURE,
} from '../../action/TypeConstants';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { saveSongRequest, saveSongRefReq } from '../../action/SongAction';
import {
  getCurrentPlayerPostionAction,
  playerResumeRequest,
  playerPauseRequest,
  playerSeekToRequest,
  getSongFromisrc,
} from '../../action/PlayerAction';
import { updateMessageCommentRequest } from '../../action/MessageAction';
import Loader from '../../widgets/AuthLoader';
import _ from 'lodash';
import axios from 'axios';
import { getUsersFromHome } from '../../action/UserAction';
import MoreModal from '../Posts/MoreModal';

let RbSheetRef;

let status;
let songStatus;
let playerStatus;

function Player(props) {
  // PLAYER

  const [playVisible, setPlayVisible] = useState(false);
  const [uri, setUri] = useState(props.route.params.uri);
  const [trackRef, setTrackRef] = useState('');
  const [songTitle, setSongTitle] = useState(props.route.params.song_title);
  const [albumTitle, setAlbumTitle] = useState(props.route.params.album_name);
  const [artist, setArtist] = useState(props.route.params.artist);
  const [pic, setPic] = useState(props.route.params.song_pic);

  const [username, setUsername] = useState(props.route.params.username);
  const [profilePic, setprofilePic] = useState(props.route.params.profile_pic);
  const [isrc, setisrc] = useState(props.route.params.isrc);
  const [details, setDetails] = useState(props.route.params.details);
  const [receiverId, setReceiverId] = useState(props.route.params.receiver_id);
  const [senderId, setSenderId] = useState(props.route.params.sender_id);

  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [playerDuration, setplayerDuration] = useState(0);
  const [curentTimeForSlider, setCurentTimeForSlider] = useState(0);
  const [totalTimeForSlider, setTotalTimeForSlider] = useState(0);

  const [hasSongLoaded, setHasSongLoaded] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [textinputHeight, setHeight] = useState(50);
  const [disabled, setDisabled] = useState(false);

  const [reactions, setSReactions] = useState(
    props.route.params.changePlayer ? [] : props.route.params.reactions,
  );

  //COMMENT ON POST
  const [commentData, setCommentData] = useState(
    props.route.params.changePlayer
      ? props.route.params.comingFromMessage
        ? getArrayLength(props.route.params.comments)
        : []
      : props.route.params.comments,
  );
  const [id, setId] = useState(props.route.params.id);
  const [commentText, setCommentText] = useState('');
  const [arrayLength, setArrayLength] = useState(
    `${commentData.length} ${commentData.length > 1 ? '' : ''}`,
  );

  const [bool, setBool] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changePlayer, setChangePlayer] = useState(
    props.route.params.changePlayer,
  );

  const [originalUri, setOriginalUri] = useState(
    props.route.params.originalUri,
  );
  const [registerType, setRegisterType] = useState(
    props.route.params.registerType,
  );
  const [changePlayer2, setChanagePlayer2] = useState(
    props.route.params.changePlayer2,
  );

  const [comingFromMessage, setCommingFromMessage] = useState(
    props.route.params.comingFromMessage === undefined ? false : true,
  );
  const [key, setKey] = useState(props.route.params.key);
  const [chatToken, setChatToken] = useState(props.route.params.chatToken);

  // console.log("commentData: " + JSON.stringify(commentData));
  let track;
  var bottomSheetRef;
  //Prithviraj's variables.
  const [firstTimePlay, setFirstTimePlay] = useState(true);

  function handleBackButtonClick() {
    console.log('hello');

    if (global.playerReference !== null) {
      if (global.playerReference.isPlaying()) {
        props.dummyRequest();
      }
    }
    props.navigation.goBack();
    return true;
  }

  useEffect(() => {
    // const unsuscribe = props.navigation.addListener('focus', (payload) => {

    //     myVar = setInterval(() => {
    //         props.getCurrentPlayerPostionAction();
    //     }, 2000)

    // });

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    console.log('coming:' + props.route.params.comingFromMessage);

    if (!props.route.params.comingFromMessage) {
      fetchCommentsOnPost(props.route.params.id, props.header.token)
        .then(res => {
          if (res) {
            setCommentData(res);

            setArrayLength(`${res.length} ${res.length > 1 ? '' : ''}`);
          }
        })
        .catch(err => {
          toast('Error', err);
        });
    }

    isInternetConnected()
      .then(() => {
        Sound.setCategory('Playback', false);
        props.getSongFromIsrc(props.userProfileResp.register_type, isrc);

        if (changePlayer2) {
          //   console.log('getting spotify song uri');
          const getSpotifyApi = async () => {
            try {
              const res = await callApi();
              //   console.log(res);
              if (res.data.status === 200) {
                let suc = res.data.data.audio;
                setUri(suc);
                playSongOnLoad(suc);
              } else {
                toast('Oops', 'Something Went Wrong');
                props.navigation.goBack();
              }
            } catch (error) {
              //   console.log(error);
            }
          };

          getSpotifyApi();
        } else {
          playSongOnLoad();
        }

        // return () => {
        //     clearInterval(myVar),
        //         unsuscribe();
        // }
      })
      .catch(() => {
        toast('', 'Please Connect To Internet');
      });
  }, []);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case COMMENT_ON_POST_REQUEST:
        status = props.status;
        break;

      case COMMENT_ON_POST_SUCCESS:
        status = props.status;
        setCommentText('');
        console.log(props.commentResp);
        if (!_.isEmpty(props.commentResp.text)) {
          let data = props.commentResp.text[props.commentResp.text.length - 1];
          data.profile_image = props.userProfileResp.profile_image;
          commentData.push(data);
          setArrayLength(
            `${commentData.length} ${commentData.length > 1 ? '' : ''}`,
          );
        } else {
          toast('Error', 'Oops could not find the post');
        }
        break;

      case COMMENT_ON_POST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong');
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
          toast('Error', props.savedSongResponse.message);
        }
        break;

      case SAVE_SONGS_FAILURE:
        songStatus = props.songStatus;
        toast('Oops', 'Something Went Wrong');
        break;
    }
  }

  if (playerStatus === '' || props.playerStatus !== playerStatus) {
    switch (props.playerStatus) {
      case GET_SONG_FROM_ISRC_REQUEST:
        playerStatus = props.playerStatus;
        break;

      case GET_SONG_FROM_ISRC_SUCCESS:
        playerStatus = props.playerStatus;
        break;

      case GET_SONG_FROM_ISRC_FAILURE:
        playerStatus = props.playerStatus;
        toast('Oops', 'Something Went Wrong');
        break;
    }
  }

  function _onReaction(ID, reaction) { }

  function _onSelectBack(data, comment) {
    // console.log('aaa' + JSON.stringify(comment));
    setCommentData(data);
    setArrayLength(`${comment} ${comment > 1 ? '' : ''}`);
  }
  //COMING FROM MESSAGE ARRAY LENGTH
  function getArrayLength(message) {
    let msg_array = [];
    message.map((item, index) => {
      if (item.text !== '') {
        msg_array.push(item);
      }
    });
    return msg_array;
  }

  // GET SPOTIFY SONG URL
  const callApi = async () => {
    return await axios.get(
      `${constants.BASE_URL}/${`song/spotify/${props.route.params.id}`}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      },
    );
  };

  const playSongOnLoad = songuri => {
    if (props.playingSongRef === '') {
      console.log('first time');
      setPlayVisible(true);

      playSong(songuri);
    } else {
      if (global.playerReference !== null) {
        if (global.playerReference._filename === uri) {
          console.log('Already Playing');
          //   console.log(global.playerReference);
          setTimeout(() => {
            changeTime(global.playerReference);
            let time = global.playerReference.getDuration();
            if (global.playerReference.isPlaying()) {
              setHasSongLoaded(true);
              setplayerDuration(time);
              setBool(false);
            } else {
              setHasSongLoaded(true);

              setBool(false);
              setPlayVisible(true);
            }
            // global.playerReference.pause();
            // global.playerReference.play((success) => {
            //     if (success) {
            //         console.log('Playback Endd')
            //         setPlayVisible(true);
            //     }
            // })
          }, 100);
        } else {
          console.log('reset');
          global.playerReference.release();
          global.playerReference = null;
          setPlayVisible(true);

          playSong(songuri);
        }
      } else {
        console.log('reset2');

        playSong(songuri);
      }
    }
  };

  // PLAY SONG
  const playSong = songuri => {
    if (changePlayer2 && songuri === null) {
      toast(
        'Error',
        'Sorry, this track cannot be played as it does not have a proper link.',
      ),
        setBool(false);
      setPlayVisible(true);
    } else if (
      (uri === null && changePlayer2 === undefined) ||
      (uri === '' && changePlayer2 === undefined)
    ) {
      setBool(false);
      setPlayVisible(true);
      toast(
        'Error',
        'Sorry, this track cannot be played as it does not have a proper link.',
      );
    } else {
      track = new Sound(changePlayer2 ? songuri : uri, '', err => {
        if (err) {
          //   console.log(err);
          setPlayVisible(true);
        } else {
          //   console.log('Loaded');
          setHasSongLoaded(true);
          setBool(false);
          changeTime(track);

          let saveSongResObj = {};
          (saveSongResObj.uri = uri),
            (saveSongResObj.song_name = songTitle),
            (saveSongResObj.album_name = albumTitle),
            (saveSongResObj.song_pic = pic),
            (saveSongResObj.username = username),
            (saveSongResObj.profile_pic = profilePic),
            (saveSongResObj.commentData = commentData);
          saveSongResObj.reactionData = reactions;
          (saveSongResObj.id = id),
            (saveSongResObj.artist = artist),
            (saveSongResObj.changePlayer = changePlayer);
          (saveSongResObj.originalUri = originalUri),
            (saveSongResObj.isrc = isrc),
            (saveSongResObj.regType = registerType),
            (saveSongResObj.details = details),
            (saveSongResObj.showPlaylist = props.route.params.showPlaylist),
            (saveSongResObj.comingFromMessage =
              props.route.params.comingFromMessage);

          props.saveSongRefReq(saveSongResObj);
          global.playerReference = track;

          let res = track.getDuration();
          setplayerDuration(res);

          // track.play((success) => {
          //     if (success) {
          //         console.log('PlayBack End')
          //         setPlayVisible(true);
          //     }
          //     else {
          //         console.log('NOOOOOOOO')
          //     }
          // });
        }
      });

      setTrackRef(track);
    }
  };

  // PAUSE AND PLAY
  function playing() {
    if (uri === null) {
      setBool(false);
      setPlayVisible(true);
      toast(
        'Error',
        'Sorry, this track cannot be played as it does not have a proper link.',
      );
    } else {
      if (playVisible === true) {
        setPlayVisible(false);

        global.playerReference.play(success => {
          if (success) {
            // console.log('PlayBack End!');
            setPlayVisible(true);
          } else {
            // console.log('NOOOOOOOO');
          }
        });
      } else {
        setPlayVisible(true);

        global.playerReference.pause(() => {
          //   console.log('paused');
        });
      }
    }
  }

  // CHANGE TIME
  const changeTime = ref => {
    setInterval(() => {
      ref.getCurrentTime(seconds => {
        setPlayerCurrentTime(seconds);
      });
    }, 1000);
  };

  //OPEN IN APPLE / SPOTIFY
  const openInAppleORSpotify = () => {
    if (!_.isEmpty(props.isrcResp)) {
      if (props.userProfileResp.register_type === 'spotify') {
        // console.log('success - spotify');
        // console.log(props.isrcResp[0].external_urls.spotify);
        Linking.canOpenURL(props.isrcResp[0].external_urls.spotify)
          .then(supported => {
            if (supported) {
              Linking.openURL(props.isrcResp[0].external_urls.spotify)
                .then(() => {
                  //   console.log('success');
                })
                .catch(() => {
                  //   console.log('error');
                });
            }
          })
          .catch(() => {
            // console.log('not supported');
          });
      } else {
        // console.log('success - apple');
        // console.log(props.isrcResp[0].attributes.url);
        Linking.canOpenURL(props.isrcResp[0].attributes.url)
          .then(supported => {
            if (supported) {
              Linking.openURL(props.isrcResp[0].attributes.url)
                .then(() => {
                  //   console.log('success');
                })
                .catch(() => {
                  //   console.log('error');
                });
            }
          })
          .catch(() => {
            // console.log('not supported');
          });
      }
    } else {
      toast('', 'No Song Found');
    }
  };

  // RENDER FLATLIST DATA
  function renderFlatlistData(data) {
    return (
      <CommentList
        width={'100%'}
        image={constants.profile_picture_base_url + data.item.profile_image}
        name={data.item.username}
        comment={data.item.text}
        time={moment(data.item.createdAt).from()}
        marginBottom={data.index === commentData.length - 1 ? normalise(10) : 0}
        onPressImage={() => {
          if (props.userProfileResp._id === data.item.user_id) {
            if (RbSheetRef) {
              RbSheetRef.close();
            }
            props.navigation.navigate('Profile', { fromAct: false });
          } else {
            if (RbSheetRef) {
              RbSheetRef.close();
            }
            props.navigation.navigate('OthersProfile', {
              id: data.item.user_id,
            });
          }
        }}
      />
    );
  }

  const updateSize = height => {
    setHeight(height);
  };

  function _onPressSheet() {
    // alert("post click")

    Keyboard.dismiss();
    setCommentText('');
    let commentObject = {
      post_id: id,
      text: commentText,
    };
    let updateMessagPayload = {};

    if (comingFromMessage) {
      let tempData = [...commentData];
      tempData.push({
        profile_image: props.userProfileResp.profile_image,
        text: commentText,
        username: props.userProfileResp.username,
        createdAt: moment().toString(),
        user_id: props.userProfileResp._id,
      });
      setArrayLength(`${tempData.length} ${tempData.length > 1 ? '' : ''}`);
      setCommentData(tempData);
      setCommentText('');

      updateMessagPayload = {
        ChatId: key,
        chatToken: chatToken,
        message: tempData,
        receiverId: receiverId,
        senderId: senderId,
        songTitle: songTitle,
        artist: artist,
      };
    }
    isInternetConnected()
      .then(() => {
        comingFromMessage
          ? props.updateMessageCommentRequest(updateMessagPayload)
          : props.commentOnPost(commentObject);
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
  }

  // BOTTOM SHEET FUNC
  const RbSheet = () => {
    return (
      <RBSheet
        ref={ref => {
          if (ref) {
            RbSheetRef = ref;
          }
        }}
        animationType={'slide'}
        closeOnDragDown={false}
        closeOnPressMask={true}
        nestedScrollEnabled={true}
        customStyles={{
          container: {
            minHeight: Dimensions.get('window').height,
            borderTopEndRadius: normalise(8),
            borderTopStartRadius: normalise(8),
            backgroundColor: 'transparent',
          },
        }}>
        <ImageBackground
          source={ImagePath.page_gradient}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (RbSheetRef) {
                RbSheetRef.close();
              }
            }}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
          />
          <View
            style={{
              height: Dimensions.get('window').height / 2.2,
              backgroundColor: 'black',
              borderTopEndRadius: normalise(8),
              borderTopStartRadius: normalise(8),
            }}>
            <View style={{ width: '95%', flex: 1, alignSelf: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: normalise(15),
                  borderBottomWidth: 0.5,
                  borderColor: Colors.grey,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (RbSheetRef) {
                      RbSheetRef.close();
                    }
                  }}>
                  <Image
                    source={ImagePath.donw_arrow_solid}
                    style={{
                      height: normalise(10),
                      width: normalise(10),
                      marginBottom: normalise(10),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (RbSheetRef) {
                      RbSheetRef.close();
                    }
                  }}>
                  <Text
                    style={{
                      fontSize: normalise(12),
                      color: Colors.white,
                      fontFamily: 'ProximaNova-Bold',
                      marginBottom: normalise(10),
                    }}>
                    {arrayLength}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (RbSheetRef) {
                      RbSheetRef.close();
                    }
                  }}>
                  <Image
                    source={ImagePath.donw_arrow_solid}
                    style={{
                      height: normalise(10),
                      width: normalise(10),
                      marginBottom: normalise(10),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                style={{ height: '40%' }}
                data={commentData}
                renderItem={renderFlatlistData}
                keyExtractor={(item, index) => {
                  index.toString();
                }}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: normalise(15),
                marginBottom: normalise(5),
                position: 'absolute',
                bottom: 0,
              }}>
              <TextInput
                style={styles.rbsheetInput}
                multiline={true}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                keyboardAppearance="dark"
                autofocus={true}
                onContentSizeChange={e =>
                  updateSize(e.nativeEvent.contentSize.height)
                }
                placeholder={'Add a comment...'}
                value={commentText}
                placeholderTextColor={Colors.white}
                onChangeText={text => {
                  setCommentText(text);
                }}
              />
              {commentText.length > 1 ? (
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: '3%',
                  }}
                  onPress={() => _onPressSheet()}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: normalise(10),
                      fontWeight: 'bold',
                    }}>
                    POST
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <KeyboardSpacer />
        </ImageBackground>
      </RBSheet>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <StatusBar />

        <Loader visible={bool} />

        <Loader visible={props.playerStatus === GET_SONG_FROM_ISRC_REQUEST} />

        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View
              style={{
                marginHorizontal: normalise(15),
                width: normalise(290),
                marginTop: normalise(5),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: changePlayer ? 'flex-end' : 'space-between',
              }}>
              {changePlayer ? null : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={
                      profilePic
                        ? {
                          uri:
                            constants.profile_picture_base_url + profilePic,
                        }
                        : ImagePath.userPlaceholder
                    }
                    style={{
                      height: normalise(24),
                      width: normalise(24),
                      borderRadius: normalise(24),
                    }}
                    resizeMode="contain"
                  />

                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      marginLeft: normalise(5),
                    }}>
                    <Text
                      style={{
                        color: Colors.grey,
                        fontSize: normalise(8),
                        fontFamily: 'ProximaNova-Bold',
                      }}
                      numberOfLines={1}>
                      {' '}
                      POSTED BY{' '}
                    </Text>

                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: normalise(11),
                        fontFamily: 'ProximaNova-Semibold',
                        textTransform: 'lowercase',
                      }}
                      numberOfLines={1}>
                      {' '}
                      {username}{' '}
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={{
                  height: normalise(40),
                  backgroundColor: Colors.black,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    height: normalise(25),
                    width: normalise(25),
                    borderRadius: normalise(5),
                    alignSelf: 'center',
                    backgroundColor: Colors.black,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: normalise(10),
                  }}
                  onPress={() => {
                    props.navigation.goBack();
                  }}>
                  <Image
                    source={ImagePath.backicon}
                    style={{
                      height: normalise(15),
                      width: normalise(15),
                      transform: [{ rotate: '-90deg' }],
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (hasSongLoaded) {
                  playing();
                }
              }}
              style={{
                marginTop: normalise(5),
                height: normalise(320),
                width: normalise(320),
                alignSelf: 'center',
                backgroundColor: Colors.darkerblack,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{ uri: pic.replace('100x100bb.jpg', '500x500bb.jpg') }}
                style={{
                  height: normalise(320),
                  width: normalise(320),
                  marginHorizontal: normalise(15),

                  // borderRadius: normalise(15),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '90%',
                alignSelf: 'center',
                marginTop: normalise(15),
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '80%',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(12),
                    fontFamily: 'ProximaNova-Semibold',
                    width: '90%',
                  }}
                  numberOfLines={1}>
                  {songTitle}
                </Text>

                <Text
                  style={{
                    color: Colors.grey_text,
                    fontSize: normalise(10),
                    fontFamily: 'ProximaNovaAW07-Medium',
                    width: '90%',
                  }}
                  numberOfLines={1}>
                  {artist}
                </Text>
              </View>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                  setDisabled(true);
                  if (hasSongLoaded) {
                    playing();
                  }
                  setTimeout(() => {
                    setDisabled(false);
                  }, 1000);
                }}>
                <Image
                  source={playVisible ? ImagePath.play : ImagePath.pause}
                  style={{ height: normalise(24), width: normalise(24) }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <Slider
              style={{
                width: '92%',
                height: 40,
                alignSelf: 'center',
                marginTop: normalise(5),
              }}
              minimumValue={0}
              maximumValue={30}
              step={1}
              thumbTintColor="#99000000"
              value={playerCurrentTime}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            {changePlayer ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  width: '90%',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  marginTop: normalise(10),
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    //  borderWidth:1,
                    justifyContent: 'space-between',
                    flex: 0.8,
                  }}>
                  <TouchableOpacity
                    style={{
                      height: normalise(40),
                      // width: normalise(42),
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: Colors.fadeblack,
                      borderRadius: normalise(5),
                    }}
                    onPress={() => {
                      props.navigation.navigate('HomeItemReactions', {
                        reactions: reactions,
                        post_id: id,
                        onSelectReaction: (ID, reaction) =>
                          _onReaction(ID, reaction),
                      });
                    }}>
                    <Image
                      source={ImagePath.reactionShow}
                      style={{ height: normalise(20), width: normalise(20) }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: normalise(40),
                      // width: normalise(42),
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: Colors.fadeblack,
                      borderRadius: normalise(5),
                    }}
                    onPress={() => {
                      let saveSongObject = {
                        song_uri: uri,
                        song_name: songTitle,
                        song_image: pic,
                        artist_name: artist,
                        album_name: albumTitle,
                        post_id: id,
                        isrc_code: isrc,
                        original_song_uri: originalUri,
                        original_reg_type: registerType,
                      };

                      props.saveSongReq(saveSongObject);
                    }}>
                    <Image
                      source={ImagePath.boxicon}
                      style={{ height: normalise(20), width: normalise(20) }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: normalise(40),
                      // width: normalise(42),
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: Colors.fadeblack,
                      borderRadius: normalise(5),
                    }}
                    onPress={() => {
                      props.navigation.navigate('PlayerScreenSelectUser', {
                        item: {
                          _id: id,
                          song_uri: uri,
                          song_name: songTitle,
                          song_image: pic,
                          artist_name: artist,
                          album_name: albumTitle,
                          post_id: id,
                          chat_id: key,
                          type: comingFromMessage ? 'chat' : null,
                          isrc_code: isrc,
                          original_song_uri: originalUri,
                          register_type: registerType,
                        },
                        fromPlayer: true,
                        fromHome: true,
                      });
                    }}>
                    <Image
                      source={ImagePath.sendicon}
                      style={{ height: normalise(20), width: normalise(20) }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {props.route.params.showPlaylist === false ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        if (props.userProfileResp.register_type === 'spotify') {
                          props.navigation.navigate('AddToPlayListScreen', {
                            originalUri: originalUri,
                            registerType: registerType,
                            isrc: isrc,
                          });
                        }
                        // toast("Oops", "Only, Spotify users can add to their playlist now.")
                        else {
                          props.navigation.navigate('AddToPlayListScreen', {
                            isrc: isrc,
                          });
                        }
                      }}
                      style={{
                        flexDirection: 'row',
                        height: normalise(40),
                        // width: normalise(160),
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // marginTop: normalise(10),
                        // backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(10),
                      }}>
                      <Image
                        source={ImagePath.add_white}
                        style={{
                          height: normalise(20),
                          width: normalise(20),
                          borderRadius: normalise(18),
                          opacity: 0.8,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      height: normalise(40),
                      // width: normalise(115),
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: Colors.fadeblack,
                      borderRadius: normalise(10),
                    }}
                    onPress={() => {
                      props.navigation.navigate('HomeItemComments', {
                        index: 1,
                        comment: commentData,
                        image: pic,
                        username: username,
                        // userComment: data.item.post_content,
                        // time: data.item.createdAt,
                        id: id,
                        onSelect: (ID, comment) => _onSelectBack(ID, comment),
                      });
                    }}>
                    <Image
                      source={ImagePath.comment_grey}
                      style={{ height: normalise(20), width: normalise(20) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: normalise(13),
                        color: Colors.white,
                        marginLeft: normalise(4),
                        fontFamily: 'ProximaNova-Semibold',
                      }}>
                      {arrayLength}
                    </Text>
                  </TouchableOpacity>
                </View>
                {changePlayer ? null : (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginLeft: normalise(16),
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Image
                      source={ImagePath.threedots}
                      style={{
                        transform: [{ rotate: '90deg' }],
                        width: normalise(14),
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}

                {comingFromMessage ? (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginLeft: normalise(16),
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Image
                      source={ImagePath.threedots}
                      style={{
                        transform: [{ rotate: '90deg' }],
                        width: normalise(14),
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {comingFromMessage ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: normalise(10),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    // borderWidth:1,
                    // justifyContent:'space-between',
                    // flex:0.6,
                  }}>
                  <TouchableOpacity
                    style={{
                      height: normalise(40),
                      width: normalise(30),
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: Colors.fadeblack,
                      borderRadius: normalise(5),
                    }}
                    onPress={() => {
                      let saveSongObject = {
                        song_uri: uri,
                        song_name: songTitle,
                        song_image: pic,
                        artist_name: artist,
                        album_name: albumTitle,
                        chat_id: key,
                        type: 'chat',
                        isrc_code: isrc,
                        original_song_uri: originalUri,
                        original_reg_type: registerType,
                      };

                      props.saveSongReq(saveSongObject);
                    }}>
                    <Image
                      source={ImagePath.boxicon}
                      style={{ height: normalise(20), width: normalise(20) }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: normalise(40),
                      width: normalise(30),
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: normalise(15),
                      // backgroundColor: Colors.fadeblack,
                      borderRadius: normalise(5),
                    }}
                    onPress={() => {
                      props.navigation.navigate('PlayerScreenSelectUser', {
                        item: {
                          _id: id,
                          song_uri: uri,
                          song_name: songTitle,
                          song_image: pic,
                          artist_name: artist,
                          album_name: albumTitle,
                          post_id: id,
                          chat_id: key,
                          type: comingFromMessage ? 'chat' : null,
                          isrc_code: isrc,
                          original_song_uri: originalUri,
                          register_type: registerType,
                        },
                        fromPlayer: true,
                        fromHome: true,
                      });
                    }}>
                    <Image
                      source={ImagePath.sendicon}
                      style={{ height: normalise(20), width: normalise(20) }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {props.route.params.showPlaylist === false ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        if (props.userProfileResp.register_type === 'spotify') {
                          props.navigation.navigate('AddToPlayListScreen', {
                            originalUri: originalUri,
                            registerType: registerType,
                            isrc: isrc,
                          });
                        }
                        // toast("Oops", "Only, Spotify users can add to their playlist now.")
                        else {
                          props.navigation.navigate('AddToPlayListScreen', {
                            isrc: isrc,
                          });
                        }
                      }}
                      style={{
                        marginRight: normalise(15),

                        flexDirection: 'row',
                        height: normalise(40),
                        // width: normalise(160),
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // marginTop: normalise(10),
                        // backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(10),
                      }}>
                      <Image
                        source={ImagePath.add_white}
                        style={{
                          height: normalise(18),
                          width: normalise(18),
                          borderRadius: normalise(18),
                          opacity: 0.8,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      height: normalise(40),
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      borderRadius: normalise(10),
                    }}
                    onPress={() => {
                      props.navigation.navigate('PlayerComment', {
                        index: 0,
                        id: id,
                        commentData: commentData,
                        songTitle: songTitle,
                        artist: artist,
                        username: username,
                        receiverId: receiverId,
                        senderId: senderId,
                        pic: pic,
                        key: key,
                        chatToken: chatToken,
                        comingFromMessage: comingFromMessage,
                        time: props.route.params.time,
                        onSelect: (data, comment) =>
                          _onSelectBack(data, comment),
                      });
                    }}>
                    <Image
                      source={ImagePath.comment_grey}
                      style={{ height: normalise(22), width: normalise(22) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: normalise(15),
                        color: Colors.white,
                        marginLeft: normalise(4),
                        fontFamily: 'ProximaNova-Bold',
                      }}>
                      {arrayLength}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            <View>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: normalise(20),
                }}
                onPress={() => {
                  //FOR SPOTIFY USERS
                  if (props.userProfileResp.register_type === 'spotify') {
                    if (props.userProfileResp.register_type === registerType) {
                      Linking.canOpenURL(originalUri)
                        .then(supported => {
                          if (supported) {
                            Linking.openURL(originalUri)
                              .then(() => { })
                              .catch(err => { });
                          }
                        })
                        .catch(err => { });
                    } else {
                      isInternetConnected()
                        .then(() => {
                          openInAppleORSpotify();
                        })
                        .catch(() => {
                          toast('', 'Please Connect To Internet');
                        });
                    }
                  }
                  //FOR APPLE USERS
                  else {
                    if (props.userProfileResp.register_type === registerType) {
                      Linking.canOpenURL(originalUri)
                        .then(supported => {
                          if (supported) {
                            Linking.openURL(originalUri)
                              .then(() => { })
                              .catch(err => { });
                          }
                        })
                        .catch(err => { });
                    } else {
                      isInternetConnected()
                        .then(() => {
                          openInAppleORSpotify();
                        })
                        .catch(() => {
                          toast('', 'Please Connect To Internet');
                        });
                    }
                  }
                }}>
                <Image
                  source={
                    props.userProfileResp.register_type === 'spotify'
                      ? ImagePath.playSpotify
                      : ImagePath.playApple
                  }
                  style={{
                    height: normalise(40),
                    width: 2 * normalise(80),
                    borderRadius: normalise(18),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {RbSheet()}
            {modalVisible && (
              <MoreModal
                setBool={setBool}
                bottomSheetRef={bottomSheetRef}
                chatId={key}
                index={0}
                navigation={props.navigation}
                openInAppleORSpotify={openInAppleORSpotify}
                page={'player'}
                postData={[
                  {
                    _id: id,
                    song_uri: uri,
                    song_name: songTitle,
                    song_image: pic,
                    artist_name: artist,
                    album_name: albumTitle,
                    post_id: id,
                    chat_id: key,
                    type: comingFromMessage ? 'chat' : null,
                    isrc_code: isrc,
                    original_song_uri: originalUri,
                    register_type: registerType,
                  },
                ]}
                show={modalVisible}
                setShow={setModalVisible}
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    postData: state.UserReducer.postData,
    regType: state.TokenReducer.registerType,
    commentResp: state.UserReducer.commentResp,
    userProfileResp: state.UserReducer.userProfileResp,
    songStatus: state.SongReducer.status,
    savedSongResponse: state.SongReducer.savedSongResponse,
    playingSongRef: state.SongReducer.playingSongRef,
    currentPlayerPositionResponse:
      state.PlayerReducer.currentPlayerPositionResponse,
    playerStatus: state.PlayerReducer.status,
    playerError: state.PlayerReducer.error,
    seekToPlayerResponse: state.PlayerReducer.seekToPlayerResponse,
    isrcResp: state.PlayerReducer.getSongFromISRC,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
    messageStatus: state.MessageReducer.status,
    header: state.TokenReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentOnPost: payload => {
      dispatch(commentOnPostReq(payload));
    },

    saveSongReq: payload => {
      dispatch(saveSongRequest(payload));
    },

    saveSongRefReq: object => {
      dispatch(saveSongRefReq(object));
    },

    getCurrentPlayerPostionAction: () => {
      dispatch(getCurrentPlayerPostionAction());
    },

    playerSeekToRequest: seekTo => {
      dispatch(playerSeekToRequest(seekTo));
    },

    playerResumeRequest: () => {
      dispatch(playerResumeRequest());
    },

    playerPauseRequest: () => {
      dispatch(playerPauseRequest());
    },

    getSongFromIsrc: (regType, isrc) => {
      dispatch(getSongFromisrc(regType, isrc));
    },

    updateMessageCommentRequest: payload => {
      dispatch(updateMessageCommentRequest(payload));
    },

    getusersFromHome: payload => {
      dispatch(getUsersFromHome(payload));
    },

    dummyRequest: () => {
      dispatch(dummyRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    marginBottom: normalise(10),
    height: normalise(250),
    width: '95%',
    backgroundColor: Colors.darkerblack,
    borderRadius: 20,
    padding: 20,
    paddingTop: normalise(20),
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },

  rbsheetInput: {
    width: '100%',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    maxHeight: 100,
    backgroundColor: Colors.darkerblack,
    borderColor: Colors.activityBorderColor,
    borderRadius: normaliseNew(24),
    borderWidth: normaliseNew(0.5),
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normaliseNew(14),
    paddingTop: normaliseNew(12),
    paddingBottom: normaliseNew(13),
    paddingEnd: normaliseNew(14),
    paddingStart: normaliseNew(16),
    marginHorizontal: 5,
    ///backgroundColor:"red"
  },
});
