import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../assests/Colors';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import HeaderComponent from '../../widgets/HeaderComponent';
import ImagePath from '../../assests/ImagePath';
import {useSelector, useDispatch} from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {
  clearSessionDetail,
  getSessionDetailRequest,
  startSessionJoinRequest,
  startSessionJoinRequestStatusIdle,
  startSessionLeftRequest,
} from '../../action/SessionAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import socketService from '../../utils/socket/socketService';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {
  CREATE_SESSION_DETAIL_FAILURE,
  CREATE_SESSION_DETAIL_SUCCESS,
  START_SESSION_JOINEE_FAILURE,
  START_SESSION_JOINEE_STOP_HOST,
  START_SESSION_LEFT_SUCCESS,
} from '../../action/TypeConstants';
import toast from '../../utils/helpers/ShowErrorAlert';
import Popover from 'react-native-popover-view';
import {
  AppleMusicContext,
  useMusicPlayer,
} from '../../context/AppleMusicContext';
import {
  MusicKit,
  Player,
  useCurrentSong,
  useIsPlaying,
} from '@lomray/react-native-apple-music';
import {usePlayFullAppleMusic} from '../../hooks/usePlayFullAppleMusic';
import {TrackProgress} from '../common/Progress';
import {useFocusEffect} from '@react-navigation/native';

