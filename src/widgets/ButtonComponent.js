import React from 'react';
import propTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

import normalize from '../utils/helpers/Dimens';
import Colors from '../assests/Colors';
import LinearGradient from 'react-native-linear-gradient';

export default function ButtonComponent(props) {
  const onPress = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity}
      onPress={() => {
        onPress();
      }}>
      <LinearGradient
        useAngle={true}
        angle={315}
        angleCenter={{ x: 0.5, y: 0.5 }}
        colors={['#9F00FF', '#03965B']}
        style={{
          marginTop: props.marginTop,
          width: props.width,
          marginBottom: props.marginBottom,
          backgroundColor: props.buttonColor,
          borderRadius: props.borderRadius,
          height: props.height,
          borderWidth: normalize(props.buttonBorderWidth),
          borderColor: props.buttonBorderColor,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: props.textcolor,
            textAlign: 'center',
            fontFamily: 'ProximaNova-Bold',
            fontSize: props.fontSize,
          }}>
          {props.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
ButtonComponent.propTypes = {
  backcolor: propTypes.string,
  textcolor: propTypes.string,
  marginTop: propTypes.number,
  width: propTypes.string,
  title: propTypes.string,
  onPress: propTypes.func,
  activeOpacity: propTypes.number,
  buttonColor: propTypes.string,
  buttonBorderColor: propTypes.string,
  buttonBorderWidth: propTypes.number,
  height: propTypes.number,
  fontSize: propTypes.number,
  marginBottom: propTypes.number,
  borderRadius: propTypes.number,
};

ButtonComponent.defaultProps = {
  textcolor: Colors.black,
  marginTop: normalize(20),
  title: '',
  onPress: null,
  activeOpacity: null,
  width: '100%',
  buttonColor: Colors.white,
  buttonBorderColor: '',
  buttonBorderWidth: 0,
  height: normalize(45),
  fontSize: normalize(15),
  marginBottom: normalize(0),
  borderRadius: normalize(25),
};
