
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
    TextInput
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import InboxListItem from '../../components/main/ListCells/InboxItemList';
import StatusBar from '../../utils/MyStatusBar';

const followdata = [
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        message: "Remember we use to play this in office ?",
        read: false

    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        message: "Here's a blast from past?",
        read: false

    },
    {
        picture: ImagePath.dp,
        title: "Annie88jones ",
        message: "Here's a blast from past?",
        read: true


    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ ",
        message: "Here's a blast from past?",
        read: true

    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        message: "Here's a blast from past?",
        read: true

    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        message: "Here's a blast from past?",
        read: true

    },
    {
        picture: ImagePath.dp,
        title: "Annie88j",
        message: "Here's a blast from past?",
        read: true

    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ",
        message: "Here's a blast from past?",
        read: true

    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        message: "Here's a blast from past?",
        read: true

    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        message: "Here's a blast from past?",
        read: true

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

    }


    function renderInboxItem(data) {
        return (
            <InboxListItem image={data.item.picture}
                title={data.item.title}
                description={data.item.message}
                read={data.item.read === true ? true : false}
                onPress={() => props.navigation.navigate('InsideaMessage')}
                marginBottom={data.index === followdata.length - 1 ? normalise(20) : 0}
            />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

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
                            marginRight: normalise(30)
                        }}>

                            <Text style={{
                                color: Colors.grey, fontSize: normalise(10),
                                fontWeight: 'bold',
                            }} numberOfLines={1}> Posted By </Text>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(11),
                                fontWeight: 'bold',

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

                    <Text style={{
                        margin: normalise(20),
                        color: Colors.white, fontSize: normalise(12),
                        fontWeight: 'bold',

                    }} numberOfLines={2}>
                        Played-A-Live (The Bongo {"\n"} Song)
                </Text>

                    <View style={{
                        flexDirection: 'row', marginLeft: normalise(22), width: normalise(276),
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ color: 'white' }}>
                            01:30
                    </Text>
                        <Text style={{ color: 'white' }}>
                            -2:19
                        </Text>
                    </View>
                    <Slider
                        style={{ width: normalise(276), height: 40, marginLeft: normalise(22) }}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />

                    <View style={{
                        flexDirection: 'row', marginLeft: normalise(22), width: normalise(276),
                        justifyContent: 'space-around', marginTop: normalise(25), alignItems: 'center'
                    }}>
                        <Image source={ImagePath.backwardicon}
                            style={{ height: normalise(18), width: normalise(18) }}
                            resizeMode="contain" />
                        <TouchableOpacity
                            onPress={() => {
                                playing()
                            }}
                            style={{
                                height: normalise(60), width: normalise(60), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: Colors.white, borderRadius: normalise(30)
                            }}>
                            {playVisible == true ?
                                <Image source={ImagePath.pauseicon}
                                    style={{ height: normalise(20), width: normalise(20) }}
                                    resizeMode="contain" />
                                :

                                <Image source={ImagePath.playicon}
                                    style={{ height: normalise(20), width: normalise(20) }}
                                    resizeMode="contain" />

                            }

                        </TouchableOpacity>
                        <Image source={ImagePath.forwardicon}
                            style={{ height: normalise(18), width: normalise(18) }}
                            resizeMode="contain" />
                    </View>


                    <View style={{
                        flexDirection: 'row', marginLeft: normalise(15), width: normalise(290),
                        justifyContent: 'space-around', marginTop: normalise(25), alignItems: 'center'
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
                        }}>



                            <Image source={ImagePath.commenticon}
                                style={{ height: normalise(16), width: normalise(16) }}
                                resizeMode="contain" />

                            <Text style={{ fontSize: normalise(9), color: Colors.white, marginLeft: normalise(5) }}>
                                3 Comments
                     </Text>

                        </TouchableOpacity>
                    </View>

                    <View style={{
                        width: '90%', alignSelf: 'center', backgroundColor: Colors.white,
                        height: normalise(50), marginTop: normalise(20), alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: normalise(10), marginBottom: normalise(20),
                    }}>

                        <View style={{
                            width: '90%', alignSelf: 'center', flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                        }}>

                            <TouchableOpacity>
                                <Image source={ImagePath.playicon}
                                    style={{
                                        height: normalise(12), width: normalise(12),
                                        transform: [{ rotate: '90deg' }]
                                    }} resizeMode='contain' />
                            </TouchableOpacity>

                            <Text style={{
                                color: Colors.darkerblack, fontSize: normalise(12),
                                fontWeight: '500'
                            }}>Minimize Player</Text>

                            <TouchableOpacity>
                                <Image source={ImagePath.playicon}
                                    style={{
                                        height: normalise(12), width: normalise(12),
                                        transform: [{ rotate: '90deg' }]
                                    }} resizeMode='contain' />
                            </TouchableOpacity>

                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    )
}