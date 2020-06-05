
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
    Dimensions
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
    COMMENT_ON_POST_REQUEST, COMMENT_ON_POST_SUCCESS,
    COMMENT_ON_POST_FAILURE,

    SAVE_SONGS_REQUEST, SAVE_SONGS_SUCCESS,
    SAVE_SONGS_FAILURE,
} from '../../action/TypeConstants';
import { commentOnPostReq } from '../../action/UserAction';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { saveSongRequest, saveSongRefReq } from '../../action/SongAction';
import Loader from '../../widgets/AuthLoader';

let RbSheetRef;

let status;
let songStatus;

function Player(props) {

    // PLAYER 
    const [playVisible, setPlayVisible] = useState(false);
    const [uri, setUri] = useState(props.route.params.uri);
    const [trackRef, setTrackRef] = useState("");
    const [currentTime, setCurrentTime] = useState();
    const [index, setIndex] = useState(props.route.params.index);
    const [songTitle, setSongTitle] = useState(props.postData[index].song_name);
    const [albumTitle, setAlbumTitle] = useState(props.postData[index].album_name);
    const [pic, setPic] = useState(props.regType === 'spotify' ? props.postData[index].song_image :
        props.postData[index].song_image.replace("100x100bb.jpg", "500x500bb.jpg"));

    const [username, setUsername] = useState(props.postData[index].userDetails.username);
    const [profilePic, setprofilePic] = useState(props.postData[index].userDetails.profile_image);
    const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
    const [playerDuration, setplayerDuration] = useState(0);

    //COMMENT ON POST
    const [commentData, setCommentData] = useState(props.postData[index].comment);
    const [id, setId] = useState(props.postData[index]._id);
    const [commentText, setCommentText] = useState("");
    const [arrayLength, setArrayLength] = useState(`${commentData.length} ${commentData.length > 1 ? "COMMENTS" : "COMMENT"}`)

    const [bool, setBool] = useState(true);

    let track;



    useEffect(() => {
        // const unsuscribe = props.navigation.addListener('focus', (payload) => {
        // Sound.setActive(true)
        Sound.setCategory('Playback', false);
        playSongOnLoad()


        // });

        // return () => {
        //     unsuscribe();
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


    // PLAY SONG ON LOAD
    const playSongOnLoad = () => {

        if (props.playingSongRef === "") {

            console.log('first time')
            playSong();

        } else {

            if (global.playerReference._filename === uri) {
                console.log('Already Playing');

                setTimeout(() => {
                    changeTime(global.playerReference);
                    let time = global.playerReference.getDuration();
                    setplayerDuration(time);
                    setBool(false);
                    global.playerReference.pause();
                    global.playerReference.play((success) => {
                        if (success) {
                            console.log('Playback End')
                            setPlayVisible(true);
                        }
                    })
                }, 100)

            }

            else {
                console.log('reset');
                global.playerReference.release();
                playSong();
            }

        };
    };


    // PLAY SONG
    const playSong = () => {

        if (uri === null) {
            setBool(false);
            setPlayVisible(true);
            toast('Error', "Sorry, this track cannot be played as it does not have a proper link.")
        } else {

            track = new Sound(uri, "", (err) => {
                if (err) {
                    console.log(err);
                    setPlayVisible(true);
                }
                else {
                    console.log('Loaded')
                    setBool(false);
                    changeTime(track);


                    let saveSongResObj = {}
                    saveSongResObj.uri = uri,
                        saveSongResObj.song_name = songTitle,
                        saveSongResObj.album_name = albumTitle,
                        saveSongResObj.song_pic = pic

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


    //REWIND AND FORWARD
    const toggleTime = (type) => {

        if (uri === null) {
            setBool(false);
            setPlayVisible(true);
            toast('Error', "Sorry, this track cannot be played as it does not have a proper link.")
        } else {

            if (type === 'backward') {
                // trackRef.getCurrentTime((seconds) => { setCurrentTime(seconds), console.log(seconds) })
                // if (currentTime > 5) {
                global.playerReference.setCurrentTime(0)
                setPlayerCurrentTime(0)
                // }
            }
            else {
                global.playerReference.getCurrentTime((seconds) => { setCurrentTime(seconds), console.log(seconds) })
                if (currentTime < 25) {
                    global.playerReference.setCurrentTime(currentTime + 5)
                    setPlayerCurrentTime(currentTime + 5)
                }
            }
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
                marginBottom={data.index === commentData.length - 1 ? normalise(10) : 0} />
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
                animationType={'fade'}
                closeOnDragDown={false}
                closeOnPressMask={false}
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
                            color: Colors.white, paddingLeft: normalise(30)
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
                                    isInternetConnected()
                                        .then(() => {
                                            props.commentOnPost(commentObject)
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


    // CHANGE TIME
    const changeTime = (ref) => {

        setInterval(() => {
            ref.getCurrentTime((seconds) => { setPlayerCurrentTime(seconds) })
        }, 1000)

    };


    // ON SILIDE SLIDER
    const onSliderSlide = (time) => {

        if (uri === null) {
            setBool(false);
            setPlayVisible(true);
            toast('Error', "Sorry, this track cannot be played as it does not have a proper link.")
        } else {
            setPlayerCurrentTime(0)
            setPlayerCurrentTime(time);
            global.playerReference.setCurrentTime(time);
        }
    };



    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <StatusBar />

                <Loader visible={bool} />

                <SafeAreaView style={{ flex: 1, }}>

                    <ScrollView>

                        <View style={{
                            marginHorizontal: normalise(15),
                            width: normalise(290),
                            marginTop: normalise(15),
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>


                            <Image source={{ uri: constants.profile_picture_base_url + profilePic }}
                                style={{ height: normalise(24), width: normalise(24), borderRadius: normalise(12) }}
                                resizeMode="contain" />



                            <View style={{
                                flexDirection: 'column', alignItems: 'flex-start', width: '50%',
                                marginRight: normalise(60)
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

                            <View style={{
                                height: normalise(40), width: normalise(50), backgroundColor: Colors.black,
                                justifyContent: 'center',
                            }}>

                                <TouchableOpacity style={{
                                    height: normalise(25), width: normalise(45),
                                    borderRadius: normalise(5), alignSelf: 'center', backgroundColor: Colors.fadeblack,
                                    justifyContent: 'center', alignItems: 'center'
                                }} >

                                    <Image source={ImagePath.threedots} style={{ height: normalise(15), width: normalise(15) }}
                                        resizeMode='contain' />

                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{
                                marginTop: normalise(5),
                                height: normalise(265), width: normalise(290), alignSelf: 'center',
                                borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                                borderColor: Colors.grey, shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                                shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                            }}   >


                            <Image source={{ uri: pic.replace("100x100bb.jpg", "500x500bb.jpg") }}
                                style={{ height: normalise(265), width: normalise(290), borderRadius: normalise(15) }}
                                resizeMode="cover" />



                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row', alignItems: "center", justifyContent: 'space-between',
                            width: '90%', alignSelf: 'center', marginTop: normalise(15)
                        }}>

                            <View style={{
                                flexDirection: 'column', width: '90%', alignSelf: 'center',
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(14),
                                    fontFamily: 'ProximaNova-Semibold',
                                    width: '90%',
                                }} numberOfLines={1}>{songTitle}</Text>

                                <Text style={{
                                    color: Colors.grey_text, fontSize: normalise(12),
                                    fontFamily: 'ProximaNovaAW07-Medium', width: '90%',
                                }} numberOfLines={1}>{albumTitle}</Text>

                            </View>

                            <Image source={props.regType === 'spotify' ? ImagePath.spotifyicon : ImagePath.applemusic}
                                style={{ height: normalise(20), width: normalise(20), borderRadius: normalise(10) }}
                                resizeMode='contain' />

                        </View>

                        <View style={{
                            flexDirection: 'row', width: '90%', alignSelf: 'center',
                            justifyContent: 'space-between', marginTop: normalise(15),
                        }}>

                            <Text style={{
                                color: 'white',
                                fontFamily: 'ProximaNova-Semibold'
                            }}>
                                {playerCurrentTime >= 10 ? "00:" : "00:0"}{playerCurrentTime.toFixed(0)}
                            </Text>

                            <Text style={{
                                color: 'white',
                                fontFamily: 'ProximaNova-Semibold'
                            }}>
                                -00:{playerDuration.toFixed(0)}
                            </Text>

                        </View>

                        <Slider
                            style={{ width: '90%', height: 40, alignSelf: "center", }}
                            minimumValue={0}
                            maximumValue={30}
                            step={1}
                            value={playerCurrentTime}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            onSlidingComplete={(number) => { onSliderSlide(number) }}
                        />

                        <View style={{
                            flexDirection: 'row', alignSelf: 'center', width: '70%',
                            justifyContent: 'space-around', marginTop: normalise(15), alignItems: 'center'
                        }}>
                            <TouchableOpacity onPress={() => { toggleTime('backward') }}>
                                <Image source={ImagePath.backwardicon}
                                    style={{ height: normalise(18), width: normalise(18) }}
                                    resizeMode="contain" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    playing()
                                }}
                                style={{
                                    height: normalise(60), width: normalise(60), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.white, borderRadius: normalise(30)
                                }}>
                                {playVisible == true ?
                                    <Image source={ImagePath.playicon}
                                        style={{ height: normalise(20), width: normalise(20) }}
                                        resizeMode="contain" />
                                    :

                                    <Image source={ImagePath.pauseicon}
                                        style={{ height: normalise(20), width: normalise(20) }}
                                        resizeMode="contain" />

                                }

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { toggleTime('forward') }}>
                                <Image source={ImagePath.forwardicon}
                                    style={{ height: normalise(18), width: normalise(18) }}
                                    resizeMode="contain" />
                            </TouchableOpacity>
                        </View>


                        <View style={{
                            flexDirection: 'row', width: '90%', alignSelf: 'center',
                            justifyContent: 'space-between', marginTop: normalise(25), alignItems: 'center'
                        }}>

                            <TouchableOpacity style={{
                                height: normalise(40), width: normalise(42), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.fadeblack, borderRadius: normalise(5)
                            }} onPress={() => {
                                props.navigation.navigate('HomeItemReactions',
                                    { reactions: props.postData[index].reaction, post_id: id })
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
                                    song_uri: props.postData[index].song_uri,
                                    song_name: props.postData[index].song_name,
                                    song_image: props.postData[index].song_image,
                                    artist_name: props.postData[index].artist_name,
                                    album_name: props.postData[index].album_name,
                                    post_id: props.postData[index]._id,
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
                                if (RbSheetRef) RbSheetRef.open()
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
                        </View>

                        <TouchableOpacity style={{
                            width: '90%', alignSelf: 'center', backgroundColor: Colors.fadeblack,
                            height: normalise(50), marginTop: normalise(40), alignItems: 'center',
                            justifyContent: 'center',
                            borderTopRightRadius: normalise(8), borderTopLeftRadius: normalise(8),
                            marginBottom: normalise(20),
                        }} onPress={() => { props.navigation.goBack() }}>

                            <View style={{
                                width: '90%', alignSelf: 'center', flexDirection: 'row',
                                justifyContent: 'space-between', alignItems: 'center',
                            }}>


                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                    }} resizeMode='contain' />


                                <Text style={{
                                    color: Colors.white, fontSize: normalise(12),
                                    fontFamily: 'ProximaNova-Extrabld'
                                }}>MINIMISE PLAYER</Text>


                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                    }} resizeMode='contain' />


                            </View>
                        </TouchableOpacity>

                        {RbSheet()}

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
        playingSongRef: state.SongReducer.playingSongRef
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);