// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   ImageBackground,
//   Linking,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Colors from '../../assests/Colors';
// import ImagePath from '../../assests/ImagePath';
// import normalise from '../../utils/helpers/Dimens';
// import StatusBar from '../../utils/MyStatusBar';
// import {useSelector, useDispatch} from 'react-redux';
// import constants from '../../utils/helpers/constants';
// import Loader from '../../widgets/AuthLoader';
// import isInternetConnected from '../../utils/helpers/NetInfo';
// // import toast from '../../utils/helpers/ShowErrorAlert';
// import toast from '../../utils/helpers/ShowErrorAlert';
// import {
//   getSessionDetailRequest,
//   startSessionRequest,
// } from '../../action/SessionAction';
// import socketService from '../../utils/socket/socketService';
// import useTrackPlayer, {addTracks} from '../../hooks/useTrackPlayer';
// import TrackPlayerComponent from '../common/TrackPlayerComponent';
// import TrackPlayer, {
//   Event,
//   useTrackPlayerEvents,
//   usePlaybackState,
//   useProgress,
//   State,
// } from 'react-native-track-player';
// import {TrackProgress} from '../common/Progress';
// import {hitSlop} from '../../widgets/HeaderComponent';
// import Popover from 'react-native-popover-view';
// import ActivityListItem from './ListCells/ActivityListItem';
// import Seperator from './ListCells/Seperator';
// import EmptyComponent from '../Empty/EmptyComponent';
// import {
//   sendSessionInvitationToUser,
//   sendSessionInvitationToUserIdleStatus,
//   userSearchRequest,
// } from '../../action/UserAction';
// import {
//   START_SESSION_JOINEE_FAILURE,
//   START_SESSION_JOINEE_REQUEST,
//   SEND_SESSION_INVITATION_FAILURE,
//   SEND_SESSION_INVITATION_SUCCESS,
// } from '../../action/TypeConstants';
// import {usePlayFullAppleMusic} from '../../hooks/usePlayFullAppleMusic';
// import {
//   AppleMusicContext,
//   useMusicPlayer,
// } from '../../context/AppleMusicContext';
// import {
//   MusicKit,
//   Player,
//   useCurrentSong,
//   useIsPlaying,
// } from '@lomray/react-native-apple-music';

// // let status;

// function MySessionDetailScreen(props) {
//   let sendSong = false;
//   // console.log(props?.route?.params, 'these are params')
//   // const { currentSession } = props?.route?.params
//   // console.log(currentSession, 'its current sessionI')
//   const {width, height} = useWindowDimensions();
//   const [playVisible, setPlayVisible] = useState(true);
//   const [disabled, setDisabled] = useState(false);
//   const [isPrivate, setIsPrivate] = useState(true);
//   const [islive, setIsLive] = useState(false);
//   const [currentPlayingSong, setCurrentPlayingSong] = useState(null);
//   const [showPopover, setShowPopover] = useState(false);
//   const [userDataList, setUserDataList] = useState([]);
//   const [usersSearchText, setUsersSearchText] = useState('');
//   const [seletedUserToInvite, setSelectedUserToInvite] = useState([]);
//   const [status, setStatus] = useState('');
//   const {isPlaying: appleFullSongPlaying} = useIsPlaying();

//   // console.log(appleFullSongPlaying, 'this is my current song>>>>>>');

//   const {
//     startSessionAndPlay,
//     playTrack,
//     pauseTrack,
//     skipToNext,
//     skipToPrevious,
//     isPlaying,
//     setIsPlaying,
//     isPlayerReady,
//   } = useTrackPlayer();

//   const {isAuthorizeToAccessAppleMusic, haveAppleMusicSubscription} =
//     useContext(AppleMusicContext);

//   const {onToggle, checkPlaybackState, setPlaybackQueue, resetPlaybackQueue} =
//     usePlayFullAppleMusic();

//   const [playerVisible, setPlayerVisible] = useState(false);
//   const [playerAcceptedSongs, setPlayerAcceptedSongs] = useState([]);
//   const [listenSessionStart, setListenSessionStart] = useState(null);
//   const [currentListners, setCurrentListeners] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);

//   // const { position, duration } = useProgress(200);
//   const playerState = usePlaybackState();
//   // console.log(playerState, 'its play back state');
//   const [currentTrack, setCurrentTrack] = useState(0);

//   const dispatch = useDispatch();
//   const userProfileResp = useSelector(
//     state => state.UserReducer.userProfileResp,
//   );
//   const userTokenData = useSelector(state => state.TokenReducer);
//   const sessionReduxData = useSelector(state => state.SessionReducer);
//   const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data;
//   const currentSessionLiveInfo = sessionReduxData?.currentSessionSong?.data;
//   const userReduxData = useSelector(state => state.UserReducer);
//   const userSearchList = useSelector(state => state.UserReducer.userSearch);
//   const userInviteLoader = useSelector(state => state.UserReducer.inviteLoader);

//   //TRACK PLAYER DURATION ADN PROGRESS HANDLING FOR APPLE AND APPLE PREVIEW
//   const {
//     progress,
//     duration: appleFullSongDuration,
//     resetProgress,
//   } = useMusicPlayer();
//   const {position, duration} = useProgress(200);
//   const positionRef = useRef(null);
//   const playerAcceptedSongsRef = useRef([]);
//   //USEEFFECT HOOKS++++++++++++++++++++++++++++++++++++++++++++++++++++++

//   useEffect(() => {
//     const playbackListener = Player.addListener(
//       'onPlaybackStateChange',
//       state => {
//         console.log('New Playback State:', state);
//         const duration = state?.currentSong?.duration;
//         const time = state?.playbackTime;
//         console.log(duration, state?.playbackTime, 'hey it both>>');
//         const isCompleted =
//           state.playbackStatus == 'paused' &&
//           duration > 0 &&
//           duration - time == duration;
//         console.log(isCompleted, 'its completed');
//         const songs = playerAcceptedSongsRef.current;
//         // if (isCompleted && currentTrack < songs?.length - 1) {
//         //   console.log('Track likely finished automatically');
//         //   if (currentTrack < songs?.length - 1) {
//         //     console.log('next track>>>');
//         //     let nextTrack = currentTrack + 1;
//         //     setCurrentTrack(nextTrack);
//         //     // resetProgress();
//         //     setPlaybackQueue(songs[nextTrack]);
//         //     console.log('next track>>>1', nextTrack);
//         //     setTimeout(() => {
//         //       Player.play();
//         //     }, 500);
//         //   }
//         // }
//         // setTimeout(() => {
//         //   if (isCompleted) {
//         //     console.log('Track likely finished automatically');
//         //     changeTrack();
//         //   }
//         // }, 1000);

//         if (isCompleted) {
//           setCurrentTrack(prevTrack => {
//             const songs = playerAcceptedSongsRef.current;
//             if (prevTrack < songs?.length - 1) {
//               const nextTrack = prevTrack + 1;
//               setPlaybackQueue(songs[nextTrack]);
//               setTimeout(() => Player.play(), 500);
//               return nextTrack;
//             }
//             return prevTrack;
//           });
//         }
//       },
//     );

//     // Clean up on unmount
//     return () => {
//       playbackListener.remove();
//     };
//   }, [playerAcceptedSongs, currentTrack]);

//   useEffect(() => {
//     console.log(playerAcceptedSongs, 'this is song length >>');
//   }, [playerAcceptedSongs]);

//   useEffect(() => {
//     setUserDataList(userSearchList);
//   }, [userSearchList]);

//   useEffect(() => {
//     if (checkIsAppleStatus) {
//       positionRef.current = progress; //FOR APPLE FULL MUSIC
//     } else {
//       positionRef.current = position; //FOR APPLE/SPOTIFY PREVIEW
//     }
//   }, [position, progress]);

//   useEffect(() => {
//     if (!checkIsAppleStatus) {
//       async function setupPlayer() {
//         await TrackPlayer.setupPlayer();
//       }
//       setupPlayer();
//       // Cleanup the player on unmount
//       // return () => {
//       //     TrackPlayer.destroy();
//       // };
//     }
//   }, []);

//   //// not try with when saparate the socket initalization
//   useEffect(() => {
//     let isMounted = true;
//     const initializeSocket = async () => {
//       try {
//         await socketService.initializeSocket(userTokenData?.token);
//       } catch (error) {
//         console.error('Socket initialization error:', error);
//       }
//     };

//     if (userTokenData?.token) {
//       initializeSocket();
//     }

//     return () => {
//       isMounted = false;
//       socketService.disconnect(); // Disconnect on component unmount or token change
//     };
//   }, [userTokenData?.token]);

//   // Lets emit the other event when session is live and depends stop, start , position and playing state
//   useEffect(() => {
//     let intervalId;
//     let isMounted = true;
//     const handleStartSession = sessionData => {
//       if (!isMounted) return;
//       setListenSessionStart(sessionData);
//     };

//     // Setup listeners and interval
//     const setupListenersAndInterval = () => {
//       try {
//         // Add event listeners
//         // socketService.on('start_session', handleStartSession);
//         socketService.on('session_users_status', handleListerUserStatus);

//         // Start interval if live
//         if (islive && isMounted) {
//           intervalId = setInterval(() => {
//             const emitObjData = {
//               hostId: userProfileResp?._id,
//               // startAudioMixing: playerState?.state === 'playing' ?? false,
//               playIndex: currentTrack ?? -1,
//               playLoading: false,
//               currentTime: positionRef.current,
//               startedAt: Date.now(),
//               pausedAt: null,
//               sessionId: sessionDetailReduxdata?._id,
//             };

//             emitObjData.startAudioMixing = checkIsAppleStatus
//               ? appleFullSongPlaying
//               : playerState?.state === 'playing'
//               ? true
//               : false;
//             // console.log(emitObjData, 'this is the emit data');
//             socketService.emit('session_play_status', emitObjData);
//           }, 1000);
//         }
//       } catch (error) {
//         console.error('Error setting up listeners:', error);
//       }
//     };

//     setupListenersAndInterval();
//     // Cleanup on unmount or dependency change
//     return () => {
//       isMounted = false;
//       clearInterval(intervalId);
//       // socketService.off('start_session', handleStartSession);
//       socketService.off('session_users_status', handleListerUserStatus);
//     };
//   }, [
//     islive,
//     playerState?.state,
//     currentTrack,
//     appleFullSongPlaying,
//     // position,
//   ]);

//   useEffect(() => {
//     isInternetConnected()
//       .then(() => {
//         dispatch(
//           getSessionDetailRequest({sessionId: props?.route?.params?.sessionId}),
//         );
//       })
//       .catch(() => {
//         toast('Error', 'Please Connect To Internet');
//       });
//   }, []);

