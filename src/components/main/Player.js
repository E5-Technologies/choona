
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text, Slider,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    TextInput,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import CommentList from '../main/ListCells/CommentList';
import StatusBar from '../../utils/MyStatusBar';
import RBSheet from "react-native-raw-bottom-sheet";

let RbSheetRef;

const followdata = [
    {

        picture: ImagePath.dp1,
        title: 'This girl',
        name: "Andy88Jones",
        comments: 1,

        reactions: 11,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {

        picture: ImagePath.dp,
        title: 'Paradise',
        singer: "Cold Play",
        name: "Andy88Jones",

        reactions: 7,
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        time: 8
    },
    {

        picture: ImagePath.dp1,
        title: 'Naked feat. Justin Suissa',
        name: "Andy88Jones",
        comments: 1,

        reactions: 10,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },

    {

        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        name: "Andy88Jones",
        comments: 1,

        reactions: 11,
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        time: 8
    },

]

export default function Player(props) {

    const [playVisible, setPlayVisible] = useState(false);


    function playing() {

        if (playVisible == true) {
            setPlayVisible(false)
        }
        else {
            setPlayVisible(true)
        }
        //  setModalReact(x)
    };

    function renderFlatlistData(data) {
        return (
            <CommentList
                width={"100%"}
                image={data.item.picture}
                title={data.item.title}
                name={data.item.name}
                comment={data.item.content}
                time={data.item.time}
                marginBottom={data.index === followdata.length - 1 ? normalise(10) : 0} />
        )
    }

    const RbSheet = () => {
        return (
            <RBSheet
                ref={(ref) => {
                    if (ref) {
                        RbSheetRef = ref
                    }
                }}
                animationType={'fade'}
                closeOnDragDown={false}
                closeOnPressMask={false}
                nestedScrollEnabled={true}
                keyboardAvoidingViewEnabled={true}
                customStyles={{
                    container: {
                        minHeight: Dimensions.get('window').height / 2.2,
                        borderTopEndRadius: normalise(8),
                        borderTopStartRadius: normalise(8),
                    },

                }}>

                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.black }}>
                    <View style={{ width: '95%', alignSelf: 'center' }}>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: normalise(15),
                            borderBottomWidth: 0.5,
                            borderColor: Colors.grey
                        }}>
                            <TouchableOpacity onPress={() => { if (RbSheetRef) { RbSheetRef.close() } }}>
                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                        marginBottom: normalise(10)
                                    }}
                                    resizeMode='contain' />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { if (RbSheetRef) { RbSheetRef.close() } }}>
                                <Text style={{
                                    fontSize: normalise(12), color: Colors.white,
                                    fontFamily: 'ProximaNova-Bold',
                                    marginBottom: normalise(10)
                                }}>4 COMMENTS</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { if (RbSheetRef) { RbSheetRef.close() } }}>
                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                        marginBottom: normalise(10)
                                    }}
                                    resizeMode='contain' />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            style={{ height: '60%' }}
                            data={followdata}
                            renderItem={renderFlatlistData}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(17),
                            marginTop: normalise(10),
                            padding: normalise(10),
                            color: Colors.white, paddingLeft: normalise(30)
                        }}
                            placeholder={"Add a comment..."}
                            placeholderTextColor={Colors.white}
                            onChangeText={(text) => { console.log(text) }} />


                        <TouchableOpacity
                            style={{
                                position: 'absolute', right: 0,
                                bottom: normalise(10),
                                paddingRight: normalise(10)
                            }}>
                            <Text style={{
                                color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                            }}>POST</Text>

                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

            </RBSheet>
        )
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <StatusBar />

                <SafeAreaView style={{ flex: 1, }}>

                    <ScrollView>

                        <View style={{
                            marginHorizontal: normalise(15),
                            width: normalise(290),
                            marginTop: normalise(15),
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>


                            <Image source={ImagePath.dp1}
                                style={{ height: normalise(24), width: normalise(24) }}
                                resizeMode="contain" />



                            <View style={{
                                flexDirection: 'column', alignItems: 'flex-start', width: '50%',
                                marginRight: normalise(60)
                            }}>

                                <Text style={{
                                    color: Colors.grey, fontSize: normalise(8),
                                    fontFamily: 'ProximaNova-Bold'
                                }} numberOfLines={1}> POSTED BY </Text>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold',
                                }} numberOfLines={1}> ShimShimmer </Text>


                            </View>

                            <View style={{
                                height: normalise(40), width: normalise(50), backgroundColor: Colors.black,
                                justifyContent: 'center',
                            }}>

                                <TouchableOpacity style={{
                                    height: normalise(25), width: normalise(45),
                                    borderRadius: normalise(5), alignSelf: 'center', backgroundColor: Colors.fadeblack,
                                    justifyContent: 'center', alignItems: 'center'
                                }} >

                                    <Image source={ImagePath.threedots} style={{ height: normalise(15), width: normalise(15) }}
                                        resizeMode='contain' />

                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{
                                marginTop: normalise(5),
                                height: normalise(265), width: normalise(290), alignSelf: 'center',
                                borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                                borderColor: Colors.grey, shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                                shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                            }}   >


                            <Image source={ImagePath.profiletrack4}
                                style={{ height: normalise(265), width: normalise(290), borderRadius: normalise(15) }}
                                resizeMode="cover" />



                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row', alignItems: "center", justifyContent: 'space-between',
                            width: '90%', alignSelf: 'center', marginTop: normalise(15)
                        }}>

                            <View style={{
                                flexDirection: 'column', width: '90%', alignSelf: 'center',
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(14),
                                    fontFamily: 'ProximaNova-Semibold',
                                    width: '90%',
                                }} numberOfLines={1}>Played-A-Live (The Bongo Song)</Text>

                                <Text style={{
                                    color: Colors.grey_text, fontSize: normalise(12),
                                    fontFamily: 'ProximaNovaAW07-Medium', width: '90%',
                                }} numberOfLines={1}>Safri Duo</Text>

                            </View>

                            <Image source={ImagePath.spotifyicon}
                            style={{height:normalise(20), width:normalise(20)}}
                            resizeMode='contain' />

                        </View>

                        <View style={{
                            flexDirection: 'row', width: '90%', alignSelf: 'center',
                            justifyContent: 'space-between', marginTop: normalise(15),
                        }}>

                            <Text style={{ color: 'white', 
                            fontFamily: 'ProximaNova-Semibold' }}>
                                01:30
                                </Text>

                            <Text style={{ color: 'white',
                            fontFamily: 'ProximaNova-Semibold'}}>
                                -2:19
                                </Text>

                        </View>

                        <Slider
                            style={{ width: '90%', height: 40, alignSelf: "center", }}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                        />

                        <View style={{
                            flexDirection: 'row', alignSelf: 'center', width: '70%',
                            justifyContent: 'space-around', marginTop: normalise(15), alignItems: 'center'
                        }}>
                            <TouchableOpacity>
                                <Image source={ImagePath.backwardicon}
                                    style={{ height: normalise(18), width: normalise(18) }}
                                    resizeMode="contain" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    playing()
                                }}
                                style={{
                                    height: normalise(60), width: normalise(60), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.white, borderRadius: normalise(30)
                                }}>
                                {playVisible == true ?
                                    <Image source={ImagePath.playicon}
                                        style={{ height: normalise(20), width: normalise(20) }}
                                        resizeMode="contain" />
                                    :

                                    <Image source={ImagePath.pauseicon}
                                        style={{ height: normalise(20), width: normalise(20) }}
                                        resizeMode="contain" />

                                }

                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Image source={ImagePath.forwardicon}
                                    style={{ height: normalise(18), width: normalise(18) }}
                                    resizeMode="contain" />
                            </TouchableOpacity>
                        </View>


                        <View style={{
                            flexDirection: 'row', width: '90%', alignSelf:'center',
                            justifyContent: 'space-between', marginTop: normalise(25), alignItems: 'center'
                        }}>
                            <TouchableOpacity style={{
                                height: normalise(40), width: normalise(42), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.fadeblack, borderRadius: normalise(5)
                            }}>
                                <Image source={ImagePath.reactionicon}
                                    style={{ height: normalise(20), width: normalise(20) }}
                                    resizeMode="contain" />


                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                height: normalise(40), width: normalise(42), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.fadeblack, borderRadius: normalise(5)
                            }}>

                                <Image source={ImagePath.boxicon}
                                    style={{ height: normalise(20), width: normalise(20) }}
                                    resizeMode="contain" />


                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                height: normalise(40), width: normalise(42), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.fadeblack, borderRadius: normalise(5)
                            }}>

                                <Image source={ImagePath.sendicon}
                                    style={{ height: normalise(20), width: normalise(20) }}
                                    resizeMode="contain" />


                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                height: normalise(40), width: normalise(115), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.fadeblack, borderRadius: normalise(10)
                            }} onPress={() => {
                                if (RbSheetRef) RbSheetRef.open()
                            }}>



                                <Image source={ImagePath.comment_grey}
                                    style={{ height: normalise(16), width: normalise(16) }}
                                    resizeMode="contain" />

                                <Text style={{ fontSize: normalise(9), color: Colors.white, marginLeft: normalise(10),
                                fontFamily:'ProximaNova-Bold' }}>
                                    3 COMMENTS
                                    </Text>

                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={{
                            width: '90%', alignSelf: 'center', backgroundColor: Colors.fadeblack,
                            height: normalise(50), marginTop: normalise(40), alignItems: 'center',
                            justifyContent: 'center',
                            borderTopRightRadius: normalise(8), borderTopLeftRadius:normalise(8),
                             marginBottom: normalise(20),
                        }} onPress={() => { props.navigation.goBack() }}>

                            <View style={{
                                width: '90%', alignSelf: 'center', flexDirection: 'row',
                                justifyContent: 'space-between', alignItems: 'center',
                            }}>


                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                    }} resizeMode='contain' />


                                <Text style={{
                                    color: Colors.white, fontSize: normalise(12),
                                    fontFamily:'ProximaNova-Extrabld'
                                }}>MINIMISE PLAYER</Text>


                                <Image source={ImagePath.donw_arrow_solid}
                                    style={{
                                        height: normalise(10), width: normalise(10),
                                    }} resizeMode='contain' />


                            </View>
                        </TouchableOpacity>

                        {RbSheet()}

                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>

    )
}