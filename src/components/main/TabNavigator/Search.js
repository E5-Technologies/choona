import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image, Clipboard,
    TextInput, ImageBackground,
    TouchableOpacity, Modal
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import StatusBar from '../../../utils/MyStatusBar';
import HeaderComponent from '../../../widgets/HeaderComponent';
import ImagePath from '../../../assests/ImagePath';
import { FlatList } from 'react-native-gesture-handler';
import ActivityListItem from '../ListCells/ActivityListItem';
import HomeItemList from '../ListCells/HomeItemList';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    USER_SEARCH_REQUEST, USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE,
    USER_FOLLOW_UNFOLLOW_REQUEST,
    USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE,
    SEARCH_POST_REQUEST, SEARCH_POST_SUCCESS,
    SEARCH_POST_FAILURE,
    TOP_50_SONGS_REQUEST, TOP_50_SONGS_SUCCESS,
    TOP_50_SONGS_FAILURE
} from '../../../action/TypeConstants';
import { userSearchRequest, userFollowUnfollowRequest, reactionOnPostRequest } from '../../../action/UserAction';
import { saveSongRequest, getTop50SongsRequest } from '../../../action/SongAction';
import { searchPostReq } from '../../../action/PostAction';
import { deletePostReq } from '../../../action/PostAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import constants from '../../../utils/helpers/constants';
import isInternetConnected from '../../../utils/helpers/NetInfo';

let status;
let postStatus;
let top50Status;

