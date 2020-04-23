import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';

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

export default function Profile(props) {

    const [following, setFollowing] = useState("1633");
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

            <StatusBar barStyle={'light-content'} />

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

                    <TouchableOpacity>
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
                        marginLeft: normalise(20),
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15),
                            fontWeight: 'bold'
                        }}>Andy Jones</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),

                        }}>@andyjones88</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),

                        }}>Liverpool, UK</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalise(2), }}>
                            
                            <TouchableOpacity onPress={()=>{props.navigation.navigate("Following", {following: following})}}>
                                <Text style={{
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontWeight: 'bold'
                                }}><Text style={{ color: Colors.white }}>{following}</Text>  Following</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>{props.navigation.navigate("Followers", {followers: followers})}}>
                            <Text style={{
                                marginLeft: normalise(10),
                                color: Colors.darkgrey, fontSize: normalise(11),
                                fontWeight: 'bold'
                            }}><Text style={{ color: Colors.white }}>{followers}</Text>  Followers</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <ImageBackground source={ImagePath.gradientbar}
                    style={{
                        width: '100%', height: normalise(50),
                        marginTop: normalise(10),
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
                            flexDirection: 'column', alignItems: 'flex-start', marginRight: normalise(100),
                        }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(9), fontWeight: 'bold'
                            }}>FEATURED TRACK</Text>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(10),
                            }}>Bongo Song</Text>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(9),
                            }}>Above & Beyond</Text>
                        </View>

                        <TouchableOpacity>
                            <Image source={ImagePath.change} style={{ height: normalise(40), width: normalise(40) }} />
                        </TouchableOpacity>
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