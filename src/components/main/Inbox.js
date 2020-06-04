
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
import InboxListItem from '../../components/main/ListCells/InboxItemList';
import StatusBar from '../../utils/MyStatusBar';
import database from '@react-native-firebase/database';
import moment from "moment";
import { connect } from 'react-redux';
import {
    GET_CHAT_LIST_REQUEST, GET_CHAT_LIST_SUCCESS,
    GET_CHAT_LIST_FAILURE
} from '../../action/TypeConstants';
import { getChatListRequest } from '../../action/MessageAction';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from 'lodash';


let status;

function Inbox(props) {

    const [search, setSearch] = useState("");


    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.getChatListReq();
                })
                .catch((err) => {
                    toast('Error', 'Please Connect To Internet')
                });

            return () => {
                unsuscribe();
            }
        })
    });

    if (props.status === "" || props.status !== status) {
        switch (props.status) {

            case GET_CHAT_LIST_REQUEST:
                status = props.status
                break;

            case GET_CHAT_LIST_SUCCESS:
                status = props.status
                break;

            case GET_CHAT_LIST_FAILURE:
                status = props.status
                toast('Error', 'Something Went Wrong, Please Try Again');
                break;
        }
    };

    function renderInboxItem(data) {
        return (
            <InboxListItem 
                image={constants.profile_picture_base_url+data.item.profile_image}
                title={data.item.username}
                description={data.item.message}
                read={data.item.read === true ? true : false}
                onPress={() => props.navigation.navigate('InsideaMessage')}
                marginBottom={data.index === props.chatList.length - 1 ? normalise(20) : 0}
            />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon}
                    title={`INBOX`}
                    thirditemtext={false}
                    imagetwo={ImagePath.newmessage}
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.goBack() }}
                    onPressThirdItem={() => {
                        props.navigation.navigate('AddSongsInMessage')
                    }}
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
                        onChangeText={(text) => { setSearch(text) }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {search === "" ? null :
                        <TouchableOpacity onPress={() => { setSearch("") }}
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

                {_.isEmpty(props.chatList) ?

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: Colors.white, fontSize: normalise(15) }}>No Messages</Text>
                    </View>

                    : <FlatList
                        data={props.chatList}
                        renderItem={renderInboxItem}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false} />}




            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.MessageReducer.status,
        chatList: state.MessageReducer.chatList,
        error: state.MessageReducer.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getChatListReq: () => {
            dispatch(getChatListRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);