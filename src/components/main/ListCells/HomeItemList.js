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
import constants from '../../../utils/helpers/constants';
import moment from "moment";


function HomeItemList(props) {

    const react = ["🔥", "🕺", "💃", "😳", "❤️"]
    const [plusVisible, setPlusVisible] = useState(false);
    const [numberOfLines, setNumberOfLines] = useState(3);
    const [viewMore, setViewMore] = useState(false);

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


    const onAddReaction = () => {

        if (props.onAddReaction) {
            props.onAddReaction()

            // if (plusVisible == true) {
            //     setPlusVisible(false)
            //   }
            //   else {
            //     setPlusVisible(true)
            //   }
        }

    };

    return (

        <View style={{
            width: normalise(285),
            alignSelf: 'center',
            marginTop: normalise(15),
            marginBottom: props.marginBottom
        }}>

            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between'
            }}>

                <View style={{ flexDirection: 'row' }}>

                    <Image source={props.postType ? ImagePath.spotifyicon : ImagePath.apple_icon_round}
                        style={{
                            height: normalise(24),
                            width: normalise(24),
                            borderRadius: normalise(12)
                        }}
                        resizeMode="contain" />



                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginStart: normalise(5),
                        width: normalise(200)
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(11),
                            fontFamily: 'ProximaNova-Semibold',
                        }} numberOfLines={1}> {props.title} </Text>

                        <Text style={{
                            color: Colors.grey, fontSize: normalise(10),
                            fontFamily: 'ProximaNovaAW07-Medium',
                        }} numberOfLines={1}> {props.singer} </Text>


                    </View>

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


                <Image source={props.image === "" ? ImagePath.profiletrack1 : { uri: props.postType ? props.image : props.image.replace("100x100bb.jpg", "300x300bb.jpg") }}
                    style={{ height: normalise(250), width: normalise(280), borderRadius: normalise(10) }}
                    resizeMode="cover" />

                <Image source={ImagePath.play}
                    style={{
                        height: normalise(60), width: normalise(60), position: 'absolute',
                        marginLeft: normalise(10), marginTop: normalise(11)
                    }} />

                <View style={{
                    position: 'absolute',
                    marginBottom: normalise(10),
                    alignSelf: 'center',
                    marginHorizontal: normalise(10),
                    bottom: 0,
                    height: normalise(50),
                    justifyContent: 'space-between',
                    borderRadius: normalise(35),
                    backgroundColor: Colors.white,
                    opacity: 0.9,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                    paddingHorizontal: normalise(10)
                }}>

                    <TouchableOpacity
                        onPress={() => { onAddReaction() }}>


                        <Image source={props.modalVisible ? ImagePath.greycross : ImagePath.greyplus}
                            style={{
                                height: normalise(35), width: normalise(35),

                            }} resizeMode="contain" />
                    </TouchableOpacity>


                </View>
            </TouchableOpacity>


            <View style={{

                width: normalise(280), marginTop: normalize(10),
                alignSelf: 'center',
            }}>

                <View style={{
                    flexDirection: 'row', alignItems: 'flex-start',
                    justifyContent: 'space-between', width: '100%',
                }}>

                    <TouchableOpacity style={{ width: '9%' }}
                        onPress={() => { onPressImage() }}>
                        <Image source={props.picture === "" ? ImagePath.dp1 : { uri: constants.profile_picture_base_url + props.picture }}
                            style={{
                                height: normalise(20), width: normalise(20),
                                borderRadius: normalise(20)
                            }}
                            resizeMode="contain" />
                    </TouchableOpacity>


                    <View style={{
                        width: '91%', flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: 14,
                            fontFamily: 'ProximaNova-Semibold',

                        }} numberOfLines={1}>{props.name}</Text>

                        <Text style={{
                            color: Colors.grey_text,
                            fontFamily: 'ProximaNovaAW07-Medium', fontSize: 12,
                        }}>{moment(props.time).fromNow()} </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={numberOfLines}
                    style={{
                        color: Colors.white, fontSize: 12,
                        fontFamily: 'ProximaNovaAW07-Medium', bottom: 6,
                        width: '90.8%',
                        alignSelf: 'flex-end', textAlign: 'left',
                    }}>{props.content}</Text>

                {props.content.length > 150 ? <TouchableOpacity onPress={() => {
                    !viewMore ? setNumberOfLines(10) : setNumberOfLines(3),
                        setViewMore(!viewMore)
                }}>
                    <Text
                        style={{
                            color: Colors.white, fontSize: 12,
                            fontFamily: 'ProximaNovaAW07-Medium', bottom: 6,
                            width: '90.8%',
                            alignSelf: 'flex-end', textAlign: 'left',
                        }}>{!viewMore ? `...View More` : `View Less`}</Text>
                </TouchableOpacity> : null}

                <View style={{
                    height: normalise(30), flexDirection: 'row',
                    justifyContent: 'space-between', marginStart: Platform.OS === 'android' ?
                        normalize(25) : normalise(24),
                    marginTop: normalise(5)
                }}>


                    <TouchableOpacity style={{
                        height: normalise(28), width: "48%", alignSelf: 'center',
                        borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }} onPress={() => { onPressCommentbox() }} >



                        <Text style={{
                            color: Colors.white, fontSize: 10,
                            fontFamily: 'ProximaNova-Bold',
                        }}>{props.comments > 0 ? props.comments > 1 ? `${props.comments}  COMMENTS` : `${props.comments}  COMMENT` : `COMMENT`}</Text>

                    </TouchableOpacity>



                    <TouchableOpacity style={{
                        height: normalise(28), width: "48%", alignSelf: 'center',
                        borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }} onPress={() => { onPressReactionbox() }} >



                        <Text style={{
                            color: Colors.white, fontSize: 10,
                            fontFamily: "ProximaNova-Bold"
                        }}>{props.reactions > 1 ? `${props.reactions} REACTIONS` : `${props.reactions} REACTION`}</Text>

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
    onAddReaction: PropTypes.func,
    modalVisible: PropTypes.bool,

    postType: PropTypes.bool

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
    onPressSecondImage: null,
    modalVisible: false,
    postType: true
}