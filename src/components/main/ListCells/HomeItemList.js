import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,Modal,
    Text,
    StatusBar,
    TouchableOpacity,
    Image
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from "prop-types";
import { normalizeUnits } from 'moment';


function HomeItemList(props) {

    const react = ["🔥", "🕺", "💃", "😳", "❤️"]
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
    const    onPressCommentbox= () => {
        if (props.onPressCommentbox) {
            props.onPressCommentbox()
        }
    };


    const    onPressReactionbox= () => {
        if (props.onPressReactionbox) {
            props.onPressReactionbox()
        }
    };

  
    const   onPressMusicbox= () => {
        if (props.onPressMusicbox) {
            props.onPressMusicbox()
        }
    };

    return (

        <View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom }}>

            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between'
            }}>


       <Image source={ImagePath.spotifyicon} 
                          style={{ height: normalise(24), width: normalise(24) }}
                          resizeMode="contain" />
             


                <View style={{
                    flexDirection: 'column', alignItems: 'flex-start', width: '50%',
                    marginRight: normalise(30)
                }}>

                    <Text style={{
                        color: Colors.white, fontSize: normalise(11),
                        fontWeight: 'bold',
                    }} numberOfLines={1}> {props.title} </Text>

                    <Text style={{
                        color: Colors.grey, fontSize: normalise(10),
                        fontWeight: 'bold',
                    }}  numberOfLines={1}> {props.singer} </Text>

     
                </View>
         



    
                <View style={{height:normalise(40), width:normalise(50), backgroundColor:Colors.black,
                justifyContent:'center'}}>
                    
                    <TouchableOpacity style={{height: normalise(25), width: normalise(45), 
                    borderRadius: normalise(5), alignSelf: 'center',backgroundColor: Colors.fadeblack,
                     justifyContent: 'center',alignItems: 'center'}} onPress={() => { props.onPressSecondImage()}} >

                        <Image source={ImagePath.threedots} style={{ height: normalise(15), width: normalise(15) }}
                            resizeMode='contain' />

                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => { props.onPressMusicbox()}}
            style={{
                     height: normalise(250), width: normalise(280), alignSelf: 'center',
                    borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                    borderColor: Colors.grey, shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}   >

                
                   <Image source={props.image}
                    style={{    height: normalise(250), width: normalise(280),borderRadius: normalise(25)}}
                    resizeMode="cover" />

                    <Image source={ImagePath.play} 
                    style={{height:normalise(60), width:normalise(60), position:'absolute',
                    marginLeft:normalise(10), marginTop:normalise(11)}} />




<View style={{
                        position: 'absolute', marginBottom: normalise(30), alignSelf: 'center', marginHorizontal: normalise(15),
                        bottom: 0, height: normalise(60), width: '85%', justifyContent: 'space-between',
                        borderRadius: normalise(35), backgroundColor: Colors.white, borderWidth: normalise(0.5),
                        shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                        shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                        borderColor: Colors.grey, paddingHorizontal: normalise(10)
                    }}>
                        <TouchableOpacity 
                        // onPress={() => {
                        //     hitreact(react[0])
                        // }}
                        >
                            <Text style={{ fontSize: 42 }}>{react[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        // onPress={() => {
                        //     hitreact(react[1])
                        // }}
                        >
                            <Text style={{ fontSize: 42 }}>{react[1]}</Text>
                        </TouchableOpacity >
                        <TouchableOpacity 
                        // onPress={() => {
                        //     hitreact(react[2])
                        // }}
                        >
                            <Text style={{ fontSize: 42 }}>{react[2]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        // onPress={() => {
                        //     hitreact(react[3])
                        // }}
                        >
                            <Text style={{ fontSize: 43 }}>{react[3]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        // onPress={() => {
                        //     hitreact1()
                        // }}
                        >
                       
                        
                                <Image source={ImagePath.greyplus}
                                style={{
                                    height: normalise(35), width: normalise(35),

                                }} resizeMode="contain" /> 
                     
                        </TouchableOpacity>


                    </View>
                </TouchableOpacity>

          <View style={{ height: normalise(90), width: normalise(250),marginLeft:normalize(15),marginTop:normalize(20) }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between'
              }}>


               <TouchableOpacity onPress={() => { onPressImage() }}>
                    <Image source={props.picture}
                        style={{ height: normalise(25), width: normalise(25) }}
                        resizeMode="contain" />

                      
                </TouchableOpacity>


                <View style={{
                    flexDirection: 'column', alignItems: 'flex-start', width: '50%',
                    marginRight: normalise(30)
                }}>

                    <Text style={{
                        color: Colors.white, fontSize: normalise(13),
                        fontWeight: 'bold',
                    }} numberOfLines={1}> {props.name} </Text>

                   


     
                </View>
         


    
       
                    
                  

                     <Text style={{   color: Colors.white,}}>
                     {props.time} mins ago
                     </Text>
                  
              
            </View>

<Text style={{
                          color: Colors.white, fontSize: normalise(11),
                        fontWeight: 'bold',marginLeft:normalize(25),
                    }}  numberOfLines={1}> {props.content} </Text>

                    <View  style={{height:normalise(30),flexDirection:'row',
                    justifyContent:'space-between',marginLeft:normalise(20),marginTop:normalise(10)}}>


                    <TouchableOpacity style={{
                     height: normalise(30), width:normalise(110), alignSelf: 'center',
                    borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                     shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}   onPress={() => { props.onPressCommentbox()}} >

                  

                    <Text style={{
                        marginLeft: normalise(10), color: Colors.white, fontSize: normalise(10),
                        fontWeight: 'bold'
                    }}>{props.comments} COMMENTS</Text>

                </TouchableOpacity>



                <TouchableOpacity style={{
                     height: normalise(30), width:normalise(110), alignSelf: 'center',
                    borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}   onPress={() => { props.onPressReactionbox()}} >

                  

                    <Text style={{
                        marginLeft: normalise(10), color: Colors.white, fontSize: normalise(10),
                        fontWeight: 'bold'
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
    onPressCommentbox:PropTypes.func,
    onPressReactionbox:PropTypes.func,
    onPressMusicbox:PropTypes.func,
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