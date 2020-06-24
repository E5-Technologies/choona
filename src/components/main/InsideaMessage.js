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
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import InsideMessegeHeader from '../../widgets/InsideMessegeHeader';
import SavedSongsListItem from '../main/ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import StatusBar from '../../utils/MyStatusBar';
import { loadChatMessageRequest } from '../../action/MessageAction'
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import {

    CHAT_LOAD_REQUEST,
    CHAT_LOAD_SUCCESS,
    CHAT_LOAD_FAILURE,

} from '../../action/TypeConstants'
import toast from '../../utils/helpers/ShowErrorAlert';
import Loader from '../../widgets/AuthLoader';
import _ from 'lodash'

let status = ""
let changePlayer = true;

function InsideaMessage(props) {

    const [index, setIndex] = useState(props.route.params.index);
    const [chatData, setChatData] = useState([]);

    const [search, setSearch] = useState("");
    const [bool, setBool] = useState(false);

    useEffect(function () {

        props.loadChatMessageRequest({ chatToken: props.chatList[index].chat_token, isMount: true, userId: props.userProfileResp._id });

        return () => {

            props.loadChatMessageRequest({ chatToken: props.chatList[index].chat_token, isMount: false })
        }
    }, []);

    if (status === "" || props.status !== status) {
        switch (props.status) {
            case CHAT_LOAD_REQUEST:
                status = props.status
                break;

            case CHAT_LOAD_SUCCESS:
                status = props.status;
                setChatData(props.chatData)
                break;

            case CHAT_LOAD_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;
        }
    };


    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={data.item.image}
                title={data.item.song_name}
                singer={data.item.artist_name}
                comments={data.item.message}
                onPressImage={() => {
                    props.navigation.navigate('Player', {
                        song_title: data.item.song_name,
                        album_name: data.item.album_name,
                        song_pic: data.item.image,
                        uri: data.item.song_uri,
                        artist: data.item.artist_name,
                        changePlayer: changePlayer,
                        // originalUri: data.item.hasOwnProperty('original_song_uri') ? data.item.original_song_uri :
                        //     undefined,
                    })
                }}
                marginBottom={data.index === chatData.length - 1 ? normalise(20) : 0} />
        )
    }

    function filterArray(keyword) {

        let data = _.filter(props.chatData, (item) => {
            return item.song_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        });

        setChatData(data);

    };

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <Loader visible={props.status === CHAT_LOAD_REQUEST} />

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <InsideMessegeHeader
                    firstitemtext={false}
                    imageone={constants.profile_picture_base_url + props.userProfileResp.profile_image}
                    imagesecond={constants.profile_picture_base_url + props.chatList[index].profile_image}
                    title={props.chatList[index].username}
                    thirditemtext={false}
                    // imagetwo={ImagePath.newmessage} 
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

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
                        onChangeText={(text) => { setSearch(text), filterArray(text) }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {search === "" ? null :
                        <TouchableOpacity onPress={() => { setSearch(""), filterArray("") }}
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
                    data={chatData}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => { index.toString() }}
                    disableRightSwipe={true}
                    rightOpenValue={-75} />



                <TouchableOpacity style={{
                    marginBottom: normalise(30),
                    marginTop: normalise(10), height: normalise(50), width: '80%', alignSelf: 'center',
                    borderRadius: normalise(25), backgroundColor: Colors.white, borderWidth: normalise(0.5),
                    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', borderColor: Colors.grey,
                }} onPress={() => {
                    props.navigation.replace('AddAnotherSong', {
                        users: [{
                            _id: chatData[0].receiver_id === props.userProfileResp._id ? chatData[0].sender_id :
                                chatData[0].receiver_id, username: props.chatList[index].username, full_name: props.chatList[index].full_name,
                            profile_image: props.chatList[index].profile_image,
                        }], index: index
                    })
                }}>

                    <Text style={{
                        marginLeft: normalise(10), color: Colors.gray, fontSize: normalise(14),
                        fontFamily: 'ProximaNova-Extrabld',
                    }}>ADD ANOTHER SONG</Text>

                </TouchableOpacity>
            </SafeAreaView>


        </View>
    )
}

const mapStateToProps = state => {
    return {
        chatList: state.MessageReducer.chatList,
        chatData: state.MessageReducer.chatData,
        userProfileResp: state.UserReducer.userProfileResp,
        status: state.MessageReducer.status,
        error: state.MessageReducer.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadChatMessageRequest: (payload) => {
            dispatch(loadChatMessageRequest(payload))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InsideaMessage);
