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
    ImageBackground
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
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

]

export default function OthersProfile(props) {

    const [following, setFollowing] = useState("120");
    const [followers, setFollowers] = useState('873')

    function renderProfileData(data) {
        return (
            <TouchableOpacity style={{

                marginBottom: data.index === profileData.length - 1 ? normalise(30) : normalise(0)
            }}>
                <Image source={data.item.image}
                    style={{
                        height: normalise(140),
                        width: normalise(152),
                        marginBottom: normalise(10)
                    }}
                    resizeMode="contain" />
            </TouchableOpacity>
        )
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon}
                    title={"@DANVERNON"}
                    thirditemtext={true}
                    texttwo={""}
                    onPressFirstItem={() => { props.navigation.goBack() }}
                />


                <View style={{
                    width: '90%', alignSelf: 'center', flexDirection: 'row',
                    alignItems: 'center', marginTop: normalise(15)
                }}>
                    <Image source={ImagePath.dp1}
                        style={{ height: normalise(80), width: normalise(80), borderRadius: normalise(40) }} />

                    <View style={{
                        flexDirection: 'column', alignItems: 'flex-start',
                        marginLeft: normalise(20),
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15),
                            fontFamily: 'ProximaNovaAW07-Medium',

                        }}>Dan Vernon</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',

                        }}>4 Posts</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',

                        }}>London, UK</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalise(2), }}>

                            <TouchableOpacity onPress={() => { props.navigation.navigate("Following", { following: following }) }}>
                                <Text style={{
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold',
                                }}><Text style={{ color: Colors.white }}>{following}</Text>  Following</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { props.navigation.navigate("Followers", { followers: followers }) }}>
                                <Text style={{
                                    marginLeft: normalise(10),
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold',
                                }}><Text style={{ color: Colors.white }}>{followers}</Text>  Followers</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

                <View style={{
                    width: '95%', alignSelf: 'center', marginTop: normalise(20), flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'space-around'
                }}>

                    <TouchableOpacity
                        style={{
                            height: normalise(30), width: '45%', borderRadius: normalise(15),
                            backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'
                        }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(11), color: Colors.black,
                            fontFamily: 'ProximaNova-Bold'
                        }}>
                            SEND A SONG
                            </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            height: normalise(30), width: '45%', borderRadius: normalise(15),
                            backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'
                        }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(11), color: Colors.black,
                            fontFamily: 'ProximaNova-Bold'
                        }}>
                            FOLLOW
                            </Text>

                    </TouchableOpacity>

                </View>

                <ImageBackground source={ImagePath.gradientbar}
                    style={{
                        width: '100%', height: normalise(50),
                        marginTop: normalise(15),
                    }}>

                    <View style={{
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
                            flexDirection: 'column', alignItems: 'flex-start', marginRight: normalise(120),
                        }}>

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(9),
                                fontFamily: 'ProximaNova-Bold'
                            }}>FEATURED TRACK</Text>

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(10),
                                fontFamily: 'ProximaNova-Bold'

                            }}>Naked feat. Justin Suissa</Text>

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(9),
                                fontFamily: 'ProximaNova-Regular',
                                fontWeight: '400'
                            }}>Above & Beyond</Text>
                        </View>

                    </View>

                </ImageBackground>

                <FlatList
                    style={{ paddingTop: normalise(10), alignSelf: 'center' }}
                    data={profileData}
                    renderItem={renderProfileData}
                    keyExtractor={(item, index) => { index.toString() }}
                    showsVerticalScrollIndicator={false}
                    numColumns={2} />



            </SafeAreaView>
        </View>
    )
}