function Search(props) {

    const [usersSearch, setUsersSearch] = useState(true);
    const [genreSearch, setGenreSearch] = useState(false);
    const [songSearch, setSongSearch] = useState(false);


    const [usersSearchText, setUsersSearchText] = useState("");
    const [genreSearchText, setGenreSearchText] = useState("");
    const [songSearchText, setSongSearchText] = useState("");
    const [bool, setBool] = useState(false);

    const [songData, setSongData] = useState([]);       // user search data...ignore the naming
    const [searchPostData, setSearchPostData] = useState([]);   //search post data
    const [top50, setTop50] = useState([]);  //top 50 data 

    const [positionInArray, setPositionInArray] = useState(0);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalReact, setModalReact] = useState("");

    let changePlayer = false;
    let sendSong = false;
    let flag = true;

    // useEffect(() => {
    //     const unsuscribe = props.navigation.addListener('focus', (payload) => {
    //         setSearchPostData([]);
    //         setSongSearchText("");
    //     });

    //     return () => {
    //         unsuscribe();
    //     }
    // }, []);

    if (status === "" || status !== props.status) {

        switch (props.status) {

            case USER_SEARCH_REQUEST:
                status = props.status
                break;

            case USER_SEARCH_SUCCESS:
                status = props.status
                setBool(true)
                setSongData([])
                setTimeout(() => {
                    setSongData(props.userSearch)
                    setBool(false);
                }, 1000)
                break;

            case USER_SEARCH_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                //props.userSearchReq({ keyword: usersSearchText })
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                status = props.status
                break;
        }
    };

    if (postStatus === "" || postStatus !== props.postStatus) {

        switch (props.postStatus) {

            case SEARCH_POST_REQUEST:
                postStatus = props.postStatus
                break;

            case SEARCH_POST_SUCCESS:
                postStatus = props.postStatus
                setSearchPostData(props.searchPostData);
                break;

            case SEARCH_POST_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                postStatus = props.postStatus
                break;

        }
    };

    if (top50Status === "" || top50Status !== props.top50SongsStatus) {

        switch (props.top50SongsStatus) {

            case TOP_50_SONGS_REQUEST:
                top50Status = props.top50SongsStatus
                break;

            case TOP_50_SONGS_SUCCESS:
                top50Status = props.top50SongsStatus
                setTop50(props.top50SongsResponse)
                break;

            case TOP_50_SONGS_FAILURE:
                top50Status = props.top50SongsStatus
                console.log("ERROR", props.error.response)
                break;
        }
    };


    // RENDER FUNCTION FLATLIST 
    function renderUserData(data) {
        return (
            <ActivityListItem
                image={constants.profile_picture_base_url + data.item.profile_image}
                title={data.item.username}
                follow={data.item.isFollowing ? false : true}
                bottom={data.index === props.userSearch.length - 1 ? true : false}
                marginBottom={data.index === props.userSearch.length - 1 ? normalise(80) : normalise(0)}
                onPressImage={() => {
                    props.navigation.navigate("OthersProfile",
                        { id: data.item._id, following: data.item.isFollowing })
                }}
                onPress={() => { props.followReq({ follower_id: data.item._id }) }}
            />
        )
    };

    function renderSongData(data) {
        return (
            <HomeItemList
                image={data.item.song_image}
                picture={data.item.userDetails.profile_image}
                name={data.item.userDetails.username}
                comments={data.item.comment}
                reactions={data.item.reaction}
                content={data.item.post_content}
                time={data.item.createdAt}
                title={data.item.song_name}
                singer={data.item.artist_name}
                modalVisible={modal1Visible}
                postType={data.item.social_type === "spotify"}
                onReactionPress={(reaction) => {
                    hitreact(reaction),
                        sendReaction(data.item._id, reaction);
                }}
                onPressImage={() => {
                    if (props.userProfileResp._id === data.item.user_id) {
                        props.navigation.navigate("Profile")
                    }
                    else {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item.user_id })
                    }
                }}

                onAddReaction={() => {
                    hitreact1(modal1Visible)
                }}
                onPressMusicbox={() => {
                    props.navigation.navigate('Player', {
                        comments: data.item.comment,
                        song_title: data.item.song_name,
                        album_name: data.item.album_name,
                        song_pic: data.item.song_image,
                        username: data.item.userDetails.username,
                        profile_pic: data.item.userDetails.profile_image,
                        time: data.item.time, title: data.item.title,
                        uri: data.item.song_uri,
                        reactions: data.item.reaction,
                        id: data.item._id,
                        artist: data.item.artist_name,
                        changePlayer: changePlayer,
                        originalUri: data.item.original_song_uri !== "" ? data.item.original_song_uri : undefined,
                        registerType: data.item.userDetails.register_type

                    })
                }}
                onPressReactionbox={() => {
                    props.navigation.navigate('HomeItemReactions', { reactions: data.item.reaction, post_id: data.item._id })
                }}
                onPressCommentbox={() => {
                    props.navigation.navigate('HomeItemComments', { index: data.index, type: 'search' });
                }}
                onPressSecondImage={() => {
                    setPositionInArray(data.index)
                    setModalVisible(true)
                }}
                marginBottom={data.index === searchPostData.length - 1 ? normalise(50) : 0} />
        )
    };


    function renderGenreData(data) {
        return (
            <TouchableOpacity style={{
                marginBottom: data.index === top50.length - 1 ? normalise(30) : normalise(-2),
            }}
                onPress={() => { props.navigation.navigate("GenreSongClicked", { data: data.item._id }) }}
            >

                <Image source={{ uri: data.item.song_image.replace("100x100bb.jpg", "500x500bb.jpg") }}
                    style={{
                        height: normalise(140), width: normalise(140),
                        margin: normalise(6)
                    }}
                    resizeMode="contain" />
            </TouchableOpacity>
        )
    };
    // RENDER FUNCTION FLATLIST END 


    // SEND REACTION
    function sendReaction(id, reaction) {
        let reactionObject = {
            post_id: id,
            text: reaction
        };
        isInternetConnected()
            .then(() => {
                props.reactionOnPostRequest(reactionObject)
            })
            .catch(() => {
                toast('Error', 'Please Connect To Internet')
            })
    };


    // HIT REACT
    function hitreact(x) {
        setVisible(true)
        setModalReact(x)
        setTimeout(() => {
            setVisible(false)
        }, 2000);
    };


    // SHOW REACTION MODAL
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
            //Alert.alert("Modal has been closed.");
        }}
    >
        <View style={{
            flex: 1,
            backgroundColor: '#000000',
            opacity: 0.9,
            justifyContent: "center",
            alignItems: "center",
        }}>

            <Text style={{ fontSize: Platform.OS === 'android' ? normalise(70) : normalise(100) }}>{modalReact}</Text>


        </View>
    </Modal>



    //MODAL MORE PRESSED
    const MorePressed = () => {
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

                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(10) }}
                            onPress={() => {
                                let saveSongObject = {
                                    song_uri: props.searchPostData[positionInArray].song_uri,
                                    song_name: props.searchPostData[positionInArray].song_name,
                                    song_image: props.searchPostData[positionInArray].song_image,
                                    artist_name: props.searchPostData[positionInArray].artist_name,
                                    album_name: props.searchPostData[positionInArray].album_name,
                                    post_id: props.searchPostData[positionInArray]._id,
                                };

                                props.saveSongReq(saveSongObject);
                                setModalVisible(!modalVisible)
                            }}>

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


                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                            onPress={() => {
                                Clipboard.setString(props.searchPostData[positionInArray].song_uri);
                                setModalVisible(!modalVisible);

                                setTimeout(() => {
                                    toast("Success", "Song copied to clipboard.")
                                }, 1000);
                            }}>
                            <Image source={ImagePath.more_copy} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Copy Link</Text>
                        </TouchableOpacity>


                        {/* <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                            onPress={() => {
                                setModalVisible(!modalVisible)
                                setSearchPostData([]);

                                props.userProfileResp._id !== props.searchPostData[positionInArray].user_id ?                      // USER - FOLLOW/UNFOLLOW
                                    props.followReq({ follower_id: props.searchPostData[positionInArray].userDetails._id })    // USER - FOLLOW/UNFOLLOW
                                    : props.deletePostReq(props.searchPostData[positionInArray]._id)

                                    setPositionInArray(0);
                            }}>

                            <Image source={ImagePath.more_unfollow} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />

                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>{! _.isEmpty(props.searchPostData) ? props.userProfileResp._id === props.searchPostData[positionInArray].user_id ? "Delete Post" :
                                `Unfollow ${props.searchPostData[positionInArray].userDetails.username}` : null}</Text>

                        </TouchableOpacity> */}

                    </View>


                    <TouchableOpacity onPress={() => {
                        setModalVisible(!modalVisible);
                        setPositionInArray(0);
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
    };
    //END OF MODAL MORE PRESSED




    // SEARCH AND CLEAR FUNCTIONS
    const search = (text) => {
        if (usersSearch) {
            if (text.length >= 1) {
                isInternetConnected()
                    .then(() => { props.userSearchReq({ keyword: text }, sendSong) })
                    .catch(() => { toast('Error', 'Please Connect To Internet') })
            }
        }

        else if (songSearch) {
            if (text.length >= 1) {
                isInternetConnected().then(() => { props.searchPost(text, flag) })
                    .catch(() => { toast('Error', 'Please Connect To Internet') })

            }

        }
    };


    const clearSearch = () => {
        if (usersSearch) {
            setSongData([]);
        }

        else if (songSearch) {
            setSearchPostData([]);
            setPositionInArray(0);
        }

    };


    //VIEW
    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === USER_SEARCH_REQUEST} />

            <Loader visible={props.postStatus === SEARCH_POST_REQUEST} />

            <Loader visible={props.top50SongsStatus === TOP_50_SONGS_REQUEST} />

            <Loader visible={bool} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={""}
                    title={"SEARCH"}
                    thirditemtext={true}
                    texttwo={""}
                />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: normalise(15)
                }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.fadeblack,
                            width: "33%",
                            height: normalise(40),
                            justifyContent: 'flex-end'
                        }}
                        onPress={() => {
                            setUsersSearch(true),
                                setGenreSearch(false),
                                setSongSearch(false)
                        }}
                    >
                        <Text
                            style={{
                                color: usersSearch ? Colors.white : Colors.grey_text,
                                fontFamily: 'ProximaNova-Black',
                                position: 'absolute',
                                top: normalise(14),
                                left: normalise(26),
                                fontSize: normalise(12)
                            }}>USERS</Text>

                        {usersSearch ? <Image
                            source={ImagePath.gradient_border_horizontal}
                            style={{ width: "100%", height: normalise(2) }}
                        /> : null}


                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.fadeblack,
                            width: "34%",
                            height: normalise(40),
                            justifyContent: 'flex-end'
                        }}
                        onPress={() => {
                            props.getTop50SongReq()
                            setUsersSearch(false),
                                setGenreSearch(true),
                                setSongSearch(false)


                        }}
                    >
                        <Text
                            style={{
                                color: genreSearch ? Colors.white : Colors.grey_text,
                                fontFamily: 'ProximaNova-Black',
                                position: 'absolute',
                                top: normalise(14),
                                left: normalise(26),
                                fontSize: normalise(12)
                            }}>TOP 50</Text>

                        {genreSearch ? <Image
                            source={ImagePath.gradient_border_horizontal}
                            style={{ width: "100%", height: normalise(2) }}
                        /> : null}

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.fadeblack,
                            width: "33%",
                            height: normalise(40),
                            justifyContent: 'flex-end'
                        }}
                        onPress={() => {
                            setUsersSearch(false),
                                setGenreSearch(false),
                                setSongSearch(true)
                        }}
                    >
                        <Text
                            style={{
                                color: songSearch ? Colors.white : Colors.grey_text,
                                fontFamily: 'ProximaNova-Black',
                                position: 'absolute',
                                top: normalise(14),
                                left: normalise(26),
                                fontSize: normalise(12)
                            }}>SONGS</Text>

                        {songSearch ? <Image
                            source={ImagePath.gradient_border_horizontal}
                            style={{ width: "100%", height: normalise(2) }}
                        /> : null}

                    </TouchableOpacity>
                </View>

                <View style={{
                    width: '92%',
                    alignSelf: 'center',
                }}>

                    <TextInput style={{
                        height: normalise(35),
                        width: '100%',
                        backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(8),
                        marginTop: normalise(20),
                        padding: normalise(10),
                        color: Colors.white,
                        paddingLeft: normalise(30)
                    }} value={usersSearch ? usersSearchText : genreSearch ? genreSearchText : songSearchText}
                        placeholder={usersSearch ? "Search Users" : genreSearch ? "Search Top 50 Songs " : "Search Songs"}
                        placeholderTextColor={Colors.darkgrey}
                        onChangeText={(text) => {
                            search(text)
                            usersSearch ? setUsersSearchText(text) : genreSearch ? setGenreSearchText(text) :
                                setSongSearchText(text)
                        }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {usersSearch && usersSearchText || genreSearch && genreSearchText || songSearch && songSearchText ?
                        <TouchableOpacity onPress={() => {
                            clearSearch()
                            usersSearch ? setUsersSearchText("") : genreSearch ? setGenreSearchText("") :
                                setSongSearchText("")
                        }}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: Platform.OS === 'ios' ? normalise(26) : normalise(25),
                                paddingRight: normalise(10)
                            }}>
                            <Text style={{
                                color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                            }}>CLEAR</Text>

                        </TouchableOpacity> : null}
                </View>



                {usersSearch ?              //USERS VIEW

                    _.isEmpty(songData) ?

                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                            <Image source={ImagePath.user} style={{ height: normalise(40), width: normalise(40) }}
                                resizeMode='contain' />

                            <Text style={{
                                color: Colors.white, fontSize: normalise(15), fontWeight: '500',
                                marginTop: normalise(20), width: '68%', textAlign: 'center'
                            }}>Search for users via username or their full name</Text>

                        </View>

                        : <View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', width: '92%', alignSelf: 'center',
                                marginTop: normalise(5), justifyContent: 'flex-start'
                            }}>
                                <Text style={{
                                    fontFamily: 'ProximaNova-Bold',
                                    color: Colors.white, fontSize: normalise(12),
                                    fontWeight: 'bold'
                                }}> RESULTS ({songData.length})</Text>

                            </View>


                            <FlatList
                                style={{ height: '70%' }}
                                data={songData}
                                renderItem={renderUserData}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false} />
                        </View>

                    : null}


                {songSearch ?               //SONG VIEW

                    _.isEmpty(searchPostData) ?

                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                            <Image source={ImagePath.music_icon} style={{ height: normalise(40), width: normalise(40) }}
                                resizeMode='contain' />

                            <Text style={{
                                color: Colors.white, fontSize: normalise(15), fontWeight: '500',
                                marginTop: normalise(20), width: '68%', textAlign: 'center'
                            }}>Search for posts which contain a particular song</Text>

                        </View>

                        : <View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', width: '92%', alignSelf: 'center',
                                marginTop: normalise(5), justifyContent: 'flex-start'
                            }}>
                                <Text style={{
                                    fontFamily: 'ProximaNova-Bold',
                                    color: Colors.white, fontSize: normalise(12),
                                    fontWeight: 'bold'
                                }}> RESULTS ({searchPostData.length})</Text>

                            </View>


                            <FlatList
                                style={{ height: '70%' }}
                                data={searchPostData}
                                renderItem={renderSongData}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false} />

                            {MorePressed()}

                        </View>

                    : null}


                {genreSearch ?              //GENRE VIEW

                    <FlatList
                        //style={{ height: '70%' }}
                        style={{ alignSelf: 'center' }}
                        data={top50}
                        renderItem={renderGenreData}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false} />

                    : null}


            </SafeAreaView>
        </View>
    )

};



const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",

    },
    modalView: {
        marginBottom: normalise(10),
        height: normalise(190),
        width: "95%",
        backgroundColor: Colors.darkerblack,
        borderRadius: 20,
        padding: 20,
        paddingTop: normalise(20)

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

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userSearch: state.UserReducer.userSearch,
        postStatus: state.PostReducer.status,
        searchPostData: state.PostReducer.searchPost,
        savedSongResponse: state.SongReducer.savedSongResponse,
        userProfileResp: state.UserReducer.userProfileResp,
        top50SongsResponse: state.SongReducer.top50SongsResponse,
        top50SongsStatus: state.SongReducer.status,
        error: state.SongReducer.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        userSearchReq: (payload, sendSong) => {
            dispatch(userSearchRequest(payload, sendSong))
        },

        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        },

        searchPost: (text, flag) => {
            dispatch(searchPostReq(text, flag))
        },

        reactionOnPostRequest: (payload) => {
            dispatch(reactionOnPostRequest(payload))
        },

        saveSongReq: (payload) => {
            dispatch(saveSongRequest(payload))
        },

        deletePostReq: (payload) => {
            dispatch(deletePostReq(payload))
        },
        getTop50SongReq: () => {
            dispatch(getTop50SongsRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);