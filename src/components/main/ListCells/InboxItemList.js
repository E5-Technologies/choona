import React, { useEffect, Fragment, useState } from 'react';
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
import PropTypes from "prop-types";


function InboxListItem(props) {



    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
    };

    const onPressImage = () => {
        if (props.onPressImage) {
            props.onPressImage()
        }
    };


    return (

        <TouchableOpacity style={{
            width: '90%',
            height: normalise(45),
            alignSelf: 'center',
            marginTop: normalise(10),
            marginBottom: props.marginBottom,
        }} onPress={() => { onPress() }}  >

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>

                <TouchableOpacity onPress={() => { onPressImage() }}>
                    <Image source={{ uri: props.image }}
                        style={{
                            height: normalise(35),
                            width: normalise(35),
                            borderRadius: normalise(17),
                        }}
                        resizeMode="contain" />
                </TouchableOpacity>


                <View style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '75%',
                    justifyContent: 'flex-start'
                }}>
                    <TouchableOpacity onPress={() => { onPressImage() }}>
                        <Text style={{
                            color: Colors.white, fontSize: normalise(11),
                            fontFamily: 'ProximaNova-Bold',
                        }} numberOfLines={1}>{props.title}</Text>
                    </TouchableOpacity>
                    
                    <Text style={{
                        marginTop: normalise(2),
                        color: props.read ? Colors.grey : Colors.white, fontSize: normalise(10),
                        fontFamily: 'ProximaNovaAW07-Medium'
                    }} numberOfLines={2} >{props.description}</Text>

                </View>

                <View style={{
                    height: normalise(12), width: normalise(12), borderRadius: normalise(6),
                    backgroundColor: props.read ? Colors.black : Colors.red
                }} />

            </View>


            {/* {props.bottom ? null : */}
            <View style={{
                height: 0.5,
                backgroundColor: Colors.activityBorderColor,
                marginTop: normalise(10),
            }} />
            {/* } */}


        </TouchableOpacity>
    )
}

export default InboxListItem;

InboxListItem.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    marginBottom: PropTypes.number,
    description: PropTypes.string,
    read: PropTypes.bool,
    onPressImage: PropTypes.func

};

InboxListItem.defaultProps = {
    image: "",
    title: "",
    onPress: null,
    marginBottom: 0,
    description: "",
    read: false,
    onPressImage: null

}