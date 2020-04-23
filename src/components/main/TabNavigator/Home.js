import React, { useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';

export default function Home(props) {
    return (
        <View style={{flex:1,  backgroundColor:Colors.black}}>
            <SafeAreaView style={{flex:1}}>
                
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:Colors.white}}>Home</Text>

                    <TouchableOpacity onPress={()=>{props.navigation.navigate("Profile")}}>
                    <Text style={{marginTop:normalise(20),color:Colors.white}}>Go to Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{props.navigation.navigate("OthersProfile")}}>
                    <Text style={{marginTop:normalise(20),color:Colors.white}}>Go to Others Profile</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    )
}