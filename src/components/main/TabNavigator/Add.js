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
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import SavedSongsListItem from './../ListCells/SavedSongsListItem';
import _ from 'lodash';
import StatusBar from '../../../utils/MyStatusBar';

const flatlistdata = [
    {
        image: ImagePath.profiletrack1,
        title: 'Naked feat. Justin Suissa',
        singer: "Above & Beyond"
    },
    {
        image: ImagePath.profiletrack2,
        title: 'One Kiss',
        singer: "Dua Lipa"
    },
    {
        image: ImagePath.profiletrack3,
        title: 'Firestone',
        singer: "Kygo"
    },
    {
        image: ImagePath.profiletrack4,
        title: 'Naked feat. Justin Suissa',
        singer: "Above & Beyond"
    },
    {
        image: ImagePath.profiletrack5,
        title: 'One Kiss',
        singer: "Dua Lipa"
    },
    {
        image: ImagePath.profiletrack6,
        title: 'Firestone',
        singer: "Kygo"
    },
    {
        image: ImagePath.profiletrack1,
        title: 'Naked feat. Justin Suissa',
        singer: "Above & Beyond"
    },
    {
        image: ImagePath.profiletrack2,
        title: 'One Kiss',
        singer: "Dua Lipa"
    },
];

let flatlistdata1 = []

export default function AddSong(props) {

    const [search, setSearch] = useState("")

    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={data.item.image}
                title={data.item.title}
                singer={data.item.singer}
                marginRight={normalise(50)}
                marginBottom={data.index === flatlistdata.length - 1 ? normalise(20) : 0}
                change={true}
                image2={ImagePath.addicon}
                onPressSecondImage={() => {
                    props.navigation.navigate("CreatePost", {
                        image: data.item.image,
                        title: data.item.title, title2: data.item.singer
                    })
                }} />
        )
    }

    if (search !== "") {
        flatlistdata1 = [...flatlistdata]
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={"CANCEL"}
                    title={"ADD SONG"}
                    thirditemtext={true}
                    texttwo={"POST"}
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
                        <TouchableOpacity onPress={() => { setSearch(""), flatlistdata1 = [] }}
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

                {_.isEmpty(flatlistdata1) ? null :
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center',
                        marginTop: normalise(5)
                    }}>
                        <Image source={ImagePath.spotifyicon} style={{ height: normalise(20), width: normalise(20) }} />
                        <Text style={{
                            color: Colors.white, fontSize: normalise(12), marginLeft: normalise(10),
                            fontWeight: 'bold'
                        }}> RESULTS (23)</Text>

                    </View>}


                {_.isEmpty(flatlistdata1) ?

                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                        <Image source={ImagePath.searchicongrey} style={{ height: normalise(35), width: normalise(35) }} />

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15), fontWeight: 'bold',
                            marginTop: normalise(20), width: '60%', textAlign: 'center'
                        }}>Search for the song you want to share above.</Text>

                    </View>

                    : <FlatList
                        style={{ marginTop: normalise(10) }}
                        data={flatlistdata}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                    />}

            </SafeAreaView>
        </View>
    )
}