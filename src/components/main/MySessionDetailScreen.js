import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import { useSelector, useDispatch } from 'react-redux';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import { getSessionDetailRequest, startSessionRequest } from '../../action/SessionAction';
import socketService from '../../utils/socket/socketService';
import useTrackPlayer, { addTracks } from '../../hooks/useTrackPlayer';
import TrackPlayerComponent from '../common/TrackPlayerComponent';
import TrackPlayer, { Event, useTrackPlayerEvents, usePlaybackState, useProgress, State } from 'react-native-track-player';
import { TrackProgress } from '../common/Progress';

// let status;

function MySessionDetailScreen(props) {
    // console.log(props?.route?.params, 'these are params')
    // const { currentSession } = props?.route?.params
    // console.log(currentSession, 'its current sessionI')
    const { width, height } = useWindowDimensions()
    const [playVisible, setPlayVisible] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [islive, setIsLive] = useState(false)
    const [currentPlayingSong, setCurrentPlayingSong] = useState(null)
    const { startSessionAndPlay, playTrack, pauseTrack, skipToNext, skipToPrevious, isPlaying, setIsPlaying, isPlayerReady } = useTrackPlayer();
    const [playerVisible, setPlayerVisible] = useState(false)
    const [playerAcceptedSongs, setPlayerAcceptedSongs] = useState([])
    const [listenSessionStart, setListenSessionStart] = useState(null)
    // const { position, duration } = useProgress(200);
    const playerState = usePlaybackState();
    console.log(playerState, 'its play back state')
    const [currentTrack, setCurrentTrack] = useState(0);
    const { position, duration } = useProgress(200);
    const positionRef = useRef(position ?? null);


    const dispatch = useDispatch();
    const userProfileResp = useSelector(
        state => state.UserReducer.userProfileResp,
    );
    const userTokenData = useSelector(state => state.TokenReducer)
    const sessionReduxData = useSelector(state => state.SessionReducer);
    const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data
    const currentSessionLiveInfo = sessionReduxData?.currentSessionSong?.data
    console.log(sessionDetailReduxdata, 'its detail data state');


    // const { state } = usePlaybackState();
    // useEffect(() => {
    //     if (state == 'ended') {
    //         setIsPlaying(false)
    //     }
    // }, [state])



    useEffect(() => {
        positionRef.current = position;
      }, [position]);


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
    //     let intervalId;
    //     // Define your session handler
    //     const handleStartSession = (sessionData) => {
    //         console.log('Session started first time:', sessionData);
    //         setListenSessionStart(sessionData)
    //         // Update state or perform actions with sessionData here
    //     };
    //     const listenJoinUser = (sessionData) => {
    //         console.log('Session started:', sessionData);
    //         toast('Someonw has joined  session');
    //         // Update state or perform actions with sessionData here
    //     };
    //     const listenLeftUser = (sessionData) => {
    //         console.log('Session started:', sessionData);
    //         toast('Someonw has left the session');
    //         // Update state or perform actions with sessionData here
    //     };

    //     const listenSessionPlayStatus = (sessionData) => {
    //         console.log('Session started:', sessionData);
    //         toast('Session is playing/Stop');
    //         // Update state or perform actions with sessionData here
    //     };
    //     socketService.initializeSocket(userTokenData?.token).then((res) => {
    //         socketService.on('start_session', handleStartSession);
    //         socketService.on('join_session_user', listenJoinUser);
    //         socketService.on('leave_session_user', listenLeftUser);
    //         socketService.on('session_play_status', listenSessionPlayStatus);
    //         console.log('outside', islive)
    //         if (islive) {
    //             console.log('inside', islive)

    //             intervalId = setInterval(() => {
    //                 const statusPayload = {
    //                     hostId: userProfileResp?._id,
    //                     startAudioMixing: playerState?.state === 'playing' ?? false,
    //                     playIndex: currentTrack ?? -1,
    //                     playLoading: false,
    //                     currentTime: position,
    //                     startedAt: Date.now(),
    //                     pausedAt: null
    //                 };

    //                 socketService.emit('session_play_status', statusPayload);
    //             }, 5000)
    //         }
    //     }).catch(error => {
    //         console.log(error, 'hey erorr h')
    //     })
    //     return () => {
    //         socketService.off('start_session');
    //         clearInterval(intervalId)
    //         socketService.disconnect();
    //     };
    // }, [islive, playerState?.state, currentTrack, position]);


    // const stateRef = useRef({
    //     // playerState: null,
    //     // currentTrack: null,
    //     // position: null,
    //     // userProfileId: null
    //     hostId: null,
    //     startAudioMixing: null,
    //     playIndex: null,
    //     playLoading: null,
    //     currentTime: null,
    //     startedAt: null,
    //     pausedAt: null
    // });

    // useEffect(() => {
    //     let intervalId;
    //     let isMounted = true;
    //     // Update the ref values whenever dependencies change
    //     stateRef.current = {
    //         // playerState: playerState?.state,
    //         // currentTrack,
    //         // position,
    //         // userProfileId: userProfileResp?._id,


    //         hostId: userProfileResp?._id,
    //         startAudioMixing: playerState?.state === 'playing' ?? false,
    //         playIndex: currentTrack ?? -1,
    //         playLoading: false,
    //         currentTime: position,
    //         startedAt: Date.now(),
    //         pausedAt: null
    //     };




    //     const handleStartSession = (sessionData) => {
    //         console.log(sessionData, 'its sesion data when  session stared')
    //         if (!isMounted) return;
    //         setListenSessionStart(sessionData);

    //     };

    //     const setupSocket = async () => {
    //         try {
    //             await socketService.initializeSocket(userTokenData?.token);

    //             socketService.on('start_session', handleStartSession);
    //             socketService.on('join_session_user', () => toast('Someone joined'));
    //             socketService.on('leave_session_user', () => toast('Someone left'));
    //             socketService.on('session_play_status', () => toast('Play status changed'));

    //             if (islive && isMounted) {
    //                 intervalId = setInterval(() => {

    //                     // socketService.emit('session_play_status', {
    //                     //     hostId: stateRef.current.userProfileId,
    //                     //     startAudioMixing: stateRef.current.playerState === 'playing',
    //                     //     playIndex: stateRef.current.currentTrack ?? -1,
    //                     //     currentTime: stateRef.current.position,
    //                     //     startedAt: Date.now(),
    //                     // });
    //                     socketService.emit('session_play_status', {
    //                         hostId: userProfileResp?._id,
    //                         startAudioMixing: playerState?.state === 'playing' ?? false,
    //                         playIndex: currentTrack ?? -1,
    //                         playLoading: false,
    //                         currentTime: position,
    //                         startedAt: Date.now(),
    //                         pausedAt: null
    //                     });
    //                     console.log({
    //                         hostId: userProfileResp?._id,
    //                         startAudioMixing: playerState?.state === 'playing' ?? false,
    //                         playIndex: currentTrack ?? -1,
    //                         playLoading: false,
    //                         currentTime: position,
    //                         startedAt: Date.now(),
    //                         pausedAt: null
    //                     }, 'its music state ref data')
    //                     console.log('yes emitted')
    //                 }, 5000);
    //             }
    //         } catch (error) {
    //             if (isMounted) console.error('Socket error:', error);
    //         }
    //     };

    //     setupSocket();

    //     return () => {
    //         isMounted = false;
    //         clearInterval(intervalId);
    //         // socketService.off('start_session');
    //         // socketService.off('join_session_user');
    //         // socketService.off('leave_session_user');
    //         // socketService.off('session_play_status');
    //         // socketService.disconnect();
    //     };
    // }, [islive,
    //     playerState?.state, 
    //     currentTrack, 
    //     position, 
    //     // userProfileResp?._id, 
    //     // userTokenData?.token
    // ]);



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

        // Update ref with current state
        // stateRef.current = {
        //     hostId: userProfileResp?._id,
        //     startAudioMixing: playerState?.state === 'playing' ?? false,
        //     playIndex: currentTrack ?? -1,
        //     playLoading: false,
        //     currentTime: position,
        //     startedAt: Date.now(),
        //     pausedAt: null
        // };

        const handleStartSession = (sessionData) => {
            if (!isMounted) return;
            setListenSessionStart(sessionData);
        };

        // Setup listeners and interval
        const setupListenersAndInterval = () => {
            try {
                // Add event listeners
                socketService.on('start_session', handleStartSession);
                socketService.on('join_session_user', () => toast('Someone joined'));
                socketService.on('leave_session_user', () => toast('Someone left'));
                socketService.on('session_play_status', () => toast('Play status changed'));

                // Start interval if live
                if (islive && isMounted) {
                    intervalId = setInterval(() => {
                        socketService.emit('session_play_status', {
                            hostId: userProfileResp?._id,
                            startAudioMixing: playerState?.state === 'playing' ?? false,
                            playIndex: currentTrack ?? -1,
                            playLoading: false,
                            // currentTime: position,
                            currentTime: positionRef.current, 
                            startedAt: Date.now(),
                            pausedAt: null,
                            sessionId:sessionDetailReduxdata?._id
                        });
                        console.log('yes emiting', {
                            hostId: userProfileResp?._id,
                            startAudioMixing: playerState?.state === 'playing' ?? false,
                            playIndex: currentTrack ?? -1,
                            playLoading: false,
                            // currentTime: position,
                            currentTime: positionRef.current, 
                            startedAt: Date.now(),
                            pausedAt: null
                        })
                    }, 3000);
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
            // Remove listeners to prevent duplicates
            socketService.off('start_session', handleStartSession);
            socketService.off('join_session_user');
            socketService.off('leave_session_user');
            socketService.off('session_play_status');
        };
    }, [
        islive,
        playerState?.state,
        currentTrack,
        // position,
    ]);



    useEffect(() => {
        isInternetConnected()
            .then(() => {
                dispatch(getSessionDetailRequest({ sessionId: props?.route?.params?.sessionId }))
            })
            .catch(() => {
                toast('Error', 'Please Connect To Internet');
            });
    }, [])


    useEffect(() => {
        const handleAddTrack = async () => {
            if (islive && sessionDetailReduxdata?.session_songs?.length) {
                const getTrackRelatedSong = () => {
                    return sessionDetailReduxdata.session_songs.map((item) => ({
                        id: item._id,
                        url: item.song_uri,
                        title: item.song_name,
                        artist: item.artist_name,
                        artwork: item.song_image,
                    }));
                };
                const newArray = getTrackRelatedSong();
                // console.log(newArray,'ite new aarary')
                // startSessionAndPlay(getTrackRelatedSong());
                setPlayerAcceptedSongs(newArray)
                await addTracks(newArray)
                await TrackPlayer.play();
            }
        }
        // setTrackInfo()
        handleAddTrack()
    }, [islive, sessionDetailReduxdata]);

    useEffect(() => {
        if (sessionReduxData?.currentSessionSong && sessionDetailReduxdata) {
            Alert.alert(sessionDetailReduxdata?.isLive?.toString())
            setIsLive(sessionDetailReduxdata?.isLive)
            if (!sessionDetailReduxdata?.isLive) {
                // Alert.alert('Reset')
                TrackPlayer.reset();
            }
        }
        // else {
        //     Alert.alert('Reset')
        //     TrackPlayer.reset();
        // }
    }, [sessionDetailReduxdata?.isLive])

    // useEffect(() => {
    //     if (islive)
    //         Alert.alert(islive.toString())
    // }, [islive])

    // useEffect(() => {
    //     setTimeout(() => {
    //         socketService.emit('session_play_status', {
    //             hostId: userProfileResp?._id,
    //             startAudioMixing: playerState?.state == 'playing' ? true : false,
    //             playIndex: currentTrack ?? -1,
    //             playLoading: false,
    //             currentTime: position,
    //             // currentTime: format(position),
    //             startedAt: Date.now(),
    //             pausedAt: null
    //         })
    //     }, 5000)
    // }, [])

    // useEffect(() => {
    //     startSessionAndPlay(playerAcceptedSongs)
    //     setPlayerVisible(true)

    //     // if (currentPlayingSong) {
    //     //     const trackdata = {
    //     //         id: currentPlayingSong?._id,
    //     //         url: currentPlayingSong?.song_uri,
    //     //         title: currentPlayingSong?.song_name,
    //     //         artist: currentPlayingSong?.artist_name,
    //     //         artwork: currentPlayingSong?.song_image,
    //     //     }
    //     //     startSessionAndPlay(trackdata)
    //     //     setPlayerVisible(true)
    //     // }

    // }, [currentPlayingSong])


    // console.log(currentPlayingSong, 'its current playing song')


    //helperss***********************************************************************************


    function format(seconds) {
        let mins = (parseInt(seconds / 60)).toString().padStart(2, '0');
        let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    const handleStartSession = () => {
        const requestObj = {
            isLive: true,
            sessionId: sessionDetailReduxdata?._id
        }
        dispatch(startSessionRequest(requestObj))
    }

    const handleStopKillSession = () => {
        const requestObj = {
            isLive: false,
            sessionId: sessionDetailReduxdata?._id
        }
        dispatch(startSessionRequest(requestObj))
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        if (event.state == State.nextTrack) {
            let index = await TrackPlayer.getCurrentTrack();
            // Alert.alert(index.toString())
            setCurrentTrack(index);
        }
    });



    return (
        <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
            <Loader visible={sessionReduxData?.loading || sessionReduxData?.startSessionLoading} />
            <LinearGradient
                colors={['#0E402C', '#101119', '#360455']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <StatusBar backgroundColor={Colors.darkerblack} />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.headerStyle}>
                        <TouchableOpacity onPress={() => islive ? handleStopKillSession() : props.navigation.goBack()}>
                            <Image
                                source={islive ? ImagePath.crossIcon : ImagePath.backicon}
                                style={{ width: normalise(16), height: normalise(14) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {!islive &&
                            <TouchableOpacity
                                style={[{ alignItems: 'center', flexDirection: 'row' }]}
                                onPress={handleStartSession}>
                                <Text
                                    style={[
                                        styles.listItemHeaderSongTextTitle,
                                        { marginBottom: normalise(0), fontSize: normalise(10) },
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
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 2.5 }}>
                            <View style={styles.listItemHeaderSongDetails}>
                                <Text style={styles.hostedText} numberOfLines={1}>
                                    Hosted by
                                </Text>
                                <View style={styles.nameWrapper}>
                                    <Text
                                        style={[
                                            styles.listItemHeaderSongTextTitle,
                                            { textTransform: 'uppercase', marginBottom: normalise(0) },
                                        ]}
                                        numberOfLines={1}>
                                        {userProfileResp?.username}
                                    </Text>
                                    <Image
                                        source={ImagePath.blueTick}
                                        style={{ width: 16, height: 16 }}
                                        resizeMode="contain"
                                    />
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
                                        { marginTop: normalise(10), marginBottom: 0 },
                                    ]}
                                    numberOfLines={1}>
                                    NOW PLAYING
                                </Text>
                                <View

                                    style={[styles.bottomLineStyle, { width: width / 3, marginTop: normalise(6), }]}></View>
                            </View>
                            <View style={[styles.playListItemContainer]}>
                                <FlatList
                                    data={sessionDetailReduxdata?.session_songs}
                                    renderItem={({ item, index }) => {
                                        // let iscurrentPlaying = currentPlayingSong?._id == item?._id
                                        // let iscurrentPlaying = currentPlayingSong?._id == item?._id

                                        const iscurrentPlaying = currentTrack == index
                                        // playerState == State.Playing &&
                                        return (
                                            <View style={[styles.itemWrapper, !iscurrentPlaying && { opacity: 0.4 }]}>
                                                <TouchableOpacity
                                                    disabled={disabled}
                                                    onPress={() => {
                                                        // isPlaying ?
                                                        playerState?.state === 'playing' ?
                                                            pauseTrack()
                                                            :
                                                            playTrack()
                                                    }} style={styles.playButtonStyle}>
                                                    <Image
                                                        // source={(isPlaying && iscurrentPlaying) ? ImagePath.pause : ImagePath.play}
                                                        source={(playerState?.state == 'playing' && iscurrentPlaying) ? ImagePath.pause : ImagePath.play}
                                                        style={{ height: normalise(25), width: normalise(25) }}
                                                        resizeMode="contain"
                                                    />
                                                </TouchableOpacity>
                                                <Image
                                                    source={{ uri: item?.song_image }
                                                    }
                                                    style={styles.songListItemImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.listItemHeaderSongText}>
                                                    <Text style={styles.songlistItemHeaderSongTextTitle} numberOfLines={1}>
                                                        {item?.song_name}
                                                    </Text>
                                                    <Text style={styles.songlistItemHeaderSongTextArtist} numberOfLines={1}>
                                                        {item?.artist_name}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={item => item?._id}
                                />
                            </View>
                        </View>
                        {(sessionDetailReduxdata?.users && sessionDetailReduxdata?.users?.length > 0) &&
                            <View style={styles.listenersContainer}>
                                <Text style={[styles.listItemHeaderSongTextTitle, { marginTop: normalise(10) }]} numberOfLines={2}>
                                    LISTENERS
                                </Text>
                                <View style={[styles.bottomLineStyle, { width: width / 3, marginBottom: normalise(20) }]}>
                                </View>
                                <ScrollView style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                                        {
                                            sessionDetailReduxdata?.users?.map((item, index) => {
                                                return (
                                                    <View style={[styles.joineeIitemWrapper, (index == 0 && sessionDetailReduxdata?.watch_users?.length > 1) && { marginLeft: normalise(40) }, index == 3 && { marginRight: normalise(40) }]}>
                                                        <Image
                                                            source={{ uri: constants?.profile_picture_base_url + item?.profile_image }
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
                        }
                    </View>

                    <TrackProgress />
                    {/* {playerVisible &&
                        <TrackPlayerComponent
                            currentTrack={{
                                id: currentPlayingSong?._id,
                                url: currentPlayingSong?.song_uri,
                                title: currentPlayingSong?.song_name,
                                artist: currentPlayingSong?.artist_name,
                                artwork: currentPlayingSong?.song_image,
                            }
                            }
                        />
                    } */}
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

// const mapStateToProps = state => {
//     return {
//         status: state.UserReducer.status,
//         postStatus: state.PostReducer.status,
//         userProfileResp: state.UserReducer.userProfileResp,
//         countryCode: state.UserReducer.countryCodeOject,
//         header: state.TokenReducer,
//     };
// };

const styles = StyleSheet.create({
    playListItemContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: normalise(15),
        flex: 1,
    },

    itemWrapper: {
        flexDirection: 'row',
        marginBottom: normalise(5),
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    songListItemImage: {
        borderRadius: normalise(5),
        height: normalise(47),
        width: normalise(47),
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
        borderWidth: 1,
        borderColor: Colors.grey,
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
        marginTop: normalise(10),
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
        alignItems: 'center'
    },

    playButtonStyle: {
        width: normalise(50),
        height: normalise(50),
        justifyContent: 'center',
        alignItems: 'center',
    },

    //Footer listners styles
    listenersContainer: {
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
    },
    startSessionIcon: {
        width: 16,
        height: 16,
    },
    hostedText: {
        color: Colors.meta,
        fontFamily: 'ProximaNova-Regular',
        fontSize: normalise(12),
    },
});

export default MySessionDetailScreen;
