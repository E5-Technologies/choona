








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


function CommentList(props) {


    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
    }

    const onPressImage = () => {
        if (props.onPressImage) {
            props.onPressImage()
        }
    };

    const onPressSecondImage = () => {
        if (props.onPressSecondImage) {
            props.onPressSecondImage()
        }
    };

    return (

        <View style={{ width: props.width, alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom}}>

            <View style={{
                flexDirection: 'row',

            }}>

                <TouchableOpacity onPress={() => { onPressImage() }}  >
                    <Image source={props.image}
                        style={{ height: normalise(30), width: normalise(30), borderRadius: normalise(15) }}
                        resizeMode="contain" />


                </TouchableOpacity>
                <View style={{ marginLeft: normalise(6), }}>
                    <View style={{
                        flexDirection: 'row',
                        width: '77%',
                        justifyContent: 'space-between'
                    }}>

                        <Text style={{
                            color: Colors.white,
                            fontSize: 14,
                            fontFamily: 'ProximaNova-Semibold',
                        }}>
                            {props.name}
                        </Text>
                        <Text style={{
                            color: Colors.grey_text,
                            fontSize: 12,
                            fontFamily: 'ProximaNovaAW07-Medium',
                        }}>
                            {props.time} mins ago</Text>
                    </View>
                    <View style={{width: '77%'}}>
                        <Text style={{
                            color: Colors.white,
                            fontSize: 12,
                            marginTop: normalise(2),
                            fontFamily: 'ProximaNovaAW07-Medium'
                        }}>
                            {props.comment}</Text>
                    </View>
                </View>

            </View>

            <View style={{
                marginTop: normalise(20), borderBottomWidth: 0.5,
                borderBottomColor: Colors.activityBorderColor
            }} />

        </View>

    )
}

export default CommentList;

CommentList.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    onPressImage: PropTypes.bool,
    singer: PropTypes.string,
    marginBottom: PropTypes.number,
    change: PropTypes.bool,
    image2: PropTypes.string,
    onPressSecondImage: PropTypes.func,
    comments: PropTypes.bool,
    width: PropTypes.string
};
CommentList.defaultProps = {
    image: "",
    title: "",
    onPress: null,
    onPressImage: null,
    singer: "",
    marginBottom: 0,
    change: false,
    image2: "",
    onPressSecondImage: null,
    comments: false,
    width: '90%'
}