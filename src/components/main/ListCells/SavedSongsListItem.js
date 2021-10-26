// import React, { useEffect, Fragment, useState } from 'react';
// import {
//     SafeAreaView,
//     StyleSheet,
//     ScrollView,
//     View,
//     Text,
//     StatusBar,
//     TouchableOpacity,
//     Image
// } from 'react-native';
// import normalise from '../../../utils/helpers/Dimens';
// import Colors from '../../../assests/Colors';
// import ImagePath from '../../../assests/ImagePath';
// import PropTypes from "prop-types";

// function SavedSongListItem(props) {

//     const onPress = () => {
//         if (props.onPress) {
//             props.onPress()
//         }
//     }

//     const onPressImage = () => {
//         if (props.onPressImage) {
//             props.onPressImage()
//         }
//     };

//     const onPressSecondImage = () => {
//         if (props.onPressSecondImage) {
//             props.onPressSecondImage()
//         }
//     };

//     return (

//         <View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom }}>

//             <View style={{
//                 flexDirection: 'row', alignItems: 'center',
//                 justifyContent: 'space-between'
//             }}>

//                 <TouchableOpacity onPress={() => { onPressImage() }}>
//                     <Image source={props.image}
//                         style={{ height: normalise(40), width: normalise(40) }}
//                         resizeMode="contain" />

//                         <Image source={ImagePath.play}
//                         style={{height:normalise(20), width:normalise(20), position:'absolute',
//                         marginLeft:normalise(10), marginTop:normalise(11)}} />
//                 </TouchableOpacity>

//                 <View style={{
//                     flexDirection: 'column', alignItems: 'flex-start', width: '50%',
//                     marginRight: normalise(30)
//                 }}>

//                     <Text style={{
//                         color: Colors.white, fontSize: normalise(11),
//                         fontWeight: 'bold',
//                     }} numberOfLines={1}> {props.title} </Text>

//                     <Text style={{
//                         color: Colors.grey, fontSize: normalise(10),
//                         fontWeight: 'bold',
//                     }}  numberOfLines={1}> {props.singer} </Text>

//          <Text style={{
//                         color: Colors.grey, fontSize: normalise(10),
//                         fontWeight: 'bold',
//                     }}  numberOfLines={1}> {props.comments} comments </Text>
//                 </View>

//     {props.change ?

//                 <TouchableOpacity onPress={()=>{onPressSecondImage()}}>
//                     <Image source={props.image2} style={{height:normalise(25), width:normalise(25)}} />
//                 </TouchableOpacity>

//                  :<View style={{height:normalise(40), width:normalise(45), backgroundColor:Colors.black,
//                 justifyContent:'center'}}>

//                     <TouchableOpacity style={{height: normalise(25), width: normalise(45),
//                     borderRadius: normalise(5), alignSelf: 'center',backgroundColor: Colors.fadeblack,
//                      justifyContent: 'center',alignItems: 'center'}} onPress={() => { onPress() }} >

//                         <Image source={ImagePath.threedots} style={{ height: normalise(15), width: normalise(15) }}
//                             resizeMode='contain' />

//                     </TouchableOpacity>
//                 </View>}
//             </View>

//             <View style={{
//                 marginTop: normalise(10), borderBottomWidth: normalise(1),
//                 borderBottomColor: Colors.grey
//             }} />

//         </View>

//     )
// }

// export default SavedSongListItem;

// SavedSongListItem.propTypes = {
//     image: PropTypes.string,
//     title: PropTypes.string,
//     onPress: PropTypes.func,
//     onPressImage: PropTypes.bool,
//     singer: PropTypes.string,
//     marginBottom: PropTypes.number,
//     change: PropTypes.bool,
//     image2: PropTypes.string,
//     onPressSecondImage: PropTypes.func
// };

// SavedSongListItem.defaultProps = {
//     image: "",
//     title: "",
//     onPress: null,
//     onPressImage: null,
//     singer: "",
//     marginBottom: 0,
//     change: false,
//     image2: "",
//     onPressSecondImage: null
// }

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from 'prop-types';

