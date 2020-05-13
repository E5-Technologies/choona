import React, { useState } from 'react';
import propTypes from "prop-types";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    Button,
    Image,
    FlatList,
    Alert,
    CheckBox,
    Slider,
    Platform,
    ImageBackground,
    Dimensions
} from 'react-native';

import normalise from "../utils/helpers/Dimens";
import Colors from "../assests/Colors";
import ImagePath from '../assests/ImagePath';


export default function MusicPlayerBar(props) {

    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
    }

    return (
        <ImageBackground
            source={ImagePath.gradientbar}
            style={{
                width: '100%', height: normalize(45),
            }}
            blurRadius={200}>

            <Slider
                style={{
                    width: Platform.OS == 'ios' ? '100%' : normalise(335),
                    height: Platform.OS === 'android' ? 5 : 0, alignSelf: 'center'
                }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
            />

            <View style={{
                width: '90%', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between',
                marginTop: Platform.OS === 'ios' ? normalize(10) : normalize(8), flexDirection: 'row'
            }}>

                    <TouchableOpacity onPress={()=>{onPress()}}>
                        <Image source={ImagePath.profiletrack1}
                            style={{ height: normalize(25), width: normalize(25) }} />
                    </TouchableOpacity>

                    <View style={{
                        flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
                        marginRight: normalise(60)
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(11),
                            fontFamily: 'ProximaNova-Semibold',
                            width: '100%',
                        }} numberOfLines={1}>Played-A-Live (The Bongo Song)</Text>

                        <Text style={{
                            color: Colors.grey_text, fontSize: normalise(10),
                            fontFamily: 'ProximaNovaAW07-Medium', width: '100%',
                        }} numberOfLines={1}>Safri Duo</Text>
                    </View>

                    <TouchableOpacity>
                        <Image source={ImagePath.play}
                            style={{ height: normalize(25), width: normalize(25) }} />
                    </TouchableOpacity>


               
            </View>
        </ImageBackground>
    )

};


MusicPlayerBar.propTypes = {
    onPress: propTypes.func
};

MusicPlayerBar.defaultProps = {
    onPress: null
};