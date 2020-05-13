
import React, { useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HomeHeaderComponent';
import CommentList from '../main/ListCells/CommentList';
import { SwipeListView } from 'react-native-swipe-list-view';
import { normalizeUnits } from 'moment';



const flatlistdata = [
    {

        picture: ImagePath.dp1,
        title: 'This girl',
        name: "andy88Jones",
        comments: 1,

        reactions: 11,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {

        picture: ImagePath.dp,
        title: 'Paradise',
        singer: "Cold Play",
        name: "andy88Jones",

        reactions: 7,
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        time: 8
    },
    {

        picture: ImagePath.dp1,
        title: 'Naked feat. Justin Suissa',
        name: "andy88Jones",
        comments: 1,

        reactions: 10,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },

    {

        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        name: "andy88Jones",
        comments: 1,

        reactions: 11,
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        time: 8
    },


]

export default function HomeItemComments(props) {

    function renderItem(data) {
        return (
            <CommentList
                image={data.item.picture}
                title={data.item.title}
                name={data.item.name}
                comment={data.item.content}
                time={data.item.time}
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

        <KeyboardAvoidingView
            behavior="height"
            style={{ flex: 1, backgroundColor: Colors.black, }}>
            <SafeAreaView style={{ flex: 1 }}>



                <HeaderComponent
                    firstitemtext={false}
                    imageone={ImagePath.backicon}
                    //imagesecond={ImagePath.dp}
                    title="4 COMMENTS"
                    thirditemtext={false}
                    marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
                    // imagetwo={ImagePath.newmessage} 
                    imagetwoheight={25}
                    imagetwowidth={25}
                    inner={true}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

                <View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom }}>

                    <View style={{
                        flexDirection: 'row',
                    }}>

                        <TouchableOpacity onPress={() => { onPressImage() }} style={{ justifyContent: 'center' }}>
                            <Image source={ImagePath.profiletrack1}
                                style={{ height: normalise(60), width: normalise(60), }}
                                resizeMode="contain" />

                            <Image source={ImagePath.play}
                                style={{
                                    height: normalise(20), width: normalise(20), position: 'absolute',
                                    alignSelf: 'center'
                                }} />
                        </TouchableOpacity>


                        <View style={{ marginLeft: normalise(10) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: normalise(220) }}>

                                <Text style={{
                                    color: Colors.white, fontSize: 14, fontFamily: 'ProximaNova-Semibold',
                                }}>
                                    andy88jones
      </Text>
                                <Text style={{
                                    marginEnd: normalise(12.5),
                                    color: Colors.grey_text, fontSize: 12, fontFamily: 'ProximaNovaAW07-Medium',
                                }}>
                                    8 mins ago
      </Text>
                            </View>

                            <View>
                                <Text style={{
                                    width: normalise(218), color: Colors.white, fontSize: 12, marginTop: normalise(2),
                                    fontFamily: 'ProximaNovaAW07-Medium'
                                }}>
                                    Absolutely use to love this song, was an unreal banger back in the day
      </Text>
                            </View>
                        </View>
                    </View>


                    <View style={{
                        marginTop: normalise(10), borderBottomWidth: normalise(1),
                        borderBottomColor: Colors.activityBorderColor
                    }} />

                </View>

                <SwipeListView
                    data={flatlistdata}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}


                    keyExtractor={(item, index) => { index.toString() }}
                    disableRightSwipe={true}
                    rightOpenValue={-75} />



                <View style={{
                    width: '95%',
                    backgroundColor: Colors.fadeblack,
                    borderColor: Colors.activityBorderColor,
                    borderWidth: 1,
                    flexDirection: 'row',
                    padding: normalise(4),
                    borderRadius: normalise(25),
                    marginTop: normalise(20),
                    alignSelf: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: normalise(15),
                    justifyContent: 'space-between'
                }}>

                    <TextInput multiline
                        style={{
                            width: '80%',
                            maxHeight: normalise(100),
                            fontSize: normalise(12),
                            color: Colors.white,
                            marginTop: Platform.OS === 'android' ? 0 : normalise(6),
                            marginStart: normalise(10),
                            paddingBottom: normalise(11)
                        }}
                        placeholder={"Add a comment..."}
                        placeholderTextColor={Colors.white}
                        onChangeText={(text) => { console.log(text) }} />

                    <TouchableOpacity style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontSize: normalise(13),
                            color: Colors.white,
                            marginEnd: normalise(10),
                            fontWeight: 'bold'
                        }}>
                            POST
        </Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>

        </KeyboardAvoidingView>
    )
}
