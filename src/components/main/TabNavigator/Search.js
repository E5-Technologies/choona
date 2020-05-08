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


export default function Search(props) {

    const [usersSearch, setUsersSearch] = useState(true);
    const [genreSearch, setGenreSearch] = useState(false);
    const [songSearch, setSongSearch] = useState(false);

    const [usersSearchText, setUsersSearchText] = useState("");
    const [genreSearchText, setGenreSearchText] = useState("");
    const [songSearchText, setSongSearchText] = useState("");


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
                            height: normalise(50),
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
                                top: normalise(15),
                                left: normalise(26),
                                fontSize: normalise(14)
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
                            height: normalise(50),
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
                                top: normalise(15),
                                left: normalise(26),
                                fontSize: normalise(14)
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
                            height: normalise(50),
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
                                top: normalise(15),
                                left: normalise(26),
                                fontSize: normalise(14)
                            }}>SONGS</Text>

                        {songSearch ? <Image
                            source={ImagePath.gradient_border_horizontal}
                            style={{ width: "100%", height: normalise(2) }}
                        /> : null}

                    </TouchableOpacity>
                </View>

                <View style={{
                    width: '95%',
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
                        placeholderTextColor={Colors.white}
                        onChangeText={(text) => {
                            usersSearch ? setUsersSearchText(text) : genreSearch ? setGenreSearchText(text) :
                                setSongSearchText(text)
                        }} />

                    <Image source={ImagePath.searchicon}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {usersSearch && usersSearchText || genreSearch && genreSearchText || songSearch && songSearchText ?
                        <TouchableOpacity onPress={() => {
                            usersSearch ? setUsersSearchText("") : genreSearch ? setGenreSearchText("") :
                                setSongSearchText("")
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



            </SafeAreaView>
        </View>
    )
}