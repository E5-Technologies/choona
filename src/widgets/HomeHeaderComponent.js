import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import normalise from '../utils/helpers/Dimens';
import ImagePath from '../assests/ImagePath';
import PropTypes from 'prop-types';

import Avatar from '../components/Avatar';
import HeaderStyles from '../styles/header';

function HomeHeaderComponent(props) {
  function onPressFirstItem() {
    if (props.onPressFirstItem) {
      props.onPressFirstItem();
    }
  }

  function onPressThirdItem() {
    if (props.onPressThirdItem) {
      props.onPressThirdItem();
    }
  }

  function onPressLogo() {
    if (props.pressLogo) {
      props.pressLogo();
    }
  }

  return (
    <View style={HeaderStyles.headerContainer}>
      {/* Left */}
      {props.firstitemtext ? (
        <TouchableOpacity
          style={HeaderStyles.leftItem}
          onPress={() => {
            onPressFirstItem();
          }}>
          <Text style={HeaderStyles.headerItemText}>{props.textone}</Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            left: normalise(8),
            position: 'absolute',
            top: normalise(1),
          }}>
          <TouchableOpacity
            style={[
              {
                left: normalise(0),
                position: 'absolute',
                height: normalise(42),
                width: normalise(42),
                top: normalise(0),
                paddingTop: normalise(8),
                paddingLeft: normalise(8),
              },
              props.imageOneWrapperStyle,
            ]}
            onPress={() => {
              onPressFirstItem();
            }}>
            <Image
              resizeMode="contain"
              source={props && props.imageone ? props.imageone : null}
              style={[
                {
                  height: props.imageoneheight,
                  width: props.imageonewidth,
                },
                props.imageOneStyle,
              ]}
            />

            {/* <Avatar image={props.imageone} height={22} width={22} imageStyle={props.imageOneStyle}/> */}
          </TouchableOpacity>
        </View>
      )}
      {/* Middle */}
      {!props.middleImageReq ? (
        <View stye={{flexDriction: 'row'}}>
          <Image
            style={{width: 60, height: 60}}
            source={ImagePath.choonaLogo}
            resizeMode={'contain'}
          />
          <Text style={HeaderStyles.headerText}>{props.title}</Text>
        </View>
      ) : props.onIconPress ? (
        <TouchableOpacity
          onPress={() => {
            onPressLogo();
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <View
            style={{
              borderRadius: 15,
              overflow: 'hidden',
              width: 50,
              height: 50,
              marginRight: normalise(7),
            }}> */}
          {/* <Image
            style={{
              width: 50,
              height: 50,
              marginRight: normalise(7),
            }}
            source={ImagePath.choonaLogo1}
            resizeMode="cover"
          /> */}
          {/* </View> */}
          <Image
            style={HeaderStyles.logo}
            source={ImagePath ? ImagePath.home_icon_choona : null}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      ) : (
        <View stye={{flexDriction: 'row'}}>
          {/* <Image
            style={{width: 60, height: 60}}
            source={ImagePath.choonaLogo}
            resizeMode={'contain'}
          /> */}
          <Image
            style={HeaderStyles.logo}
            source={ImagePath ? ImagePath.home_icon_choona : null}
            resizeMode={'contain'}
          />
        </View>
      )}
      {/* Right */}
      <TouchableOpacity
        style={HeaderStyles.rightItem}
        onPress={() => {
          onPressThirdItem();
        }}>
        {props.thirditemtext ? (
          <Text style={HeaderStyles.headerItemText}>{props.texttwo}</Text>
        ) : (
          <>
            <Image
              source={props && props.imagetwo ? props.imagetwo : null}
              style={[
                {
                  height: props.imagetwoheight,
                  width: props.imagetwowidth,
                },
                props.imageTwoStyle,
              ]}
              resizeMode="contain"
            />
            {props.notRead ? (
              <View style={HeaderStyles.rightItemNotification} />
            ) : null}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default HomeHeaderComponent;

HomeHeaderComponent.propTypes = {
  firstitemtext: PropTypes.bool,
  thirditemtext: PropTypes.bool,
  imageone: PropTypes.string,
  imagetwo: PropTypes.number,
  textone: PropTypes.string,
  texttwo: PropTypes.string,
  title: PropTypes.string,
  onPressFirstItem: PropTypes.func,
  onPressThirdItem: PropTypes.func,
  imageoneheight: PropTypes.number,
  imageonewidth: PropTypes.number,
  imagetwoheight: PropTypes.number,
  imagetwowidth: PropTypes.number,
  middleImageReq: PropTypes.bool,
  marginTop: PropTypes.number,
  height: PropTypes.number,
  borderRadius: PropTypes.number,
  staticFirstImage: PropTypes.bool,
  read: PropTypes.bool,
  onIconPress: PropTypes.bool,
  pressLogo: PropTypes.func,
  imageoneheight: PropTypes.string,
};
HomeHeaderComponent.defaultProps = {
  firstitemtext: true,
  thirditemtext: true,
  imageone: '',
  imagetwo: '',
  textone: '',
  texttwo: '',
  title: '',
  onPressFirstItem: null,
  onPressThirdItem: null,
  imageoneheight: normalise(15),
  imageonewidth: normalise(15),
  borderRadius: normalise(7.5),
  imagesecondheight: normalise(30),
  imagesecondwidth: normalise(30),
  imagetwoheight: normalise(15),
  imagetwowidth: normalise(15),
  middleImageReq: false,
  marginTop: normalise(15),
  height: normalise(35),
  staticFirstImage: true,
  notRead: false,
  onIconPress: false,
  pressLogo: null,
};
