import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TextInput, ImageBackground,
    TouchableOpacity, Modal
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import StatusBar from '../../../utils/MyStatusBar';
import HeaderComponent from '../../../widgets/HeaderComponent';
import ImagePath from '../../../assests/ImagePath';
import { FlatList } from 'react-native-gesture-handler';
import ActivityListItem from '../ListCells/ActivityListItem';
import HomeItemList from '../ListCells/HomeItemList';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    USER_SEARCH_REQUEST, USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE,
    USER_FOLLOW_UNFOLLOW_REQUEST,
    USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE
} from '../../../action/TypeConstants';
import { userSearchRequest, userFollowUnfollowRequest } from '../../../action/UserAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import constants from '../../../utils/helpers/constants';


let songsdata = [
    {
        image: ImagePath.profiletrack1,
        picture: ImagePath.dp1,
        title: 'This Girl',
        singer: "Kungs Vs Cookins 3 burners",
        comments: 1,
        name: 'Shimshimmer',
        reactions: 11,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {
        image: ImagePath.profiletrack4,
        picture: ImagePath.dp,
        title: 'Paradise',
        singer: "Cold Play",
        comments: 2,
        name: 'Shimshimmer',
        reactions: 7,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {
        image: ImagePath.profiletrack2,
        picture: ImagePath.dp1,
        title: 'Naked feat. Justin Suissa',
        singer: "Kygo",
        comments: 1,
        name: 'Shimshimmer',
        reactions: 10,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },

    {
        image: ImagePath.profiletrack1,
        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        singer: "Dua Lipa",
        comments: 1,
        name: 'Shimshimmer',
        reactions: 11,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {
        image: ImagePath.profiletrack3,
        picture: ImagePath.dp1,
        title: 'Naked feat. Justin Suissa',
        singer: "Kygo",
        comments: 3,
        name: 'Shimshimmer',
        reactions: 9,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {
        image: ImagePath.profiletrack4,
        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        singer: "Above & Beyond",
        comments: 2,
        name: 'Shimshimmer',
        reactions: 11,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },

];

let songDataEmpty = [];

let genreData = [
    {
        title: "Electronic/Dance"
    },
    {
        title: "Pop"
    },
    {
        title: "Rock"
    },
    {
        title: "Country Music"
    },
    {
        title: "R & B"
    },
    {
        title: "Indie"
    },
    {
        title: "Rap"
    },
    {
        title: "Afro"
    },

];


let status;

function Search(props) {

    const [usersSearch, setUsersSearch] = useState(true);
    const [genreSearch, setGenreSearch] = useState(false);
    const [songSearch, setSongSearch] = useState(false);

    const [usersSearchText, setUsersSearchText] = useState("");
    const [genreSearchText, setGenreSearchText] = useState("");
    const [songSearchText, setSongSearchText] = useState("");

    const [songData, setSongData] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);


    if (status === "" || status !== props.status) {

        switch (props.status) {

            case USER_SEARCH_REQUEST:
                status = props.status
                break;

            case USER_SEARCH_SUCCESS:
                setSongData(props.userSearch)
                status = props.status
                break;

            case USER_SEARCH_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                status = props.status
                break;
        }
    };

    // RENDER FUNCTION FLATLIST 

    function renderUserData(data) {
        return (
            <ActivityListItem
                image={constants.profile_picture_base_url + data.item.profile_image}
                title={data.item.username}
                follow={data.item.isFollowing ? false : true}
                bottom={data.index === props.userSearch.length - 1 ? true : false}
                marginBottom={data.index === props.userSearch.length - 1 ? normalise(80) : normalise(0)}
                onPressImage={() => { props.navigation.navigate("OthersProfile", {id: data.item._id}) }}
                onPress={() => { props.followReq({ follower_id: data.item._id }) }}
            />
        )
    };

    function renderSongData(data) {
        return (
            <HomeItemList
                image={data.item.image}
                picture={data.item.picture}
                name={data.item.name}
                comments={data.item.comments}
                reactions={data.item.reactions}
                content={data.item.content}
                time={data.item.time}
                title={data.item.title}
                singer={data.item.singer}
                onPressReact1={() => {
                    console.log('Coming Soon...')
                }}
                onPressReact2={() => {
                    console.log('Coming Soon...')
                }}
                onPressReact3={() => {
                    console.log('Coming Soon...')
                }}
                onPressReact4={() => {
                    console.log('Coming Soon...')
                }}
                onPressReact5={() => {
                    console.log('Coming Soon...')
                }}
                onPressMusicbox={() => {
                    props.navigation.navigate('Player', {
                        comments: data.item.comments,
                        time: data.item.time, title: data.item.title
                    })
                }}
                onPressReactionbox={() => {
                    props.navigation.navigate('HomeItemReactions', {
                    })
                }}
                onPressCommentbox={() => {
                    props.navigation.navigate('HomeItemComments', {
                        comments: data.item.comments,
                        time: data.item.time, title: data.item.title
                    })
                }}
                onPressSecondImage={() => {
                    setModalVisible(true)
                }}
                marginBottom={data.index === songDataEmpty.length - 1 ? normalise(50) : 0} />
        )
    };


    function renderGenreData(data) {
        return (
            <TouchableOpacity style={{
                width: '88%', alignSelf: 'center', flexDirection: 'row',
                alignItems: 'center', justifyContent: 'space-between', paddingTop: normalise(20),
                paddingBottom: normalise(20),
                marginBottom: data.index === genreData.length - 1 ? normalise(30) : normalise(0),
                borderBottomWidth: 0.5, borderBottomColor: Colors.activityBorderColor
            }} onPress={() => { props.navigation.navigate("GenreClicked", { data: data.item.title }) }}>

                <Text style={{
                    fontFamily: 'ProximaNova-Semibold',
                    fontSize: normalise(15), color: Colors.white, marginLeft: normalise(5)
                }}>{data.item.title}</Text>

                <Image source={ImagePath.backicon} style={{
                    height: normalise(10), width: normalise(10),
                    transform: [{ rotate: '180deg' },], marginRight: normalise(5)
                }} resizeMode='contain' />
            </TouchableOpacity>
        )
    };
    // RENDER FUNCTION FLATLIST END 



    //MODAL MORE PRESSED
    const MorePressed = () => {
        return (

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    //Alert.alert("Modal has been closed.");
                }}
            >
                <ImageBackground
                    source={ImagePath.page_gradient}
                    style={styles.centeredView}
                >

                    <View
                        style={styles.modalView}
                    >
                        <Text style={{
                            color: Colors.white,
                            fontSize: normalise(12),
                            fontFamily: 'ProximaNova-Semibold',

                        }}>MORE</Text>

                        <View style={{
                            backgroundColor: Colors.activityBorderColor,
                            height: 0.5,
                            marginTop: normalise(12),
                            marginBottom: normalise(12)
                        }} />

                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(10) }}>
                            <Image source={ImagePath.boxicon} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Save Song</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                            <Image source={ImagePath.sendicon} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(13), marginLeft: normalise(15),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Send Song</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                            <Image source={ImagePath.more_copy} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Copy Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                            <Image source={ImagePath.more_unfollow} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Unfollow Shimshimmer</Text>
                        </TouchableOpacity>

                    </View>


                    <TouchableOpacity onPress={() => {
                        setModalVisible(!modalVisible);
                    }}

                        style={{
                            marginStart: normalise(20),
                            marginEnd: normalise(20),
                            marginBottom: normalise(20),
                            height: normalise(50),
                            width: "95%",
                            backgroundColor: Colors.darkerblack,
                            opacity: 10,
                            borderRadius: 20,
                            // padding: 35,
                            alignItems: "center",
                            justifyContent: 'center',


                        }}>

                        <Text style={{
                            fontSize: normalise(12),
                            fontFamily: 'ProximaNova-Bold',
                            color: Colors.white
                        }}>CANCEL</Text>

                    </TouchableOpacity>
                </ImageBackground>
            </Modal>
        )
    };
    //END OF MODAL MORE PRESSED


    if (songSearchText !== "") {
        songDataEmpty = [...songsdata]
    }
    if (genreSearchText !== "") {
        genreDataEmpty = [...genreData]
    };


    // SEARCH AND CLEAR FUNCTIONS

    const search = (text) => {
        if (usersSearch) {
            if (text.length >= 1) {
                props.userSearchReq({ keyword: text })
            }
        };
    };


    const clearSearch = () => {
        setSongData([]);
    };


    //VIEW
    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === USER_SEARCH_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={""}
                    title={"SEARCH"}
                    thirditemtext={true}
                    texttwo={""}
                />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: normalise(15)
                }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.fadeblack,
                            width: "33%",
                            height: normalise(40),
                            justifyContent: 'flex-end'
                        }}
                        onPress={() => {
                            setUsersSearch(true),
                                setGenreSearch(false),
                                setSongSearch(false)
                        }}
                    >
                        <Text
                            style={{
                                color: usersSearch ? Colors.white : Colors.grey_text,
                                fontFamily: 'ProximaNova-Black',
                                position: 'absolute',
                                top: normalise(14),
                                left: normalise(26),
                                fontSize: normalise(12)
                            }}>USERS</Text>

                        {usersSearch ? <Image
                            source={ImagePath.gradient_border_horizontal}
                            style={{ width: "100%", height: normalise(2) }}
                        /> : null}


                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.fadeblack,
                            width: "33%",
                            height: normalise(40),
                            justifyContent: 'flex-end'
                        }}
                        onPress={() => {
                            setUsersSearch(false),
                                setGenreSearch(true),
                                setSongSearch(false)
                        }}
                    >
                        <Text
                            style={{
                                color: genreSearch ? Colors.white : Colors.grey_text,
                                fontFamily: 'ProximaNova-Black',
                                position: 'absolute',
                                top: normalise(14),
                                left: normalise(26),
                                fontSize: normalise(12)
                            }}>GENRES</Text>

                        {genreSearch ? <Image
                            source={ImagePath.gradient_border_horizontal}
                            style={{ width: "100%", height: normalise(2) }}
                        /> : null}

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.fadeblack,
                            width: "33%",
                            height: normalise(40),
                            justifyContent: 'flex-end'
                        }}
                        onPress={() => {
                            setUsersSearch(false),
                                setGenreSearch(false),
                                setSongSearch(true)
                        }}
                    >
                        <Text
                            style={{
                                color: songSearch ? Colors.white : Colors.grey_text,
                                fontFamily: 'ProximaNova-Black',
                                position: 'absolute',
                                top: normalise(14),
                                left: normalise(26),
                                fontSize: normalise(12)
                            }}>SONGS</Text>

                        {songSearch ? <Image
                            source={ImagePath.gradient_border_horizontal}
                            style={{ width: "100%", height: normalise(2) }}
                        /> : null}

                    </TouchableOpacity>
                </View>

                <View style={{
                    width: '92%',
                    alignSelf: 'center',
                }}>

                    <TextInput style={{
                        height: normalise(35),
                        width: '100%',
                        backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(8),
                        marginTop: normalise(20),
                        padding: normalise(10),
                        color: Colors.white,
                        paddingLeft: normalise(30)
                    }} value={usersSearch ? usersSearchText : genreSearch ? genreSearchText : songSearchText}
                        placeholder={usersSearch ? "Search Users" : genreSearch ? "Search Genres" : "Search Songs"}
                        placeholderTextColor={Colors.darkgrey}
                        onChangeText={(text) => {
                            search(text)
                            usersSearch ? setUsersSearchText(text) : genreSearch ? setGenreSearchText(text) :
                                setSongSearchText(text)
                        }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {usersSearch && usersSearchText || genreSearch && genreSearchText || songSearch && songSearchText ?
                        <TouchableOpacity onPress={() => {
                            clearSearch()
                            usersSearch ? setUsersSearchText("") : genreSearch ? setGenreSearchText("") :
                                setSongSearchText("")
                            genreSearch ? null : songDataEmpty = []
                        }}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: Platform.OS === 'ios' ? normalise(26) : normalise(25),
                                paddingRight: normalise(10)
                            }}>
                            <Text style={{
                                color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                            }}>CLEAR</Text>

                        </TouchableOpacity> : null}
                </View>



                {usersSearch ?              //USERS VIEW

                    _.isEmpty(songData) ?

                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                            <Image source={ImagePath.user} style={{ height: normalise(40), width: normalise(40) }}
                                resizeMode='contain' />

                            <Text style={{
                                color: Colors.white, fontSize: normalise(15), fontWeight: '500',
                                marginTop: normalise(20), width: '68%', textAlign: 'center'
                            }}>Search for users via username or their full name</Text>

                        </View>

                        : <View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', width: '92%', alignSelf: 'center',
                                marginTop: normalise(5), justifyContent: 'flex-start'
                            }}>
                                <Text style={{
                                    fontFamily: 'ProximaNova-Bold',
                                    color: Colors.white, fontSize: normalise(12),
                                    fontWeight: 'bold'
                                }}> RESULTS ({songData.length})</Text>

                            </View>


                            <FlatList
                                style={{ height: '70%' }}
                                data={songData}
                                renderItem={renderUserData}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false} />
                        </View>

                    : null}


                {songSearch ?               //SONG VIEW

                    _.isEmpty(songDataEmpty) ?

                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                            <Image source={ImagePath.music_icon} style={{ height: normalise(40), width: normalise(40) }}
                                resizeMode='contain' />

                            <Text style={{
                                color: Colors.white, fontSize: normalise(15), fontWeight: '500',
                                marginTop: normalise(20), width: '68%', textAlign: 'center'
                            }}>Search for posts which contain a particular song</Text>

                        </View>

                        : <View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', width: '92%', alignSelf: 'center',
                                marginTop: normalise(5), justifyContent: 'flex-start'
                            }}>
                                <Text style={{
                                    fontFamily: 'ProximaNova-Bold',
                                    color: Colors.white, fontSize: normalise(12),
                                    fontWeight: 'bold'
                                }}> RESULTS (1)</Text>

                            </View>


                            <FlatList
                                style={{ height: '70%' }}
                                data={songDataEmpty}
                                renderItem={renderSongData}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false} />
                        </View>

                    : null}


                {genreSearch ?              //GENRE VIEW

                    <FlatList
                        style={{ height: '70%' }}
                        data={genreData}
                        renderItem={renderGenreData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false} />

                    : null}


                {MorePressed()}

            </SafeAreaView>
        </View>
    )

};



const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",

    },
    modalView: {
        marginBottom: normalise(10),
        height: normalise(220),
        width: "95%",
        backgroundColor: Colors.darkerblack,
        borderRadius: 20,
        padding: 20,
        paddingTop: normalise(20)

    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,

    }
});

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userSearch: state.UserReducer.userSearch
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        userSearchReq: (payload) => {
            dispatch(userSearchRequest(payload))
        },

        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);