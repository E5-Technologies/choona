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
    Dimensions
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import {
    OTHERS_PROFILE_REQUEST, OTHERS_PROFILE_SUCCESS, OTHERS_PROFILE_FAILURE,
    USER_FOLLOW_UNFOLLOW_REQUEST, USER_FOLLOW_UNFOLLOW_SUCCESS, USER_FOLLOW_UNFOLLOW_FAILURE
} from '../../action/TypeConstants';
import { othersProfileRequest, userFollowUnfollowRequest } from '../../action/UserAction';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import { connect } from 'react-redux'
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from "lodash"


const profileData = [
    {
        image: ImagePath.profiletrack1
    },
    {
        image: ImagePath.profiletrack2
    },
    {
        image: ImagePath.profiletrack3
    },
    {
        image: ImagePath.profiletrack4
    },

]

let status;

function OthersProfile(props) {


    const [id, setId] = useState(props.route.params.id)
    const [isFollowing, setIsFollowing] = useState(props.route.params.following)
    const [noOfPosts, setNoOfPosts] = useState("");

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.othersProfileReq(id)
                })
                .catch(() => {
                    toast('Error', 'Please Connect to Internet')
                })
        });

        return () => {
            unsuscribe();
        }
    }, []);

    if (status === "" || props.status !== status) {
        switch (props.status) {
            case OTHERS_PROFILE_REQUEST:
                status = props.status
                break;

            case OTHERS_PROFILE_SUCCESS:
                status = props.status
                setNoOfPosts(`${props.othersProfileresp.post.length} ${props.othersProfileresp.post.length > 1 ? "Posts" : "Post"}`)
                break;

            case OTHERS_PROFILE_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong, Please Try Again')
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong, Please Try Again')
                break;


        }
    };

    function renderProfileData(data) {
        return (
            <TouchableOpacity style={{
                margin: normalise(4),
                marginBottom: data.index === props.othersProfileresp.post.length - 1 ? normalise(30) : normalise(5)
            }}>
                <Image source={{
                    uri: props.othersProfileresp.register_type === 'spotify' ? data.item.song_image :
                        data.item.song_image.replace("100x100bb.jpg", "500x500bb.jpg")
                }}

                    style={{
                        width: Dimensions.get("window").width / 2.1,
                        height: Dimensions.get("window").height * 0.22,
                        borderRadius: normalise(10)
                    }}

                    resizeMode="cover" />
            </TouchableOpacity>
        )
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <Loader visible={props.status === OTHERS_PROFILE_REQUEST} />

            <StatusBar />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon}
                    title={props.othersProfileresp.username}
                    thirditemtext={true}
                    texttwo={""}
                    onPressFirstItem={() => { props.navigation.goBack() }}
                />


                <View style={{
                    width: '90%', alignSelf: 'center', flexDirection: 'row',
                    alignItems: 'center', marginTop: normalise(15)
                }}>
                    <Image source={{ uri: constants.profile_picture_base_url + props.othersProfileresp.profile_image }}
                        style={{ height: normalise(80), width: normalise(80), borderRadius: normalise(40) }} />

                    <View style={{
                        flexDirection: 'column', alignItems: 'flex-start',
                        marginLeft: normalise(20),
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15),
                            fontFamily: 'ProximaNovaAW07-Medium',

                        }}>{props.othersProfileresp.full_name}</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',

                        }}>{noOfPosts}</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',

                        }}>{props.othersProfileresp.location}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalise(2), }}>

                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("Following", { type: "public", id: props.othersProfileresp._id  }) 
                            }}>
                                <Text style={{
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold',
                                }}><Text style={{ color: Colors.white }}>{props.othersProfileresp.following}</Text>  Following</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("Followers", { type: "public", id:props.othersProfileresp._id  }) 
                            }}>
                                <Text style={{
                                    marginLeft: normalise(10),
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold',
                                }}><Text style={{ color: Colors.white }}>{props.othersProfileresp.follower}</Text>  Followers</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

                <View style={{
                    width: '95%', alignSelf: 'center', marginTop: normalise(20), flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'space-around'
                }}>

                    <TouchableOpacity
                        style={{
                            height: normalise(30), width: '45%', borderRadius: normalise(15),
                            backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'
                        }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(11), color: Colors.black,
                            fontFamily: 'ProximaNova-Bold'
                        }}>
                            SEND A SONG
                            </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            height: normalise(30), width: '45%', borderRadius: normalise(15),
                            backgroundColor: isFollowing ? Colors.fadeblack : Colors.white,
                            alignItems: 'center', justifyContent: 'center'
                        }} onPress={() => { setIsFollowing(!isFollowing), props.followReq({ follower_id: id }) }}>

                        <Text style={{
                            fontSize: normalise(11), color: isFollowing ? Colors.white : Colors.black,
                            fontFamily: 'ProximaNova-Bold'
                        }}>
                            {isFollowing ? "FOLLOWING" : "FOLLOW"}
                        </Text>

                    </TouchableOpacity>

                </View>

                <ImageBackground source={ImagePath.gradientbar}
                    style={{
                        width: '100%', height: normalise(50),
                        marginTop: normalise(15),
                    }}>

                    <View style={{
                        width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between', height: normalise(50),
                    }}>
                        <TouchableOpacity>
                            <Image source={ImagePath.dp2} style={{ height: normalise(40), width: normalise(40) }} />
                            <Image source={ImagePath.play} style={{
                                height: normalise(25), width: normalise(25),
                                position: 'absolute', marginLeft: normalise(8), marginTop: normalise(8)
                            }} />
                        </TouchableOpacity>


                        <View style={{
                            flexDirection: 'column', alignItems: 'flex-start', marginRight: normalise(120),
                        }}>

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(9),
                                fontFamily: 'ProximaNova-Bold'
                            }}>FEATURED TRACK</Text>

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(10),
                                fontFamily: 'ProximaNova-Bold'

                            }}>Naked feat. Justin Suissa</Text>

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(9),
                                fontFamily: 'ProximaNova-Regular',
                                fontWeight: '400'
                            }}>Above & Beyond</Text>
                        </View>

                    </View>

                </ImageBackground>


                {_.isEmpty(props.othersProfileresp.post) ?

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


                            <Text style={{ color: Colors.white, fontSize: normalise(15), fontWeight: 'bold' }}>
                                 Profile is Empty</Text>

                            <Text style={{
                                marginTop: normalise(10), color: Colors.grey, fontSize: normalise(15),
                                width:'60%', textAlign:'center'
                            }}>{props.othersProfileresp.username} has not posted any songs yet</Text>
                       
                    </View>

                    :

                    <FlatList
                        style={{ paddingTop: normalise(10) }}
                        data={props.othersProfileresp.post}
                        renderItem={renderProfileData}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                        numColumns={2} />
                }


            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        othersProfileresp: state.UserReducer.othersProfileresp
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        othersProfileReq: (id) => {
            dispatch(othersProfileRequest(id))
        },
        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfile)