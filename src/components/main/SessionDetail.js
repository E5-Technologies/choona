import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
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
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {
  getSessionDetailRequest,
  startSessionJoinRequest,
  startSessionLeftRequest,
} from '../../action/SessionAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import socketService from '../../utils/socket/socketService';
import {connect} from 'socket.io-client';
import {addTracks} from '../../hooks/useTrackPlayer';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';

function SessionDetail(props) {
  // console.log(props?.route?.params, 'these are params')
  // const { currentSession } = props?.route?.params
  // console.log(currentSession, 'its current sessionI')
  const {width, height} = useWindowDimensions();
  const [playVisible, setPlayVisible] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [playerState, setPlayerState] = useState({});
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentState, setCurrentStatus] = useState(null);

  // Redux state ++++++++++++++++++++++++++++++++++++++++++++
  const dispatch = useDispatch();
  const userProfileResp = useSelector(
    state => state.UserReducer.userProfileResp,
  );
  const userTokenData = useSelector(state => state.TokenReducer);
  const sessionReduxData = useSelector(state => state.SessionReducer);
  const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data;
  const sessionDataForJoineeAfterJoin =
    sessionReduxData.CurrentSessionJoineeInfo?.data;
  // console.log(sessionDataForJoineeAfterJoin, 'its session state');
  // console.log(sessionDetailReduxdata, 'its data of current session')
  const currentEmitedSongStatus = useRef({
    hostId: null,
    startAudioMixing: null,
    playIndex: null,
    playLoading: null,
    currentTime: null,
    startedAt: null,
    pausedAt: null,
  });

  // const handleAddTrack = async () => {
  //     if (currentEmitedSongStatus?.current && currentEmitedSongStatus?.current?.playIndex != null) {
  //         const getTrackRelatedSong = {
  //             id: sessionDetailReduxdata.session_songs[currentEmitedSongStatus?.current?.playIndex]._id,
  //             url: sessionDetailReduxdata.session_songs[currentEmitedSongStatus?.current?.playIndex].song_uri,
  //             title: sessionDetailReduxdata.session_songs[currentEmitedSongStatus?.current?.playIndex].song_name,
  //             artist: sessionDetailReduxdata.session_songs[currentEmitedSongStatus?.current?.playIndex].artist_name,
  //             artwork: sessionDetailReduxdata.session_songs[currentEmitedSongStatus?.current?.playIndex].song_image,
  //         }
  //         console.log(getTrackRelatedSong, 'ite new aarary')
  //     };
  //     // startSessionAndPlay(getTrackRelatedSong());
  //     // setPlayerAcceptedSongs(newArray)
  //     await addTracks(getTrackRelatedSong)
  //     await TrackPlayer.play();
  // }

  // useEffect(() => {
  //     console.log(currentState, 'Hello this is')
  // }, [currentState])

  // Then modify your handleAddTrack
  // const handleAddTrack = async () => {
  //     try {
  //         if (!currentEmitedSongStatus?.current || currentEmitedSongStatus.current.playIndex == null) {
  //             return;
  //         }

  //         const songs = sessionDetailReduxdata?.session_songs || [];
  //         const currentIndex = currentEmitedSongStatus.current.playIndex;

  //         if (currentIndex >= songs?.length) {
  //             console.error('Invalid play index');
  //             return;
  //         }

  //         const track = {
  //             id: songs[currentIndex]._id,
  //             url: songs[currentIndex].song_uri,
  //             title: songs[currentIndex].song_name,
  //             artist: songs[currentIndex].artist_name,
  //             artwork: songs[currentIndex].song_image,
  //         };
  //         console.log(track, 'its track')
  //         // Clear previous tracks
  //         // await TrackPlayer.reset();

  //         // Add new track (wrap in array)
  //         await TrackPlayer.add([track]);

  //         // Seek to correct position if needed
  //         if (currentEmitedSongStatus.current?.currentTime) {
  //             await TrackPlayer.seekTo(currentEmitedSongStatus.current?.currentTime);
  //         }

  //         // Start playback
  //         if (currentEmitedSongStatus.current?.startAudioMixing) {

  //             await TrackPlayer.play();
  //         }
  //         else {
  //             await TrackPlayer.pause();

  //         }
  //     } catch (error) {
  //         console.error('Playback error:', error);
  //     }
  // };

  // const handleAddTrack = async () => {
  //     try {
  //         if (currentState==null) {
  //             return;
  //         }

  //         const songs = sessionDetailReduxdata?.session_songs || [];
  //         const currentIndex = currentState?.playIndex;

  //         if (currentIndex >= songs?.length) {
  //             console.error('Invalid play index');
  //             return;
  //         }

  //         const track = {
  //             id: songs[currentIndex]._id,
  //             url: songs[currentIndex].song_uri,
  //             title: songs[currentIndex].song_name,
  //             artist: songs[currentIndex].artist_name,
  //             artwork: songs[currentIndex].song_image,
  //         };
  //         console.log(track, 'its track')
  //         // Clear previous tracks
  //         // await TrackPlayer.reset();

  //         // Add new track (wrap in array)
  //         await TrackPlayer.add([track]);

  //         // Seek to correct position if needed
  //         if (currentState?.currentTime) {
  //             await TrackPlayer.seekTo(currentState?.currentTime);
  //         }

  //         // Start playback
  //         if (currentState?.startAudioMixing) {
  //             await TrackPlayer.play();
  //         }
  //         else {
  //             await TrackPlayer.pause();
  //         }
  //     } catch (error) {
  //         console.error('Playback error:', error);
  //     }
  // };

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
      if (currentIndex >= songs.length || currentIndex < 0) {
        console.error('Invalid play index:', currentIndex);
        return;
      }

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
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  useEffect(() => {
    async function setupPlayer() {
      await TrackPlayer.setupPlayer();
    }

    setupPlayer();
    // Cleanup the player on unmount
    // return () => {
    //     TrackPlayer.destroy();
    // };
  }, []);

  // useEffect(() => {
  //     if (currentState && currentState?.playIndex != null)
  //         // console.log(currentTrack, currentState.playIndex, 'lll')
  //         // if (currentTrack != currentState?.playIndex) {
  //         //     // Alert.alert('inside')
  //         //     console.log(currentTrack, currentState.playIndex, 'lll')
  //         handleAddTrack()
  //     // }
  // }, [
  //     // currentEmitedSongStatus,
  //     currentState
  // ])
  const previousIndexRef = useRef(null);

  useEffect(() => {
    if (
      currentState?.playIndex !== undefined &&
      currentState?.playIndex !== null &&
      currentState?.playIndex !== previousIndexRef.current
    ) {
      console.log(
        'Index changed from',
        previousIndexRef.current,
        'to',
        currentState.playIndex,
      );

      handleAddTrack();

      // Update the ref with the new value
      previousIndexRef.current = currentState.playIndex;
    }
  }, [currentState]);

  useEffect(() => {
    isInternetConnected()
      .then(() => {
        dispatch(
          getSessionDetailRequest({sessionId: props?.route?.params?.sessionId}),
        );
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
  }, []);

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

  // useEffect(() => {
  //     const handleStatusUpdate = (status) => {
  //         console.log(status, 'its satus that we get from host emit')
  //         // Update local player state with received status
  //         // setPlayerState(prev => ({
  //         //     ...prev,
  //         //     // position: status.currentTime,
  //         //     // trackIndex: status.playIndex,
  //         //     // state: status.startAudioMixing ? 'playing' : 'paused'
  //         //     hostId: status?.hostId,
  //         //     startAudioMixing: status?.startAudioMixing,
  //         //     playIndex: status?.playIndex ?? -1,
  //         //     playLoading: status?.playLoading ?? false,
  //         //     currentTime: status?.currentTime,
  //         //     startedAt:status?.startedAt,
  //         //     pausedAt: status?.pausedAt
  //         // }));

  //     };

  //     socketService.initializeSocket(userTokenData?.token)
  //         .then(() => {
  //             Alert.alert('connected')
  //             if (checkUserExistence) {
  //                 socketService.on('session_play_status', handleStatusUpdate);
  //             }
  //         })
  //         .catch(() => {
  //             Alert.alert('not connected')
  //         })

  //     return () => {
  //         // socketService.off('session_play_status', handleStatusUpdate);
  //         // socketService.disconnect();
  //     };
  // }, [sessionDetailReduxdata]);

  // useEffect(() => {
  //     const handleStatusUpdate = (status) => {
  //         console.log('Received status:', status);
  //     };

  //     const joinSessionRoom = async () => {
  //         try {
  //             await socketService.initializeSocket(userTokenData?.token);
  //             // Join specific session room after connection
  //             socketService.emit('join_session_room', {
  //                 sessionId: yourSessionId,
  //                 userId: userProfileResp?._id
  //             });

  //             socketService.on('session_play_status', handleStatusUpdate);
  //         } catch (error) {
  //             console.error('Connection error:', error);
  //         }
  //     };

  //     joinSessionRoom();

  //     return () => {
  //         socketService.off('session_play_status', handleStatusUpdate);
  //         socketService.disconnect();
  //     };
  // }, []);

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
          // Only initialize if not already connected
          if (!socketService.isConnected() && userTokenData?.token) {
            await socketService.initializeSocket(userTokenData?.token);
            socketInitialized = true;
            console.log('Socket connected');
          }

          // Join room if needed
          // socketService.emit('join_session_room', {
          //     sessionId: sessionDetailReduxdata.id,
          //     userId: userTokenData?.userId
          // });

          // Register listener
          // socketService.on('session_play_status', handleStatusUpdate);
          // Add listener only if component is still mounted
          // if (isMounted) {
          socketService.on('session_play_status', handleStatusUpdate);
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

  //helperss***********************************************************************************
  // async function setTrackInfo() {
  //     const track = await TrackPlayer.getCurrentTrack();
  //     console.log(track, 'its track hhhhhh')
  //     const info = await TrackPlayer.getTrack(track);
  //     console.log(info, 'its track info iiii')
  // }

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
      // Alert.alert(index.toString())
      setCurrentTrack(index);
    } else {
      // Alert.alert('index')
    }
  });

  const handleJoinLeaveSession = () => {
    const requestObj = {
      id: sessionDetailReduxdata?._id,
      user_id: userProfileResp?._id,
    };
    console.log(requestObj, 'its >>>>>>>');
    // return
    if (sessionDetailReduxdata?.isLive && checkUserExistence())
      dispatch(startSessionLeftRequest(requestObj));
    else dispatch(startSessionJoinRequest(requestObj));
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      <Loader
        visible={sessionReduxData?.loading || sessionReduxData?.isRequestLoader}
      />
      <StatusBar backgroundColor={Colors.darkerblack} />
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
          title={'SESSIONS'}
          thirditemtext={false}
          imagetwo={
            sessionDetailReduxdata?.isPrivate ||
            (sessionDetailReduxdata?.isLive && checkUserExistence())
              ? null
              : ImagePath.addButtonSmall
          }
          imagetwoStyle={styles.imageTwoStyle}
          onPressFirstItem={() => {
            sessionDetailReduxdata?.isLive && checkUserExistence()
              ? handleJoinLeaveSession()
              : props.navigation.goBack();
          }}
          onPressThirdItem={handleJoinLeaveSession}
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
                    },
                  ]}
                  numberOfLines={2}>
                  {sessionDetailReduxdata?.own_user?.username}
                </Text>
                {/* <Image
                  source={ImagePath.blueTick}
                  style={{width: 16, height: 16}}
                  resizeMode="contain"
                /> */}
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
                  {marginTop: normalise(8), fontFamily: 'ProximaNova-Bold'},
                ]}
                numberOfLines={2}>
                NOW PLAYING
              </Text>
              <View style={[styles.bottomLineStyle, {width: '45%'}]}></View>
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
                        isPlayingCurrent &&
                          currentEmitedSongStatus?.current
                            ?.startAudioMixing && {opacity: 1},
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
                          numberOfLines={2}>
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
          {/* {(sessionDetailReduxdata?.watch_users && sessionDetailReduxdata?.watch_users?.length > 0) &&
                        <View style={styles.listenersContainer}>
                            <Text style={[styles.listItemHeaderSongTextTitle, { marginTop: normalise(10) }]} numberOfLines={2}>
                                LISTENERS
                            </Text>
                            <View style={[styles.bottomLineStyle, { width: width / 3, marginBottom: normalise(20) }]}>
                            </View>
                            <ScrollView>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {
                                        sessionDetailReduxdata?.watch_users?.map((item, index) => {
                                            return (
                                                <View style={[styles.joineeIitemWrapper, index == 0 && { marginLeft: normalise(40) }, index == 3 && { marginRight: normalise(40) }]}>
                                                    <Image
                                                        source={{ uri: item?.userProfile }
                                                        }
                                                        style={styles.songListItemImage}
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            )
                                        }
                                        )
                                    }
                                </View>
                            </ScrollView>
                        </View>
                    } */}
        </View>
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
    height: normalise(45),
    width: normalise(48),
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
    // flex: 1,
    // flexDirection: 'row',
  },
  listItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(14),
    marginBottom: normalise(5),
    marginRight: normalise(5),
  },

  listItemHeaderSongTypeIcon: {
    borderRadius: normalise(10),
    height: normalise(100),
    width: normalise(100),
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
    borderBottomWidth: 0.5,
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
    fontSize: normalise(9),
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
    width: normalise(50),
    height: normalise(50),
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
});

export default SessionDetail;
