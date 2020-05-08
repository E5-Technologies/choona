import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity
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


let usersdata = [
    {
        picture: ImagePath.dp,
        title: "Wimwillems88",
        picture2: ImagePath.dp2,
        type: 'Follow'
    },

    {
        picture: ImagePath.dp1,
        title: "Wimwillems88",
        picture2: ImagePath.dp2,
        type: 'Follow'
    },
    {
        picture: ImagePath.dp,
        title: "Wimwillems88 ",
        type: 'Follow'
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ ",
        type: 'Follow'
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        picture2: ImagePath.dp2,
        type: 'Follow'
    },


];
let userdataEmpty = [];

let songsdata = [
    {
        image: ImagePath.profiletrack1,
        picture: ImagePath.dp1,
        title: 'This girl',
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


export default function Search(props) {

    const [usersSearch, setUsersSearch] = useState(true);
    const [genreSearch, setGenreSearch] = useState(false);
    const [songSearch, setSongSearch] = useState(false);

    const [usersSearchText, setUsersSearchText] = useState("");
    const [genreSearchText, setGenreSearchText] = useState("");
    const [songSearchText, setSongSearchText] = useState("");


    function renderUserData(data) {
        return (
            <ActivityListItem image={data.item.picture} title={data.item.title}
                follow={data.item.type === "Follow" ? true : false}
                bottom={data.index === userdataEmpty.length - 1 ? true : false}
                marginBottom={data.index === userdataEmpty.length - 1 ? normalise(80) : normalise(0)}
                onPressImage={() => { props.navigation.navigate("OthersProfile") }}
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
                    hitreact(react[0])
                }}
                onPressReact2={() => {
                    hitreact(react[1])
                }}
                onPressReact3={() => {
                    hitreact(react[2])
                }}
                onPressReact4={() => {
                    hitreact(react[3])
                }}
                onPressReact5={() => {
                    hitreact1(modal1Visible)
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
                // onPressSecondImage={() => {
                //     setModalVisible(true)
                // }}
                marginBottom={data.index === songDataEmpty.length - 1 ? normalise(20) : 0} />
        )
    }

    if (usersSearchText !== "") {
        userdataEmpty = [...usersdata]
    }
    else if (songSearchText !== "") {
        songDataEmpty = [...songsdata]
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

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
                        placeholder={usersSearch ? "Search Users" : genreSearch ? "Seach Genres" : "Seach Songs"}
                        placeholderTextColor={Colors.darkgrey}
                        onChangeText={(text) => {
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
                            usersSearch ? setUsersSearchText("") : genreSearch ? setGenreSearchText("") :
                                setSongSearchText("")
                            usersSearch ? userdataEmpty = [] : genreSearch ? null : songDataEmpty = []

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


                {usersSearch ?

                    _.isEmpty(userdataEmpty) ?

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
                                }}> RESULTS (4)</Text>

                            </View>


                            <FlatList
                                style={{ marginTop: normalise(10), height: '70%' }}
                                data={userdataEmpty}
                                renderItem={renderUserData}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false} />
                        </View>

                    : null}


                {songSearch ?

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
                                style={{ marginTop: normalise(10), height: '70%' }}
                                data={songDataEmpty}
                                renderItem={renderSongData}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false} />
                        </View>

                    : null}




            </SafeAreaView>
        </View>
    )
}