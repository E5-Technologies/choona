import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import normalise from '../utils/helpers/Dimens';
import PropTypes from 'prop-types';

import HeaderStyles from '../styles/header';
export const hitSlop = {top: 20, bottom: 20, left: 50, right: 50};

function HeaderComponent(props) {
  const [onDisable, setOnDisable] = useState(false);
  function onPressFirstItem() {
    if (props.onPressFirstItem) {
      props.onPressFirstItem();
    }
  }

  function onPressThirdItem() {
    if (props.onPressThirdItem) {
      setOnDisable(true);
      props.onPressThirdItem();
      setTimeout(() => {
        setOnDisable(false);
      }, 1000);
    }
  }

  return (
    <View
      style={[
        HeaderStyles.headerContainer,
        props.hideBorderBottom && {borderBottomWidth: 0},
      ]}>
      {/* Left */}
      {props.firstitemtext ? (
        <TouchableOpacity
          style={HeaderStyles.leftItem}
          onPress={() => {
            onPressFirstItem();
          }}
          hitSlop={hitSlop}>
          <Text style={HeaderStyles.headerItemText}>{props.textone}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          ref={props.imageOneRef ?? null}
          style={HeaderStyles.leftItem}
          onPress={() => {
            onPressFirstItem();
          }}
          hitSlop={hitSlop}>
          <Image
            source={props.imageone}
            style={[HeaderStyles.headerIcon, props.imageOneStyle]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      {/* Middle */}
      <Text style={HeaderStyles.headerText}>{props.title}</Text>
      {/* Right */}
      {props.thirditemtext ? (
        <TouchableOpacity
          disabled={onDisable}
          onPress={() => {
            onPressThirdItem();
          }}
          style={HeaderStyles.rightItem}
          hitSlop={hitSlop}>
          <Text style={HeaderStyles.headerItemText}>{props.texttwo}</Text>
        </TouchableOpacity>
      ) : props.imagetwo ? (
        <TouchableOpacity
          style={HeaderStyles.rightItem}
          onPress={() => {
            onPressThirdItem();
          }}
          hitSlop={hitSlop}>
          <Image
            source={props.imagetwo}
            style={[HeaderStyles.headerIcon, props.imagetwoStyle]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default HeaderComponent;

HeaderComponent.propTypes = {
  firstitemtext: PropTypes.bool,
  thirditemtext: PropTypes.bool,
  imageone: PropTypes.number,
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
  hideBorderBottom: PropTypes.bool,
};

HeaderComponent.defaultProps = {
  firstitemtext: true,
  thirditemtext: true,
  imageone: null,
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
  hideBorderBottom: false,
};
