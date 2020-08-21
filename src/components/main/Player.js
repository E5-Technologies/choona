
import React, { useEffect, Fragment, useState, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text, Slider,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    TextInput,
    KeyboardAvoidingView,
    Dimensions,
    Modal,
    Linking,
    Alert
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import CommentList from '../main/ListCells/CommentList';
import StatusBar from '../../utils/MyStatusBar';
import RBSheet from "react-native-raw-bottom-sheet";
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

    GET_CURRENT_PLAYER_POSITION_REQUEST,
    GET_CURRENT_PLAYER_POSITION_SUCCESS,
    GET_CURRENT_PLAYER_POSITION_FAILURE,

    RESUME_PLAYER_REQUEST,
    RESUME_PLAYER_SUCCESS,
    RESUME_PLAYER_FAILURE,

    PAUSE_PLAYER_REQUEST,
    PAUSE_PLAYER_SUCCESS,
    PAUSE_PLAYER_FAILURE,

    PLAYER_SEEK_TO_REQUEST,
    PLAYER_SEEK_TO_SUCCESS,
    PLAYER_SEEK_TO_FAILURE,

    GET_SONG_FROM_ISRC_REQUEST,
    GET_SONG_FROM_ISRC_SUCCESS,
    GET_SONG_FROM_ISRC_FAILURE

} from '../../action/TypeConstants';
import { commentOnPostReq } from '../../action/UserAction';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { saveSongRequest, saveSongRefReq } from '../../action/SongAction';
import {
    getCurrentPlayerPostionAction,
    playerResumeRequest,
    playerPauseRequest,
    playerSeekToRequest,
    getSongFromisrc
} from '../../action/PlayerAction';
import { updateMessageCommentRequest } from '../../action/MessageAction';
import Loader from '../../widgets/AuthLoader';
import { call } from 'redux-saga/effects';
import { or } from 'react-native-reanimated';
import _ from 'lodash';
import axios from 'axios';

let RbSheetRef;

let status;
let songStatus;
let playerStatus;

