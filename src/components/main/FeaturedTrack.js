import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
    Platform
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import SavedSongsListItem from './ListCells/SavedSongsListItem';
import _ from 'lodash';
import StatusBar from '../../utils/MyStatusBar';
import { connect } from 'react-redux';
import {
    FEATURED_SONG_SEARCH_REQUEST,
    FEATURED_SONG_SEARCH_SUCCESS,
    FEATURED_SONG_SEARCH_FAILURE,

    EDIT_PROFILE_REQUEST,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE

} from '../../action/TypeConstants';
import { featuredSongSearchReq, editProfileRequest } from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';

let status;

function FeaturedTrack(props) {

    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);


    if (status === "" || status !== props.status) {
        switch (props.status) {

            case FEATURED_SONG_SEARCH_REQUEST:
                status = props.status
                break;

            case FEATURED_SONG_SEARCH_SUCCESS:
                setData(props.featuredTrackResp);
                status = props.status
                break;

            case FEATURED_SONG_SEARCH_FAILURE:
                toast("Error", "Something Went Wong, Please Try Again")
                status = props.status
                break;

            case EDIT_PROFILE_REQUEST:
                status = props.status
                break;

            case EDIT_PROFILE_SUCCESS:
                status = props.status
                props.navigation.goBack();
                break;

            case EDIT_PROFILE_FAILURE:
                toast("Error", "Something Went Wong, Please Try Again")
                status = props.status
                break;
        }
    };

    function singerList(artists) {

        let names = ""

        artists.map((val, index) => {
            names = names + `${val.name}${artists.length - 1 === index ? "" : ", "}`
        })

        return names
    };

    function renderItem(data) {

        return (
            <SavedSongsListItem
                image={props.registerType === 'spotify' ? data.item.album.images.length > 1 ? data.item.album.images[0].url : "qwe" : data.item.attributes.artwork.url.replace('{w}x{h}', '300x300')}
                title={props.registerType === 'spotify' ? data.item.name : data.item.attributes.name}
                singer={props.registerType === 'spotify' ? singerList(data.item.artists) : data.item.attributes.artistName}
                marginRight={normalise(50)}
                marginBottom={data.index === props.featuredTrackResp.length - 1 ? normalise(20) : 0}
                change={true}
                image2={ImagePath.addicon}
                onPressSecondImage={() => {
                    let formdata = new FormData;
                    let array = [{
                        song_name: props.registerType === 'spotify' ? data.item.name : data.item.attributes.name,
                        song_uri: props.registerType === 'spotify' ? data.item.preview_url : data.item.attributes.previews[0].url,
                        album_name: props.registerType === 'spotify' ? data.item.album.name : data.item.attributes.albumName,
                        song_pic: props.registerType === 'spotify' ? data.item.album.images.length > 1 ? data.item.album.images[0].url : "qwe" : data.item.attributes.artwork.url.replace('{w}x{h}', '300x300'),
                        artist_name: props.registerType === 'spotify' ? singerList(data.item.artists) : data.item.attributes.artistName,
                        original_song_uri: props.registerType === "spotify" ? data.item.external_urls.spotify : data.item.attributes.url,
                        isrc_code: props.registerType === "spotify" ? data.item.external_ids.isrc : data.item.attributes.isrc
                    }];
                    formdata.append("feature_song", JSON.stringify(array))
                    props.editProfileReq(formdata);
                }}
                onPressImage={() => {
                    props.navigation.navigate("Player",
                        {
                            song_title: props.registerType === 'spotify' ? data.item.name : data.item.attributes.name,
                            album_name: props.registerType === "spotify" ? data.item.album.name :
                                data.item.attributes.albumName,
                            song_pic: props.registerType === 'spotify' ? data.item.album.images[0].url : data.item.attributes.artwork.url.replace('{w}x{h}', '300x300'),
                            username: "",
                            profile_pic: "",
                            originalUri: props.registerType === "spotify" ? data.item.external_urls.spotify :
                                data.item.attributes.url,
                            uri: props.registerType === "spotify" ? data.item.preview_url :
                                data.item.attributes.previews[0].url,
                            id: "",
                            artist: props.registerType === 'spotify' ? singerList(data.item.artists) : data.item.attributes.artistName,
                            changePlayer: true,
                            registerType: props.registerType,
                            changePlayer2: props.registerType === 'spotify' ? true : false,
                            id: props.registerType === 'spotify' ? data.item.id : null
                        })
                }}
            />
        )
    };


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === FEATURED_SONG_SEARCH_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon}
                    onPressFirstItem={() => { props.navigation.goBack() }}
                    textone={""}
                    title={"PICK FEATURED TRACK"}
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
                            if (text.length >= 1) {
                                props.featuredSongSearchReq(text)
                            }
                            setSearch(text)
                        }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {search === "" ? null :
                        <TouchableOpacity onPress={() => { setSearch(""), setData([]) }}
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

                {_.isEmpty(data) ? null :
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center',
                        marginTop: normalise(5)
                    }}>
                        <Image source={props.registerType === "spotify" ? ImagePath.spotifyicon : ImagePath.applemusic}
                            style={{ height: normalise(20), width: normalise(20) }} />
                        <Text style={{
                            color: Colors.white, fontSize: normalise(12), marginLeft: normalise(10),
                            fontWeight: 'bold'
                        }}>{` RESULTS (${props.featuredTrackResp.length})`}</Text>

                    </View>}


                {_.isEmpty(data) ?

                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                        <Image source={ImagePath.searchicongrey} style={{ height: normalise(35), width: normalise(35) }} />

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15), fontWeight: 'bold',
                            marginTop: normalise(20), width: '60%', textAlign: 'center'
                        }}>Search for the song you want to share above.</Text>

                    </View>

                    : <FlatList
                        style={{ marginTop: normalise(10) }}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                    />}

            </SafeAreaView>
        </View>
    )
}

const mapStateToProps = (state) => {

    return {
        status: state.UserReducer.status,
        featuredTrackResp: state.UserReducer.featuredSongSearchResp,
        registerType: state.TokenReducer.registerType
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        featuredSongSearchReq: (text) => {
            dispatch(featuredSongSearchReq(text))
        },

        editProfileReq: (payload) => {
            dispatch(editProfileRequest(payload))
        },

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedTrack);