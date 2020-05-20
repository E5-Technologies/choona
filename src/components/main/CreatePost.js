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
    FlatList
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
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE

} from '../../action/TypeConstants';
import { createPostRequest } from '../../action/PostAction';

function AddSong(props) {

    const [search, setSearch] = useState("");
    const [imgsource, setImgSource] = useState(props.route.params.image)
    const [title1, setTitle1] = useState(props.route.params.title)
    const [title2, setTitle2] = useState(props.route.params.title2)

    function createPost() {

        var payload = {
            "post_content": search,
            "social_type": "spotify",
            "song_name": title1,
            "song_uri": props.route.params.details.preview_url,
            "song_image": imgsource,
            "artist_name": title2,
            "album_name": props.route.params.details.album.name
        }

        props.createPostRequest(payload);

    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={"CANCEL"}
                    title={"CREATE POST"}
                    thirditemtext={true}
                    texttwo={"POST"}
                    onPressFirstItem={() => { props.navigation.goBack() }}
                    onPressThirdItem={() => { createPost() }}
                />

                <View style={{ marginTop: normalise(20), width: '95%', alignSelf: 'center', }}>

                    <TextInput style={{
                        width: '100%',
                        borderRadius: normalise(8), padding: normalise(10),
                        color: Colors.white, fontWeight: '500'
                    }} value={search}
                        multiline={true}
                        placeholder={"Add a caption..."}
                        placeholderTextColor={Colors.grey}
                        onChangeText={(text) => { setSearch(text) }} />

                    <View style={{
                        marginTop: normalise(5), backgroundColor: Colors.darkerblack,
                        height: normalise(65), width: '100%', borderRadius: normalise(8), borderColor: Colors.fadeblack,
                        borderWidth: normalise(1), justifyContent: 'center', alignItems: 'center'
                    }}>

                        <View style={{
                            width: '90%', flexDirection: 'row', alignSelf: 'center',
                            justifyContent: 'flex-start', alignItems: 'center',
                        }}>

                            <TouchableOpacity>
                                <Image source={{ uri: imgsource }}
                                    style={{ height: normalise(40), width: normalise(40), borderRadius: normalise(5) }}
                                    resizeMode='contain' />
                            </TouchableOpacity>

                            <View style={{
                                alignItems: 'flex-start',
                                justifyContent: 'center', width: '85%'
                            }}>
                                <Text style={{
                                    marginLeft: normalise(20), color: Colors.white,
                                    fontSize: normalise(11)
                                }} numberOfLines={1} >{title1}</Text>

                                <Text style={{
                                    marginLeft: normalise(20), color: Colors.grey,
                                    fontSize: normalise(10)
                                }} numberOfLines={1} >{title2}</Text>
                            </View>


                        </View>
                    </View>

                </View>



            </SafeAreaView>
        </View>
    )
}

const mapStateToProps = (state) => {

    return {
        status: state.PostReducer.status,
        createPostResponse: state.PostReducer.createPostResponse
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        createPostRequest: (payload) => {
            dispatch(createPostRequest(payload))
        },

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSong);