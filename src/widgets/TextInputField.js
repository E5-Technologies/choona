import React, { useState } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../utils/helpers/Dimens';
import Colors from '../assests/Colors';
import ImagePath from '../assests/ImagePath';

function TextInputField(props) {
  const [focused, setFocused] = useState(false);

  function onChangeText(text) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }

  return (
    <View
      style={[{
        marginBottom: normalize(16),
      }, props.mainStyle]}>
      {props.text &&
        <Text
          style={{
            fontSize: normalize(10),
            color: Colors.meta,
            fontFamily: 'ProximaNova-SemiBold',
          }}>
          {props.text}
        </Text>
      }

      <TextInput
        style={{
          width: props.width,
          marginTop: normalize(10),
          fontFamily: 'ProximaNova-Semibold',
          fontSize: normalize(14),
          backgroundColor: Colors.fadeblack,
          height: normalize(44),
          borderRadius: normalize(6),
          borderWidth: normalize(0.5),
          padding: normalize(5),
          paddingLeft: normalize(16),
          borderColor: !props.userNameAvailable
            ? Colors.red
            : focused
              ? Colors.white
              : Colors.fadeblack,
          color: Colors.meta,
        }}
        keyboardAppearance="dark"
        onFocus={() => {
          setFocused(true);
        }}
        autoCorrect={props.autocorrect}
        onBlur={() => setFocused(false)}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        keyboardType={props.isNumber ? 'phone-pad' : 'default'}
        autoCapitalize={props.autoCapitalize}
        value={props.value}
        placeholderTextColor={Colors.meta}
        secureTextEntry={props.isPassword}
        onChangeText={text => {
          onChangeText(text);
        }}
      />
      {props.tick_req && props.tick_visible ? (
        <Image
          source={
            ImagePath
              ? props.userNameAvailable
                ? ImagePath.green_tick
                : ImagePath.crossIcon
              : null
          }
          style={{
            position: 'absolute',
            height: normalize(20),
            width: normalize(20),
            top: normalize(35),
            right: normalize(10),
          }}
          resizeMode="contain"
        />
      ) : null}
    </View>
  );
}

export default TextInputField;

TextInputField.propTypes = {
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  autoCapitalize: PropTypes.string,
  isPassword: PropTypes.bool,
  value: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  onChangeText: PropTypes.func,
  marginTop: PropTypes.number,
  text: PropTypes.string,
  marginBottom: PropTypes.number,
  borderColor: PropTypes.string,
  tick_req: PropTypes.bool,
  tick_visible: PropTypes.bool,
  isNumber: PropTypes.bool,
  userNameAvailable: PropTypes.bool,
  width: PropTypes.string,
};

TextInputField.defaultProps = {
  placeholder: '',
  maxLength: 40,
  autoCapitalize: 'none',
  isPassword: false,
  autocorrect: false,
  // value: "",
  placeholderTextColor: Colors.grey,
  onChangeText: null,
  marginTop: normalize(12),
  text: '',
  marginBottom: normalize(0),
  width: '100%',
  borderColor: Colors.darkerblack,
  tick_req: false,
  tick_visible: false,
  isNumber: false,
  userNameAvailable: true,
};
