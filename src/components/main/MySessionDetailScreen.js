import React, { useEffect, useState } from 'react';
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
    console.log(props?.route?.params, 'these are params')
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
        async function setupPlayer() {
            await TrackPlayer.setupPlayer();
        }

        setupPlayer();
        // Cleanup the player on unmount
        // return () => {
        //     TrackPlayer.destroy();
        // };
    }, []);


    useEffect(() => {

        // Define your session handler
        const handleStartSession = (sessionData) => {
            console.log('Session started:', sessionData);
            setListenSessionStart(sessionData)
            // Update state or perform actions with sessionData here
        };
        const listenJoinUser = (sessionData) => {
            console.log('Session started:', sessionData);
            toast('Someonw has joined  session');
            // Update state or perform actions with sessionData here
        };
        const listenLeftUser = (sessionData) => {
            console.log('Session started:', sessionData);
            toast('Someonw has left the session');
            // Update state or perform actions with sessionData here
        };

        const listenSessionPlayStatus = (sessionData) => {
            console.log('Session started:', sessionData);
            toast('Session is playing/Stop');
            // Update state or perform actions with sessionData here
        };
        socketService.initializeSocket(userTokenData?.token).then((res) => {
            socketService.on('start_session', handleStartSession);
            socketService.on('join_session_user', listenJoinUser);
            socketService.on('leave_session_user', listenLeftUser);
            socketService.on('session_play_status', listenSessionPlayStatus);
            // console.log(res, 'its status hhhh')
        }).catch(error => {
            console.log(error, 'hey erorr h')
        })
        return () => {
            socketService.off('start_session');
            socketService.disconnect();
        };




    }, []);

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
        if (sessionReduxData?.currentSessionSong && sessionReduxData?.currentSessionSong?.data) {
            setIsLive(sessionReduxData?.currentSessionSong?.data?.isLive)
        }
    }, [sessionReduxData?.currentSessionSong?.data])

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
    async function setTrackInfo() {
        const track = await TrackPlayer.getCurrentTrack();
        console.log(track, 'its track hhhhhh')
        const info = await TrackPlayer.getTrack(track);
        console.log(info, 'its track info iiii')
    }

    const handleStartSession = () => {
        const requestObj = {
            isLive: true,
            sessionId: sessionDetailReduxdata?._id
        }
        // console.log(requestObj,'its >>>>>>>')
        dispatch(startSessionRequest(requestObj))
        // setIsLive(!islive)
    }

    // // Track playback events
    // useTrackPlayerEvents(
    //     [Event.PlaybackTrackChanged, Event.PlaybackState],
    //     async (event) => {
    //         // Handle song ending naturally
    //         if (event.type === Event.PlaybackTrackChanged &&
    //             event.nextTrack == null &&
    //             event.lastTrack != null) {
    //             const playerState = await TrackPlayer.getState();

    //             if (playerState === State.Stopped) {
    //                 setHasSongEnded(true);
    //                 setIsPlaying(false);
    //                 console.log('Song finished naturally');
    //             }
    //         }

    //         // Update play/pause state
    //         if (event.type === Event.PlaybackState) {
    //             setIsPlaying(event.state === State.Playing);
    //         }
    //     }
    // );


    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        if (event.state == State.nextTrack) {
            let index = await TrackPlayer.getCurrentTrack();
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
                        <TouchableOpacity onPress={() => islive ? null : props.navigation.goBack()}>
                            <Image
                                source={islive ? ImagePath.crossIcon : ImagePath.backicon}
                                style={{ width: normalise(16), height: normalise(14) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            style={[{ alignItems: 'center', flexDirection: 'row' }]}
                            onPress={
                                null
                                //   props.navigation.navigate('SessionActive')
                            }
                        >
                            <Text
                                style={[
                                    styles.listItemHeaderSongTextTitle,
                                    { marginBottom: normalise(0), fontSize: normalise(10) },
                                ]}
                                numberOfLines={2}
                            >
                                Start Session
                            </Text>
                        </TouchableOpacity> */}

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
                                                        isPlaying ?
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
                        {(sessionDetailReduxdata?.watch_users && sessionDetailReduxdata?.watch_users?.length > 0) &&
                            <View style={styles.listenersContainer}>
                                <Text style={[styles.listItemHeaderSongTextTitle, { marginTop: normalise(10) }]} numberOfLines={2}>
                                    LISTENERS
                                </Text>
                                <View style={[styles.bottomLineStyle, { width: width / 3, marginBottom: normalise(20) }]}>
                                </View>
                                <ScrollView style={{flex:1}}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap',}}>
                                        {
                                            sessionDetailReduxdata?.watch_users?.map((item, index) => {
                                                return (
                                                    <View style={[styles.joineeIitemWrapper, (index == 0  && sessionDetailReduxdata?.watch_users?.length>1) && { marginLeft: normalise(40) }, index == 3 && { marginRight: normalise(40) }]}>
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
