



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
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import SavedSongsListItem from '../ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
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
]

export default function Contact(props) {

    const [search, setSearch] = useState("")

    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={data.item.image}
                title={data.item.title}
                singer={data.item.singer}
                marginBottom={data.index === flatlistdata.length - 1 ? normalise(20) : 0} />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={""}
                    title={"SAVED SONGS"}
                    thirditemtext={true}
                    texttwo={""}
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
                        <TouchableOpacity onPress={()=>{setSearch("")}}
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
                    data={flatlistdata}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    renderHiddenItem={(rowData, rowMap) => (

                        <TouchableOpacity style={{
                            backgroundColor: Colors.red,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: "space-evenly",
                            height: normalise(39),
                            width: normalise(42),
                            marginTop: normalise(10),
                            position: 'absolute', right: 21
                        }}
                            //  onPress={ () => { rowMap[rowData.item.key].closeRow() }}
                            onPress={() => { props.navigation.navigate('Player') }}
                        >

                            <Image source={ImagePath.unsaved}
                                style={{ height: normalise(15), width: normalise(15), }}
                                resizeMode='contain' />
                            <Text style={{
                                fontSize: normalise(8), color: Colors.white,
                                fontWeight: 'bold'
                            }}>UNSAVE</Text>

                        </TouchableOpacity>
                    )}

                    keyExtractor={(item, index) => { index.toString() }}
                    disableRightSwipe={true}
                    rightOpenValue={-75} />

            </SafeAreaView>
        </View>
    )
}