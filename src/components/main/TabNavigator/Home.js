import React, { useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import _ from 'lodash'

const flatlistdata = []

export default function Home(props) {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar barStyle={'light-content'} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent
                    firstitemtext={false}
                    imageone={ImagePath.dp}
                    imageoneheight={30}
                    imageonewidth={30}
                    title={"CHOONA"}
                    thirditemtext={false}
                    imagetwo={ImagePath.inbox}
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.navigate("Profile") }}
                    onPressThirdItem={()=>{props.navigation.navigate("Inbox")}} />

                
                {_.isEmpty(flatlistdata) ? 
                
                <View style={{ flex: 1 }}>
                    <View style={{ height: '60%', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Image source={ImagePath.noposts} style={{ height: normalise(150), width: normalise(150) }}
                            resizeMode='contain' />
                        <Text style={{
                            marginTop: normalise(10), color: Colors.white,
                            fontSize: normalise(14), fontWeight: 'bold'
                        }}>NO POSTS YET</Text>
                    </View>

                    <View style={{marginTop:normalise(10),height: '40%', alignItems: 'center', justifyContent:'flex-end' }}>

                        <TouchableOpacity style={{
                             height: normalise(50), width: '80%', alignSelf: 'center',
                            borderRadius: normalise(25), backgroundColor: Colors.facebookblue, borderWidth: normalise(0.5),
                         shadowColor: "#000", shadowOffset: { width: 0, height: 5, },
                             shadowOpacity: 0.36,shadowRadius: 6.68, elevation: 11, flexDirection: 'row', 
                             alignItems: 'center', justifyContent: 'center'
                        }} >
                            <Image source={ImagePath.facebook}
                                style={{ height: normalise(20), width: normalise(20) }}
                                resizeMode='contain' />

                            <Text style={{
                                marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
                                fontWeight: 'bold'
                            }}>CONNECT WITH FACEBOOK</Text>

                        </TouchableOpacity>


                        <TouchableOpacity style={{
                            marginBottom: normalise(30),
                            marginTop: normalise(10), height: normalise(50), width: '80%', alignSelf: 'center',
                            borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                            shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                            shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', 
                            justifyContent: 'center',borderColor: Colors.grey,
                        }}  >

                            <Text style={{
                                marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
                                fontWeight: 'bold'
                            }}>CHECK YOUR PHONEBOOK</Text>

                        </TouchableOpacity>
                    </View>
                </View> : null }


            </SafeAreaView>
        </View>
    )
}