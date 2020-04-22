import React, { useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import {tokenRequest} from '../../action/index';
import {useDispatch, useSelector} from 'react-redux';
import ImagePath from '../../assests/ImagePath';
import Colors from '../../assests/Colors';


export default function Splash(props) {


    return (
               
                   <ImageBackground source={ImagePath.Splash} 
                   style={{flex:1, alignItems:'center', justifyContent:'center'}}>

                       <Image source={ImagePath.applogo} 
                       style={{height: normalise(60) , width:'60%'}}
                       resizeMode='contain' />

                        <Text style={{color:Colors.white, fontSize:normalise(10), 
                            position:'absolute', bottom:20}} >
                            COPYRIGHT © 2020 CHOONA
                        </Text>

                   </ImageBackground>
                 
        
    )
}