//   // TO CHECK THAT USER APPLE STATUS
//   const checkIsAppleStatus = useMemo(() => {
//     if (
//       Platform.OS == 'ios' &&
//       isAuthorizeToAccessAppleMusic &&
//       haveAppleMusicSubscription &&
//       userTokenData?.registerType == 'apple'
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   }, [
//     isAuthorizeToAccessAppleMusic,
//     haveAppleMusicSubscription,
//     userTokenData?.registerType,
//   ]);

//   useEffect(() => {
//     const handleAddTrack = async () => {
//       if (islive && sessionDetailReduxdata?.session_songs?.length) {
//         let getTrackRelatedSong;
//         if (checkIsAppleStatus) {
//           getTrackRelatedSong = () => {
//             return sessionDetailReduxdata.session_songs.map(
//               item => item?.apple_song_id ?? '',
//             );
//           };
//         } else {
//           getTrackRelatedSong = () => {
//             return sessionDetailReduxdata.session_songs.map(item => ({
//               id: item._id,
//               url: item.song_uri,
//               title: item.song_name,
//               artist: item.artist_name,
//               artwork: item.song_image,
//               apple_song_id: item?.apple_song_id ?? '',
//             }));
//           };
//         }
//         const newArray = getTrackRelatedSong();
//         console.log(newArray, 'this is song arrau');
//         setPlayerAcceptedSongs(newArray);
//         playerAcceptedSongsRef.current = newArray;
//         if (checkIsAppleStatus) {
//           setPlaybackQueue(newArray[0]);
//           // MusicKit.setPlaybackQueueList(newArray ?? [],  'song');
//           setCurrentTrack(0);
//           setTimeout(() => {
//             Player.play();
//             // Alert.alert('play');
//           }, 500);
//         } else {
//           await addTracks(newArray);
//           await TrackPlayer.play();
//         }
//         // console.log(newArray,'ite new aarary')
//         // startSessionAndPlay(getTrackRelatedSong());
//       }
//     };
//     // setTrackInfo()
//     if (islive) {
//       handleAddTrack();
//     }
//   }, [
//     islive,
//     //  sessionDetailReduxdata
//   ]);

//   useEffect(() => {
//     if (sessionReduxData?.currentSessionSong && sessionDetailReduxdata) {
//       setIsLive(sessionDetailReduxdata?.isLive);
//       if (checkIsAppleStatus) {
//         if (!sessionDetailReduxdata?.isLive) {
//           // Alert.alert('reset');
//           resetPlaybackQueue();
//           setCurrentTrack(null); // addded later when handling apple full music player
//           resetProgress();
//         }
//       } else {
//         if (!sessionDetailReduxdata?.isLive) {
//           // Alert.alert('Reset')
//           TrackPlayer.reset();
//         }
//       }
//     }
//   }, [sessionDetailReduxdata?.isLive]);

//   useEffect(() => {
//     handleNavigation();
//   }, [userReduxData.status]);

//   //helperss***********************************************************************************

//   const handleNavigation = () => {
//     if (status === '' || status !== userReduxData.status) {
//       switch (userReduxData.status) {
//         case SEND_SESSION_INVITATION_FAILURE:
//           setStatus(SEND_SESSION_INVITATION_FAILURE);
//           // Alert.alert(sessionReduxData?.error?.message);
//           toast(
//             'Error',
//             userReduxData?.error?.message ??
//               'Something Went Wrong, Please Try Again',
//           );
//           setTimeout(() => {
//             dispatch(
//               sendSessionInvitationToUserIdleStatus({status: '', error: {}}),
//             );
//           }, 300);
//           break;
//         case SEND_SESSION_INVITATION_SUCCESS:
//           setStatus(SEND_SESSION_INVITATION_SUCCESS);
//           setModalVisible(!modalVisible);
//           setUserDataList([]);
//           setUsersSearchText('');
//           setSelectedUserToInvite([]);
//           setTimeout(() => {
//             toast('Success', 'Invitation sent successfully');
//             dispatch(
//               sendSessionInvitationToUserIdleStatus({status: '', error: {}}),
//             );
//           }, 300);
//           break;
//         default:
//           setStatus('');
//           break;
//       }
//     }
//   };

//   const handleListerUserStatus = res => {
//     if (res && res?.message) {
//       toast('Error', res?.message);
//     }
//     setCurrentListeners(res?.users);
//   };

//   function format(seconds) {
//     let mins = parseInt(seconds / 60)
//       .toString()
//       .padStart(2, '0');
//     let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   }

//   const handleStartSession = () => {
//     if (
//       sessionDetailReduxdata?.sessionRegisterType === 'apple' &&
//       !checkIsAppleStatus
//     ) {
//       Alert.alert(
//         "You don't have apple music subscription, you can't host the session, Apple music subscription is required!",
//       );
//       return;
//     } else {
//       const requestObj = {
//         isLive: true,
//         sessionId: sessionDetailReduxdata?._id,
//       };
//       dispatch(startSessionRequest(requestObj));
//     }
//   };

//   const handleStopKillSession = () => {
//     const requestObj = {
//       isLive: false,
//       sessionId: sessionDetailReduxdata?._id,
//     };
//     dispatch(startSessionRequest(requestObj));
//   };

//   const handleUpdateSession = () => {
//     const requestObj = {
//       isPrivate: !sessionDetailReduxdata?.isPrivate,
//       sessionId: sessionDetailReduxdata?._id,
//     };
//     dispatch(startSessionRequest(requestObj));
//   };

//   useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
//     if (event.state == State.nextTrack) {
//       let index = await TrackPlayer.getCurrentTrack();
//       // Alert.alert(index.toString())
//       setCurrentTrack(index);
//     }
//   });

//   useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
//     // console.log('✅ Playback finished for the last track');
//     TrackPlayer.reset();
//     handleStopKillSession();
//   });

//   // const listenLastTrackEnd = () => {
//   //   if (currentTrack && playerState?.state != 'none') {
//   //     let listLastSong = sessionDetailReduxdata?.session_songs?.length - 1;
//   //     // console.log(currentTrack, listLastSong, 'yes it is last song1');
//   //     if (currentTrack == listLastSong && duration > 0) {
//   //       console.log(currentTrack, listLastSong, 'yes it is last song');
//   //       console.log(playerState?.state, 'its statu inlast');
//   //       if (position == duration) {
//   //         TrackPlayer.reset();
//   //       }
//   //     }
//   //   }
//   // };
//   // useEffect(() => {
//   //   if (
//   //     sessionDetailReduxdata?.session_songs?.length &&
//   //     currentTrack !== null
//   //   ) {
//   //     console.log('hheheh', position, duration);
//   //     listenLastTrackEnd();
//   //   }
//   // }, [currentTrack, position]);

//   // SEARCH AND CLEAR FUNCTIONS
//   const search = text => {
//     if (text.length >= 1) {
//       isInternetConnected()
//         .then(() => {
//           // disableduserSearchReq({keyword: text}, sendSong);
//           dispatch(userSearchRequest({keyword: text}, sendSong));
//         })
//         .catch(() => {
//           toast('Error', 'Please Connect To Internet');
//         });
//     }
//   };

//   const handleUserToAddInvite = userId => {
//     const isExist = seletedUserToInvite.some(item => item == userId);
//     if (isExist) {
//       const filteredArray = seletedUserToInvite.filter(item => item !== userId);
//       setSelectedUserToInvite(filteredArray);
//     } else {
//       setSelectedUserToInvite([...seletedUserToInvite, userId]);
//     }
//   };

//   const handleSendInvitation = () => {
//     const objectRequest = {
//       id: sessionDetailReduxdata?._id,
//       invited_users: seletedUserToInvite,
//     };
//     // console.log(objectRequest, 'dfdfdf>>');
//     // return;
//     dispatch(sendSessionInvitationToUser(objectRequest));
//   };

//   const changeTrack = () => {
//     const songs = playerAcceptedSongsRef.current;
//     console.log(currentTrack, songs?.length - 1, 'thi is texting ');
//     console.log(currentTrack < songs?.length - 1, 'its vlue');
//     if (currentTrack < songs?.length - 1) {
//       console.log('next track>>>');
//       let nextTrack = currentTrack + 1;
//       // resetProgress();
//       setPlaybackQueue(songs[nextTrack]);
//       setCurrentTrack(nextTrack);
//       console.log('next track>>>1', nextTrack);
//       setTimeout(() => {
//         Player.play();
//         // Alert.alert('play');
//       }, 500);
//     }
//   };

//   //components *************************************************************

//   const renderModal = () => {
//     return (
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         presentationStyle={'overFullScreen'}>
//         <ImageBackground
//           source={ImagePath ? ImagePath.page_gradient : null}
//           style={styles.centeredView}>
//           <Loader visible={userInviteLoader} />
//           <View style={styles.modalView}>
//             {seletedUserToInvite && seletedUserToInvite?.length > 0 && (
//               <TouchableOpacity
//                 onPress={() => {
//                   handleSendInvitation();
//                 }}
//                 style={{
//                   padding: 10,
//                   paddingTop: 4,
//                   paddingBottom: 4,
//                   borderRadius: 5,
//                   backgroundColor: Colors.darkerblack,
//                   position: 'absolute',
//                   right: 12,
//                   top: 12,
//                   marginRight: normalise(10),
//                 }}>
//                 <Text
//                   style={{
//                     color: Colors.white,
//                     fontSize: normalise(10),
//                     fontWeight: 'bold',
//                   }}>
//                   SEND
//                 </Text>
//               </TouchableOpacity>
//             )}
//             <View
//               style={{
//                 width: '100%',
//                 alignSelf: 'center',
//                 marginTop: normalise(16),
//                 marginBottom: normalise(16),
//               }}>
//               <TextInput
//                 style={{
//                   height: normalise(35),
//                   borderRadius: normalise(8),
//                   padding: normalise(10),
//                   color: Colors.white,
//                   marginHorizontal: normalise(12),
//                   backgroundColor: Colors.fadeblack,
//                   paddingLeft: normalise(35),
//                 }}
//                 keyboardAppearance="dark"
//                 autoCorrect={false}
//                 value={usersSearchText}
//                 placeholder={'Search Users'}
//                 placeholderTextColor={Colors.darkgrey}
//                 onChangeText={text => {
//                   search(text);
//                   setUsersSearchText(text);
//                 }}
//               />
//               <Image
//                 source={ImagePath.searchicongrey}
//                 style={{
//                   position: 'absolute',
//                   height: normalise(15),
//                   width: normalise(15),
//                   bottom: normalise(10),
//                   paddingLeft: normalise(35),
//                   marginHorizontal: normalise(12),
//                   transform: [{scaleX: -1}],
//                 }}
//                 resizeMode="contain"
//               />
//               {usersSearchText && (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setUserDataList([]);
//                     setUsersSearchText('');
//                   }}
//                   style={{
//                     padding: 10,
//                     paddingTop: 4,
//                     paddingBottom: 4,
//                     borderRadius: 5,
//                     backgroundColor: Colors.darkerblack,
//                     position: 'absolute',
//                     right: 12,
//                     bottom: Platform.OS === 'ios' ? normalise(8) : normalise(8),
//                     marginRight: normalise(10),
//                   }}>
//                   <Text
//                     style={{
//                       color: Colors.white,
//                       fontSize: normalise(10),
//                       fontWeight: 'bold',
//                     }}>
//                     CLEAR
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//             {userDataList && userDataList?.length == 0 ? (
//               <EmptyComponent
//                 image={ImagePath.emptyUser}
//                 text={
//                   'Search above to find users you want to send invitation by either their username or just typing their name.'
//                 }
//                 title={'Search Users to Send Invitation'}
//               />
//             ) : (
//               <View style={{flex: 1}}>
//                 {/* {console.log(userDataList, 'this list of usered>>>>>>>>>')} */}
//                 <FlatList
//                   style={{
//                     height: Dimensions.get('window').height - 295,
//                   }}
//                   data={userDataList ?? []}
//                   renderItem={renderUserData}
//                   keyExtractor={(item, index) => index.toString()}
//                   showsVerticalScrollIndicator={false}
//                   ItemSeparatorComponent={Seperator}
//                 />
//               </View>
//             )}
//             <TouchableOpacity
//               onPress={() => {
//                 setModalVisible(!modalVisible);
//                 setUserDataList([]);
//                 setUsersSearchText('');
//                 setSelectedUserToInvite([]);
//               }}
//               style={{
//                 marginBottom: normalise(20),
//                 height: normalise(40),
//                 backgroundColor: Colors.fadeblack,
//                 opacity: 10,
//                 borderRadius: 6,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginTop: normalise(24),
//               }}>
//               <Text
//                 style={{
//                   fontSize: normalise(12),
//                   fontFamily: 'ProximaNova-Bold',
//                   color: Colors.white,
//                 }}>
//                 CANCEL
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ImageBackground>
//       </Modal>
//     );
//   };

//   function renderUserData({item}) {
//     const isAlreadyExist = seletedUserToInvite.includes(item?._id);
//     return (
//       <ActivityListItem
//         image={constants.profile_picture_base_url + item.profile_image}
//         user={item.username}
//         type={false}
//         userId={item?.user_id}
//         // loginUserId={props.userProfileResp?._id}
//         follow={item?.isFollowing ? false : true}
//         // bottom={item.index === props.userSearch.length - 1 ? true : false}
//         // marginBottom={
//         //   item.index === props.userSearch.length - 1
//         //     ? normalise(80)
//         //     : normalise(0)
//         // }
//         onPressImage={() => {
//           null;
//           // props.navigation.navigate('OthersProfile', {
//           //   id: item.item._id,
//           //   following: item.item.isFollowing,
//           // });
//         }}
//         image2={isAlreadyExist ? ImagePath?.blueTick : ImagePath?.addButton}
//         onPress={() => {
//           handleUserToAddInvite(item?._id);
//           // props.followReq({follower_id: data.item._id});
//         }}
//         TouchableOpacityDisabled={false}
//         localImage={true}
//       />
//     );
//   }

//   const handlePlayPauseViaButton = () => {
//     if (checkIsAppleStatus) {
//       appleFullSongPlaying ? Player.pause() : Player.play();
//     } else {
//       playerState?.state === 'playing' ? pauseTrack() : playTrack();
//     }
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
//       <Loader
//         visible={
//           sessionReduxData?.loading ||
//           sessionReduxData?.startSessionLoading ||
//           userInviteLoader
//         }
//       />
//       <LinearGradient
//         colors={['#0E402C', '#101119', '#360455']}
//         style={{flex: 1}}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 1}}>
//         {Platform.OS === 'android' && (
//           <StatusBar backgroundColor={Colors.darkerblack} />
//         )}
//         <SafeAreaView style={{flex: 1}}>
//           <View style={styles.headerStyle}>
//             <Popover
//               isVisible={showPopover}
//               onRequestClose={() => setShowPopover(false)}
//               from={
//                 <TouchableOpacity
//                   onPress={() =>
//                     islive ? setShowPopover(true) : props.navigation.goBack()
//                   }
//                   // onPress={() =>
//                   //   islive ? handleStopKillSession() : props.navigation.goBack()
//                   // }
//                   hitSlop={hitSlop}>
//                   <Image
//                     source={islive ? ImagePath.greycross : ImagePath.backicon}
//                     style={{
//                       width: normalise(16),
//                       height: islive ? normalise(17) : normalise(14),
//                     }}
//                     resizeMode="contain"
//                   />
//                 </TouchableOpacity>
//               }>
//               <View style={{}}>
//                 <Text style={[styles.confrimationText, {width: '100%'}]}>
//                   Are you sure, do you want to close this session!
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-around',
//                     borderTopWidth: 1,
//                     borderTopColor: Colors.meta,
//                     marginVeTop: 10,
//                   }}>
//                   <TouchableOpacity
//                     style={styles.optionText}
//                     onPress={() => {
//                       handleStopKillSession();
//                       setShowPopover(false);
//                     }}>
//                     <Text style={[styles.confrimationText]}>Yes</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.optionText}
//                     onPress={() => setShowPopover(false)}>
//                     <Text style={[styles.confrimationText]}>No</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Popover>

//             {!islive && !props.route.params.isforEdit && (
//               <TouchableOpacity
//                 style={[{alignItems: 'center', flexDirection: 'row'}]}
//                 onPress={handleStartSession}
//                 hitSlop={hitSlop}>
//                 <Text
//                   style={[
//                     styles.listItemHeaderSongTextTitle,
//                     {marginBottom: normalise(0), fontSize: normalise(9)},
//                   ]}
//                   numberOfLines={2}>
//                   START{'\n'}SESSION
//                 </Text>
//                 <Image
//                   source={ImagePath.playSolid}
//                   style={styles.startSessionIcon}
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             )}
//           </View>
//           <View style={{flex: 1}}>
//             <View style={{flex: 2}}>
//               <View style={styles.listItemHeaderSongDetails}>
//                 <Text style={styles.hostedText} numberOfLines={1}>
//                   Hosted by
//                 </Text>
//                 <View style={styles.nameWrapper}>
//                   <Text
//                     style={[
//                       styles.listItemHeaderSongTextTitle,
//                       {textTransform: 'uppercase', marginBottom: normalise(0)},
//                     ]}
//                     numberOfLines={1}>
//                     {userProfileResp?.username}
//                   </Text>
//                   {/* <Image
//                     source={ImagePath.blueTick}
//                     style={{width: 16, height: 16}}
//                     resizeMode="contain"
//                   /> */}
//                 </View>
//                 <Image
//                   source={
//                     userProfileResp?.profile_image
//                       ? {
//                           uri:
//                             constants.profile_picture_base_url +
//                             userProfileResp?.profile_image,
//                         }
//                       : ImagePath.userPlaceholder
//                   }
//                   style={styles.listItemHeaderSongTypeIcon}
//                   resizeMode="cover"
//                 />
//                 <Text
//                   style={[
//                     styles.listItemHeaderSongTextTitle,
//                     {marginTop: normalise(10), marginBottom: 0},
//                   ]}
//                   numberOfLines={1}>
//                   NOW PLAYING
//                 </Text>
//                 <View
//                   style={[
//                     styles.bottomLineStyle,
//                     {width: width / 3, marginTop: normalise(6)},
//                   ]}></View>
//               </View>
//               <View style={[styles.playListItemContainer]}>
//                 <FlatList
//                   data={sessionDetailReduxdata?.session_songs}
//                   renderItem={({item, index}) => {
//                     // let iscurrentPlaying = currentPlayingSong?._id == item?._id
//                     // let iscurrentPlaying = currentPlayingSong?._id == item?._id

