
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
import SavedSongsListItem from './ListCells/SavedSongsListItem';
import StatusBar from '../../utils/MyStatusBar';
import _ from 'lodash';
import RBSheet from "react-native-raw-bottom-sheet";

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

export default function AddSongsInMessage(props) {

    const [search, setSearch] = useState("");
    const [userSeach, setUserSeach] = useState("");
    const [userClicked, setUserClicked] = useState(false);

    var bottomSheetRef;

    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={data.item.image}
                title={data.item.title}
                marginRight={normalise(50)}
                singer={data.item.singer}
                marginBottom={data.index === flatlistdata.length - 1 ? normalise(20) : 0}
                change={true}
                image2={ImagePath.addicon}
                onPressSecondImage={() => {
                    bottomSheetRef.open();
                }} />
        )
    }

    if (search !== "") {
        flatlistdata1 = [...flatlistdata]
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon}
                    title={`CHOOSE SONG TO SEND`}
                    thirditemtext={true}
                    imagetwo={ImagePath.newmessage}
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

                <View style={{ width: '92%', alignSelf: 'center', }}>

                    <TextInput style={{
                        height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                        color: Colors.white, paddingLeft: normalise(30)
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

                        <Image source={ImagePath.searchicongrey} style={{ height: normalise(25), width: normalise(25) }} />

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15),
                            fontFamily: 'ProximaNovaAW07-Medium',
                            marginTop: normalise(20), width: '60%', textAlign: 'center'
                        }}>
                            Search for the song you want to share </Text>

                    </View>

                    : <FlatList
                        style={{ marginTop: normalise(10) }}
                        data={flatlistdata}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                    />}

                <RBSheet
                    ref={ref => {
                        if (ref) {
                            bottomSheetRef = ref;
                        }
                    }}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    nestedScrollEnabled={true}
                    keyboardAvoidingViewEnabled={true}
                    height={normalize(500)}
                    duration={250}
                    customStyles={{
                        container: {
                            backgroundColor: 'black',
                            borderTopEndRadius: normalise(8),
                            borderTopStartRadius: normalise(8),
                        },
                        // wrapper: {
                        //     backgroundColor: 'rgba(87,97,145,0.5)'

                        // },
                        draggableIcon: {
                            backgroundColor: Colors.grey,
                            width: normalise(70),
                            height: normalise(3)
                        }

                    }}
                >
                    <View
                        style={{ flex: 1 }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <View style={{ flexDirection: 'row', width: '75%', justifyContent: 'flex-end' }}>
                                <Text style={{
                                    color: Colors.white,
                                    fontSize: normalise(14),
                                    fontWeight: 'bold',
                                    marginTop: normalise(10),
                                    textAlign: 'right'
                                }}>
                                    ADD USERS TO MESSAGE</Text>

                                {userClicked ?
                                    <Text style={{
                                        color: Colors.white,
                                        marginTop: normalise(10),
                                        fontSize: normalise(14),
                                        fontWeight: 'bold',
                                    }}> (1)</Text> : null}

                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    bottomSheetRef.close(),
                                        props.navigation.replace('SendSongInMessageFinal', {
                                            image: ImagePath.profiletrack1,
                                            title: "'Naked feat. Justin Suissa'",
                                            title2: "Above & Beyond"
                                        })
                                }}>
                                <Text style={{
                                    color: Colors.white,
                                    fontSize: normalise(12),
                                    fontWeight: 'bold',
                                    marginTop: normalise(10),
                                    marginEnd: normalise(15)

                                }}>
                                    {`NEXT`}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={{ width: '90%', alignSelf: 'center', }}>

                            <TextInput style={{
                                height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                                borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                                color: Colors.white, paddingLeft: normalise(30)
                            }} value={userSeach}
                                placeholder={"Search"}
                                placeholderTextColor={Colors.grey_text}
                                onChangeText={(text) => { setUserSeach(text) }} />

                            <Image source={ImagePath.searchicongrey}
                                style={{
                                    height: normalise(15), width: normalise(15), bottom: normalise(25),
                                    paddingLeft: normalise(30)
                                }} resizeMode="contain" />

                            {userSeach === "" ? null :
                                <TouchableOpacity onPress={() => { setUserSeach("") }}
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
                        {userClicked ?
                            <View style={{
                                height: normalize(30),
                                width: normalize(95),
                                borderRadius: 25,
                                marginStart: normalise(20),
                                marginBottom: normalise(20),
                                alignItems: 'center', justifyContent: "center",
                                backgroundColor: 'white'
                            }}>
                                <Text style={{ color: Colors.black, fontWeight: 'bold' }}>IzzyWhite</Text>
                                <TouchableOpacity style={{
                                    position: 'absolute', right: 0, top: -5,
                                    height: 25, width: 25,
                                    borderRadius: 12
                                }}
                                    onPress={() => {
                                        setUserClicked(false)
                                    }}>
                                    <Image
                                        source={ImagePath.crossIcon}
                                        style={{
                                            marginTop: normalise(-1.5),
                                            marginStart: normalise(5.5),
                                            height: 25, width: 25,
                                        }} />
                                </TouchableOpacity>

                            </View> : null}


                        {userSeach === "" ? null :
                            <View>
                                <TouchableOpacity style={{
                                    marginTop: normalise(10),
                                    width: "87%",
                                    alignSelf: 'center'
                                }}
                                    onPress={() => {
                                        setUserClicked(true)
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image
                                            source={ImagePath.dp}
                                            style={{ height: 35, width: 35, borderRadius: normalise(13.5) }}
                                        />
                                        <View style={{ marginStart: normalise(10) }}>
                                            <Text style={{ color: Colors.white }}>Isabelle Frarnandes</Text>
                                            <Text style={{ color: Colors.white }}>@IzzyWhite</Text>
                                        </View>

                                    </View>
                                    <View style={{
                                        backgroundColor: Colors.grey,
                                        height: 0.5,
                                        marginTop: normalise(10)
                                    }} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    marginTop: normalise(10),
                                    width: "87%",
                                    alignSelf: 'center'
                                }}
                                    onPress={() => {
                                        setUserClicked(true)
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image
                                            source={ImagePath.dp1}
                                            style={{ height: 35, width: 35, borderRadius: normalise(13.5) }}
                                        />
                                        <View style={{ marginStart: normalise(10) }}>
                                            <Text style={{ color: Colors.white }}>John Smith</Text>
                                            <Text style={{ color: Colors.white }}>@john007</Text>
                                        </View>

                                    </View>
                                    <View style={{
                                        backgroundColor: Colors.grey,
                                        height: 0.5,
                                        marginTop: normalise(10)
                                    }} />
                                </TouchableOpacity>
                            </View>}

                    </View>

                </RBSheet>




            </SafeAreaView>
        </View >
    )
}