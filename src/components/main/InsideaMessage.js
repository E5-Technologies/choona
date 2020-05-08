import React, { useEffect, Fragment } from 'react';
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
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import InsideMessegeHeader from '../../widgets/InsideMessegeHeader';
import SavedSongsListItem from '../main/ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import StatusBar from '../../utils/MyStatusBar';


const flatlistdata = [
    {
        image: ImagePath.profiletrack1,
        title: 'Naked feat. Justin Suissa',
        singer: "Above & Beyond",
        comments: 1
    },
    {
        image: ImagePath.profiletrack2,
        title: 'Naked feat. Justin Suissa',
        singer: "Dua Lipa",
        comments: 2
    },
    {
        image: ImagePath.profiletrack1,
        title: 'Naked feat. Justin Suissa',
        singer: "Kygo",
        comments: 1
    },

    {
        image: ImagePath.profiletrack2,
        title: 'Naked feat. Justin Suissa',
        singer: "Dua Lipa",
        comments: 1
    },
    {
        image: ImagePath.profiletrack1,
        title: 'Naked feat. Justin Suissa',
        singer: "Kygo",
        comments: 3
    },
    {
        image: ImagePath.profiletrack2,
        title: 'Naked feat. Justin Suissa',
        singer: "Above & Beyond",
        comments: 2
    },

]

export default function InsideaMessage(props) {

    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={data.item.image}
                title={data.item.title}
                singer={data.item.singer}
                comments={data.item.comments}
                marginBottom={data.index === flatlistdata.length - 1 ? normalise(20) : 0} />
        )
    }

    function renderHiddenItem(data) {
        return (
            <TouchableOpacity style={{
                flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center'
            }}>

                <Image source={ImagePath.boxactive}
                    style={{ height: normalise(20), width: normalise(20) }} />

                <Text>Unsave</Text>
            </TouchableOpacity>
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>



                <InsideMessegeHeader firstitemtext={false}
                    imageone={ImagePath.backicon}
                    imagesecond={ImagePath.dp}

                    title={"RUSHY"}
                    thirditemtext={false}
                    // imagetwo={ImagePath.newmessage} 
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

                <View style={{ width: '92%', alignSelf: 'center', }}>

                    <TextInput style={{
                        height: normalise(35),
                        width: '100%',
                        backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(8),
                        marginTop: normalise(20),
                        padding: normalise(10),
                        color: Colors.white,
                        paddingLeft: normalise(30)
                    }}
                        placeholder={"Search"}
                        placeholderTextColor={Colors.darkgrey}
                        onChangeText={(text) => { console.log(text) }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />
                </View>

                <SwipeListView
                    data={flatlistdata}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    // renderHiddenItem={ (rowData, rowMap) => (

                    //     <TouchableOpacity style={{backgroundColor:Colors.red, flexDirection:'column', 
                    //     alignItems:'center', justifyContent:"space-evenly", height:normalise(39), width:normalise(44),
                    //      marginTop:normalise(15), position:'absolute', right:21}}
                    //      onPress={ () => { rowMap[rowData.item.key].closeRow() }}>

                    //         <Image source={ImagePath.unsaved} style={{height:normalise(18), width:normalise(18),}} 
                    //         resizeMode='contain' />
                    //         <Text style={{fontSize:normalise(8), color:Colors.white,
                    //         fontWeight:'bold'}}>UNSAVE</Text>

                    //     </TouchableOpacity>
                    // )}

                    keyExtractor={(item, index) => { index.toString() }}
                    disableRightSwipe={true}
                    rightOpenValue={-75} />



                <TouchableOpacity style={{
                    marginBottom: normalise(30),
                    marginTop: normalise(10), height: normalise(50), width: '80%', alignSelf: 'center',
                    borderRadius: normalise(25), backgroundColor: Colors.white, borderWidth: normalise(0.5),
                    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', borderColor: Colors.grey,
                }}  >

                    <Text style={{
                        marginLeft: normalise(10), color: Colors.gray, fontSize: normalise(14),
                        fontFamily: 'ProximaNova-Extrabld',
                    }}>ADD ANOTHER SONG</Text>

                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}