function SessionDetail(props) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentState, setCurrentStatus] = useState(null);
  const [status, setStatus] = useState('');
  const touchable = useRef();
  const [showPopover, setShowPopover] = useState(false);
  const [playerAcceptedSongs, setPlayerAcceptedSongs] = useState([]);

  // Redux state ++++++++++++++++++++++++++++++++++++++++++++
  const dispatch = useDispatch();
  const userProfileResp = useSelector(
    state => state.UserReducer.userProfileResp,
  );
  const userTokenData = useSelector(state => state.TokenReducer);
  const sessionReduxData = useSelector(state => state.SessionReducer);
  const sessionDetailReduxdata =
    sessionReduxData?.sessionDetailData?.data ?? {};
  const sessionDataForJoineeAfterJoin =
    sessionReduxData.CurrentSessionJoineeInfo?.data;

  const currentEmitedSongStatus = useRef({
    hostId: null,
    startAudioMixing: null,
    playIndex: null,
    playLoading: null,
    currentTime: null,
    startedAt: null,
    pausedAt: null,
  });

  const {
    progress,
    duration: appleFullSongDuration,
    resetProgress,
  } = useMusicPlayer();

  const {isAuthorizeToAccessAppleMusic, haveAppleMusicSubscription} =
    useContext(AppleMusicContext);
  const {isPlaying: appleFullSongPlaying} = useIsPlaying();
  const {song: currentSongData} = useCurrentSong();
  const {onToggle, checkPlaybackState, setPlaybackQueue, resetPlaybackQueue} =
    usePlayFullAppleMusic();

  const handleAddTrack = async () => {
    try {
      if (
        !currentState ||
        currentState.playIndex === null ||
        currentState.playIndex === undefined
      ) {
        return;
      }
      const songs = sessionDetailReduxdata?.session_songs || [];
      const currentIndex = currentState.playIndex;
      // Check if index is valid
      if (currentIndex >= songs?.length || currentIndex < 0) {
        console.error('Invalid play index:', currentIndex);
        return;
      }

      if (checkIsAppleStatus) {
        const getTrackRelatedSong = () => {
          return songs.map(item => item?.apple_song_id ?? '');
        };
        const newArray = getTrackRelatedSong();
        console.log(newArray, 'this is song arrau');
        setPlayerAcceptedSongs(newArray);
        await resetPlaybackQueue();
        resetProgress(); // ADDED TO RESET THE TIME TO 0
        await setPlaybackQueue(songs[currentIndex]?.apple_song_id);
        // Control playback state
        // MusicKit.setPlaybackQueueList(newArray ?? [], 'song');
        if (currentState.startAudioMixing) {
          Player.play();
        } else {
          Player.pause();
        }
      } else {
        // Clear previous tracks and stop playback
        await TrackPlayer.reset();
        const track = {
          id: songs[currentIndex]._id,
          url: songs[currentIndex].song_uri,
          title: songs[currentIndex].song_name,
          artist: songs[currentIndex].artist_name,
          artwork: songs[currentIndex].song_image,
        };
        console.log('Adding new track:', track);
        // Add and prepare the new track
        await TrackPlayer.add([track]);
        // Seek to the correct position if available
        if (currentState.currentTime) {
          await TrackPlayer.seekTo(currentState.currentTime);
        }
        // Control playback state
        if (currentState.startAudioMixing) {
          // Alert.alert('play');
          await TrackPlayer.play();
        } else {
          // Alert.alert('pause');
          await TrackPlayer.pause();
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // This will run when the screen is focused
      return () => {
        dispatch(clearSessionDetail());
      };
    }, []),
  );

  useEffect(() => {
    if (!checkIsAppleStatus) {
      async function setupPlayer() {
        await TrackPlayer.setupPlayer();
      }

      setupPlayer();
      // Cleanup the player on unmount
      // return () => {
      //     TrackPlayer.destroy();
      // };
    }
  }, []);
  const previousIndexRef = useRef(null);

  useEffect(() => {
    if (
      currentState?.playIndex !== undefined &&
      currentState?.playIndex !== null &&
      currentState?.playIndex !== previousIndexRef.current
    ) {
      console.log(
        'Index changed from',
        // previousIndexRef.current,
        'to',
        // currentState.playIndex,
        currentState?.startAudioMixing,
      );
      handleAddTrack();
      // Update the ref with the new value
      previousIndexRef.current = currentState.playIndex;
    }
    if (currentEmitedSongStatus?.current?.startAudioMixing == false) {
      if (checkIsAppleStatus) {
        Player.pause();
      } else {
        TrackPlayer.stop();
      }
    }
    if (currentEmitedSongStatus?.current?.startAudioMixing == true) {
      if (checkIsAppleStatus) {
        Player.play();
      } else {
        TrackPlayer.play();
      }
    }
    checkProgressGap();
    // console.log(
    //   currentEmitedSongStatus?.current?.startAudioMixing,
    //   'its audio mising',
    // );
  }, [currentState]);

  useEffect(() => {
    if (props?.route?.params?.sessionId) {
      isInternetConnected()
        .then(() => {
          console.log(
            props?.route?.params?.sessionId,
            'it this is the session it>>>',
          );
          // return;
          dispatch(
            getSessionDetailRequest({
              sessionId: props?.route?.params?.sessionId,
            }),
          );
          if (props.route.params?.fromScreen) {
            props.navigation.setParams({
              fromScreen: undefined,
              sessionId: null,
            });
          }
        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet');
          if (props.route.params?.fromScreen) {
            props.navigation.setParams({
              fromScreen: undefined,
              sessionId: null,
            });
          }
        });
    }
  }, [props?.route?.params?.sessionId]);

  useEffect(() => {
    // if (sessionReduxData?.hasLeftSession) {
    //     // Alert.alert(sessionReduxData?.hasLeftSession?.toString())
    //     // props.navigation.goBack()
    // }
    if (sessionDetailReduxdata?.users) {
      const isUserExist = checkUserExistence();
      // Alert.alert(isUserExist.toString())
    }
  }, [sessionDetailReduxdata]);

  // TO CONNECT WITH SOCKET
  useEffect(
    () => {
      let socketInitialized = false;
      const handleStatusUpdate = status => {
        console.log('Received update:', status);
        // update state
        currentEmitedSongStatus.current = status;
        setCurrentStatus(status);
      };

      const setupSocket = async () => {
        try {
          // Only initialize if not  connected
          if (!socketService.isConnected() && userTokenData?.token) {
            await socketService.initializeSocket(userTokenData?.token);
            socketInitialized = true;
            console.log('Socket connected on listern side');
          }
          socketService.on('session_play_status', handleStatusUpdate);
          socketService.on('session_ended_status', handleListerUserStatus);
          // }
        } catch (err) {
          console.error('Socket setup error:', err);
        }
      };

      setupSocket();

      return () => {
        // Clean up listener
        // socketService.off('session_play_status', handleStatusUpdate);
        // socketService.emit('leave_session_room', {
        //     sessionId: sessionDetailReduxdata?._id
        // });
        // if (socketInitialized) {
        //     socketService.disconnect();
        // }
      };
    },

    [
      // sessionDetailReduxdata?._id,
      // userTokenData?.token
    ],
  );

  useEffect(() => {
    handleNavigation();
  }, [sessionReduxData.status]);

  useEffect(() => {
    if (
      props.route.params.fromScreen == 'notificionScreen' &&
      Object.keys(sessionDetailReduxdata).length > 0
    ) {
      setTimeout(() => {
        handleJoinLeaveSession();
      }, 1000);
      // Alert.alert('hi')
    }
  }, [props.route.params.fromScreen, sessionDetailReduxdata]);

  //helperss***********************************************************************************

  const handleListerUserStatus = res => {
    if (res?.isLive == false) {
      dispatch({
        type: START_SESSION_JOINEE_STOP_HOST,
        data: {data: {...res}},
      });
      // toast(
      //   'Success',
      //   'Session has been stopped by the host',
      //   ToastAndroid.SHORT,
      // );
    }
  };

  const handleSessionLeftOverCancel = (type, messageText) => {
    setStatus(type);
    if (checkIsAppleStatus) {
      resetPlaybackQueue();
      resetProgress();
    } else {
      TrackPlayer.reset();
    }
    currentEmitedSongStatus.current = {
      hostId: null,
      startAudioMixing: null,
      playIndex: null,
      playLoading: null,
      currentTime: null,
      startedAt: null,
      pausedAt: null,
    };
    setTimeout(() => {
      toast('Success', `${messageText}`);
      dispatch(startSessionJoinRequestStatusIdle({status: '', error: {}}));
      props.navigation.goBack();
    }, 800);
  };

  const handleNavigation = () => {
    if (status === '' || status !== sessionReduxData.status) {
      console.log(
        sessionReduxData?.error,
        sessionReduxData.status,
        'its error jfdkfjdfkh',
      );
      switch (sessionReduxData.status) {
        case START_SESSION_JOINEE_FAILURE:
          setStatus(START_SESSION_JOINEE_FAILURE);
          // Alert.alert(sessionReduxData?.error?.message);
          toast(
            'Error',
            sessionReduxData?.error?.message ??
              'Something Went Wrong, Please Try Again',
          );
          setTimeout(() => {
            dispatch(
              startSessionJoinRequestStatusIdle({status: '', error: {}}),
            );
          }, 300);
          break;
        case START_SESSION_LEFT_SUCCESS:
          handleSessionLeftOverCancel(
            START_SESSION_LEFT_SUCCESS,
            'Session left succssfully',
          );
          if (checkIsAppleStatus) {
            resetPlaybackQueue();
            resetProgress();
          }
          break;
        case START_SESSION_JOINEE_STOP_HOST:
          handleSessionLeftOverCancel(
            START_SESSION_JOINEE_STOP_HOST,
            'Session has been closed by the host',
          );
          if (checkIsAppleStatus) {
            resetPlaybackQueue();
            resetProgress();
          }
          break;

        case CREATE_SESSION_DETAIL_FAILURE:
          handleSessionLeftOverCancel(
            CREATE_SESSION_DETAIL_FAILURE,
            sessionReduxData?.error?.message ??
              'Something Went Wrong, Please Try Again',
          );
          setTimeout(() => {
            dispatch(
              startSessionJoinRequestStatusIdle({status: '', error: {}}),
            );
          }, 300);
          break;
        // case CREATE_SESSION_DETAIL_SUCCESS:
        //   Alert.alert('join sesssion request form notifi');
        //   if (
        //     props.route.params.fromScreen == 'notificionScreen' &&
        //     sessionDetailReduxdata &&
        //     sessionReduxData?.loading
        //   ) {
        //     // handleJoinLeaveSession()
        //     Alert.alert('join sesssion request form notifi');
        //   }
        //   setTimeout(() => {
        //     dispatch(
        //       startSessionJoinRequestStatusIdle({status: '', error: {}}),
        //     );
        //   }, 300);
        //   break;
        default:
          setStatus('');
          break;
      }
    }
  };

  const checkUserExistence = useCallback(() => {
    if (sessionDetailReduxdata?.users) {
      return sessionDetailReduxdata?.users?.some(
        user => user._id === userProfileResp?._id,
      );
    } else {
      false;
    }
  }, [sessionDetailReduxdata?.users]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.state == State.nextTrack) {
      let index = await TrackPlayer.getCurrentTrack();
      setCurrentTrack(index);
    } else {
    }
  });

  const handleJoinLeaveSession = () => {
    if (
      sessionDetailReduxdata?.sessionRegisterType === 'apple' &&
      !checkIsAppleStatus
    ) {
      Alert.alert(
        "You don't have apple music subscription, To join the session Apple music subscription is required!",
      );
      return;
    } else {
      const requestObj = {
        id:
          props.route.params.fromScreen == 'notificionScreen'
            ? props.route.params?.sessionId
            : sessionDetailReduxdata?._id,
        user_id: userProfileResp?._id,
      };
      console.log(requestObj, 'thi is  the request object');
      if (sessionDetailReduxdata?.isLive && checkUserExistence()) {
        dispatch(startSessionLeftRequest(requestObj));
      } else {
        dispatch(startSessionJoinRequest(requestObj));
      }
    }
  };

  // TO CHECK THAT USER APPLE STATUS
  const checkIsAppleStatus = useMemo(() => {
    if (
      Platform.OS == 'ios' &&
      isAuthorizeToAccessAppleMusic &&
      haveAppleMusicSubscription &&
      userTokenData?.registerType == 'apple'
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    isAuthorizeToAccessAppleMusic,
    haveAppleMusicSubscription,
    userTokenData?.registerType,
  ]);

  const checkProgressGap = useCallback(() => {
    if (currentState?.currentTime - progress > 10) {
      MusicKit.seekToTime(currentState?.currentTime);
    }
  }, [progress, currentState]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      <Loader
        visible={sessionReduxData?.loading || sessionReduxData?.isRequestLoader}
      />
      {Platform.OS == 'android' && (
        <StatusBar backgroundColor={Colors.darkerblack} />
      )}
      <SafeAreaView style={{flex: 1}}>
        <HeaderComponent
          firstitemtext={
            sessionDetailReduxdata?.isLive && checkUserExistence()
              ? false
              : true
          }
          textone={
            sessionDetailReduxdata?.isLive && checkUserExistence()
              ? null
              : 'BACK'
          }
          imageone={
            sessionDetailReduxdata?.isLive && checkUserExistence()
              ? ImagePath.crossIcon
              : null
          }
          imageOneRef={
            sessionDetailReduxdata?.isLive && checkUserExistence()
              ? touchable
              : null
          }
          title={'SESSIONS'}
          thirditemtext={
            sessionDetailReduxdata?.isLive && checkUserExistence()
              ? true
              : false
          }
          imagetwo={
            sessionDetailReduxdata?.isPrivate ||
            (sessionDetailReduxdata?.isLive && checkUserExistence())
              ? null
              : ImagePath.addButtonSmall
          }
          imagetwoStyle={styles.imageTwoStyle}
          onPressFirstItem={() => {
            sessionDetailReduxdata?.isLive && checkUserExistence()
              ? // handleJoinLeaveSession()
                setShowPopover(true)
              : props.navigation.goBack();
          }}
          onPressThirdItem={
            sessionDetailReduxdata?.isPrivate ||
            (sessionDetailReduxdata?.isLive && checkUserExistence())
              ? () => null
              : handleJoinLeaveSession
          }
        />
        <View style={{flex: 1}}>
          <View style={{flex: 2.5}}>
            <View style={styles.listItemHeaderSongDetails}>
              <View style={styles.nameWrapper}>
                <Text
                  style={[
                    styles.listItemHeaderSongTextTitle,
                    {
                      textTransform: 'uppercase',
                      marginBottom: 0,
                      fontFamily: 'ProximaNova-Bold',
                      paddingHorizontal: normalise(20),
                    },
                  ]}
                  numberOfLines={1}>
                  {sessionDetailReduxdata?.own_user?.username}
                </Text>
              </View>
              <Image
                source={
                  sessionDetailReduxdata?.own_user?.profile_image
                    ? {
                        uri:
                          constants.profile_picture_base_url +
                          sessionDetailReduxdata?.own_user?.profile_image,
                      }
                    : ImagePath.userPlaceholder
                }
                style={styles.listItemHeaderSongTypeIcon}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.listItemHeaderSongTextTitle,
                  {
                    marginTop: normalise(8),
                    fontFamily: 'ProximaNova-Bold',
                    fontWeight: '400',
                  },
                ]}
                numberOfLines={1}>
                NOW PLAYING
              </Text>
              <View style={[styles.bottomLineStyle, {width: '35%'}]}></View>
            </View>
            <View style={styles.playListItemContainer}>
              <FlatList
                data={sessionDetailReduxdata?.session_songs}
                renderItem={({item, index}) => {
                  let isPlayingCurrent =
                    currentEmitedSongStatus?.current?.playIndex == index;
                  return (
                    <View
                      style={[
                        styles.itemWrapper,
                        // isPlayingCurrent &&
                        //   currentEmitedSongStatus?.current
                        //     ?.startAudioMixing && {opacity: 1},
                        isPlayingCurrent && {opacity: 1},
                      ]}>
                      <TouchableOpacity
                        disabled={true}
                        onPress={() => {}}
                        style={styles.playButtonStyle}>
                        <Image
                          // source={playVisible ? ImagePath.play : ImagePath.pause}
                          source={
                            isPlayingCurrent &&
                            currentEmitedSongStatus?.current?.startAudioMixing
                              ? ImagePath.pause
                              : ImagePath.play
                          }
                          style={{height: normalise(25), width: normalise(25)}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Image
                        source={{uri: item?.song_image}}
                        style={styles.songListItemImage}
                        resizeMode="cover"
                      />
                      <View style={styles.listItemHeaderSongText}>
                        <Text
                          style={styles.songlistItemHeaderSongTextTitle}
                          numberOfLines={1}>
                          {item?.song_name}
                        </Text>
                        <Text
                          style={styles.songlistItemHeaderSongTextArtist}
                          numberOfLines={1}>
                          {item?.artist_name}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item?._id}
              />
            </View>
          </View>
        </View>
        <TrackProgress
          setModalVisible={() => null}
          modalVisible={false}
          duration={appleFullSongDuration}
          position={progress}
          isShow={false}
        />
        <Popover
          from={touchable}
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}>
          <View style={{}}>
            <Text style={[styles.confrimationText, {width: '100%'}]}>
              Are you sure, do you want to leave this session!
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                borderTopWidth: 1,
                borderTopColor: Colors.meta,
                marginVeTop: 10,
              }}>
              <TouchableOpacity
                style={styles.optionText}
                onPress={() => {
                  handleJoinLeaveSession();
                  setShowPopover(false);
                }}>
                <Text style={[styles.confrimationText]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionText}
                onPress={() => setShowPopover(false)}>
                <Text style={[styles.confrimationText]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Popover>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  playListItemContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: normalise(15),
    flex: 1,
  },

  itemWrapper: {
    flexDirection: 'row',
    marginBottom: normalise(6),
    flex: 1,
    alignItems: 'center',
    opacity: 0.5,
  },
  songListItemImage: {
    borderRadius: normalise(5),
    height: normalise(40),
    width: normalise(40),
  },

  imageTwoStyle: {
    height: normalise(18),
    width: normalise(18),
    transform: [
      {
        rotate: '-180deg',
      },
    ],
  },

  listItemHeaderSongDetails: {
    alignItems: 'center',
  },
  listItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(12),
    marginBottom: normalise(5),
    marginRight: normalise(5),
    fontWeight: '600',
  },

  listItemHeaderSongTypeIcon: {
    borderRadius: normalise(10),
    height: normalise(80),
    width: normalise(80),
    borderRadius: normalise(80),
    borderWidth: 0.5,
    borderColor: Colors.fordGray,
  },
  listItemHeaderSongText: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(10),
    width: '100%',
    height: '100%',
    borderBottomWidth: 0.4,
    borderBottomColor: Colors.meta,
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  songlistItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(12),
  },

  songlistItemHeaderSongTextArtist: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(11),
  },

  bottomLineStyle: {
    marginTop: normalise(0),
    backgroundColor: Colors.white,
    alignSelf: 'center',
    opacity: 0.7,
    height: 0.5,
  },

  nameWrapper: {
    flexDirection: 'row',
    marginTop: normalise(15),
    marginBottom: normalise(6),
    alignItems: 'center',
  },

  playButtonStyle: {
    width: normalise(40),
    height: normalise(40),
    justifyContent: 'center',
    alignItems: 'center',
  },

  //Footer listners styles
  listenersContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  joineeIitemWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    marginHorizontal: normalise(11),
    marginBottom: normalise(7),
  },
  confrimationText: {
    color: Colors.black,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
    textAlign: 'center',
    padding: 15,
    fontWeight: '600',
  },
  optionText: {
    borderEndWidth: 1,
    borderRightColor: Colors.meta,
    width: '50%',
  },
});

export default SessionDetail;