//                     const iscurrentPlaying = currentTrack == index;
//                     // playerState == State.Playing &&
//                     return (
//                       <View
//                         style={[
//                           styles.itemWrapper,
//                           // (iscurrentPlaying ||
//                           //   playerState?.state == 'none') && {opacity: 1},

//                           !iscurrentPlaying && islive && {opacity: 0.4},
//                         ]}>
//                         <TouchableOpacity
//                           disabled={iscurrentPlaying ? false : true}
//                           onPress={handlePlayPauseViaButton}
//                           style={styles.playButtonStyle}>
//                           <Image
//                             // source={(isPlaying && iscurrentPlaying) ? ImagePath.pause : ImagePath.play}
//                             source={
//                               (appleFullSongPlaying ||
//                                 playerState?.state == 'playing') &&
//                               iscurrentPlaying
//                                 ? ImagePath.pause
//                                 : ImagePath.play
//                             }
//                             style={{
//                               height: normalise(25),
//                               width: normalise(25),
//                             }}
//                             resizeMode="contain"
//                           />
//                         </TouchableOpacity>
//                         <Image
//                           source={{uri: item?.song_image}}
//                           style={styles.songListItemImage}
//                           resizeMode="cover"
//                         />
//                         <View style={styles.listItemHeaderSongText}>
//                           <Text
//                             style={styles.songlistItemHeaderSongTextTitle}
//                             numberOfLines={1}>
//                             {item?.song_name}
//                           </Text>
//                           <Text
//                             style={styles.songlistItemHeaderSongTextArtist}
//                             numberOfLines={1}>
//                             {item?.artist_name}
//                           </Text>
//                         </View>
//                       </View>
//                     );
//                   }}
//                   showsVerticalScrollIndicator={false}
//                   keyExtractor={item => item?._id}
//                 />
//               </View>
//             </View>
//             {/* {sessionDetailReduxdata?.users &&
//               sessionDetailReduxdata?.users?.length > 0 && (
//                 <View style={styles.listenersContainer}>
//                   <View style={styles.listenersTextWrapper}>
//                     <Text
//                       style={[
//                         styles.listItemHeaderSongTextTitle,
//                         {marginTop: normalise(5)},
//                       ]}
//                       numberOfLines={2}>
//                       LISTENERS
//                     </Text>
//                   </View>
//                   <View
//                     style={[
//                       styles.bottomLineStyle,
//                       {
//                         width: width / 3,
//                         marginBottom: normalise(20),
//                         marginTop: normalise(0),
//                       },
//                     ]}></View>
//                   <ScrollView style={{flex: 1}}>
//                     <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
//                       {currentListners?.map((item, index) => {
//                         return (
//                           <View
//                             style={[
//                               styles.joineeIitemWrapper,
//                               index == 0 &&
//                                 sessionDetailReduxdata?.watch_users?.length >
//                                   1 && {
//                                   marginLeft: normalise(40),
//                                 },
//                               index == 3 && {marginRight: normalise(40)},
//                             ]}>
//                             <Image
//                               source={{
//                                 uri:
//                                   constants?.profile_picture_base_url +
//                                   item?.profile_image,
//                               }}
//                               style={styles.songListItemImage}
//                               resizeMode="cover"
//                             />
//                             <Text numberOfLines={1}>{item?.username}</Text>
//                           </View>
//                         );
//                       })}
//                     </View>
//                   </ScrollView>
//                 </View>
//               )} */}

//             {currentListners?.length > 0 && (
//               <View style={styles.listenersContainer}>
//                 <View style={styles.listenersTextWrapper}>
//                   <Text
//                     style={[
//                       styles.listItemHeaderSongTextTitle,
//                       {marginTop: normalise(5), fontSize: normalise(12)},
//                     ]}
//                     numberOfLines={2}>
//                     LISTENERS
//                   </Text>
//                 </View>
//                 <View
//                   style={[
//                     styles.bottomLineStyle,
//                     {
//                       width: width / 3.8,
//                       marginBottom: normalise(8),
//                       marginTop: normalise(0),
//                     },
//                   ]}></View>
//                 <ScrollView style={{flex: 1}}>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'center',
//                       flexWrap: 'wrap',
//                     }}>
//                     {currentListners?.map((item, index) => {
//                       return (
//                         <View
//                           style={[
//                             styles.joineeIitemWrapper,
//                             // index == 0 &&
//                             //   currentListners?.length > 1 && {
//                             //     marginLeft: normalise(40),
//                             //   },
//                             // index == 3 && {marginRight: normalise(40)},
//                           ]}>
//                           <Image
//                             source={
//                               item?.profile_image
//                                 ? {
//                                     uri:
//                                       constants.profile_picture_base_url +
//                                       item?.profile_image,
//                                   }
//                                 : ImagePath.userPlaceholder
//                             }
//                             style={[styles.songListItemImage]}
//                             resizeMode="cover"
//                           />
//                         </View>
//                       );
//                     })}
//                   </View>
//                 </ScrollView>
//               </View>
//             )}
//           </View>
//           {!props.route.params.isforEdit && (
//             <TrackProgress
//               setModalVisible={() => setModalVisible(!modalVisible)}
//               modalVisible={modalVisible}
//               duration={appleFullSongDuration}
//               position={progress}
//               isShow={true}
//             />
//           )}
//           {props.route.params.isforEdit && (
//             <View style={{}}>
//               <TouchableOpacity
//                 style={{
//                   marginHorizontal: 20,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//                 onPress={() => handleUpdateSession()}>
//                 <Text
//                   style={[
//                     {
//                       textAlign: 'center',
//                       color: Colors.meta,
//                       fontSize: normalise(12),
//                       marginBottom: normalise(3),
//                     },
//                   ]}
//                   numberOfLines={2}>
//                   {sessionDetailReduxdata?.isPrivate ? 'Private' : 'Public'}
//                 </Text>
//                 <Image
//                   source={
//                     sessionDetailReduxdata?.isPrivate
//                       ? ImagePath.toggleOn
//                       : ImagePath.toggleOff
//                   }
//                   style={{width: 45}}
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             </View>
//           )}
//           {/* {playerVisible &&
//                         <TrackPlayerComponent
//                             currentTrack={{
//                                 id: currentPlayingSong?._id,
//                                 url: currentPlayingSong?.song_uri,
//                                 title: currentPlayingSong?.song_name,
//                                 artist: currentPlayingSong?.artist_name,
//                                 artwork: currentPlayingSong?.song_image,
//                             }
//                             }
//                         />
//                     } */}
//         </SafeAreaView>
//         {renderModal()}
//       </LinearGradient>
//     </View>
//   );
// }

// // const mapStateToProps = state => {
// //     return {
// //         status: state.UserReducer.status,
// //         postStatus: state.PostReducer.status,
// //         userProfileResp: state.UserReducer.userProfileResp,
// //         countryCode: state.UserReducer.countryCodeOject,
// //         header: state.TokenReducer,
// //     };
// // };

// const styles = StyleSheet.create({
//   playListItemContainer: {
//     width: '100%',
//     alignSelf: 'center',
//     marginTop: normalise(15),
//     flex: 1,
//   },

//   itemWrapper: {
//     flexDirection: 'row',
//     marginBottom: normalise(8),
//     flex: 1,
//     width: '100%',
//     alignItems: 'center',
//     // opacity: 0.4,
//     opacity: 1,
//   },
//   songListItemImage: {
//     borderRadius: normalise(5),
//     height: normalise(40),
//     width: normalise(40),
//   },

//   listItemHeaderSongDetails: {
//     alignItems: 'center',
//     // flex: 1,
//     // flexDirection: 'row',
//   },
//   listItemHeaderSongTextTitle: {
//     color: Colors.white,
//     fontFamily: 'ProximaNova-Semibold',
//     fontSize: normalise(14),
//     marginBottom: normalise(5),
//     marginRight: normalise(5),
//   },

