import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import normalise from '../utils/helpers/Dimens';

import ImagePath from '../assests/ImagePath';
import PropTypes from 'prop-types';

import HeaderStyles from '../styles/header';
import Colors from '../assests/Colors';

function InsideMessegeHeader(props) {
  function onPressFirstItem() {
    if (props.onPressFirstItem) {
      props.onPressFirstItem();
    }
  }

  return (
    <View
      style={[
        HeaderStyles.headerContainer,
        {
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
      ]}>
      {props.firstitemtext ? (
        <TouchableOpacity
          style={HeaderStyles.leftItem}
          onPress={() => {
            onPressFirstItem();
          }}>
          <Text style={HeaderStyles.headerItemText}>{props.textone}</Text>
        </TouchableOpacity>
      ) : (
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{left: normalise(16)}}
            onPress={() => {
              onPressFirstItem();
            }}>
            <Image
              source={ImagePath.backicon}
              style={HeaderStyles.headerIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={HeaderStyles.messageAvatars}
            onPress={() => {
              onPressFirstItem();
            }}>
            <Image
              source={{uri: props.imageone}}
              style={{
                // borderWidth: normalise(1),
                borderColor: Colors.darkerblack,
                borderRadius: normalise(70),
                height: normalise(25),
                width: normalise(25),
              }}
              resizeMode="contain"
            />
            <Image
              source={{uri: props.imagesecond}}
              style={{
                // borderWidth: normalise(1),
                borderColor: Colors.darkerblack,
                height: normalise(25),
                width: normalise(25),
                marginLeft: normalise(-5),
                borderRadius: normalise(70),
              }}
              resizeMode="contain"
            />
            <View style={{flex: 1, marginRight: normalise(65)}}>
              <Text style={HeaderStyles.messageText} numberOfLines={1}>
                {props.title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default InsideMessegeHeader;

InsideMessegeHeader.propTypes = {
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
};

InsideMessegeHeader.defaultProps = {
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
  imagesecondheight: normalise(30),
  imagesecondwidth: normalise(30),
  imagetwoheight: normalise(15),
  imagetwowidth: normalise(15),
};
