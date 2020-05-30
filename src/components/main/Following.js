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
    FOLLOWING_LIST_REQUEST, FOLLOWING_LIST_SUCCESS, FOLLOWING_LIST_FAILURE,
    USER_FOLLOW_UNFOLLOW_REQUEST, USER_FOLLOW_UNFOLLOW_SUCCESS, USER_FOLLOW_UNFOLLOW_FAILURE
}
    from '../../action/TypeConstants';
import { followingListReq, userFollowUnfollowRequest } from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux'
import _ from 'lodash'

let status;

function Following(props) {

    const [type, setType] = useState(props.route.params.type)
    const [id, setId] = useState(props.route.params.id)
    const [following, setFollowing] = useState("")
    const [search, setSearch] = useState("")
    const [bool, setBool] = useState(false)
    const [followingList, setFollowingList] = useState([]);

    useEffect(() => {
        props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.followingListReq(type, id)
                })
                .catch(() => {
                    toast('Error', "Please Connect To Internet")
                })
        })
    });


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case FOLLOWING_LIST_REQUEST:
                status = props.status
                break;

            case FOLLOWING_LIST_SUCCESS:
                status = props.status
                setFollowing(props.followingData.length)
                setFollowingList(props.followingData)
                break;

            case FOLLOWING_LIST_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                status = props.status
                break;
        }
    };

    function filterArray(keyword) {

        let data = _.filter(props.followingData, (item) => {
            return item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        });
        console.log(data);
        setFollowingList([]);
        setBool(true);
        setTimeout(() => {
            setFollowingList(data);
            setBool(false);
        }, 800);
    };


    function renderFollowersItem(data) {

        if (props.userProfileResp._id === data.item._id) {
            return (

                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={false}
                    image2={"123"}
                    marginBottom={data.index === props.followingData.length - 1 ? normalise(20) : 0}
                // onPressImage={() => { props.navigation.navigate("OthersProfile") }}
                />
            );
        } else {

            return (

                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={true}
                    follow={data.item.isFollowing ? false : true}
                    marginBottom={data.index === props.followingData.length - 1 ? normalise(20) : 0}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={()=>{props.followReq({follower_id: data.item._id})}}
                />
            );
        }
    };



    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === FOLLOWING_LIST_REQUEST} />
            <Loader visible={bool} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} title={`FOLLOWING (${following})`}
                    thirditemtext={true} texttwo={""}
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


                <FlatList
                    data={followingList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => { index.toString() }}
                    renderItem={renderFollowersItem} />



            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        followingData: state.UserReducer.followingData,
        userProfileResp: state.UserReducer.userProfileResp,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        followingListReq: (usertype, id) => {
            dispatch(followingListReq(usertype, id))
        },

        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Following)