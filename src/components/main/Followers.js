
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
import {FOLLOWER_LIST_REQUEST, FOLLOWER_LIST_SUCCESS, FOLLOWER_LIST_FAILURE} from '../../action/TypeConstants';
import {followerListReq} from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {connect} from 'react-redux'


let status;

 function Followers(props) {

    const [type, setType] = useState(props.route.params.type)
    const [id, setId] = useState(props.route.params.id)
    const [search, setSearch] = useState("")
    const [followers, setFollowers] = useState("")

    useEffect(()=>{
        props.navigation.addListener('focus', (payload)=>{
            isInternetConnected()
            .then(()=>{
                props.followListReq(type, id)
            })
            .catch(()=>{
                toast('Error', "Please Connect To Internet")
            })
        })
    });


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case FOLLOWER_LIST_REQUEST:
                status = props.status
                break;

            case FOLLOWER_LIST_SUCCESS:
                status = props.status
                setFollowers(props.followerData.length)
                break;

            case FOLLOWER_LIST_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;
        }
    };

    function renderFollowersItem(data) {
        return (
            <ActivityListItem image={constants.profile_picture_base_url+data.item.profile_image}
                title={data.item.username} 
                type={true}
                follow={data.item.isFollowing?false:true}
                marginBottom={data.index === props.followerData.length - 1 ? normalise(20) : 0}
                // onPressImage={() => { props.navigation.navigate("OthersProfile") }}
                 />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <Loader visible={props.status === FOLLOWER_LIST_REQUEST} />

            <StatusBar />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} title={`FOLLOWERS (${followers})`}
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


                <FlatList
                    data={props.followerData}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => { index.toString() }}
                    renderItem={renderFollowersItem} />




            </SafeAreaView>
        </View>
    )
};


const mapStateToProps = (state) => {
    return{
        status: state.UserReducer.status,
        followerData: state.UserReducer.followerData
    }
};

const mapDispatchToProps = (dispatch) => {
    return{
        followListReq: (usertype, id) => {
            dispatch(followerListReq(usertype, id))
        }
    }
};

export default connect (mapStateToProps, mapDispatchToProps)(Followers)
