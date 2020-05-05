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


function ActivityListItem(props) {

    const [follow, setFollow] = useState(props.follow)


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
    
    return (

        <View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom, }}>

            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between'
            }}>

                <TouchableOpacity onPress={()=>{onPressImage()}}>
                    <Image source={props.image}
                        style={{ height: normalise(35), width: normalise(35), borderRadius: normalise(17) }}
                        resizeMode="contain" />
                </TouchableOpacity>

                 <Text style={{
                    color: Colors.white, fontSize: normalise(11), width: props.type ? '50%' : '70%',
                    fontWeight: 'bold',  textAlign:'left',
                }}>{props.title}</Text>
                   

            {props.type ?
                <TouchableOpacity
                    style={{height: normalise(25), width: normalise(80), borderRadius: normalise(12), alignSelf: 'center',
                        backgroundColor: follow?Colors.white:Colors.fadeblack,justifyContent: 'center', alignItems: 'center',
                    }} onPress={() => { onPress(), setFollow(!follow) }} >

                {follow ?        
                    <Text style={{ color: Colors.black, fontWeight: 'bold' }}>Follow</Text>:
                    <Text style={{ color: Colors.white, fontWeight: 'bold' }}>Following</Text>}
                </TouchableOpacity>

            :
            <TouchableOpacity>
            <Image source={props.image2} style={{height: normalise(35), width: normalise(35)}}
                resizeMode='contain' /> 
            </TouchableOpacity>}
            </View>


           {/* {props.bottom ? null : */}
            <View style={{
                marginTop: normalise(10), borderBottomWidth: normalise(1),
                borderBottomColor: Colors.grey
            }} />  
             {/* } */}


        </View>
    )
}

export default ActivityListItem;

ActivityListItem.propTypes = {
    image: PropTypes.string,
    image2: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    type: PropTypes.bool,
    follow: PropTypes.bool,
    marginBottom: PropTypes.number,
    onPressImage: PropTypes.bool
};

ActivityListItem.defaultProps = {
    image: "",
    image2: "",
    title: "",
    onPress: null,
    type: true,
    follow: true,
    marginBottom: 0,
    onPressImage: null
}