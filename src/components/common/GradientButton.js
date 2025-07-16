// components/GradientButton.tsx

import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';

export const GradientButton = ({
  title,
  onPress,
  height = 56,
  width,
  containerStyle,
  textStyle,
  gradientColors = ['#09784D', '#297283', '#9F00FF'], // adjust to your green-purple gradient
  showRightIcon = true,
  leftIconName,
  rightIconStyle,
  leftIconStyle,
}) => {
  const deviceWidth = Dimensions.get('window').width;
  const buttonWidth = width ?? deviceWidth * 0.85;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0.9, y: -5}}
        end={{x: 1.2, y: 3}}
        locations={[0, 0.5, 0.7, 1]}
        style={[
          styles.button,
          {height: height, width: buttonWidth},
          containerStyle,
        ]}>
        {leftIconName && (
          <Image
            source={ImagePath.addButton}
            style={[styles.imageStyle, leftIconStyle]}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.text, textStyle]}>{title}</Text>
        {showRightIcon && (
          <Image
            source={ImagePath.backicon}
            style={[styles.imageStyle, rightIconStyle]}
            resizeMode="contain"
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  text: {
    color: 'white',
    fontSize: normalise(12),
    textAlign: 'center',
    flex: 1,
    fontWeight: '600',
    fontFamily: 'ProximaNova-Bold',
  },
  imageStyle: {
    width: 25,
    height: 25,
  },
});

export default GradientButton;