function Player(props) {

    // PLAYER 
    const [playVisible, setPlayVisible] = useState(false);
    const [uri, setUri] = useState(props.route.params.uri);
    const [trackRef, setTrackRef] = useState("");
    const [songTitle, setSongTitle] = useState(props.route.params.song_title);
    const [albumTitle, setAlbumTitle] = useState(props.route.params.album_name);
    const [artist, setArtist] = useState(props.route.params.artist);
    const [pic, setPic] = useState(props.route.params.song_pic);

    const [username, setUsername] = useState(props.route.params.username);
    const [profilePic, setprofilePic] = useState(props.route.params.profile_pic);
    const [isrc, setisrc] = useState(props.route.params.isrc);

    const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
    const [playerDuration, setplayerDuration] = useState(0);
    const [curentTimeForSlider, setCurentTimeForSlider] = useState(0);
    const [totalTimeForSlider, setTotalTimeForSlider] = useState(0);

    const [hasSongLoaded, setHasSongLoaded] = useState(false);


    const [reactions, setSReactions] = useState(props.route.params.changePlayer ? [] : props.route.params.reactions);

    //COMMENT ON POST
    const [commentData, setCommentData] = useState(props.route.params.changePlayer ? (props.route.params.comingFromMessage ? props.route.params.comments : []) : props.route.params.comments);
    const [id, setId] = useState(props.route.params.id);
    const [commentText, setCommentText] = useState("");
    const [arrayLength, setArrayLength] = useState(`${commentData.length} ${commentData.length > 1 ? "COMMENTS" : "COMMENT"}`);

    const [bool, setBool] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [changePlayer, setChangePlayer] = useState(props.route.params.changePlayer);

    const [originalUri, setOriginalUri] = useState(props.route.params.originalUri);
    const [registerType, setRegisterType] = useState(props.route.params.registerType);
    const [changePlayer2, setChanagePlayer2] = useState(props.route.params.changePlayer2);

    const [comingFromMessage, setCommingFromMessage] = useState(props.route.params.comingFromMessage === undefined ? false : true)
    const [key, setKey] = useState(props.route.params.key);
    const [chatToken, setChatToken] = useState(props.route.params.chatToken);

    // console.log("commentData: " + JSON.stringify(commentData));
    let track;

    //Prithviraj's variables.
    const [firstTimePlay, setFirstTimePlay] = useState(true)

    var myVar;

    useEffect(() => {
        // const unsuscribe = props.navigation.addListener('focus', (payload) => {

        //     myVar = setInterval(() => {
        //         props.getCurrentPlayerPostionAction();
        //     }, 2000)

        // });
        Sound.setCategory('Playback', false);
        props.getSongFromIsrc(props.userProfileResp.register_type, isrc);

        if (changePlayer2) {
            console.log('getting spotify song uri');
            const getSpotifyApi = async () => {
                try {
                    const res = await callApi();
                    console.log(res);
                    if (res.data.status === 200) {
                        let suc = res.data.data.audio;
                        setUri(suc);
                        playSongOnLoad(suc);
                    }
                    else {
                        toast('Oops', 'Something Went Wrong');
                        props.navigation.goBack();
                    }

                } catch (error) {
                    console.log(error)
                }
            };

            getSpotifyApi();
        }

        else {
            playSongOnLoad();
        }

        // return () => {
        //     clearInterval(myVar),
        //         unsuscribe();
        // }
    }, []);


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case COMMENT_ON_POST_REQUEST:
                status = props.status
                break;

            case COMMENT_ON_POST_SUCCESS:
                status = props.status
                setCommentText("")
                let data = props.commentResp.comment[props.commentResp.comment.length - 1]
                data.profile_image = props.userProfileResp.profile_image
                commentData.push(data);
                setArrayLength(`${commentData.length} ${commentData.length > 1 ? "COMMENTS" : "COMMENT"}`)
                break;

            case COMMENT_ON_POST_FAILURE:
                status = props.status;
                toast('Oops', 'Something Went Wrong');
                break;

        }
    };

    if (songStatus === "" || props.songStatus !== songStatus) {
        switch (props.songStatus) {

            case SAVE_SONGS_REQUEST:
                songStatus = props.songStatus
                break;

            case SAVE_SONGS_SUCCESS:
                songStatus = props.songStatus
                if (props.savedSongResponse.status === 200)
                    toast("Success", props.savedSongResponse.message)
                else
                    toast("Error", props.savedSongResponse.message)
                break;

            case SAVE_SONGS_FAILURE:
                songStatus = props.songStatus;
                toast('Oops', 'Something Went Wrong');
                break;

        }
    };

    if (playerStatus === "" || props.playerStatus !== playerStatus) {
        switch (props.playerStatus) {

            case GET_SONG_FROM_ISRC_REQUEST:
                playerStatus = props.playerStatus
                break;

            case GET_SONG_FROM_ISRC_SUCCESS:
                playerStatus = props.playerStatus;
                break;

            case GET_SONG_FROM_ISRC_FAILURE:
                playerStatus = props.playerStatus;
                toast('Oops', 'Something Went Wrong');
                break;

        }
    };


    // GET SPOTIFY SONG URL
    const callApi = async () => {
        return await axios.get(`${constants.BASE_URL}/${`song/spotify/${props.route.params.id}`}`, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        });
    };

    // PLAY SONG ON LOAD
    const playSongOnLoad = (songuri) => {

        if (props.playingSongRef === "") {

            console.log('first time')
            playSong(songuri);

        } else {

            if (global.playerReference !== null) {

                if (global.playerReference._filename === uri) {
                    console.log('Already Playing');
                    console.log(global.playerReference);
                    setTimeout(() => {
                        changeTime(global.playerReference);
                        let time = global.playerReference.getDuration();
                        setHasSongLoaded(true)
                        setplayerDuration(time);
                        setBool(false);
                        global.playerReference.pause();
                        global.playerReference.play((success) => {
                            if (success) {
                                console.log('Playback Endd')
                                setPlayVisible(true);
                            }
                        })
                    }, 100)

                }

                else {
                    console.log('reset');
                    global.playerReference.release();
                    global.playerReference = null;
                    playSong(songuri);
                }

            } else {
                console.log('reset2');
                playSong(songuri);
            }

        };
    };

    // PLAY SONG
    const playSong = (songuri) => {

        if (changePlayer2 && songuri === null) {
            toast('Error', "Sorry, this track cannot be played as it does not have a proper link."),
                setBool(false);
            setPlayVisible(true);
        }

        else if (uri === null && changePlayer2 === undefined) {
            setBool(false);
            setPlayVisible(true);
            toast('Error', "Sorry, this track cannot be played as it does not have a proper link.")
        }
        else {

            track = new Sound(changePlayer2 ? songuri : uri, "", (err) => {
                if (err) {
                    console.log(err);
                    setPlayVisible(true);
                }
                else {
                    console.log('Loaded')
                    setHasSongLoaded(true)
                    setBool(false);
                    changeTime(track);


                    let saveSongResObj = {}
                    saveSongResObj.uri = uri,
                        saveSongResObj.song_name = songTitle,
                        saveSongResObj.album_name = albumTitle,
                        saveSongResObj.song_pic = pic,
                        saveSongResObj.username = username,
                        saveSongResObj.profile_pic = profilePic,
                        saveSongResObj.commentData = commentData
                    saveSongResObj.reactionData = reactions
                    saveSongResObj.id = id,
                        saveSongResObj.artist = artist,
                        saveSongResObj.changePlayer = changePlayer
                    saveSongResObj.originalUri = originalUri,
                        saveSongResObj.isrc = isrc


                    props.saveSongRefReq(saveSongResObj);
                    global.playerReference = track;

                    let res = track.getDuration();
                    setplayerDuration(res);

                    track.play((success) => {
                        if (success) {
                            console.log('PlayBack End')
                            setPlayVisible(true);
                        }
                        else {
                            console.log('NOOOOOOOO')
                        }
                    });
                };
            });

            setTrackRef(track);
        }


    }


    // PAUSE AND PLAY
    function playing() {

        if (uri === null) {
            setBool(false);
            setPlayVisible(true);
            toast('Error', "Sorry, this track cannot be played as it does not have a proper link.")
        } else {

            if (playVisible == true) {

                setPlayVisible(false)

                global.playerReference.play((success) => {
                    if (success) {
                        console.log('PlayBack End!')
                        setPlayVisible(true);
                    }
                    else {
                        console.log('NOOOOOOOO')
                    }
                });

            } else {

                setPlayVisible(true)

                global.playerReference.pause(() => {
                    console.log('paused');
                })
            }
        }


    };

    // CHANGE TIME
    const changeTime = (ref) => {

        setInterval(() => {
            ref.getCurrentTime((seconds) => { setPlayerCurrentTime(seconds) })
        }, 1000)

    };





    function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return minutes + ":" + seconds;
    }


    //PlayInSpotify 

    const playInSpotify = () => {

        if (firstTimePlay) {

            if (originalUri !== undefined) {
                Linking.canOpenURL(originalUri)
                    .then((supported) => {
                        if (supported) {
                            Linking.openURL(originalUri)
                                .then(() => {
                                    console.log('success');
                                })
                                .catch(() => {
                                    console.log('failed');
                                })
                        }
                    })
                    .catch((err) => {
                        console.log('not supported')
                    });
            }
            else {
                console.log('No Link Present, Old posts');
            }

        } else {

            if (playVisible) {
                props.playerResumeRequest();
            } else {
                props.playerPauseRequest();
            }

            //spotifyPremiumAlert();
        }
    }

    function spotifyPremiumAlert() {

        Alert.alert(
            'Opps!',
            'You need premuim subscription of Spotify for this action',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => Linking.canOpenURL("https://www.spotify.com/premium/")
                        .then((supported) => {
                            if (supported) {
                                Linking.openURL("https://www.spotify.com/premium/")
                                    .then(() => {
                                        console.log('success');
                                    })
                                    .catch(() => {
                                        console.log('failed');
                                    })
                            }
                        })
                }
            ],
            { cancelable: false }
        );
    };

    //OPEN IN APPLE / SPOTIFY
    const openInAppleORSpotify = () => {

        if (!_.isEmpty(props.isrcResp)) {
            if (props.userProfileResp.register_type === 'spotify') {
                console.log('success - spotify');
                console.log(props.isrcResp[0].external_urls.spotify)
                Linking.canOpenURL(props.isrcResp[0].external_urls.spotify)
                    .then((supported) => {
                        if (supported) {
                            Linking.openURL(props.isrcResp[0].external_urls.spotify)
                                .then(() => {
                                    console.log('success');
                                })
                                .catch(() => {
                                    console.log('error')
                                })
                        }
                    })
                    .catch(() => {
                        console.log('not supported')
                    })

            }
            else {

                console.log('success - apple');
                console.log(props.isrcResp[0].attributes.url);
                Linking.canOpenURL(props.isrcResp[0].attributes.url)
                    .then((supported) => {
                        if (supported) {
                            Linking.openURL(props.isrcResp[0].attributes.url)
                                .then(() => {
                                    console.log('success');
                                })
                                .catch(() => {
                                    console.log('error')
                                })
                        }
                    })
                    .catch(() => {
                        console.log('not supported')
                    })

            }
        }
        else {
            toast('', 'No Song Found');
        }
    };


    // RENDER FLATLIST DATA
    function renderFlatlistData(data) {
        return (
            <CommentList
                width={"100%"}
                image={constants.profile_picture_base_url + data.item.profile_image}
                name={data.item.username}
                comment={data.item.text}
                time={moment(data.item.createdAt).from()}
                marginBottom={data.index === commentData.length - 1 ? normalise(10) : 0}
                onPressImage={() => {
                    if (props.userProfileResp._id === data.item.user_id) {
                        if (RbSheetRef) RbSheetRef.close();
                        props.navigation.navigate('Profile', {fromAct: false})
                    }
                    else {
                        if (RbSheetRef) RbSheetRef.close();
                        props.navigation.navigate('OthersProfile', { id: data.item.user_id })
                    }
                }} />
        )
    };


    // BOTTOM SHEET FUNC
    const RbSheet = () => {
        return (
            <RBSheet
                ref={(ref) => {
                    if (ref) {
                        RbSheetRef = ref
                    }
                }}
                animationType={'slide'}
                closeOnDragDown={false}
                closeOnPressMask={true}
                nestedScrollEnabled={true}
                keyboardAvoidingViewEnabled={true}
                customStyles={{
                    container: {
                        minHeight: Dimensions.get('window').height / 2.2,
                        borderTopEndRadius: normalise(8),
                        borderTopStartRadius: normalise(8),
                    },

                }}>

                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.black }}>
                    <View style={{ width: '95%', alignSelf: 'center' }}>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: normalise(15),
                            borderBottomWidth: 0.5,
                            borderColor: Colors.grey
                        }}>
                            <TouchableOpacity onPress={() => { if (RbSheetRef) { RbSheetRef.close() } }}>
                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                        marginBottom: normalise(10)
                                    }}
                                    resizeMode='contain' />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { if (RbSheetRef) { RbSheetRef.close() } }}>
                                <Text style={{
                                    fontSize: normalise(12), color: Colors.white,
                                    fontFamily: 'ProximaNova-Bold',
                                    marginBottom: normalise(10)
                                }}>{arrayLength}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { if (RbSheetRef) { RbSheetRef.close() } }}>
                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                        marginBottom: normalise(10)
                                    }}
                                    resizeMode='contain' />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            style={{ height: '60%' }}
                            data={commentData}
                            renderItem={renderFlatlistData}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(17),
                            marginTop: normalise(10),
                            padding: normalise(10),
                            color: Colors.white, paddingRight: normalise(50)
                        }}
                            placeholder={"Add a comment..."}
                            value={commentText}
                            placeholderTextColor={Colors.white}
                            onChangeText={(text) => { setCommentText(text) }} />

                        {commentText.length > 1 ?
                            <TouchableOpacity
                                style={{
                                    position: 'absolute', right: 0,
                                    bottom: normalise(10),
                                    paddingRight: normalise(10)
                                }}
                                onPress={() => {
                                    let commentObject = {
                                        post_id: id,
                                        text: commentText
                                    };
                                    let updateMessagPayload = {};

                                    if (comingFromMessage) {

                                        let tempData = commentData;
                                        tempData.push({
                                            profile_image: props.userProfileResp.profile_image,
                                            text: commentText,
                                            username: props.userProfileResp.username,
                                            createdAt: moment().toString(),
                                            user_id: props.userProfileResp._id
                                        });
                                        setArrayLength(`${tempData.length} ${tempData.length > 1 ? "COMMENTS" : "COMMENT"}`)
                                        setCommentData(tempData);
                                        setCommentText("");
                                        
                                        updateMessagPayload = {
                                            ChatId: key,
                                            chatToken: chatToken,
                                            message: commentData,
                                        }
                                    }
                                    isInternetConnected()
                                        .then(() => {
                                            comingFromMessage ? props.updateMessageCommentRequest(updateMessagPayload) : props.commentOnPost(commentObject)
                                        })
                                        .catch(() => {
                                            toast('Error', 'Please Connect To Internet')
                                        })
                                }}>
                                <Text style={{
                                    color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                                }}>POST</Text>

                            </TouchableOpacity> : null}
                    </View>
                </KeyboardAvoidingView>

            </RBSheet>
        )
    };


    const renderModalMorePressed = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    //Alert.alert("Modal has been closed.");
                }}
            >
                <ImageBackground
                    source={ImagePath.page_gradient}
                    style={styles.centeredView}
                >

                    <View
                        style={styles.modalView}
                    >
                        <Text style={{
                            color: Colors.white,
                            fontSize: normalise(12),
                            fontFamily: 'ProximaNova-Semibold',

                        }}>MORE</Text>

                        <View style={{
                            backgroundColor: Colors.activityBorderColor,
                            height: 0.5,
                            marginTop: normalise(12),
                            marginBottom: normalise(12)
                        }} />

                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(10) }}>

                            <Image source={ImagePath.boxicon} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Save Song</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                            <Image source={ImagePath.sendicon} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(13), marginLeft: normalise(15),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Send Song</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                            <Image source={ImagePath.more_copy} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Copy Link</Text>
                        </TouchableOpacity>



                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                            onPress={() => {
                                //FOR SPOTIFY USERS
                                if (props.userProfileResp.register_type === 'spotify') {
                                    if (props.userProfileResp.register_type === registerType) {

                                        Linking.canOpenURL(originalUri).then((supported) => {
                                            if (supported) {
                                                Linking.openURL(originalUri)
                                                    .then(() => {
                                                        console.log('success');
                                                    })
                                                    .catch((err) => {
                                                        console.log('failed');
                                                    })
                                            }
                                        }).catch((err) => {
                                            console.log('not supported');
                                        })
                                    }
                                    else {
                                        openInAppleORSpotify();
                                    }
                                }
                                //FOR APPLE USERS
                                else {
                                    if (props.userProfileResp.register_type === registerType) {
                                        console.log(originalUri);
                                        Linking.canOpenURL(originalUri).then((supported) => {
                                            if (supported) {
                                                Linking.openURL(originalUri)
                                                    .then(() => {
                                                        console.log('success');
                                                    })
                                                    .catch((err) => {
                                                        console.log('failed');
                                                    })
                                            }
                                        }).catch((err) => {
                                            console.log('not supported');
                                        })
                                    }
                                    else {
                                        openInAppleORSpotify();

                                    }
                                }

                                setModalVisible(!modalVisible)
                            }}
                        >
                            <Image source={props.userProfileResp.register_type === 'spotify' ? ImagePath.spotifyicon : ImagePath.applemusic}
                                style={{ height: normalise(18), width: normalise(18), borderRadius: normalise(9) }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>{props.userProfileResp.register_type === 'spotify' ? "Open on Spotify" : "Open on Apple"}</Text>
                        </TouchableOpacity>

                    </View>


                    <TouchableOpacity onPress={() => {
                        setModalVisible(!modalVisible);
                    }}

                        style={{
                            marginStart: normalise(20),
                            marginEnd: normalise(20),
                            marginBottom: normalise(20),
                            height: normalise(50),
                            width: "95%",
                            backgroundColor: Colors.darkerblack,
                            opacity: 10,
                            borderRadius: 20,
                            // padding: 35,
                            alignItems: "center",
                            justifyContent: 'center',

                        }}>


                        <Text style={{
                            fontSize: normalise(12),
                            fontFamily: 'ProximaNova-Bold',
                            color: Colors.white
                        }}>CANCEL</Text>

                    </TouchableOpacity>
                </ImageBackground>
            </Modal>
        )
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <StatusBar />

                <Loader visible={bool} />

                <Loader visible={props.playerStatus === GET_SONG_FROM_ISRC_REQUEST} />

                <SafeAreaView style={{ flex: 1, }}>

                    <ScrollView>

                        <View style={{
                            marginHorizontal: normalise(15),
                            width: normalise(290),
                            marginTop: normalise(15),
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: changePlayer ? 'flex-end' : 'space-between'
                        }}>

                            {changePlayer ? null :
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Image source={{ uri: constants.profile_picture_base_url + profilePic }}
                                        style={{
                                            height: normalise(24), width: normalise(24),
                                            borderRadius: normalise(24)
                                        }}
                                        resizeMode="contain" />

                                    <View style={{
                                        flexDirection: 'column', alignItems: 'flex-start', marginLeft: normalise(5)
                                    }}>

                                        <Text style={{
                                            color: Colors.grey, fontSize: normalise(8),
                                            fontFamily: 'ProximaNova-Bold'
                                        }} numberOfLines={1}> POSTED BY </Text>

                                        <Text style={{
                                            color: Colors.white, fontSize: normalise(11),
                                            fontFamily: 'ProximaNova-Semibold',
                                        }} numberOfLines={1}> {username} </Text>
                                    </View>
                                </View>}


                            <View style={{
                                height: normalise(40), backgroundColor: Colors.black,
                                justifyContent: 'center', flexDirection: 'row'
                            }}>

                                <TouchableOpacity style={{
                                    height: normalise(25), width: normalise(45),
                                    borderRadius: normalise(5), alignSelf: 'center', backgroundColor: Colors.black,
                                    justifyContent: 'center', alignItems: 'center', marginLeft: normalise(10)
                                }} onPress={() => { props.navigation.goBack() }}>

                                    <Image source={ImagePath.backicon}
                                        style={{ height: normalise(15), width: normalise(15), transform: [{ rotate: '-90deg' }] }}
                                        resizeMode='contain' />
                                </TouchableOpacity>

                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                if (hasSongLoaded)
                                    playing()
                            }}
                            style={{
                                marginTop: normalise(5),
                                height: normalise(265), width: normalise(290), alignSelf: 'center',
                                borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                                borderColor: Colors.grey, shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                                shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                            }}>

                            <Image source={{ uri: pic.replace("100x100bb.jpg", "500x500bb.jpg") }}
                                style={{ height: normalise(265), width: normalise(290), borderRadius: normalise(15) }}
                                resizeMode="cover" />

                            <TouchableOpacity
                                onPress={() => {
                                    if (hasSongLoaded)
                                        playing()
                                }}
                                style={{
                                    height: normalise(60), width: normalise(60), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.white, borderRadius: normalise(30), position: 'absolute'
                                }}>

                                <Image source={playVisible ? ImagePath.playicon : ImagePath.pauseicon}
                                    style={{ height: normalise(20), width: normalise(20) }} />

                            </TouchableOpacity>

                        </TouchableOpacity>




                        <View style={{
                            flexDirection: 'row', alignItems: "center", justifyContent: 'space-between',
                            width: '90%', alignSelf: 'center', marginTop: normalise(15)
                        }}>

                            <View style={{
                                flexDirection: 'column', width: '80%', alignSelf: 'center',
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(12),
                                    fontFamily: 'ProximaNova-Semibold',
                                    width: '90%',
                                }} numberOfLines={1}>{songTitle}</Text>

                                <Text style={{
                                    color: Colors.grey_text, fontSize: normalise(10),
                                    fontFamily: 'ProximaNovaAW07-Medium', width: '90%',
                                }} numberOfLines={1}>{albumTitle}</Text>

                            </View>
                            {/* {changePlayer ? null :
                                <Image source={registerType === 'spotify' ? ImagePath.spotifyicon : ImagePath.applemusic}
                                    style={{ height: normalise(20), width: normalise(20), borderRadius: normalise(10) }}
                                    resizeMode='contain' />} */}

                            {changePlayer ? null :
                                <TouchableOpacity style={{
                                    height: normalise(25), width: normalise(45),
                                    borderRadius: normalise(5), alignSelf: 'center', backgroundColor: Colors.fadeblack,
                                    justifyContent: 'center', alignItems: 'center'
                                }} onPress={() => { setModalVisible(!modalVisible) }}>
                                    <Image
                                        source={ImagePath.threedots}
                                        style={{ height: normalise(15), width: normalise(15) }}
                                        resizeMode='contain' />
                                </TouchableOpacity>}

                        </View>

                        {/* <View style={{
                            flexDirection: 'row', width: '90%', alignSelf: 'center',
                            justifyContent: 'space-between', marginTop: normalise(15),
                        }}>

                            <Text style={{
                                color: 'white',
                                fontFamily: 'ProximaNova-Semibold'
                            }}>
                                {playerCurrentTime}
                            </Text>

                            <Text style={{
                                color: 'white',
                                fontFamily: 'ProximaNova-Semibold'
                            }}>
                                -{playerDuration}
                            </Text>

                        </View> */}

                        <Slider
                            style={{ width: '90%', height: 40, alignSelf: "center", marginTop: normalise(5) }}
                            minimumValue={0}
                            maximumValue={30}
                            step={1}
                            thumbTintColor="#99000000"
                            value={playerCurrentTime}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                        />

                        {/* <View style={{
                            flexDirection: 'row', alignSelf: 'center', width: '70%',
                            justifyContent: 'space-around', marginTop: normalise(15), alignItems: 'center'
                        }}>
                            <TouchableOpacity onPress={() => { props.playerSeekToRequest(curentTimeForSlider - 5000) }}>
                                <Image source={ImagePath.backwardicon}
                                    style={{ height: normalise(18), width: normalise(18) }}
                                    resizeMode="contain" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    playInSpotify()
                                }}
                                style={{
                                    height: normalise(60), width: normalise(60), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.white, borderRadius: normalise(30)
                                }}>

                                <Image source={playVisible ? ImagePath.playicon : ImagePath.pauseicon}
                                    style={{ height: normalise(20), width: normalise(20) }} />


                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { props.playerSeekToRequest(curentTimeForSlider + 5000) }}>
                                <Image source={ImagePath.forwardicon}
                                    style={{ height: normalise(18), width: normalise(18) }}
                                    resizeMode="contain" />
                            </TouchableOpacity>
                        </View> */}

                        {changePlayer ? null :

                            <View style={{
                                flexDirection: 'row', width: '90%', alignSelf: 'center',
                                justifyContent: 'space-between', marginTop: normalise(30), alignItems: 'center'
                            }}>

                                <TouchableOpacity style={{
                                    height: normalise(40), width: normalise(42), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.fadeblack, borderRadius: normalise(5)
                                }} onPress={() => {
                                    props.navigation.navigate('HomeItemReactions',
                                        { reactions: reactions, post_id: id })
                                }}>
                                    <Image source={ImagePath.reactionicon}
                                        style={{ height: normalise(20), width: normalise(20) }}
                                        resizeMode="contain" />


                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    height: normalise(40), width: normalise(42), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.fadeblack, borderRadius: normalise(5)
                                }} onPress={() => {
                                    let saveSongObject = {
                                        song_uri: uri,
                                        song_name: songTitle,
                                        song_image: pic,
                                        artist_name: artist,
                                        album_name: albumTitle,
                                        post_id: id,
                                        isrc_code: isrc,
                                        original_song_uri: originalUri
                                    };

                                    props.saveSongReq(saveSongObject);
                                }}>

                                    <Image source={ImagePath.boxicon}
                                        style={{ height: normalise(20), width: normalise(20) }}
                                        resizeMode="contain" />


                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    height: normalise(40), width: normalise(42), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.fadeblack, borderRadius: normalise(5)
                                }}>

                                    <Image source={ImagePath.sendicon}
                                        style={{ height: normalise(20), width: normalise(20) }}
                                        resizeMode="contain" />

                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    height: normalise(40), width: normalise(115), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.fadeblack, borderRadius: normalise(10)
                                }} onPress={() => {
                                    if (RbSheetRef) RbSheetRef.open();
                                }}>

                                    <Image source={ImagePath.comment_grey}
                                        style={{ height: normalise(16), width: normalise(16) }}
                                        resizeMode="contain" />

                                    <Text style={{
                                        fontSize: normalise(9), color: Colors.white, marginLeft: normalise(10),
                                        fontFamily: 'ProximaNova-Bold'
                                    }}>
                                        {arrayLength}
                                    </Text>

                                </TouchableOpacity>
                            </View>}

                        {comingFromMessage ?
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                height: normalise(40), width: normalise(115), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.fadeblack, borderRadius: normalise(10)
                            }} onPress={() => {
                                if (RbSheetRef) RbSheetRef.open();
                            }}>

                                <Image source={ImagePath.comment_grey}
                                    style={{ height: normalise(16), width: normalise(16) }}
                                    resizeMode="contain" />

                                <Text style={{
                                    fontSize: normalise(9), color: Colors.white, marginLeft: normalise(10),
                                    fontFamily: 'ProximaNova-Bold'
                                }}>
                                    {arrayLength}
                                </Text>

                            </TouchableOpacity> : null}



                        {changePlayer ? null :
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    height: normalise(40),
                                    width: normalise(150),
                                    alignSelf: 'center',
                                    alignItems: 'center', justifyContent: 'center',
                                    marginTop: normalise(30),
                                    backgroundColor: Colors.fadeblack,
                                    borderRadius: normalise(10)
                                }}
                                onPress={() => {
                                    //FOR SPOTIFY USERS
                                    if (props.userProfileResp.register_type === 'spotify') {
                                        if (props.userProfileResp.register_type === registerType) {

                                            Linking.canOpenURL(originalUri).then((supported) => {
                                                if (supported) {
                                                    Linking.openURL(originalUri)
                                                        .then(() => {
                                                            console.log('success');
                                                        })
                                                        .catch((err) => {
                                                            console.log('failed');
                                                        })
                                                }
                                            }).catch((err) => {
                                                console.log('not supported');
                                            })
                                        }
                                        else {
                                            openInAppleORSpotify();
                                        }
                                    }
                                    //FOR APPLE USERS
                                    else {
                                        if (props.userProfileResp.register_type === registerType) {
                                            console.log(originalUri);
                                            Linking.canOpenURL(originalUri).then((supported) => {
                                                if (supported) {
                                                    Linking.openURL(originalUri)
                                                        .then(() => {
                                                            console.log('success');
                                                        })
                                                        .catch((err) => {
                                                            console.log('failed');
                                                        })
                                                }
                                            }).catch((err) => {
                                                console.log('not supported');
                                            })
                                        }
                                        else {
                                            openInAppleORSpotify();
                                        }
                                    }
                                }}
                            >
                                <Image source={props.userProfileResp.register_type === 'spotify' ? ImagePath.spotifyicon : ImagePath.applemusic}
                                    style={{ height: normalise(18), width: normalise(18), borderRadius: normalise(18) }}
                                    resizeMode='contain' />
                                <Text style={{
                                    color: Colors.white, marginLeft: normalise(15),
                                    fontSize: normalise(13),
                                    fontFamily: 'ProximaNova-Semibold',
                                }}>{props.userProfileResp.register_type === 'spotify' ? "Open on Spotify" : "Open on Apple"}</Text>
                            </TouchableOpacity>}

                        {RbSheet()}
                        {renderModalMorePressed()}

                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>

    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        postData: state.UserReducer.postData,
        regType: state.TokenReducer.registerType,
        commentResp: state.UserReducer.commentResp,
        userProfileResp: state.UserReducer.userProfileResp,
        songStatus: state.SongReducer.status,
        savedSongResponse: state.SongReducer.savedSongResponse,
        playingSongRef: state.SongReducer.playingSongRef,
        currentPlayerPositionResponse: state.PlayerReducer.currentPlayerPositionResponse,
        playerStatus: state.PlayerReducer.status,
        playerError: state.PlayerReducer.error,
        seekToPlayerResponse: state.PlayerReducer.seekToPlayerResponse,
        isrcResp: state.PlayerReducer.getSongFromISRC
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        commentOnPost: (payload) => {
            dispatch(commentOnPostReq(payload))
        },

        saveSongReq: (payload) => {
            dispatch(saveSongRequest(payload))
        },

        saveSongRefReq: (object) => {
            dispatch(saveSongRefReq(object))
        },
        getCurrentPlayerPostionAction: () => {
            dispatch(getCurrentPlayerPostionAction())
        },
        playerSeekToRequest: (seekTo) => {
            dispatch(playerSeekToRequest(seekTo))
        },
        playerResumeRequest: () => {
            dispatch(playerResumeRequest())
        },
        playerPauseRequest: () => {
            dispatch(playerPauseRequest())
        },
        getSongFromIsrc: (regType, isrc) => {
            dispatch(getSongFromisrc(regType, isrc))
        },
        updateMessageCommentRequest: (payload) => {
            dispatch(updateMessageCommentRequest(payload))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",

    },
    modalView: {
        marginBottom: normalise(10),
        height: normalise(220),
        width: "95%",
        backgroundColor: Colors.darkerblack,
        borderRadius: 20,
        padding: 20,
        paddingTop: normalise(20),

    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,

    }
});