function SavedSongListItem(props) {
  const onPress = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  const onPressImage = () => {
    if (props.onPressImage) {
      props.onPressImage();
    }
  };

  const onPressSecondImage = () => {
    if (props.onPressSecondImage) {
      props.onPressSecondImage();
    }
  };

  const onPressItem = () => {
    if (props.onPressItem) {
      props.onPressItem();
    }
  };

  // console.log(props.receiver_id + ',' + props.read + ',' + props.user_id);

  return (
    <TouchableOpacity
      onPress={() => {
        onPressItem();
      }}
      activeOpacity={1}
      style={{
        width: '90%',
        alignSelf: 'center',
        marginBottom: normalise(12),
        marginTop: normalise(12),
        // marginBottom: props.marginBottom,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              marginRight: normalise(8),
            }}
            onPress={() => {
              onPressImage();
            }}>
            <Image
              source={
                props.image === ''
                  ? ImagePath.profiletrack4
                  : { uri: props.image }
              }
              style={{
                height: normalise(40),
                width: normalise(40),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '66%',
              // marginRight: props.marginRight,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: normalise(12),
                fontFamily: 'ProximaNova-Semibold',
              }}
              numberOfLines={1}>
              {' '}
              {props.title}{' '}
            </Text>

            <Text
              style={{
                color: Colors.grey,
                fontSize: normalise(11),
                fontFamily: 'ProximaNova-Regular',
              }}
              numberOfLines={1}>
              {' '}
              {props.singer}{' '}
            </Text>

            {props.comments ? (
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: normalise(10),
                  fontFamily: 'ProximaNovaAW07-Medium',
                }}
                numberOfLines={1}>
                {' '}
                {props.comments}{' '}
              </Text>
            ) : null}
          </View>
        </View>

        {props.change ? (
          <TouchableOpacity
            style={{
              height: normalise(25),
              width: normalise(25),
            }}
            onPress={() => {
              onPressSecondImage();
            }}>
            <Image
              source={props.image2}
              style={{
                height: normalise(25),
                width: normalise(25),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : props.change2 ? (
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                onPressImage();
              }}>
              <Image
                source={ImagePath.playOutline}
                style={{
                  height: normalise(25),
                  width: normalise(25),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: normalise(25),
                width: normalise(25),
                marginLeft: normalise(8),
              }}
              onPress={() => {
                onPressSecondImage();
              }}>
              <Image
                source={props.image2}
                style={{
                  height: normalise(25),
                  width: normalise(25),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
            }}>
            {props.playIcon !== false && (
              <TouchableOpacity
                onPress={() => {
                  onPressImage();
                }}>
                <Image
                  source={ImagePath.playOutline}
                  style={{
                    height: normalise(23),
                    width: normalise(23),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginLeft: normalise(16),
              }}
              onPress={() => onPress()}>
              <Image
                style={{
                  transform: [{ rotate: '90deg' }],
                  width: normalise(14),
                }}
                source={ImagePath.threedots}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                height: normalise(25),
                width: normalise(45),
                borderRadius: normalise(5),
                alignSelf: 'center',
                backgroundColor: Colors.fadeblack,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                onPress();
              }}>
              <Image
                source={ImagePath.threedots}
                style={{ height: normalise(15), width: normalise(15) }}
                resizeMode="contain"
              />
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default SavedSongListItem;

SavedSongListItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  onPressImage: PropTypes.any,
  singer: PropTypes.string,
  marginBottom: PropTypes.number,
  change: PropTypes.bool,
  image2: PropTypes.any,
  playIcon: PropTypes.bool,
  receiver_id: PropTypes.any,
  user_id: PropTypes.any,

  read: PropTypes.bool,
  onPressSecondImage: PropTypes.func,
  comments: PropTypes.bool,
  marginRight: PropTypes.number,
  onPressItem: PropTypes.func,
};

SavedSongListItem.defaultProps = {
  image: '',
  receiver_id: '',
  user_id: '',

  read: false,
  title: '',
  onPress: null,
  onPressImage: null,
  singer: '',
  marginBottom: 0,
  change: false,
  image2: '',
  onPressSecondImage: null,
  comments: false,
  marginRight: normalise(30),
  onPressItem: null,
  playIcon: true,
};
