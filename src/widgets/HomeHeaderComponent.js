import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import normalise from '../utils/helpers/Dimens';
import ImagePath from '../assests/ImagePath';
import PropTypes from 'prop-types';

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
        <View style={HeaderStyles.leftItem}>
          <TouchableOpacity
            style={HeaderStyles.leftItemInner}
            onPress={() => {
              onPressFirstItem();
            }}>
            <Image
              source={
                props.staticFirstImage
                  ? props.imageone
                  : { uri: props.imageone }
              }
              style={{
                height: props.imageoneheight,
                width: props.imageonewidth,
                borderRadius: props.borderRadius,
                marginTop: normalise(-11),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
      {/* Middle */}
      {!props.middleImageReq ? (
        <Text style={HeaderStyles.headerText}>{props.title}</Text>
      ) : (
        <Image
          style={HeaderStyles.logo}
          source={ImagePath.home_icon_choona}
          resizeMode={'contain'}
        />
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
              source={props.imagetwo}
              style={{
                height: props.imagetwoheight,
                width: props.imagetwowidth,
              }}
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
  imagetwo: PropTypes.string,
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
};
