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
    Platform
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import _ from 'lodash';
import StatusBar from '../../utils/MyStatusBar';

const profileData = [
    {
        image: ImagePath.profiletrack1
    },
    {
        image: ImagePath.profiletrack2
    },
    {
        image: ImagePath.profiletrack3
    },
    {
        image: ImagePath.profiletrack4
    },
    {
        image: ImagePath.profiletrack5
    },
    {
        image: ImagePath.profiletrack6
    },
]

const profileData2 = []

export default function Profile(props) {

    const [following, setFollowing] = useState("1,633");
    const [followers, setFollowers] = useState('429')

    function renderProfileData(data) {
        return (
            <TouchableOpacity style={{
                margin: normalise(5),
                marginBottom: data.index === profileData.length - 1 ? normalise(30) : normalise(0)
            }}>
                <Image source={data.item.image} style={{ height: normalise(140), width: normalise(140) }}
                    resizeMode="contain" />
            </TouchableOpacity>
        )
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <View style={{
                    width: '90%', alignSelf: 'center', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'flex-end', marginTop: normalise(10)
                }}>

                    <TouchableOpacity style={{ marginRight: normalise(10) }}
                        onPress={() => { props.navigation.navigate("EditProfile") }}>
                        <Image source={ImagePath.settings}
                            style={{ height: normalise(20), width: normalise(20) }}
                            resizeMode="contain" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                        <Image source={ImagePath.iconmenu}
                            style={{ height: normalise(20), width: normalise(20) }}
                            resizeMode="contain" />
                    </TouchableOpacity>
                </View>


                <View style={{
                    width: '90%', alignSelf: 'center', flexDirection: 'row',
                    alignItems: 'center', marginTop: normalise(15)
                }}>

                    <Image source={ImagePath.dp}
                        style={{ height: normalise(80), width: normalise(80), borderRadius: normalise(40) }} />

                    <View style={{
                        flexDirection: 'column', alignItems: 'flex-start',
                        marginLeft: normalise(20)
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15),
                            fontFamily: 'ProximaNova-Semibold'
                        }}>Andy Jones</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey,
                            fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',
                        }}>@andyjones88</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',
                        }}>Liverpool, UK</Text>


                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            marginTop: normalise(2),

                        }}>

                            <TouchableOpacity onPress={() => { props.navigation.navigate("Following", { following: following }) }}>
                                <Text style={{
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold'
                                }}><Text style={{
                                    color: Colors.white, fontFamily: 'ProximaNova-Semibold'
                                }}>{following}</Text>  Following</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { props.navigation.navigate("Followers", { followers: followers }) }}>
                                <Text style={{
                                    marginLeft: normalise(10),
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold'
                                }}><Text style={{
                                    color: Colors.white, fontFamily: 'ProximaNova-Semibold'
                                }}>{followers}</Text>  Followers</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                <ImageBackground source={ImagePath.gradientbar}
                    style={{
                        width: '100%', height: normalise(50),
                        marginTop: normalise(10),
                    }}>

                    {_.isEmpty(profileData) ?              // IF DATA IS EMPTY
                        <View style={{
                            width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', height: normalise(50),
                        }}>

                            <TouchableOpacity style={{
                                backgroundColor: Colors.fadeblack, height: normalise(40),
                                width: normalise(40), justifyContent: 'center', alignItems: 'center'
                            }}>

                                <Image source={ImagePath.addicon} style={{
                                    height: normalise(20),
                                    width: normalise(20)
                                }} />

                            </TouchableOpacity>


                            <View style={{
                                flexDirection: 'column', alignItems: 'flex-start', marginLeft: normalise(10)
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(9),
                                    fontFamily: 'ProximaNova-Bold'
                                }}>FEATURED TRACK</Text>

                                <Text style={{
                                    width: '70%', fontWeight: '500', marginTop: normalise(2),
                                    color: Colors.white, fontSize: normalise(10),
                                }}>You don't currently have a featured track.let's add one</Text>




                            </View>

                        </View>

                        // IF DATA IS NOT EMPTY
                        : <View style={{
                            width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', height: normalise(50),
                        }}>

                            <TouchableOpacity>
                                <Image source={ImagePath.dp2} style={{ height: normalise(40), width: normalise(40) }} />
                                <Image source={ImagePath.play} style={{
                                    height: normalise(25), width: normalise(25),
                                    position: 'absolute', marginLeft: normalise(8), marginTop: normalise(8)
                                }} />
                            </TouchableOpacity>


                            <View style={{
                                flexDirection: 'column', alignItems: 'flex-start',
                                 marginRight: Platform.OS === 'android' ? normalise(110) :  normalise(104)  ,
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize:
                                        normalise(9), fontFamily: 'ProximaNova-Regular',
                                }}>FEATURED TRACK</Text>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(10),
                                    
                                    fontFamily: 'ProximaNova-Bold'
                                }}>Bongo Song</Text>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(9),
                                    fontFamily: 'ProximaNova-Regular',
                                }}>Above & Beyond</Text>
                            </View>

                            <TouchableOpacity>
                                <Image source={ImagePath.change} style={{
                                    height: normalise(40),
                                    width: normalise(40),
                                }} />
                            </TouchableOpacity>
                        </View>}
                </ImageBackground>


                {_.isEmpty(profileData) ?

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{
                            height: '50%', justifyContent: 'flex-end', alignItems: "center",
                            width: '50%'
                        }}>

                            <Text style={{ color: Colors.white, fontSize: normalise(15), fontWeight: 'bold' }}>
                                Your Profile is Empty</Text>

                            <Text style={{
                                marginTop: normalise(10), color: Colors.grey, fontSize: normalise(15),
                            }}>You haven't posted any songs yet, let's post one </Text>
                        </View>

                        <View style={{ height: '50%', justifyContent: 'flex-end', alignItems: "center", width: '80%' }}>
                            <TouchableOpacity style={{
                                marginBottom: normalise(10),
                                height: normalise(40), width: '100%', alignItems: 'center',
                                justifyContent: 'center', borderRadius: normalise(20),
                                backgroundColor: Colors.white
                            }}>
                                <Text style={{ color: Colors.black, fontSize: normalise(12), fontWeight: 'bold' }}>
                                    POST YOUR FIRST SONG
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    : <FlatList
                        style={{ paddingTop: normalise(10), alignSelf: 'center' }}
                        data={profileData}
                        renderItem={renderProfileData}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                        numColumns={2} />}



            </SafeAreaView>
        </View>
    )
}