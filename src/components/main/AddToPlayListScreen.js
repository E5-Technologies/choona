import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    TextInput
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import ActivityListItem from '../../components/main/ListCells/ActivityListItem';
import StatusBar from '../../utils/MyStatusBar';
import {

    GET_USER_PLAYLIST_REQUEST,
    GET_USER_PLAYLIST_SUCCESS,
    GET_USER_PLAYLIST_FAILURE,

    ADD_SONG_TO_PLAYLIST_REQUEST,
    ADD_SONG_TO_PLAYLIST_SUCCESS,
    ADD_SONG_TO_PLAYLIST_FAILURE
}
    from '../../action/TypeConstants';
import { getUserPlaylist, addSongsToPlayListRequest } from '../../action/PlayerAction';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux'
import _ from 'lodash'
import axios from 'axios';
import { getSpotifyToken } from '../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../utils/helpers/AppleDevToken';
import { NativeModules } from 'react-native';

let status;

function AddToPlayListScreen(props) {

    const [originalUri, setOriginalUri] = useState(props.route.params.originalUri);
    const [registerType, setRegisterType] = useState(props.route.params.registerType);
    const [isrc, setIsrc] = useState(props.route.params.isrc);
    const [bool, setBool] = useState(false);
    const [id, setId] = useState(0);

    let devToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IktKN0RKQjM3NjgifQ.eyJpYXQiOjE2MDAzMjM5MDksImV4cCI6MTYwMDMyNzUwOSwiaXNzIjoiSDIzVzNFRVJMSyJ9.9f5rO00a6z1Q1DVgMDeo9PUVbdh5S937KJxmBe-9Yw4hNr_Ug9xzxtcDZlRRNqqiMLgX-9zNNZ05DXor-3wSGQ';
    let musicToken = 'Ai6D0TPiaMdnoCYBqv4K7ykJpmSqEcn9BanBjrvZi3BAoHuu/nZP4QLVdVSavZlfJk3/q9ASJAKFJQcop4lbWHKBrhlwnTOUnQG0vTOpCh8x8jzlgE06boY8aVaUex9ICGj+LMFd/p+SEwQQd0g1ca7IF89l2uQqVLoCgkUVy+rMZ2bcY+Rz/Jb0Qe33Zii7OxiHB9Xdr4YhCZmOaZCWEu+ZHEg/nxHg1gp2kSo0LkfKhRhGnw==';

    console.log("originalUri:  " + originalUri + registerType + isrc);

    useEffect(() => {
        props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    if (props.registerType === "apple") {
                        setBool(true);
                        getTokens();
                    }
                    else {
                        props.getUserPlaylist(props.registerType)
                    }
                })
                .catch(() => {
                    toast('Error', "Please Connect To Internet")
                })
        })
    });


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case GET_USER_PLAYLIST_REQUEST:
                status = props.status
                break;

            case GET_USER_PLAYLIST_SUCCESS:
                status = props.status
                break;

            case GET_USER_PLAYLIST_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;

            case ADD_SONG_TO_PLAYLIST_REQUEST:
                status = props.status
                break;

            case ADD_SONG_TO_PLAYLIST_SUCCESS:
                status = props.status;
                toast("Oops", "Song successfully added to playlist")
                isInternetConnected()
                    .then(() => {
                        props.getUserPlaylist(props.registerType, devToken, musicToken)
                    })
                    .catch(() => {
                        toast('Error', "Please Connect To Internet")
                    })
                break;

            case ADD_SONG_TO_PLAYLIST_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;
        }
    };

    // GET ISRC CODE
    const callApi = async () => {
        if (props.registerType === 'spotify') {

            const spotifyToken = await getSpotifyToken();

            return await axios.get(`https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track`, {
                headers: {
                    "Authorization": spotifyToken
                }
            });
        }
        else {
            const AppleToken = await getAppleDevToken();

            return await axios.get(`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${isrc}`, {
                headers: {
                    "Authorization": AppleToken
                }
            });
        }
    };


    //OPEN IN APPLE / SPOTIFY
    const getAppleTrackIdFromIsrc = (playListId) => {

        const getSpotifyApi = async (playListId) => {
            try {
                const res = await callApi();
                console.log(res);

                if (res.status === 200) {
                    if (!_.isEmpty(props.registerType === 'spotify' ? res.data.tracks.items : res.data.data)) {
                        if (props.registerType === 'spotify') {

                            let addToPlayListObj = {
                                "songUri": [`${res.data.tracks.items[0].uri}`],
                                "playListId": playListId
                            }
                            isInternetConnected()
                                .then(() => {
                                    props.addSongsToPlayListRequest(props.registerType, addToPlayListObj)
                                })
                                .catch(() => {
                                    toast('Error', "Please Connect To Internet")
                                })
                        }
                        else {

                            props.getUserPlaylist(props.registerType, devToken, musicToken);
                            setId(res.data.data[0].id);
                            setBool(false);
                        }
                    }
                    else {
                        toast('', 'The selected song was not found');
                        setBool(false);
                    }

                }
                else {
                    toast('Oops', 'Something Went Wrong');
                    setBool(false);
                }

            } catch (error) {
                console.log(error);
                setBool(false);
            }
        };

        getSpotifyApi(playListId);
    };


    // GET TOKENS FOR APPLE MUSIC
    const getTokens = async () => {

        const token = await getAppleDevToken()

        if (token !== "") {
            let newtoken = token.split(" ");
            NativeModules.Print.printValue(newtoken.pop(), (value) => {
                console.log(value);
                if (value === "") {
                    setId(1);
                    toast("Error", "This feature is available for users with Apple Music Subcription. You need to subscribe to Apple Music to avail this feature.");
                    setBool(false);
                }
                else {
                    getAppleTrackIdFromIsrc();
                }
            })
        }
        else {
            toast('Oops', 'Something Went Wrong');
        }
    };

    function renderPlayListItem(data) {

        return (
            <TouchableOpacity
                onPress={() => {
                    if (props.registerType === 'spotify') {
                        if (registerType === 'spotify') {
                            let addToPlayListObj = {
                                "songUri": [`spotify:track:${(originalUri.substring(originalUri.lastIndexOf("/") + 1))}`],
                                "playListId": data.item.id
                            }
                            isInternetConnected()
                                .then(() => {
                                    props.addSongsToPlayListRequest(props.registerType, addToPlayListObj)
                                })
                                .catch(() => {
                                    toast('Error', "Please Connect To Internet")
                                })
                        } else {
                            getAppleTrackIdFromIsrc(data.item.id)
                        }
                    }
                    else {
                        if (id === 0) {
                            toast('', 'The selected song was not found');
                        }
                        else if (id === 1) {
                            toast("Error", "This feature is available for users with Apple Music Subcription. You need to subscribe to Apple Music to avail this feature.")
                        }
                        else {
                            let addToPlayListObj = {
                                obj: [{
                                    id: id,
                                    type: 'songs'
                                }],
                                playListId: data.item.id
                            }
                            props.addSongsToPlayListRequest(props.registerType, addToPlayListObj, devToken, musicToken);
                        }
                    }


                }}
                style={{
                    flexDirection: 'row',
                    marginVertical: normalise(10),
                    marginHorizontal: normalise(10)
                }}>
                <Image source={props.registerType === "spotify" ? data.item.images.length > 0 ? { uri: data.item.images[0].url } : ImagePath.appIcon512
                    : data.item.attributes.hasOwnProperty("artwork") ? { uri: data.item.attributes.artwork.url } : ImagePath.appIcon512}
                    style={{ height: normalise(50), width: normalise(50) }}
                    resizeMode="contain" />

                <View style={{ marginHorizontal: normalise(10), alignSelf: 'center' }}>
                    <Text style={{
                        color: Colors.white
                    }}>{props.registerType === 'spotify' ? data.item.name : data.item.attributes.name}</Text>
                    <Text style={{
                        color: Colors.grey_text
                    }}>{props.registerType === 'spotify' ? `${data.item.tracks.total} Tracks` : data.item.type}</Text>
                </View>

            </TouchableOpacity >
        );

    };


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === GET_USER_PLAYLIST_REQUEST} />
            <Loader visible={bool} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} title={`ADD TO PLAYLIST`}
                    thirditemtext={true} texttwo={""}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

                <Text
                    style={{
                        color: Colors.activityBorderColor,
                        marginTop: normalise(30),
                        marginHorizontal: normalise(10)
                    }}>{props.registerType === 'spotify' ? "SPOTIFY" : 'APPLE MUSIC'}</Text>

                {props.getUserPlayList.length < 1 ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text
                            style={{ color: Colors.white, fontSize: normalise(14), textAlign: 'center' }}
                        >Please make a playlist on Spotify/Apple Music before you can save.
                        </Text>
                    </View>

                    : <FlatList
                        style={{ marginTop: normalise(10) }}
                        data={props.getUserPlayList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => { index.toString() }}
                        renderItem={renderPlayListItem} />}



            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.PlayerReducer.status,
        getUserPlayList: state.PlayerReducer.getUserPlayList,
        registerType: state.TokenReducer.registerType,
        addSongToPlayListResponse: state.PlayerReducer.addSongToPlayListResponse,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserPlaylist: (regType, devToken, musicToken) => {
            dispatch(getUserPlaylist(regType, devToken, musicToken))
        },
        addSongsToPlayListRequest: (regType, payload, devToken, musicToken) => {
            dispatch(addSongsToPlayListRequest(regType, payload, devToken, musicToken))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToPlayListScreen)