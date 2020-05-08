import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Modal,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from "prop-types";
import { normalizeUnits } from 'moment';


function HomeItemList(props) {

    const react = ["🔥", "🕺", "💃", "😳", "❤️"]
    const [plusVisible, setPlusVisible] = useState(false);
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
    const onPressCommentbox = () => {
        if (props.onPressCommentbox) {
            props.onPressCommentbox()
        }
    };


    const onPressReactionbox = () => {
        if (props.onPressReactionbox) {
            props.onPressReactionbox()
        }
    };


    const onPressMusicbox = () => {
        if (props.onPressMusicbox) {
            props.onPressMusicbox()
        }
    };




    const onPressReact1 = () => {
        if (props.onPressReact1) {
            props.onPressReact1()
        }
    };
    const onPressReact2 = () => {
        if (props.onPressReact2) {
            props.onPressReact2()
        }
    };
    const onPressReact3 = () => {
        if (props.onPressReact3) {
            props.onPressReact3()
        }
    };
    const onPressReact4 = () => {
        if (props.onPressReact4) {
            props.onPressReact4()
        }
    };
    const onPressReact5 = () => {

        if (props.onPressReact5) {
            props.onPressReact5()

            // if (plusVisible == true) {
            //     setPlusVisible(false)
            //   }
            //   else {
            //     setPlusVisible(true)
            //   }
        }

    };
    return (

        <View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom }}>

            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between',
            }}>


                <Image source={ImagePath.spotifyicon}
                    style={{ height: normalise(24), width: normalise(24) }}
                    resizeMode="contain" />



                <View style={{
                    flexDirection: 'column', alignItems: 'flex-start', width: '50%',
                    marginRight: normalise(60)
                }}>

                    <Text style={{
                        color: Colors.white, fontSize: normalise(11),
                       fontFamily: 'ProximaNova-Regular',
                       fontWeight:'600'
                    }} numberOfLines={1}> {props.title} </Text>

                    <Text style={{
                        color: Colors.grey, fontSize: normalise(10),
                        fontFamily: 'ProximaNova-Regular',
                        fontWeight: '500',
                    }} numberOfLines={1}> {props.singer} </Text>


                </View>





                <View style={{
                    height: normalise(40), width: normalise(50), backgroundColor: Colors.black,
                    justifyContent: 'center'
                }}>

                    <TouchableOpacity style={{
                        height: normalise(25), width: normalise(45),
                        borderRadius: normalise(5), alignSelf: 'center', backgroundColor: Colors.fadeblack,
                        justifyContent: 'center', alignItems: 'center'
                    }} onPress={() => { props.onPressSecondImage() }} >

                        <Image source={ImagePath.threedots} style={{ height: normalise(15), width: normalise(15) }}
                            resizeMode='contain' />

                    </TouchableOpacity>
                </View>
            </View>


            <TouchableOpacity onPress={() => { props.onPressMusicbox() }}
                style={{
                    height: normalise(250), width: normalise(280), alignSelf: 'center',
                    borderRadius: normalise(10), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                    borderColor: Colors.grey, shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}   >


                <Image source={props.image}
                    style={{ height: normalise(250), width: normalise(280), borderRadius: normalise(10) }}
                    resizeMode="cover" />

                <Image source={ImagePath.play}
                    style={{
                        height: normalise(60), width: normalise(60), position: 'absolute',
                        marginLeft: normalise(10), marginTop: normalise(11)
                    }} />




                <View style={{
                    position: 'absolute', marginBottom: normalise(10), alignSelf: 'center', marginHorizontal: normalise(10),
                    bottom: 0, height: normalise(50), width: '90%', justifyContent: 'space-between',
                    borderRadius: normalise(35), backgroundColor: Colors.white, opacity: 0.9,
                    borderWidth: normalise(0.5),
                    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                    borderColor: Colors.grey, paddingHorizontal: normalise(10)
                }}>
                    <TouchableOpacity
                        onPress={() => { props.onPressReact1() }}
                    >
                        <Text style={{ fontSize: 42, fontWeight: 'bold', position: 'relative' }}>{react[0]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center'
                        }}>
                            <Text>2</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { props.onPressReact2() }}
                    >
                        <Text style={{ fontSize: 42, fontWeight: 'bold' }}>{react[1]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center'
                        }}>
                            <Text>5</Text>
                        </View>
                    </TouchableOpacity >
                    <TouchableOpacity
                        onPress={() => { props.onPressReact3() }}
                    >
                        <Text style={{ fontSize: 42, fontWeight: 'bold' }}>{react[2]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center'
                        }}>
                            <Text>8</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { props.onPressReact4() }}
                    >
                        <Text style={{ fontSize: 43, fontWeight: 'bold' }}>{react[3]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center'
                        }}>
                            <Text>0</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { props.onPressReact5(props.modal1Visible) }}
                    >

                        {/* {plusVisible==true ? */}
                        <Image source={ImagePath.greyplus}
                            style={{
                                height: normalise(35), width: normalise(35),

                            }} resizeMode="contain" />
                        {/* :  <Image source={ImagePath.greycross}
                                style={{
                                    height: normalise(35), width: normalise(35),

                                }} resizeMode="contain" /> } */}

                    </TouchableOpacity>


                </View>
            </TouchableOpacity>

            
            <View style={{ height: normalise(90), width: normalise(280), marginTop: normalize(10), 
            alignSelf:'center'}}>
                
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', 
                }}>

                    <TouchableOpacity onPress={() => { onPressImage() }}>
                        <Image source={props.picture}
                            style={{ height: normalise(20), width: normalise(20) }}
                            resizeMode="contain" />
                    </TouchableOpacity>
                  
                       <Text style={{ alignSelf:"flex-start",
                            color: Colors.white, fontSize: normalise(12),
                            fontFamily: 'ProximaNova-Regular',
                            fontWeight: '600', marginRight:normalise(110)
                        }} numberOfLines={1}> {props.name} </Text>       

                    <Text style={{ color: Colors.grey_text,  alignSelf:"flex-start",
                        fontFamily: 'ProximaNova-Regular', fontWeight:'500'}}>
                        {props.time} mins ago
                     </Text>

                </View>

                <Text style={{
                    color: Colors.white, fontSize: normalise(10),
                    fontFamily: 'ProximaNova-Regular', fontWeight:'500', marginLeft: Platform.OS === 'android' ?
                     normalize(33): normalise(30), bottom: 4, width:'90%'
                }} >{props.content}</Text>

                <View style={{
                    height: normalise(30), flexDirection: 'row',
                    justifyContent: 'space-between', marginStart: Platform.OS === 'android' ?
                    normalize(33): normalise(30),
                    marginTop: normalise(10)
                }}>


                    <TouchableOpacity style={{
                        height: normalise(28), width: "48%", alignSelf: 'center',
                        borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                         flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }} onPress={() => { props.onPressCommentbox() }} >



                        <Text style={{
                         color: Colors.white, fontSize: normalise(9),
                            fontFamily:'ProximaNova-Bold', 
                        }}>{props.comments} COMMENTS</Text>

                    </TouchableOpacity>



                    <TouchableOpacity style={{
                        height: normalise(28), width: "48%", alignSelf: 'center',
                        borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                         flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }} onPress={() => { props.onPressReactionbox() }} >



                        <Text style={{
                            color: Colors.white, fontSize: normalise(9),
                            fontFamily:"ProximaNova-Bold"
                        }}>{props.reactions} REACTIONS</Text>

                    </TouchableOpacity>
                </View>
            </View>



        </View>

    )
}

export default HomeItemList;

HomeItemList.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    onPressImage: PropTypes.bool,
    singer: PropTypes.string,
    marginBottom: PropTypes.number,
    change: PropTypes.bool,
    image2: PropTypes.string,
    onPressSecondImage: PropTypes.func,
    onPressCommentbox: PropTypes.func,
    onPressReactionbox: PropTypes.func,

    onPressReact1: PropTypes.func,

    onPressReact2: PropTypes.func,
    onPressReact3: PropTypes.func,

    onPressReact4: PropTypes.func,
    onPressReact5: PropTypes.func

};

HomeItemList.defaultProps = {
    image: "",
    title: "",
    onPress: null,
    onPressImage: null,
    singer: "",
    marginBottom: 0,
    change: false,
    image2: "",
    onPressSecondImage: null
}