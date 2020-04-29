import React, { useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import StatusBar from '../../../utils/MyStatusBar';


export default function Search(props) {
    return (
        <Fragment>

        <StatusBar />

            <SafeAreaView style={{flex:1, backgroundColor:Colors.black}}>
                
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color: Colors.white}}>Search</Text>
                </View>

            </SafeAreaView>
        </Fragment>
    )
}