//   listItemHeaderSongTypeIcon: {
//     borderRadius: normalise(10),
//     height: normalise(80),
//     width: normalise(80),
//     borderRadius: normalise(80),
//     borderWidth: 1,
//     borderColor: Colors.grey,
//   },
//   listItemHeaderSongText: {
//     alignItems: 'flex-start',
//     flexDirection: 'column',
//     marginLeft: normalise(10),
//     width: '100%',
//     height: '100%',
//     borderBottomWidth: 0.3,
//     borderBottomColor: Colors.meta,
//     flex: 1,
//     justifyContent: 'center',
//     marginRight: normalise(10),
//   },
//   songlistItemHeaderSongTextTitle: {
//     color: Colors.white,
//     fontFamily: 'ProximaNova-Semibold',
//     fontSize: normalise(12),
//   },

//   songlistItemHeaderSongTextArtist: {
//     color: Colors.darkgrey,
//     fontFamily: 'ProximaNova-Regular',
//     fontSize: normalise(11),
//   },

//   bottomLineStyle: {
//     marginTop: normalise(8),
//     backgroundColor: Colors.white,
//     alignSelf: 'center',
//     opacity: 0.7,
//     height: 0.5,
//   },

//   nameWrapper: {
//     flexDirection: 'row',
//     // marginTop: normalise(2),
//     marginBottom: normalise(4),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   playButtonStyle: {
//     width: normalise(40),
//     height: normalise(40),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   //Footer listners styles
//   listenersContainer: {
//     alignItems: 'center',
//     flex: 0.5,
//   },
//   joineeIitemWrapper: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     marginHorizontal: normalise(11),
//     marginBottom: normalise(11),
//   },
//   inviteIcon: {
//     borderRadius: normalise(5),
//     height: normalise(20),
//     width: normalise(20),
//   },
//   headerStyle: {
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: normalise(20),
//     paddingVertical: normalise(15),
//     height: 65,
//   },
//   startSessionIcon: {
//     width: 14,
//     height: 14,
//   },
//   hostedText: {
//     color: Colors.meta,
//     fontFamily: 'ProximaNova-Regular',
//     fontSize: normalise(12),
//   },
//   listenersTextWrapper: {
//     flexDirection: 'row',
//   },
//   confrimationText: {
//     color: Colors.black,
//     fontFamily: 'ProximaNova-Regular',
//     fontSize: normalise(12),
//     // width: '50%',
//     // paddingVertical: 10,
//     textAlign: 'center',
//     padding: 15,
//     fontWeight: '600',
//   },
//   optionText: {
//     borderEndWidth: 1,
//     borderRightColor: Colors.meta,
//     width: '50%',
//   },

//   //modal view style
//   centeredView: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   modalView: {
//     // marginBottom: normalise(10),
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     position: 'absolute',
//     backgroundColor: Colors.darkerblack,
//     // margin: 20,
//     padding: 20,
//     paddingTop: normalise(24),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     height: '80%',
//   },
//   openButton: {
//     backgroundColor: '#F194FF',
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//   },
// });

// export default MySessionDetailScreen;

// {
//   /* <TouchableOpacity
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         opacity: 0.6,
//                       }}>
//                       <Image
//                         source={ImagePath.add_white}
//                         style={styles.inviteIcon}
//                         resizeMode="cover"
//                       />
//                       <Text
//                     style={[
//                       styles.listItemHeaderSongTextTitle,
//                       {marginLeft: normalise(8), fontSize: normalise(13)},
//                     ]}
//                     numberOfLines={2}>
//                     Send Invite
//                   </Text>
//                     </TouchableOpacity> */
// }

/************************** WORKING ***********************************/

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
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import {useSelector, useDispatch} from 'react-redux';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
// import toast from '../../utils/helpers/ShowErrorAlert';
import toast from '../../utils/helpers/ShowErrorAlert';
import {
  getSessionDetailRequest,
  startSessionRequest,
} from '../../action/SessionAction';
import socketService from '../../utils/socket/socketService';
import useTrackPlayer, {addTracks} from '../../hooks/useTrackPlayer';
import TrackPlayerComponent from '../common/TrackPlayerComponent';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
  usePlaybackState,
  useProgress,
  State,
} from 'react-native-track-player';
import {TrackProgress} from '../common/Progress';
import {hitSlop} from '../../widgets/HeaderComponent';
import Popover from 'react-native-popover-view';
import ActivityListItem from './ListCells/ActivityListItem';
import Seperator from './ListCells/Seperator';
import EmptyComponent from '../Empty/EmptyComponent';
import {
  sendSessionInvitationToUser,
  sendSessionInvitationToUserIdleStatus,
  userSearchRequest,
} from '../../action/UserAction';
import {
  START_SESSION_JOINEE_FAILURE,
  START_SESSION_JOINEE_REQUEST,
  SEND_SESSION_INVITATION_FAILURE,
  SEND_SESSION_INVITATION_SUCCESS,
  START_SESSION_SUCCESS,
} from '../../action/TypeConstants';
import {usePlayFullAppleMusic} from '../../hooks/usePlayFullAppleMusic';
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

// let status;

