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
                
                <View style={{ alignItems:'center', justifyContent:'center'}}>
                    <Text>Home</Text>
                </View>

            </SafeAreaView>
        </View>
    )
}