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

export default function Contact(props) {
    return (
        <Fragment>
            <SafeAreaView style={{flex:1}}>
                
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text>Contact</Text>
                </View>

            </SafeAreaView>
        </Fragment>
    )
}