function MySessionDetailScreen(props) {
  let sendSong = false;
  // console.log(props?.route?.params, 'these are params')
  // const { currentSession } = props?.route?.params
  // console.log(currentSession, 'its current sessionI')
  const {width, height} = useWindowDimensions();
  const [islive, setIsLive] = useState(false);
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [userDataList, setUserDataList] = useState([]);
  const [usersSearchText, setUsersSearchText] = useState('');
  const [seletedUserToInvite, setSelectedUserToInvite] = useState([]);
  const [status, setStatus] = useState('');
  const {isPlaying: appleFullSongPlaying} = useIsPlaying();
  console.log(appleFullSongPlaying, 'this is my current song>>>>>>');
  const {playTrack, pauseTrack} = useTrackPlayer();

  const {isAuthorizeToAccessAppleMusic, haveAppleMusicSubscription} =
    useContext(AppleMusicContext);

  const {onToggle, checkPlaybackState, setPlaybackQueue, resetPlaybackQueue} =
    usePlayFullAppleMusic();

  const [playerAcceptedSongs, setPlayerAcceptedSongs] = useState([]);
  const [listenSessionStart, setListenSessionStart] = useState(null);
  const [currentListners, setCurrentListeners] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // const { position, duration } = useProgress(200);
  const playerState = usePlaybackState();
  // console.log(playerState, 'its play back state');
  const [currentTrack, setCurrentTrack] = useState(0);

  const dispatch = useDispatch();
  const userProfileResp = useSelector(
    state => state.UserReducer.userProfileResp,
  );
  const userTokenData = useSelector(state => state.TokenReducer);
  const sessionReduxData = useSelector(state => state.SessionReducer);
  const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data;
  const currentSessionLiveInfo = sessionReduxData?.currentSessionSong?.data;
  const userReduxData = useSelector(state => state.UserReducer);
  const userSearchList = useSelector(state => state.UserReducer.userSearch);
  const userInviteLoader = useSelector(state => state.UserReducer.inviteLoader);

  //TRACK PLAYER DURATION ADN PROGRESS HANDLING FOR APPLE AND APPLE PREVIEW
  const {
    progress,
    duration: appleFullSongDuration,
    resetProgress,
  } = useMusicPlayer();
  const {position, duration} = useProgress(200);
  const positionRef = useRef(null);
  const playerAcceptedSongsRef = useRef([]);
  const {song: currentPlayinSongData} = useCurrentSong();
  console.log(sessionReduxData?.startSessionLoading, 'thiisissong');
  //USEEFFECT HOOKS++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // useEffect(() => {
  //   const playbackListener = Player.addListener(
  //     'onPlaybackStateChange',
  //     state => {
  //       console.log('New Playback State:', state);
  //       setCurrentPlayingSong(state);
  //     },
  //   );

  //   // Clean up on unmount
  //   return () => {
  //     playbackListener.remove();
  //   };
  // }, [appleFullSongPlaying]);

  useEffect(() => {
    if (
      currentPlayinSongData &&
      Object.keys(currentPlayinSongData)?.length > 0 &&
      islive
    ) {
      let currentSongId = currentPlayinSongData?.id;
      let playingSongIndex = playerAcceptedSongsRef.current.findIndex(
        item => item == currentSongId,
      );
      // console.log(playingSongIndex, 'its playing song index');
      if (playingSongIndex != currentTrack) {
        setCurrentTrack(playingSongIndex);
      }
    }
  }, [currentPlayinSongData]);

  useEffect(() => {
    setUserDataList(userSearchList);
  }, [userSearchList]);

  useEffect(() => {
    if (checkIsAppleStatus) {
      positionRef.current = progress; //FOR APPLE FULL MUSIC
    } else {
      positionRef.current = position; //FOR APPLE/SPOTIFY PREVIEW
    }
  }, [position, progress]);

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

  //// not try with when saparate the socket initalization
  useEffect(() => {
    let isMounted = true;
    const initializeSocket = async () => {
      try {
        await socketService.initializeSocket(userTokenData?.token);
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    if (userTokenData?.token) {
      initializeSocket();
    }

    return () => {
      isMounted = false;
      socketService.disconnect(); // Disconnect on component unmount or token change
    };
  }, [userTokenData?.token]);

  // Lets emit the other event when session is live and depends stop, start , position and playing state
  useEffect(() => {
    let intervalId;
    let isMounted = true;
    const handleStartSession = sessionData => {
      if (!isMounted) return;
      setListenSessionStart(sessionData);
    };

    // Setup listeners and interval
    const setupListenersAndInterval = () => {
      try {
        // Add event listeners
        // socketService.on('start_session', handleStartSession);
        socketService.on('session_users_status', handleListerUserStatus);

        // Start interval if live
        if (islive && isMounted) {
          intervalId = setInterval(() => {
            const emitObjData = {
              hostId: userProfileResp?._id,
              // startAudioMixing: playerState?.state === 'playing' ?? false,
              playIndex: currentTrack ?? -1,
              playLoading: false,
              currentTime: positionRef.current,
              startedAt: Date.now(),
              pausedAt: null,
              sessionId: sessionDetailReduxdata?._id,
            };

            emitObjData.startAudioMixing = checkIsAppleStatus
              ? appleFullSongPlaying
              : playerState?.state === 'playing'
              ? true
              : false;
            // console.log(emitObjData, 'this is the emit data');
            socketService.emit('session_play_status', emitObjData);
          }, 1000);
        }
      } catch (error) {
        console.error('Error setting up listeners:', error);
      }
    };

    setupListenersAndInterval();
    // Cleanup on unmount or dependency change
    return () => {
      isMounted = false;
      clearInterval(intervalId);
      // socketService.off('start_session', handleStartSession);
      socketService.off('session_users_status', handleListerUserStatus);
    };
  }, [
    islive,
    playerState?.state,
    currentTrack,
    appleFullSongPlaying,
    // position,
  ]);

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

  useEffect(() => {
    const handleAddTrack = async () => {
      if (islive && sessionDetailReduxdata?.session_songs?.length) {
        let getTrackRelatedSong;
        if (checkIsAppleStatus) {
          getTrackRelatedSong = () => {
            return sessionDetailReduxdata.session_songs.map(
              item => item?.apple_song_id ?? '',
            );
          };
        } else {
          getTrackRelatedSong = () => {
            return sessionDetailReduxdata.session_songs.map(item => ({
              id: item._id,
              url: item.song_uri,
              title: item.song_name,
              artist: item.artist_name,
              artwork: item.song_image,
              apple_song_id: item?.apple_song_id ?? '',
            }));
          };
        }
        const newArray = getTrackRelatedSong();
        console.log(newArray, 'this is song arrau');
        setPlayerAcceptedSongs(newArray);
        playerAcceptedSongsRef.current = newArray;
        if (checkIsAppleStatus) {
          MusicKit.setPlaybackQueueList(newArray ?? [], 'song');
          setCurrentTrack(0);
          setTimeout(() => {
            Player.play();
          }, 1000);
        } else {
          await addTracks(newArray);
          await TrackPlayer.play();
        }
      }
    };
    if (islive) {
      handleAddTrack();
    }
  }, [
    islive,
    //  sessionDetailReduxdata
  ]);

  useEffect(() => {
    if (sessionReduxData?.currentSessionSong && sessionDetailReduxdata) {
      setIsLive(sessionDetailReduxdata?.isLive);
      if (checkIsAppleStatus) {
        if (!sessionDetailReduxdata?.isLive) {
          // Alert.alert('reset');
          resetPlaybackQueue();
          setCurrentTrack(null); // addded later when handling apple full music player
          resetProgress();
        }
      } else {
        if (!sessionDetailReduxdata?.isLive) {
          // Alert.alert('Reset')
          TrackPlayer.reset();
        }
      }
    }
  }, [sessionDetailReduxdata?.isLive]);

  useEffect(() => {
    if (
      userReduxData.status == SEND_SESSION_INVITATION_FAILURE ||
      userReduxData.status == SEND_SESSION_INVITATION_SUCCESS
    ) {
      handleNavigation();
    }
  }, [userReduxData.status, sessionReduxData.status]);

  useEffect(() => {
    if (!islive) {
      setCurrentListeners([]);
    }
  }, [islive]);

  //helperss***********************************************************************************

  const handleNavigation = () => {
    if (status === '' || status !== userReduxData.status) {
      switch (userReduxData.status) {
        case SEND_SESSION_INVITATION_FAILURE:
          setStatus(SEND_SESSION_INVITATION_FAILURE);
          toast(
            'Error',
            userReduxData?.error?.message ??
              'Something Went Wrong, Please Try Again',
          );
          setTimeout(() => {
            dispatch(
              sendSessionInvitationToUserIdleStatus({status: '', error: {}}),
            );
          }, 300);
          break;
        case SEND_SESSION_INVITATION_SUCCESS:
          setStatus(SEND_SESSION_INVITATION_SUCCESS);
          setModalVisible(!modalVisible);
          setUserDataList([]);
          setUsersSearchText('');
          setSelectedUserToInvite([]);
          setTimeout(() => {
            toast('Success', 'Invitation sent successfully');
            dispatch(
              sendSessionInvitationToUserIdleStatus({status: '', error: {}}),
            );
          }, 300);
          break;
        default:
          setStatus('');
          break;
      }
    }
  };

  const handleListerUserStatus = res => {
    if (res && res?.message) {
      toast('Error', res?.message);
    }
    setCurrentListeners(res?.users);
  };

  function format(seconds) {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  const handleStartSession = () => {
    if (
      sessionDetailReduxdata?.sessionRegisterType === 'apple' &&
      !checkIsAppleStatus
    ) {
      Alert.alert(
        "You don't have apple music subscription, you can't host the session, Apple music subscription is required!",
      );
      return;
    } else {
      const requestObj = {
        isLive: true,
        sessionId: sessionDetailReduxdata?._id,
      };
      dispatch(startSessionRequest(requestObj));
    }
  };

  const handleStopKillSession = () => {
    const requestObj = {
      isLive: false,
      sessionId: sessionDetailReduxdata?._id,
    };
    dispatch(startSessionRequest(requestObj));
  };

  const handleUpdateSession = () => {
    const requestObj = {
      isPrivate: !sessionDetailReduxdata?.isPrivate,
      sessionId: sessionDetailReduxdata?._id,
    };
    dispatch(startSessionRequest(requestObj));
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.state == State.nextTrack) {
      let index = await TrackPlayer.getCurrentTrack();
      // Alert.alert(index.toString())
      setCurrentTrack(index);
    }
  });

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    // console.log('✅ Playback finished for the last track');
    TrackPlayer.reset();
    handleStopKillSession();
  });

  // const listenLastTrackEnd = () => {
  //   if (currentTrack && playerState?.state != 'none') {
  //     let listLastSong = sessionDetailReduxdata?.session_songs?.length - 1;
  //     // console.log(currentTrack, listLastSong, 'yes it is last song1');
  //     if (currentTrack == listLastSong && duration > 0) {
  //       console.log(currentTrack, listLastSong, 'yes it is last song');
  //       console.log(playerState?.state, 'its statu inlast');
  //       if (position == duration) {
  //         TrackPlayer.reset();
  //       }
  //     }
  //   }
  // };
  // useEffect(() => {
  //   if (
  //     sessionDetailReduxdata?.session_songs?.length &&
  //     currentTrack !== null
  //   ) {
  //     console.log('hheheh', position, duration);
  //     listenLastTrackEnd();
  //   }
  // }, [currentTrack, position]);

  // SEARCH AND CLEAR FUNCTIONS
  const search = text => {
    if (text.length >= 1) {
      isInternetConnected()
        .then(() => {
          // disableduserSearchReq({keyword: text}, sendSong);
          dispatch(userSearchRequest({keyword: text}, sendSong));
        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet');
        });
    }
  };

  const handleUserToAddInvite = userId => {
    const isExist = seletedUserToInvite.some(item => item == userId);
    if (isExist) {
      const filteredArray = seletedUserToInvite.filter(item => item !== userId);
      setSelectedUserToInvite(filteredArray);
    } else {
      setSelectedUserToInvite([...seletedUserToInvite, userId]);
    }
  };

  const handleSendInvitation = () => {
    const objectRequest = {
      id: sessionDetailReduxdata?._id,
      invited_users: seletedUserToInvite,
    };
    // console.log(objectRequest, 'dfdfdf>>');
    // return;
    dispatch(sendSessionInvitationToUser(objectRequest));
  };

  const changeTrack = () => {
    const songs = playerAcceptedSongsRef.current;
    console.log(currentTrack, songs?.length - 1, 'thi is texting ');
    console.log(currentTrack < songs?.length - 1, 'its vlue');
    if (currentTrack < songs?.length - 1) {
      console.log('next track>>>');
      let nextTrack = currentTrack + 1;
      // resetProgress();
      setPlaybackQueue(songs[nextTrack]);
      setCurrentTrack(nextTrack);
      console.log('next track>>>1', nextTrack);
      setTimeout(() => {
        Player.play();
        // Alert.alert('play');
      }, 500);
    }
  };

  //components *************************************************************

  const renderModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        presentationStyle={'overFullScreen'}>
        <ImageBackground
          source={ImagePath ? ImagePath.page_gradient : null}
          style={styles.centeredView}>
          <Loader visible={userInviteLoader} />
          <View style={styles.modalView}>
            {seletedUserToInvite && seletedUserToInvite?.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  handleSendInvitation();
                }}
                style={{
                  padding: 10,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderRadius: 5,
                  backgroundColor: Colors.darkerblack,
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  marginRight: normalise(10),
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(10),
                    fontWeight: 'bold',
                  }}>
                  SEND
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                marginTop: normalise(16),
                marginBottom: normalise(16),
              }}>
              <TextInput
                style={{
                  height: normalise(35),
                  borderRadius: normalise(8),
                  padding: normalise(10),
                  color: Colors.white,
                  marginHorizontal: normalise(12),
                  backgroundColor: Colors.fadeblack,
                  paddingLeft: normalise(35),
                }}
                keyboardAppearance="dark"
                autoCorrect={false}
                value={usersSearchText}
                placeholder={'Search Users'}
                placeholderTextColor={Colors.darkgrey}
                onChangeText={text => {
                  search(text);
                  setUsersSearchText(text);
                }}
              />
              <Image
                source={ImagePath.searchicongrey}
                style={{
                  position: 'absolute',
                  height: normalise(15),
                  width: normalise(15),
                  bottom: normalise(10),
                  paddingLeft: normalise(35),
                  marginHorizontal: normalise(12),
                  transform: [{scaleX: -1}],
                }}
                resizeMode="contain"
              />
              {usersSearchText && (
                <TouchableOpacity
                  onPress={() => {
                    setUserDataList([]);
                    setUsersSearchText('');
                  }}
                  style={{
                    padding: 10,
                    paddingTop: 4,
                    paddingBottom: 4,
                    borderRadius: 5,
                    backgroundColor: Colors.darkerblack,
                    position: 'absolute',
                    right: 12,
                    bottom: Platform.OS === 'ios' ? normalise(8) : normalise(8),
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
            {userDataList && userDataList?.length == 0 ? (
              <EmptyComponent
                image={ImagePath.emptyUser}
                text={
                  'Search above to find users you want to send invitation by either their username or just typing their name.'
                }
                title={'Search Users to Send Invitation'}
              />
            ) : (
              <View style={{flex: 1}}>
                {/* {console.log(userDataList, 'this list of usered>>>>>>>>>')} */}
                <FlatList
                  style={{
                    height: Dimensions.get('window').height - 295,
                  }}
                  data={userDataList ?? []}
                  renderItem={renderUserData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={Seperator}
                />
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                setUserDataList([]);
                setUsersSearchText('');
                setSelectedUserToInvite([]);
              }}
              style={{
                marginBottom: normalise(20),
                height: normalise(40),
                backgroundColor: Colors.fadeblack,
                opacity: 10,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: normalise(24),
              }}>
              <Text
                style={{
                  fontSize: normalise(12),
                  fontFamily: 'ProximaNova-Bold',
                  color: Colors.white,
                }}>
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>
    );
  };

  function renderUserData({item}) {
    const isAlreadyExist = seletedUserToInvite.includes(item?._id);
    return (
      <ActivityListItem
        image={constants.profile_picture_base_url + item.profile_image}
        user={item.username}
        type={false}
        userId={item?.user_id}
        // loginUserId={props.userProfileResp?._id}
        follow={item?.isFollowing ? false : true}
        // bottom={item.index === props.userSearch.length - 1 ? true : false}
        // marginBottom={
        //   item.index === props.userSearch.length - 1
        //     ? normalise(80)
        //     : normalise(0)
        // }
        onPressImage={() => {
          null;
          // props.navigation.navigate('OthersProfile', {
          //   id: item.item._id,
          //   following: item.item.isFollowing,
          // });
        }}
        image2={isAlreadyExist ? ImagePath?.blueTick : ImagePath?.addButton}
        onPress={() => {
          handleUserToAddInvite(item?._id);
          // props.followReq({follower_id: data.item._id});
        }}
        TouchableOpacityDisabled={false}
        localImage={true}
      />
    );
  }

  const handlePlayPauseViaButton = () => {
    if (checkIsAppleStatus) {
      onToggle();
      // appleFullSongPlaying ? Player.pause() : Player.play();
    } else {
      playerState?.state === 'playing' ? pauseTrack() : playTrack();
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      <Loader
        visible={
          sessionReduxData?.loading ||
          sessionReduxData?.startSessionLoading ||
          userInviteLoader
        }
      />
      <LinearGradient
        colors={
          islive
            ? ['#101119', '#101119', '#101119']
            : ['#0E402C', '#101119', '#360455']
        }
        style={{flex: 1}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        {Platform.OS === 'android' && (
          <StatusBar backgroundColor={Colors.darkerblack} />
        )}
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.headerStyle}>
            <Popover
              isVisible={showPopover}
              onRequestClose={() => setShowPopover(false)}
              from={
                <TouchableOpacity
                  onPress={() =>
                    islive ? setShowPopover(true) : props.navigation.goBack()
                  }
                  // onPress={() =>
                  //   islive ? handleStopKillSession() : props.navigation.goBack()
                  // }
                  hitSlop={hitSlop}>
                  <Image
                    source={islive ? ImagePath.greycross : ImagePath.backicon}
                    style={{
                      width: normalise(16),
                      height: islive ? normalise(17) : normalise(14),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              }>
              <View style={{}}>
                <Text style={[styles.confrimationText, {width: '100%'}]}>
                  Are you sure, do you want to close this session!
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
                      handleStopKillSession();
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

            {!islive && !props.route.params.isforEdit && (
              <TouchableOpacity
                style={[{alignItems: 'center', flexDirection: 'row'}]}
                onPress={handleStartSession}
                hitSlop={hitSlop}>
                <Text
                  style={[
                    styles.listItemHeaderSongTextTitle,
                    {marginBottom: normalise(0), fontSize: normalise(9)},
                  ]}
                  numberOfLines={2}>
                  START{'\n'}SESSION
                </Text>
                <Image
                  source={ImagePath.playSolid}
                  style={styles.startSessionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}>
              <View style={styles.listItemHeaderSongDetails}>
                <Text style={styles.hostedText} numberOfLines={1}>
                  Hosted by
                </Text>
                <View style={styles.nameWrapper}>
                  <Text
                    style={[
                      styles.listItemHeaderSongTextTitle,
                      {textTransform: 'uppercase', marginBottom: normalise(0)},
                    ]}
                    numberOfLines={1}>
                    {userProfileResp?.username}
                  </Text>
                  {/* <Image
                    source={ImagePath.blueTick}
                    style={{width: 16, height: 16}}
                    resizeMode="contain"
                  /> */}
                </View>
                <Image
                  source={
                    userProfileResp?.profile_image
                      ? {
                          uri:
                            constants.profile_picture_base_url +
                            userProfileResp?.profile_image,
                        }
                      : ImagePath.userPlaceholder
                  }
                  style={styles.listItemHeaderSongTypeIcon}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    styles.listItemHeaderSongTextTitle,
                    {marginTop: normalise(10), marginBottom: 0},
                  ]}
                  numberOfLines={1}>
                  NOW PLAYING
                </Text>
                <View
                  style={[
                    styles.bottomLineStyle,
                    {width: width / 3, marginTop: normalise(6)},
                  ]}></View>
              </View>
              <View style={[styles.playListItemContainer]}>
                <FlatList
                  data={sessionDetailReduxdata?.session_songs}
                  renderItem={({item, index}) => {
                    // console.log(item, 'thi is the item', currentPlayingSong);
                    // const iscurrentPlaying = currentTrack == index;
                    // const iscurrentPlaying =
                    //   currentPlayingSong?.currentSong?.id ==
                    //   item?.apple_song_id;
                    const iscurrentPlaying =
                      currentPlayinSongData?.id == item?.apple_song_id;
                    // playerState == State.Playing &&
                    return (
                      <View
                        style={[
                          styles.itemWrapper,
                          // (iscurrentPlaying ||
                          //   playerState?.state == 'none') && {opacity: 1},
                          !iscurrentPlaying && islive && {opacity: 0.4},
                        ]}>
                        {/* {iscurrentPlaying ? (
                          <TouchableOpacity
                            disabled={iscurrentPlaying ? false : true}
                            // onPress={handlePlayPauseViaButton}
                            style={styles.playButtonStyle}>
                            <Image
                              // source={(isPlaying && iscurrentPlaying) ? ImagePath.pause : ImagePath.play}
                              source={
                                (appleFullSongPlaying ||
                                  playerState?.state == 'playing') &&
                                iscurrentPlaying
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
                        ) : (
                          <View style={styles.playButtonStyle}></View>
                        )} */}

                        {islive ? (
                          iscurrentPlaying ? (
                            <TouchableOpacity
                              disabled={!iscurrentPlaying}
                              // onPress={handlePlayPauseViaButton}
                              style={styles.playButtonStyle}>
                              <Image
                                // source={(isPlaying && iscurrentPlaying) ? ImagePath.pause : ImagePath.play}
                                source={
                                  (appleFullSongPlaying ||
                                    playerState?.state === 'playing') &&
                                  iscurrentPlaying
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
                          ) : (
                            <View style={styles.playButtonStyle}></View>
                          )
                        ) : null}

                        <View style={{flexDirection: 'row'}}>
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
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item?._id}
                />
              </View>
            </View>
            {islive ? (
              currentListners?.length > 0 ? (
                <View style={styles.listenersContainer}>
                  <View style={styles.listenersTextWrapper}>
                    <Text
                      style={[
                        styles.listItemHeaderSongTextTitle,
                        {marginTop: normalise(5), fontSize: normalise(12)},
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
                  <ScrollView style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}>
                      {currentListners?.map((item, index) => {
                        return (
                          <View
                            style={[
                              styles.joineeIitemWrapper,
                              // index == 0 &&
                              //   currentListners?.length > 1 && {
                              //     marginLeft: normalise(40),
                              //   },
                              // index == 3 && {marginRight: normalise(40)},
                            ]}>
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
                  </ScrollView>
                </View>
              ) : (
                <View>
                  <Text style={styles.noJoineeText}>No listeners available</Text>
                </View>
              )
            ) : null}
          </View>
          {!props.route.params.isforEdit && (
            <TrackProgress
              setModalVisible={() => setModalVisible(!modalVisible)}
              modalVisible={modalVisible}
              duration={appleFullSongDuration}
              position={progress}
              isShow={sessionDetailReduxdata?.isPrivate ? true : false}
            />
          )}
          {props.route.params.isforEdit && (
            <View style={{}}>
              <TouchableOpacity
                style={{
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleUpdateSession()}>
                <Text
                  style={[
                    {
                      textAlign: 'center',
                      color: Colors.meta,
                      fontSize: normalise(12),
                      marginBottom: normalise(3),
                    },
                  ]}
                  numberOfLines={2}>
                  {sessionDetailReduxdata?.isPrivate ? 'Private' : 'Public'}
                </Text>
                <Image
                  source={
                    sessionDetailReduxdata?.isPrivate
                      ? ImagePath.toggleOn
                      : ImagePath.toggleOff
                  }
                  style={{width: 45}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
        {renderModal()}
      </LinearGradient>
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
    marginBottom: normalise(8),
    flex: 1,
    width: '100%',
    alignItems: 'center',
    // opacity: 0.4,
    opacity: 1,
    marginHorizontal: normalise(10),
  },
  songListItemImage: {
    borderRadius: normalise(5),
    height: normalise(40),
    width: normalise(40),
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
    height: normalise(80),
    width: normalise(80),
    borderRadius: normalise(80),
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  listItemHeaderSongText: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(10),
    width: '100%',
    height: '100%',
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.meta,
    flex: 1,
    justifyContent: 'center',
    marginRight: normalise(15),
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
    marginTop: normalise(8),
    backgroundColor: Colors.white,
    alignSelf: 'center',
    opacity: 0.7,
    height: 0.5,
  },

  nameWrapper: {
    flexDirection: 'row',
    // marginTop: normalise(2),
    marginBottom: normalise(4),
    justifyContent: 'center',
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
    alignItems: 'center',
    flex: 0.5,
  },
  joineeIitemWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    marginHorizontal: normalise(11),
    marginBottom: normalise(11),
  },
  inviteIcon: {
    borderRadius: normalise(5),
    height: normalise(20),
    width: normalise(20),
  },
  headerStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalise(20),
    paddingVertical: normalise(15),
    height: 65,
  },
  startSessionIcon: {
    width: 14,
    height: 14,
  },
  hostedText: {
    color: Colors.meta,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
  },
  listenersTextWrapper: {
    flexDirection: 'row',
  },
  confrimationText: {
    color: Colors.black,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
    // width: '50%',
    // paddingVertical: 10,
    textAlign: 'center',
    padding: 15,
    fontWeight: '600',
  },
  optionText: {
    borderEndWidth: 1,
    borderRightColor: Colors.meta,
    width: '50%',
  },

  //modal view style
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    // marginBottom: normalise(10),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: Colors.darkerblack,
    // margin: 20,
    padding: 20,
    paddingTop: normalise(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '80%',
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
  noJoineeText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
    textAlign: 'center',
    marginTop: normalise(20),
  }
});

export default MySessionDetailScreen;

/************************************************************  OPTIMIZATION **************************/

// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   ImageBackground,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Colors from '../../assests/Colors';
// import ImagePath from '../../assests/ImagePath';
// import normalise from '../../utils/helpers/Dimens';
// import StatusBar from '../../utils/MyStatusBar';
// import {useSelector, useDispatch} from 'react-redux';
// import constants from '../../utils/helpers/constants';
// import Loader from '../../widgets/AuthLoader';
// import isInternetConnected from '../../utils/helpers/NetInfo';
// // import toast from '../../utils/helpers/ShowErrorAlert';
// import toast from '../../utils/helpers/ShowErrorAlert';
// import {
//   getSessionDetailRequest,
//   startSessionRequest,
// } from '../../action/SessionAction';
// import socketService from '../../utils/socket/socketService';
// import useTrackPlayer, {addTracks} from '../../hooks/useTrackPlayer';
// import TrackPlayer, {
//   Event,
//   useTrackPlayerEvents,
//   usePlaybackState,
//   useProgress,
//   State,
// } from 'react-native-track-player';
// import {TrackProgress} from '../common/Progress';
// import {hitSlop} from '../../widgets/HeaderComponent';
// import Popover from 'react-native-popover-view';
// import ActivityListItem from './ListCells/ActivityListItem';
// import Seperator from './ListCells/Seperator';
// import EmptyComponent from '../Empty/EmptyComponent';
// import {
//   sendSessionInvitationToUser,
//   sendSessionInvitationToUserIdleStatus,
//   userSearchRequest,
// } from '../../action/UserAction';
// import {
//   SEND_SESSION_INVITATION_FAILURE,
//   SEND_SESSION_INVITATION_SUCCESS,
// } from '../../action/TypeConstants';
// import {usePlayFullAppleMusic} from '../../hooks/usePlayFullAppleMusic';
// import {
//   AppleMusicContext,
//   useMusicPlayer,
// } from '../../context/AppleMusicContext';
// import {
//   MusicKit,
//   Player,
//   useCurrentSong,
//   useIsPlaying,
// } from '@lomray/react-native-apple-music';

// // let status;

// function MySessionDetailScreen(props) {
//   let sendSong = false;
//   const {width, height} = useWindowDimensions();
//   const [islive, setIsLive] = useState(false);
//   const [showPopover, setShowPopover] = useState(false);
//   const [userDataList, setUserDataList] = useState([]);
//   const [usersSearchText, setUsersSearchText] = useState('');
//   const [seletedUserToInvite, setSelectedUserToInvite] = useState([]);
//   const [status, setStatus] = useState('');
//   const {isPlaying: appleFullSongPlaying} = useIsPlaying();
//   console.log(appleFullSongPlaying, 'this is my current song>>>>>>');

//   const {isAuthorizeToAccessAppleMusic, haveAppleMusicSubscription} =
//     useContext(AppleMusicContext);

//   const {onToggle, checkPlaybackState, setPlaybackQueue, resetPlaybackQueue} =
//     usePlayFullAppleMusic();
//   const [playerAcceptedSongs, setPlayerAcceptedSongs] = useState([]);
//   const [listenSessionStart, setListenSessionStart] = useState(null);
//   const [currentListners, setCurrentListeners] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [currentTrack, setCurrentTrack] = useState(0);
//   const dispatch = useDispatch();
//   const userProfileResp = useSelector(
//     state => state.UserReducer.userProfileResp,
//   );
//   const userTokenData = useSelector(state => state.TokenReducer);
//   const sessionReduxData = useSelector(state => state.SessionReducer);
//   const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data;
//   const currentSessionLiveInfo = sessionReduxData?.currentSessionSong?.data;
//   const userReduxData = useSelector(state => state.UserReducer);
//   const userSearchList = useSelector(state => state.UserReducer.userSearch);
//   const userInviteLoader = useSelector(state => state.UserReducer.inviteLoader);

//   //TRACK PLAYER DURATION ADN PROGRESS HANDLING FOR APPLE AND APPLE PREVIEW
//   const {
//     progress,
//     duration: appleFullSongDuration,
//     resetProgress,
//   } = useMusicPlayer();

//   const {position, duration} = useProgress(200);
//   const positionRef = useRef(null);
//   const playerAcceptedSongsRef = useRef([]);
//   const {song: currentPlayinSongData} = useCurrentSong();

//   //USEEFFECT HOOKS++++++++++++++++++++++++++++++++++++++++++++++++++++++

//   // AT START WE CONNECT SOCKET INTIALIZATION
//   useEffect(() => {
//     let isMounted = true;
//     const initializeSocket = async () => {
//       try {
//         await socketService.initializeSocket(userTokenData?.token);
//       } catch (error) {
//         console.error('Socket initialization error:', error);
//       }
//     };
//     if (userTokenData?.token) {
//       initializeSocket();
//     }
//     return () => {
//       isMounted = false;
//       socketService.disconnect(); // Disconnect on component unmount or token change
//     };
//   }, [userTokenData?.token]);

//   //GET API DATA OF CURRENT SESSION
//   useEffect(() => {
//     isInternetConnected()
//       .then(() => {
//         dispatch(
//           getSessionDetailRequest({sessionId: props?.route?.params?.sessionId}),
//         );
//       })
//       .catch(() => {
//         toast('Error', 'Please Connect To Internet');
//       });
//   }, []);

//   //SET STATE OF THE CURRENT SESSION IS LIVE OR NOT
//   useEffect(() => {
//     if (sessionReduxData?.currentSessionSong && sessionDetailReduxdata) {
//       setIsLive(sessionDetailReduxdata?.isLive);
//       if (checkIsAppleStatus) {
//         if (!sessionDetailReduxdata?.isLive) {
//           resetPlaybackQueue();
//           setCurrentTrack(null); // addded later when handling apple full music player
//           resetProgress();
//         }
//       }
//     }
//   }, [sessionDetailReduxdata?.isLive]);

//   // WHEN SESSSION IS LIVE THEN WE INITIALIZE PLAYER AND EXTRACT SONG ID AND SETPLAYBACKQUE AND START PALYING AFTER DELAY AS TAKES TIME TO INITILIZE
//   useEffect(() => {
//     if (islive) {
//       handleAddTrack();
//     } else {
//       setCurrentListeners([]);
//     }
//   }, [islive]);

//   //HANDLE TOAST AND STATES OF STATUS AND OTHER PERFORM SOMETHING AFTER STATUS UPDATE
//   useEffect(() => {
//     if (
//       userReduxData.status == SEND_SESSION_INVITATION_FAILURE ||
//       userReduxData.status == SEND_SESSION_INVITATION_SUCCESS
//     ) {
//       handleNavigation();
//     }
//   }, [userReduxData.status, sessionReduxData.status]);

//   //SET USER SEARCH STATE AFTRE RESULT
//   useEffect(() => {
//     setUserDataList(userSearchList);
//   }, [userSearchList]);

//   useEffect(() => {
//     if (checkIsAppleStatus) {
//       positionRef.current = progress; //FOR APPLE FULL MUSIC
//     }
//   }, [position, progress]);

//   // Lets emit the other event when session is live and depends stop, start , position and playing state
//   useEffect(() => {
//     let intervalId;
//     let isMounted = true;
//     // Setup listeners and interval
//     const setupListenersAndInterval = () => {
//       try {
//         // Add event listeners
//         // socketService.on('start_session', handleStartSession);
//         socketService.on('session_users_status', handleListerUserStatus);

//         // Start interval if live
//         if (islive && isMounted) {
//           intervalId = setInterval(() => {
//             const emitObjData = {
//               hostId: userProfileResp?._id,
//               // startAudioMixing: playerState?.state === 'playing' ?? false,
//               playIndex: currentTrack ?? -1,
//               playLoading: false,
//               currentTime: positionRef.current,
//               startedAt: Date.now(),
//               pausedAt: null,
//               sessionId: sessionDetailReduxdata?._id,
//             };

//             emitObjData.startAudioMixing = checkIsAppleStatus
//               ? appleFullSongPlaying
//               : playerState?.state === 'playing'
//               ? true
//               : false;
//             // console.log(emitObjData, 'this is the emit data');
//             socketService.emit('session_play_status', emitObjData);
//           }, 1000);
//         }
//       } catch (error) {
//         console.error('Error setting up listeners:', error);
//       }
//     };

//     setupListenersAndInterval();
//     // Cleanup on unmount or dependency change
//     return () => {
//       isMounted = false;
//       clearInterval(intervalId);
//       socketService.off('session_users_status', handleListerUserStatus);
//     };
//   }, [
//     islive,
//     currentTrack,
//     appleFullSongPlaying,
//     // position,
//   ]);

//   useEffect(() => {
//     if (
//       currentPlayinSongData &&
//       Object.keys(currentPlayinSongData)?.length > 0 &&
//       islive
//     ) {
//       let currentSongId = currentPlayinSongData?.id;
//       let playingSongIndex = playerAcceptedSongsRef.current.findIndex(
//         item => item == currentSongId,
//       );
//       // console.log(playingSongIndex, 'its playing song index');
//       if (playingSongIndex != currentTrack) {
//         setCurrentTrack(playingSongIndex);
//       }
//     }
//   }, [currentPlayinSongData]);
//   //helperss***********************************************************************************

//   const handleNavigation = () => {
//     if (status === '' || status !== userReduxData.status) {
//       switch (userReduxData.status) {
//         case SEND_SESSION_INVITATION_FAILURE:
//           setStatus(SEND_SESSION_INVITATION_FAILURE);
//           toast(
//             'Error',
//             userReduxData?.error?.message ??
//               'Something Went Wrong, Please Try Again',
//           );
//           setTimeout(() => {
//             dispatch(
//               sendSessionInvitationToUserIdleStatus({status: '', error: {}}),
//             );
//           }, 300);
//           break;
//         case SEND_SESSION_INVITATION_SUCCESS:
//           setStatus(SEND_SESSION_INVITATION_SUCCESS);
//           setModalVisible(!modalVisible);
//           setUserDataList([]);
//           setUsersSearchText('');
//           setSelectedUserToInvite([]);
//           setTimeout(() => {
//             toast('Success', 'Invitation sent successfully');
//             dispatch(
//               sendSessionInvitationToUserIdleStatus({status: '', error: {}}),
//             );
//           }, 300);
//           break;
//         default:
//           setStatus('');
//           break;
//       }
//     }
//   };

//   const handleListerUserStatus = res => {
//     if (res && res?.message) {
//       toast('Error', res?.message);
//     }
//     setCurrentListeners(res?.users);
//   };

//   const handleStartSession = () => {
//     if (
//       sessionDetailReduxdata?.sessionRegisterType === 'apple' &&
//       !checkIsAppleStatus
//     ) {
//       Alert.alert(
//         "You don't have apple music subscription, you can't host the session, Apple music subscription is required!",
//       );
//       return;
//     } else {
//       const requestObj = {
//         isLive: true,
//         sessionId: sessionDetailReduxdata?._id,
//       };
//       dispatch(startSessionRequest(requestObj));
//     }
//   };

//   const handleStopKillSession = useCallback(() => {
//     const requestObj = {
//       isLive: false,
//       sessionId: sessionDetailReduxdata?._id,
//     };
//     dispatch(startSessionRequest(requestObj));
//   }, [sessionDetailReduxdata]);

//   const handleUpdateSession = useCallback(() => {
//     const requestObj = {
//       isPrivate: !sessionDetailReduxdata?.isPrivate,
//       sessionId: sessionDetailReduxdata?._id,
//     };
//     dispatch(startSessionRequest(requestObj));
//   }, [sessionDetailReduxdata]);

//   // SEARCH AND CLEAR FUNCTIONS
//   const search = text => {
//     if (text.length >= 1) {
//       isInternetConnected()
//         .then(() => {
//           dispatch(userSearchRequest({keyword: text}, sendSong));
//         })
//         .catch(() => {
//           toast('Error', 'Please Connect To Internet');
//         });
//     }
//   };

//   const handleUserToAddInvite = userId => {
//     const isExist = seletedUserToInvite.some(item => item == userId);
//     if (isExist) {
//       const filteredArray = seletedUserToInvite.filter(item => item !== userId);
//       setSelectedUserToInvite(filteredArray);
//     } else {
//       setSelectedUserToInvite([...seletedUserToInvite, userId]);
//     }
//   };

//   const handleSendInvitation = useCallback(() => {
//     const objectRequest = {
//       id: sessionDetailReduxdata?._id,
//       invited_users: seletedUserToInvite,
//     };
//     dispatch(sendSessionInvitationToUser(objectRequest));
//   }, [seletedUserToInvite, sessionDetailReduxdata]);

//   const handlePlayPauseViaButton = () => {
//     if (checkIsAppleStatus) {
//       onToggle();
//     }
//   };

//   // TO CHECK THAT USER APPLE STATUS
//   const checkIsAppleStatus = useMemo(() => {
//     if (
//       Platform.OS == 'ios' &&
//       isAuthorizeToAccessAppleMusic &&
//       haveAppleMusicSubscription &&
//       userTokenData?.registerType == 'apple'
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   }, [
//     isAuthorizeToAccessAppleMusic,
//     haveAppleMusicSubscription,
//     userTokenData?.registerType,
//   ]);

//   const handleAddTrack = async () => {
//     if (sessionDetailReduxdata?.session_songs?.length) {
//       let newArray;
//       if (checkIsAppleStatus) {
//         newArray = sessionDetailReduxdata.session_songs.map(
//           item => item?.apple_song_id ?? '',
//         );
//         console.log(newArray, 'this is song arrau');
//         setPlayerAcceptedSongs(newArray);
//         playerAcceptedSongsRef.current = newArray;
//         // MusicKit.setPlaybackQueue(newArray[0]);
//         MusicKit.setPlaybackQueueList(newArray ?? [], 'song');
//         setCurrentTrack(0);
//         setTimeout(() => {
//           Player.play();
//         }, 1000);
//       } else {
//         toast('error', 'Please check your apple Music Subscription!');
//         return;
//       }
//     } else {
//       toast('error', 'Something went wrong when initializing player!');
//     }
//   };

//   //components *************************************************************

//   const renderModal = () => {
//     return (
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         presentationStyle={'overFullScreen'}>
//         <ImageBackground
//           source={ImagePath ? ImagePath.page_gradient : null}
//           style={styles.centeredView}>
//           <Loader visible={userInviteLoader} />
//           <View style={styles.modalView}>
//             {seletedUserToInvite && seletedUserToInvite?.length > 0 && (
//               <TouchableOpacity
//                 onPress={() => {
//                   handleSendInvitation();
//                 }}
//                 style={{
//                   padding: 10,
//                   paddingTop: 4,
//                   paddingBottom: 4,
//                   borderRadius: 5,
//                   backgroundColor: Colors.darkerblack,
//                   position: 'absolute',
//                   right: 12,
//                   top: 12,
//                   marginRight: normalise(10),
//                 }}>
//                 <Text
//                   style={{
//                     color: Colors.white,
//                     fontSize: normalise(10),
//                     fontWeight: 'bold',
//                   }}>
//                   SEND
//                 </Text>
//               </TouchableOpacity>
//             )}
//             <View
//               style={{
//                 width: '100%',
//                 alignSelf: 'center',
//                 marginTop: normalise(16),
//                 marginBottom: normalise(16),
//               }}>
//               <TextInput
//                 style={{
//                   height: normalise(35),
//                   borderRadius: normalise(8),
//                   padding: normalise(10),
//                   color: Colors.white,
//                   marginHorizontal: normalise(12),
//                   backgroundColor: Colors.fadeblack,
//                   paddingLeft: normalise(35),
//                 }}
//                 keyboardAppearance="dark"
//                 autoCorrect={false}
//                 value={usersSearchText}
//                 placeholder={'Search Users'}
//                 placeholderTextColor={Colors.darkgrey}
//                 onChangeText={text => {
//                   search(text);
//                   setUsersSearchText(text);
//                 }}
//               />
//               <Image
//                 source={ImagePath.searchicongrey}
//                 style={{
//                   position: 'absolute',
//                   height: normalise(15),
//                   width: normalise(15),
//                   bottom: normalise(10),
//                   paddingLeft: normalise(35),
//                   marginHorizontal: normalise(12),
//                   transform: [{scaleX: -1}],
//                 }}
//                 resizeMode="contain"
//               />
//               {usersSearchText && (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setUserDataList([]);
//                     setUsersSearchText('');
//                   }}
//                   style={{
//                     padding: 10,
//                     paddingTop: 4,
//                     paddingBottom: 4,
//                     borderRadius: 5,
//                     backgroundColor: Colors.darkerblack,
//                     position: 'absolute',
//                     right: 12,
//                     bottom: Platform.OS === 'ios' ? normalise(8) : normalise(8),
//                     marginRight: normalise(10),
//                   }}>
//                   <Text
//                     style={{
//                       color: Colors.white,
//                       fontSize: normalise(10),
//                       fontWeight: 'bold',
//                     }}>
//                     CLEAR
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//             {userDataList && userDataList?.length == 0 ? (
//               <EmptyComponent
//                 image={ImagePath.emptyUser}
//                 text={
//                   'Search above to find users you want to send invitation by either their username or just typing their name.'
//                 }
//                 title={'Search Users to Send Invitation'}
//               />
//             ) : (
//               <View style={{flex: 1}}>
//                 <FlatList
//                   style={{
//                     height: Dimensions.get('window').height - 295,
//                   }}
//                   data={userDataList ?? []}
//                   renderItem={renderUserData}
//                   keyExtractor={(item, index) => index.toString()}
//                   showsVerticalScrollIndicator={false}
//                   ItemSeparatorComponent={Seperator}
//                 />
//               </View>
//             )}
//             <TouchableOpacity
//               onPress={() => {
//                 setModalVisible(!modalVisible);
//                 setUserDataList([]);
//                 setUsersSearchText('');
//                 setSelectedUserToInvite([]);
//               }}
//               style={{
//                 marginBottom: normalise(20),
//                 height: normalise(40),
//                 backgroundColor: Colors.fadeblack,
//                 opacity: 10,
//                 borderRadius: 6,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginTop: normalise(24),
//               }}>
//               <Text
//                 style={{
//                   fontSize: normalise(12),
//                   fontFamily: 'ProximaNova-Bold',
//                   color: Colors.white,
//                 }}>
//                 CANCEL
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ImageBackground>
//       </Modal>
//     );
//   };

//   function renderUserData({item}) {
//     const isAlreadyExist = seletedUserToInvite?.includes(item?._id);
//     return (
//       <ActivityListItem
//         image={constants.profile_picture_base_url + item?.profile_image}
//         user={item?.username}
//         type={false}
//         userId={item?.user_id}
//         follow={item?.isFollowing ? false : true}
//         onPressImage={() => {
//           null;
//         }}
//         image2={isAlreadyExist ? ImagePath?.blueTick : ImagePath?.addButton}
//         onPress={() => {
//           handleUserToAddInvite(item?._id);
//         }}
//         TouchableOpacityDisabled={false}
//         localImage={true}
//       />
//     );
//   }

//   return (
//     <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
//       <Loader
//         visible={
//           sessionReduxData?.loading ||
//           sessionReduxData?.startSessionLoading ||
//           userInviteLoader
//         }
//       />
//       <LinearGradient
//         colors={['#0E402C', '#101119', '#360455']}
//         style={{flex: 1}}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 1}}>
//         {Platform.OS === 'android' && (
//           <StatusBar backgroundColor={Colors.darkerblack} />
//         )}
//         <SafeAreaView style={{flex: 1}}>
//           <View style={styles.headerStyle}>
//             <Popover
//               isVisible={showPopover}
//               onRequestClose={() => setShowPopover(false)}
//               from={
//                 <TouchableOpacity
//                   onPress={() =>
//                     islive ? setShowPopover(true) : props.navigation.goBack()
//                   }
//                   hitSlop={hitSlop}>
//                   <Image
//                     source={islive ? ImagePath.greycross : ImagePath.backicon}
//                     style={{
//                       width: normalise(16),
//                       height: islive ? normalise(17) : normalise(14),
//                     }}
//                     resizeMode="contain"
//                   />
//                 </TouchableOpacity>
//               }>
//               <View style={{}}>
//                 <Text style={[styles.confrimationText, {width: '100%'}]}>
//                   Are you sure, do you want to close this session!
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-around',
//                     borderTopWidth: 1,
//                     borderTopColor: Colors.meta,
//                     marginVeTop: 10,
//                   }}>
//                   <TouchableOpacity
//                     style={styles.optionText}
//                     onPress={() => {
//                       handleStopKillSession();
//                       setShowPopover(false);
//                     }}>
//                     <Text style={[styles.confrimationText]}>Yes</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.optionText}
//                     onPress={() => setShowPopover(false)}>
//                     <Text style={[styles.confrimationText]}>No</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Popover>

//             {!islive && !props.route.params.isforEdit && (
//               <TouchableOpacity
//                 style={[{alignItems: 'center', flexDirection: 'row'}]}
//                 onPress={handleStartSession}
//                 hitSlop={hitSlop}>
//                 <Text
//                   style={[
//                     styles.listItemHeaderSongTextTitle,
//                     {marginBottom: normalise(0), fontSize: normalise(9)},
//                   ]}
//                   numberOfLines={2}>
//                   START{'\n'}SESSION
//                 </Text>
//                 <Image
//                   source={ImagePath.playSolid}
//                   style={styles.startSessionIcon}
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             )}
//           </View>
//           <View style={{flex: 1}}>
//             <View style={{flex: 2}}>
//               <View style={styles.listItemHeaderSongDetails}>
//                 <Text style={styles.hostedText} numberOfLines={1}>
//                   Hosted by
//                 </Text>
//                 <View style={styles.nameWrapper}>
//                   <Text
//                     style={[
//                       styles.listItemHeaderSongTextTitle,
//                       {textTransform: 'uppercase', marginBottom: normalise(0)},
//                     ]}
//                     numberOfLines={1}>
//                     {userProfileResp?.username}
//                   </Text>
//                 </View>
//                 <Image
//                   source={
//                     userProfileResp?.profile_image
//                       ? {
//                           uri:
//                             constants.profile_picture_base_url +
//                             userProfileResp?.profile_image,
//                         }
//                       : ImagePath.userPlaceholder
//                   }
//                   style={styles.listItemHeaderSongTypeIcon}
//                   resizeMode="cover"
//                 />
//                 <Text
//                   style={[
//                     styles.listItemHeaderSongTextTitle,
//                     {marginTop: normalise(10), marginBottom: 0},
//                   ]}
//                   numberOfLines={1}>
//                   NOW PLAYING
//                 </Text>
//                 <View
//                   style={[
//                     styles.bottomLineStyle,
//                     {width: width / 3, marginTop: normalise(6)},
//                   ]}></View>
//               </View>
//               <View style={[styles.playListItemContainer]}>
//                 <FlatList
//                   data={sessionDetailReduxdata?.session_songs}
//                   renderItem={({item, index}) => {
//                     const iscurrentPlaying =
//                       currentPlayinSongData?.id == item?.apple_song_id;
//                     return (
//                       <View
//                         style={[
//                           styles.itemWrapper,
//                           !iscurrentPlaying && islive && {opacity: 0.4},
//                         ]}>
//                         <TouchableOpacity
//                           disabled={iscurrentPlaying ? false : true}
//                           onPress={handlePlayPauseViaButton}
//                           style={styles.playButtonStyle}>
//                           <Image
//                             source={
//                               appleFullSongPlaying && iscurrentPlaying
//                                 ? ImagePath.pause
//                                 : ImagePath.play
//                             }
//                             style={{
//                               height: normalise(25),
//                               width: normalise(25),
//                             }}
//                             resizeMode="contain"
//                           />
//                         </TouchableOpacity>
//                         <Image
//                           source={{uri: item?.song_image}}
//                           style={styles.songListItemImage}
//                           resizeMode="cover"
//                         />
//                         <View style={styles.listItemHeaderSongText}>
//                           <Text
//                             style={styles.songlistItemHeaderSongTextTitle}
//                             numberOfLines={1}>
//                             {item?.song_name}
//                           </Text>
//                           <Text
//                             style={styles.songlistItemHeaderSongTextArtist}
//                             numberOfLines={1}>
//                             {item?.artist_name}
//                           </Text>
//                         </View>
//                       </View>
//                     );
//                   }}
//                   showsVerticalScrollIndicator={false}
//                   keyExtractor={item => item?._id}
//                 />
//               </View>
//             </View>
//             {currentListners?.length > 0 && islive && (
//               <View style={styles.listenersContainer}>
//                 <View style={styles.listenersTextWrapper}>
//                   <Text
//                     style={[
//                       styles.listItemHeaderSongTextTitle,
//                       {marginTop: normalise(5), fontSize: normalise(12)},
//                     ]}
//                     numberOfLines={2}>
//                     LISTENERS
//                   </Text>
//                 </View>
//                 <View
//                   style={[
//                     styles.bottomLineStyle,
//                     {
//                       width: width / 3.8,
//                       marginBottom: normalise(8),
//                       marginTop: normalise(0),
//                     },
//                   ]}></View>
//                 <ScrollView style={{flex: 1}}>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'center',
//                       flexWrap: 'wrap',
//                     }}>
//                     {currentListners?.map((item, index) => {
//                       return (
//                         <View
//                           style={[
//                             styles.joineeIitemWrapper,
//                             // index == 0 &&
//                             //   currentListners?.length > 1 && {
//                             //     marginLeft: normalise(40),
//                             //   },
//                             // index == 3 && {marginRight: normalise(40)},
//                           ]}>
//                           <Image
//                             source={
//                               item?.profile_image
//                                 ? {
//                                     uri:
//                                       constants.profile_picture_base_url +
//                                       item?.profile_image,
//                                   }
//                                 : ImagePath.userPlaceholder
//                             }
//                             style={[styles.songListItemImage]}
//                             resizeMode="cover"
//                           />
//                         </View>
//                       );
//                     })}
//                   </View>
//                 </ScrollView>
//               </View>
//             )}
//           </View>
//           {!props.route.params.isforEdit && (
//             <TrackProgress
//               setModalVisible={() => setModalVisible(!modalVisible)}
//               modalVisible={modalVisible}
//               duration={appleFullSongDuration}
//               position={progress}
//               isShow={sessionDetailReduxdata?.isPrivate ? true : false}
//             />
//           )}
//           {props.route.params.isforEdit && (
//             <View style={{}}>
//               <TouchableOpacity
//                 style={{
//                   marginHorizontal: 20,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//                 onPress={() => handleUpdateSession()}>
//                 <Text
//                   style={[
//                     {
//                       textAlign: 'center',
//                       color: Colors.meta,
//                       fontSize: normalise(12),
//                       marginBottom: normalise(3),
//                     },
//                   ]}
//                   numberOfLines={2}>
//                   {sessionDetailReduxdata?.isPrivate ? 'Private' : 'Public'}
//                 </Text>
//                 <Image
//                   source={
//                     sessionDetailReduxdata?.isPrivate
//                       ? ImagePath.toggleOn
//                       : ImagePath.toggleOff
//                   }
//                   style={{width: 45}}
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             </View>
//           )}
//         </SafeAreaView>
//         {renderModal()}
//       </LinearGradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   playListItemContainer: {
//     width: '100%',
//     alignSelf: 'center',
//     marginTop: normalise(15),
//     flex: 1,
//   },

//   itemWrapper: {
//     flexDirection: 'row',
//     marginBottom: normalise(8),
//     flex: 1,
//     width: '100%',
//     alignItems: 'center',
//     // opacity: 0.4,
//     opacity: 1,
//   },
//   songListItemImage: {
//     borderRadius: normalise(5),
//     height: normalise(40),
//     width: normalise(40),
//   },

//   listItemHeaderSongDetails: {
//     alignItems: 'center',
//     // flex: 1,
//     // flexDirection: 'row',
//   },
//   listItemHeaderSongTextTitle: {
//     color: Colors.white,
//     fontFamily: 'ProximaNova-Semibold',
//     fontSize: normalise(14),
//     marginBottom: normalise(5),
//     marginRight: normalise(5),
//   },

//   listItemHeaderSongTypeIcon: {
//     borderRadius: normalise(10),
//     height: normalise(80),
//     width: normalise(80),
//     borderRadius: normalise(80),
//     borderWidth: 1,
//     borderColor: Colors.grey,
//   },
//   listItemHeaderSongText: {
//     alignItems: 'flex-start',
//     flexDirection: 'column',
//     marginLeft: normalise(10),
//     width: '100%',
//     height: '100%',
//     borderBottomWidth: 0.3,
//     borderBottomColor: Colors.meta,
//     flex: 1,
//     justifyContent: 'center',
//     marginRight: normalise(10),
//   },
//   songlistItemHeaderSongTextTitle: {
//     color: Colors.white,
//     fontFamily: 'ProximaNova-Semibold',
//     fontSize: normalise(12),
//   },

//   songlistItemHeaderSongTextArtist: {
//     color: Colors.darkgrey,
//     fontFamily: 'ProximaNova-Regular',
//     fontSize: normalise(11),
//   },

//   bottomLineStyle: {
//     marginTop: normalise(8),
//     backgroundColor: Colors.white,
//     alignSelf: 'center',
//     opacity: 0.7,
//     height: 0.5,
//   },

//   nameWrapper: {
//     flexDirection: 'row',
//     // marginTop: normalise(2),
//     marginBottom: normalise(4),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   playButtonStyle: {
//     width: normalise(40),
//     height: normalise(40),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   //Footer listners styles
//   listenersContainer: {
//     alignItems: 'center',
//     flex: 0.5,
//   },
//   joineeIitemWrapper: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     marginHorizontal: normalise(11),
//     marginBottom: normalise(11),
//   },
//   inviteIcon: {
//     borderRadius: normalise(5),
//     height: normalise(20),
//     width: normalise(20),
//   },
//   headerStyle: {
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: normalise(20),
//     paddingVertical: normalise(15),
//     height: 65,
//   },
//   startSessionIcon: {
//     width: 14,
//     height: 14,
//   },
//   hostedText: {
//     color: Colors.meta,
//     fontFamily: 'ProximaNova-Regular',
//     fontSize: normalise(12),
//   },
//   listenersTextWrapper: {
//     flexDirection: 'row',
//   },
//   confrimationText: {
//     color: Colors.black,
//     fontFamily: 'ProximaNova-Regular',
//     fontSize: normalise(12),
//     // width: '50%',
//     // paddingVertical: 10,
//     textAlign: 'center',
//     padding: 15,
//     fontWeight: '600',
//   },
//   optionText: {
//     borderEndWidth: 1,
//     borderRightColor: Colors.meta,
//     width: '50%',
//   },

//   //modal view style
//   centeredView: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   modalView: {
//     // marginBottom: normalise(10),
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     position: 'absolute',
//     backgroundColor: Colors.darkerblack,
//     // margin: 20,
//     padding: 20,
//     paddingTop: normalise(24),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     height: '80%',
//   },
//   openButton: {
//     backgroundColor: '#F194FF',
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//   },
// });

// export default MySessionDetailScreen;
