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

let status;

function AddToPlayListScreen(props) {

    const [originalUri, setOriginalUri] = useState(props.route.params.originalUri)
    const [registerType, setRegisterType] = useState(props.route.params.registerType)
    const [isrc, setIsrc] = useState(props.route.params.isrc)

    console.log("originalUri:  " + originalUri + registerType + isrc)

    useEffect(() => {
        props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.getUserPlaylist()
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
                        props.getUserPlaylist()
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
    const openInAppleORSpotify = (playListId) => {

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
                                    props.addSongsToPlayListRequest(addToPlayListObj)
                                })
                                .catch(() => {
                                    toast('Error', "Please Connect To Internet")
                                })
                        }else{
                            console.log("Coming soon")
                        }
 
                    }

                    else {
                        toast('', 'No Song Found');
                    }

                }
                else {
                    toast('Oops', 'Something Went Wrong');
                }

            } catch (error) {
                console.log(error);
            }
        };

        getSpotifyApi(playListId);
    };

    function renderPlayListItem(data) {

        return (
            <TouchableOpacity
                onPress={() => {
                    
                    if(registerType==='spotify'){
                        let addToPlayListObj = {
                            "songUri": [`spotify:track:${(originalUri.substring(originalUri.lastIndexOf("/") + 1))}`],
                            "playListId": data.item.id
                        }
                        isInternetConnected()
                            .then(() => {
                                props.addSongsToPlayListRequest(addToPlayListObj)
                            })
                            .catch(() => {
                                toast('Error', "Please Connect To Internet")
                            })
                    }else{
                        openInAppleORSpotify(data.item.id)
                    }


                }}
                style={{
                    flexDirection: 'row',
                    marginVertical: normalise(10),
                    marginHorizontal: normalise(10)
                }}>
                <Image source={data.item.images.length > 0 ? { uri: data.item.images[0].url } : ImagePath.appIcon512}
                    style={{ height: normalise(50), width: normalise(50) }}
                    resizeMode="contain" />

                <View style={{ marginHorizontal: normalise(10), alignSelf: 'center' }}>
                    <Text style={{
                        color: Colors.white
                    }}>{data.item.name}</Text>
                    <Text style={{
                        color: Colors.grey_text
                    }}>{`${data.item.tracks.total} Tracks`}</Text>
                </View>

            </TouchableOpacity >
        );

    };


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === GET_USER_PLAYLIST_REQUEST} />

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
                    }}>SPOTIFY</Text>

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
        getUserPlaylist: () => {
            dispatch(getUserPlaylist())
        },
        addSongsToPlayListRequest: (payload) => {
            dispatch(addSongsToPlayListRequest(payload))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToPlayListScreen)