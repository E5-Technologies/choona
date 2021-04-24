import React,{useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import normalise from '../utils/helpers/Dimens';
import PropTypes from 'prop-types';

import HeaderStyles from '../styles/header';


function HeaderComponent(props) {
  const [onDisable,setOnDisable] = useState(false)
  function onPressFirstItem() {
    if (props.onPressFirstItem) {
      props.onPressFirstItem();
    }
  }

  function onPressThirdItem() {
    if (props.onPressThirdItem) {
      setOnDisable(true)
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
              source={props.imageone}
              style={HeaderStyles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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
          style={HeaderStyles.rightItem}>
          <Text style={HeaderStyles.headerItemText}>{props.texttwo}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={HeaderStyles.rightItem}
          onPress={() => {
            onPressThirdItem();
          }}>
          <Image
            source={props.imagetwo}
            style={HeaderStyles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default HeaderComponent;

HeaderComponent.propTypes = {
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

HeaderComponent.defaultProps = {
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