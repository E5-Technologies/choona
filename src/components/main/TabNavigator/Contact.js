import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import SavedSongsListItem from '../ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import StatusBar from '../../../utils/MyStatusBar';
import {
    SAVED_SONGS_LIST_REQUEST, SAVED_SONGS_LIST_SUCCESS,
    SAVED_SONGS_LIST_FAILURE,
    UNSAVE_SONG_REQUEST,
    UNSAVE_SONG_SUCCESS,
    UNSAVE_SONG_FAILURE
} from '../../../action/TypeConstants';
import { savedSongsListRequset, unsaveSongRequest } from '../../../action/SongAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import { connect } from 'react-redux';
import isInternetConnected from '../../../utils/helpers/NetInfo';


let status;

function Contact(props) {

    const [search, setSearch] = useState("")

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.getSavedSongs(search)
                })
                .catch(() => {
                    toast("Oops", "Please Connect To Internet")
                })


        });

        return () => {
            unsuscribe()
        }
    }, []);

    if (status === "" || props.status !== status) {
        switch (props.status) {

            case SAVED_SONGS_LIST_REQUEST:
                status = props.status
                break;

            case SAVED_SONGS_LIST_SUCCESS:
                status = props.status
                break;

            case SAVED_SONGS_LIST_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong')
                break;

            case UNSAVE_SONG_REQUEST:
                status = props.status
                break;

            case UNSAVE_SONG_SUCCESS:
                status = props.status
                props.getSavedSongs(search)
                break;

            case UNSAVE_SONG_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong')
                break;

        }
    }

    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={data.item.song_image}
                title={data.item.song_name}
                singer={data.item.artist_name}
                marginBottom={data.index === props.savedSong.length - 1 ? normalise(20) : 0}
                onPressImage={()=>{props.navigation.navigate("Player",
                {
                  song_title: data.item.song_name,
                  album_name: data.item.album_name,
                  song_pic: data.item.song_image,
                  originalUri: data.item.song_uri,
                  id: data.item.post_id,
                  artist: data.item.artist_name,
                  changePlayer: true
                })}} 
                />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === SAVED_SONGS_LIST_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={""}
                    title={"SAVED SONGS"}
                    thirditemtext={true}
                    texttwo={""}
                />

                <View style={{
                    width: '92%',
                    alignSelf: 'center',
                }}>

                    <TextInput style={{
                        height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                        color: Colors.white, paddingLeft: normalise(30),
                    }} value={search}
                        placeholder={"Search"}
                        placeholderTextColor={Colors.darkgrey}
                        onChangeText={(text) => {
                            setSearch(text),
                                props.getSavedSongs(text)
                        }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {search === "" ? null :
                        <TouchableOpacity onPress={() => {
                        setSearch(""),
                            props.getSavedSongs("")
                        }}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: Platform.OS === 'ios' ? normalise(26) : normalise(25),
                                paddingRight: normalise(10)
                            }}>
                            <Text style={{
                                color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                            }}>CLEAR</Text>

                        </TouchableOpacity>}

                </View>


                <SwipeListView
                    data={props.savedSong}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    renderHiddenItem={(rowData, rowMap) => (

                        <TouchableOpacity style={{
                            backgroundColor: Colors.red,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: "space-evenly",
                            height: normalise(39),
                            width: normalise(42),
                            marginTop: normalise(10),
                            position: 'absolute', right: 21
                        }}
                            onPress={() => {
                                props.unsaveSongReq(rowData.item._id)
                                rowMap[rowData.item.key].closeRow()
                            }}
                        >

                            <Image source={ImagePath.unsaved}
                                style={{ height: normalise(15), width: normalise(15), }}
                                resizeMode='contain' />
                            <Text style={{
                                fontSize: normalise(8), color: Colors.white,
                                fontWeight: 'bold'
                            }}>UNSAVE</Text>

                        </TouchableOpacity>
                    )}

                    keyExtractor={(item, index, rowData) => { index.toString() }}
                    disableRightSwipe={true}
                    rightOpenValue={-75} />

            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.SongReducer.status,
        error: state.SongReducer.error,
        savedSong: state.SongReducer.savedSongList,
        userProfileResp: state.UserReducer.userProfileResp
    }
};

const mapDistapchToProps = (dispatch) => {
    return {
        getSavedSongs: (search) => {
            dispatch(savedSongsListRequset(search))
        },

        unsaveSongReq: (id) => {
            dispatch(unsaveSongRequest(id))
        }
    }
};

export default connect(mapStateToProps, mapDistapchToProps)(Contact)

