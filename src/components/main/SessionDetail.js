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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Colors from '../../assests/Colors';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import HeaderComponent from '../../widgets/HeaderComponent';
import ImagePath from '../../assests/ImagePath';
import { useSelector, useDispatch } from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {
  //   clearSessionDetail,
  getSessionDetailRequest,
  startSessionJoinRequest,
  startSessionJoinRequestStatusIdle,
  startSessionLeftRequest,
} from '../../action/SessionAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import socketService from '../../utils/socket/socketService';
import TrackPlayer from 'react-native-track-player';
import {
  CREATE_SESSION_DETAIL_FAILURE,
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
} from '@lomray/react-native-apple-music';
import { usePlayFullAppleMusic } from '../../hooks/usePlayFullAppleMusic';
import { useSessionHosting } from '../../hooks/useSessionHosting';
import { useFocusEffect } from '@react-navigation/native';

function SessionDetail(props) {
  const [status, setStatus] = useState('');
  const touchable = useRef();
  const [showPopover, setShowPopover] = useState(false);
  const [playerAcceptedSongs, setPlayerAcceptedSongs] = useState([]);
  const [currentListners, setCurrentListeners] = useState([]);
  const { width } = useWindowDimensions();

  // Redux state ++++++++++++++++++++++++++++++++++++++++++++
  const dispatch = useDispatch();
  const userProfileResp = useSelector(
    state => state.UserReducer.userProfileResp,
  );
  const userTokenData = useSelector(state => state.TokenReducer);
  const sessionReduxData = useSelector(state => state.SessionReducer);
  const sessionDetailReduxdata =
    sessionReduxData?.sessionDetailData?.data ?? {};

  // console.log(sessionDetailReduxdata, 'thshfdfhffsfdh');


  // console.log(sessionDetailReduxdata, 'thi is the session id>>');

  const {
    progress,
    resetProgress,
  } = useMusicPlayer();

  const { isAuthorizeToAccessAppleMusic, haveAppleMusicSubscription } =
    useContext(AppleMusicContext);
  const { isHost, isJoinee, currentSyncStatus } = useSessionHosting({ enablePlaybackSync: true });
  const currentState = currentSyncStatus;

  const activeSong = useMemo(() => {
    const songs = sessionDetailReduxdata?.session_songs || [];
    const currentIndex = currentState?.playIndex;
    if (currentIndex !== null && currentIndex !== undefined && currentIndex >= 0 && currentIndex < songs.length) {
      return songs[currentIndex];
    }
    return null;
  }, [currentState, sessionDetailReduxdata?.session_songs]);

  useEffect(() => {
    if (currentState) {
      console.log('📡 [SessionDetail Sync] Current State Received:', {
        playIndex: currentState.playIndex,
        isPlaying: currentState.startAudioMixing,
        currentTime: currentState.currentTime,
      });
    }
  }, [currentState]);

  const handleListerUserStatus = useCallback(res => {

    console.log('✅ [Joinee Sync] Success: Received data from Host:>>>>>', res);
    if (res?.isLive === false) {
      dispatch({
        type: START_SESSION_JOINEE_STOP_HOST,
        data: { data: { ...res } },
      });
    }
  }, [dispatch]);

  const { setPlaybackQueue, resetPlaybackQueue } =
    usePlayFullAppleMusic();

  const handleAddTrack = async (forcedIndex = null) => {
    try {
      const songs = sessionDetailReduxdata?.session_songs || [];
      const currentIndex = forcedIndex !== null ? forcedIndex : currentState?.playIndex;

      if (
        currentIndex === null ||
        currentIndex === undefined
      ) {
        return;
      }
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
        setPlayerAcceptedSongs(newArray);
        await resetPlaybackQueue();
        resetProgress();

        await setPlaybackQueue(songs[currentIndex]?.apple_song_id);

        // For host, selecting a track should always start playback
        if (isHost || currentState?.startAudioMixing) {
          Player.play();
        } else {
          Player.pause();
        }
      } else {
        await TrackPlayer.reset();
        const track = {
          id: songs[currentIndex]._id,
          url: songs[currentIndex].song_uri,
          title: songs[currentIndex].song_name,
          artist: songs[currentIndex].artist_name,
          artwork: songs[currentIndex].song_image,
        };
        await TrackPlayer.add([track]);

        if (currentState?.currentTime) {
          await TrackPlayer.seekTo(currentState.currentTime);
        }

        if (isHost || currentState?.startAudioMixing) {
          await TrackPlayer.play();
        } else {
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
        // dispatch(clearSessionDetail());
      };
    }, []),
  );

  useEffect(() => {
    if (!checkIsAppleStatus) {
      async function setupPlayer() {
        await TrackPlayer.setupPlayer();
      }
      setupPlayer();
    }
  }, [checkIsAppleStatus]);

  useEffect(() => {
    checkProgressGap();
  }, [currentState, isJoinee, isHost, checkProgressGap]);

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
        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet');
          // if (props.route.params?.fromScreen) {
          //   props.navigation.setParams({
          //     fromScreen: undefined,
          //   });
          // }
        });
    }
  }, [props?.route?.params?.sessionId]);

  useEffect(() => {
    if (sessionDetailReduxdata?.users) {
      checkUserExistence();
    }
    if (sessionDetailReduxdata?.watch_users?.length > 0) {
      setCurrentListeners(sessionDetailReduxdata?.watch_users);
    }
  }, [sessionDetailReduxdata]);

  // TO CONNECT WITH SOCKET
  useEffect(
    () => {

      const setupSocket = async () => {
        try {
          // Only initialize if not  connected
          if (!socketService.isConnected() && userTokenData?.token) {
            await socketService.initializeSocket(userTokenData?.token);
            console.log('Socket connected on listern side');
          }
          socketService.on('session_ended_status', handleListerUserStatus);
          socketService.on('session_users_status', data => {
            console.log('Got session_users_status in this file:', data);
            setCurrentListeners(data);
          });
        } catch (error) {
          console.error('Socket setup error:', error);
        }
      };

      setupSocket();
      return () => {
        socketService.off('session_ended_status', handleListerUserStatus);
        socketService.off('session_users_status');
      };
    },

    [userTokenData?.token, sessionDetailReduxdata?._id, handleListerUserStatus],
  );

  useEffect(() => {
    handleNavigation();
  }, [sessionReduxData.status]);

  // console.log(props.route.params?.fromScreen, 'this is the route h')

  useEffect(() => {
    if (
      props.route.params.fromScreen === 'notificionScreen' &&
      Object.keys(sessionDetailReduxdata).length > 0
    ) {
      // setTimeout(() => {
      // handleJoinLeaveSession();
      // }, 1000);
      // Alert.alert('hi')
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
        dispatch(startSessionJoinRequest(requestObj));
        if (props.route.params?.fromScreen) {
          props.navigation.setParams({
            fromScreen: undefined,
          });
        }
      }
    }
  }, [sessionDetailReduxdata]);

  useEffect(() => {
    if (!sessionDetailReduxdata?.isLive) {
      setCurrentListeners([]);
    }
  }, [sessionDetailReduxdata?.isLive]);

  //helperss***********************************************************************************



  const handleSessionLeftOverCancel = (type, messageText) => {
    setStatus(type);
    if (checkIsAppleStatus) {
      resetPlaybackQueue();
      resetProgress();
    } else {
      TrackPlayer.reset();
    }
    // currentEmitedSongStatus.current = {
    //   hostId: null,
    //   startAudioMixing: null,
    //   playIndex: null,
    //   playLoading: null,
    //   currentTime: null,
    //   startedAt: null,
    //   pausedAt: null,
    // };
    setTimeout(() => {
      toast('Success', `${messageText}`);
      dispatch(startSessionJoinRequestStatusIdle({ status: '', error: {} }));
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
              startSessionJoinRequestStatusIdle({ status: '', error: {} }),
            );
          }, 300);
          break;
        case START_SESSION_LEFT_SUCCESS:
          handleSessionLeftOverCancel(
            START_SESSION_LEFT_SUCCESS,
            'Session left succssfully',
          );
          if (checkIsAppleStatus) {
            (async () => {
              await resetPlaybackQueue();
              resetProgress();
            })();
          }
          // if (props.route.params?.fromScreen) {
          //   props.navigation.setParams({
          //     fromScreen: undefined,
          //   });
          // }
          break;
        case START_SESSION_JOINEE_STOP_HOST:
          handleSessionLeftOverCancel(
            START_SESSION_JOINEE_STOP_HOST,
            'Session has been closed by the host',
          );
          if (checkIsAppleStatus) {
            (async () => {
              await resetPlaybackQueue();
              resetProgress();
            })();
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
              startSessionJoinRequestStatusIdle({ status: '', error: {} }),
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
    }
    return false;
  }, [sessionDetailReduxdata?.users, userProfileResp?._id]);


  const handleJoinLeaveSession = () => {
    // if (
    //   sessionDetailReduxdata?.sessionRegisterType === 'apple' &&
    //   !checkIsAppleStatus
    // ) {
    //   Alert.alert(
    //     "You don't have apple music subscription, To join the session Apple music subscription is required!",
    //   );
    //   return;
    // } 
    // else {
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
    // }
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
    <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
      <Loader
        visible={sessionReduxData?.loading || sessionReduxData?.isRequestLoader}
      />
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={Colors.darkerblack} />
      )}
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={
            isHost
              ? false
              : true
          }
          textone={
            isHost
              ? null
              : 'BACK'
          }
          imageone={
            isHost
              ? ImagePath.crossIcon
              : null
          }
          imageOneRef={
            isHost
              ? touchable
              : null
          }
          title={'SESSIONS'}
          thirditemtext={
            sessionDetailReduxdata?.isLive || checkUserExistence()
              ? true
              : false
          }
          texttwo={
            checkUserExistence()
              ? 'LEAVE'
              : !isHost && sessionDetailReduxdata?.isLive
                ? 'JOIN'
                : ''
          }
          imagetwo={
            sessionDetailReduxdata?.isPrivate ||
              (sessionDetailReduxdata?.isLive && checkUserExistence()) ||
              (!isHost && sessionDetailReduxdata?.isLive)
              ? null
              : ImagePath.addButtonSmall
          }
          imagetwoStyle={styles.imageTwoStyle}
          onPressFirstItem={() => {
            isHost
              ? setShowPopover(true)
              : props.navigation.goBack();
          }}
          onPressThirdItem={
            sessionDetailReduxdata?.isPrivate
              ? () => null
              : handleJoinLeaveSession
          }
          hideBorderBottom={false}
          titleStyle={{ fontFamily: 'ProximaNova-Semibold' }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2.5 }}>
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
                  activeSong?.song_image
                    ? { uri: activeSong.song_image }
                    : sessionDetailReduxdata?.own_user?.profile_image
                      ? {
                        uri:
                          constants.profile_picture_base_url +
                          sessionDetailReduxdata?.own_user?.profile_image,
                      }
                      : ImagePath.userPlaceholder
                }
                style={[
                  styles.listItemHeaderSongTypeIcon,
                  activeSong && { borderRadius: normalise(8) }
                ]}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.listItemHeaderSongTextTitle,
                  {
                    marginTop: normalise(8),
                    fontFamily: 'ProximaNova-Bold',
                    fontWeight: '400',
                    textAlign: 'center',
                  },
                ]}
                numberOfLines={2}>
                {activeSong ? `${activeSong.song_name}\n${activeSong.artist_name}` : 'NOW PLAYING'}
              </Text>
              <View style={[styles.bottomLineStyle, { width: '35%' }]}></View>
            </View>
            <View style={styles.playListItemContainer}>
              <FlatList
                data={sessionDetailReduxdata?.session_songs}
                extraData={currentState}
                renderItem={({ item, index }) => {
                  let isPlayingCurrent =
                    currentState?.playIndex === index;
                  return (
                    <View
                      style={[
                        styles.itemWrapper,
                        // isPlayingCurrent &&
                        //   currentEmitedSongStatus?.current
                        //     ?.startAudioMixing && {opacity: 1},
                        isPlayingCurrent && { opacity: 1 },
                      ]}>
                      {sessionDetailReduxdata?.isLive ? (
                        isPlayingCurrent ? (
                          <TouchableOpacity
                            disabled={true}
                            onPress={() => { }}
                            style={styles.playButtonStyle}>
                            <Image
                              source={
                                isPlayingCurrent &&
                                  currentState?.startAudioMixing
                                  ? ImagePath.pause
                                  : ImagePath.play
                              }
                              style={{
                                height: normalise(25),
                                width: normalise(25),
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        ) : isHost ? (
                          <TouchableOpacity
                            onPress={() => handleAddTrack(index)}
                            style={styles.playButtonStyle}>
                            <Image
                              source={ImagePath.play}
                              style={{
                                height: normalise(25),
                                width: normalise(25),
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.playButtonStyle}></View>
                        )
                      ) : index === 0 ? (
                        <TouchableOpacity
                          disabled={true}
                          style={styles.playButtonStyle}>
                          <Image
                            source={ImagePath.playCenter}
                            style={{
                              height: normalise(14),
                              width: normalise(14),
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.playButtonStyle}></View>
                      )}
                      <Image
                        source={{ uri: item?.song_image }}
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
          <View style={styles.listenersContainer}>
            <View style={styles.listenersTextWrapper}>
              <Text
                style={[
                  styles.listItemHeaderSongTextTitle,
                  { marginTop: normalise(5), fontSize: normalise(12) },
                ]}
                numberOfLines={2}>
                LISTENERS
              </Text>
            </View>
            <View
              style={[
                styles.bottomLineStyle,
                {
                  width: width / 3.8,
                  marginBottom: normalise(8),
                  marginTop: normalise(0),
                },
              ]}></View>
            <ScrollView style={{ flex: 1 }}>
              {currentListners?.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}>
                  {currentListners?.map((item, index) => {
                    return (
                      <View style={[styles.joineeIitemWrapper]}>
                        <Image
                          source={
                            item?.profile_image
                              ? {
                                uri:
                                  constants.profile_picture_base_url +
                                  item?.profile_image,
                              }
                              : ImagePath.userPlaceholder
                          }
                          style={[styles.songListItemImage]}
                          resizeMode="cover"
                        />
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.noJoineeText}>
                    No listeners available
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
        {/* <TrackProgress
          setModalVisible={() => null}
          modalVisible={false}
          duration={appleFullSongDuration}
          position={progress}
          isShow={false}
        /> */}
        <Popover
          from={touchable}
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}>
          <View style={{}}>
            <Text style={[styles.confrimationText, { width: '100%' }]}>
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
    width: normalise(45),
    height: normalise(45),
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
  noJoineeText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
    textAlign: 'center',
    marginTop: '20%',
  },
});

export default SessionDetail;
