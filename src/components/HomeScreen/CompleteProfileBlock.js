import React from 'react';
import { Image, StyleSheet, Text, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';

const CompleteProfileBlock = ({ navigation, setIsShown }) => {
  return (
    <Pressable
      onPress={() => {
        setIsShown(true);
        navigation.navigate('EditProfile');
      }}
      style={styles.completeProfileBlockContainer}>
      <LinearGradient
        colors={['#09784D', '#297283', '#9F00FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.completeProfileBlockBorder}
      />
      <Text style={styles.completeProfileBlockText}>
        <Text style={styles.completeProfileBlockTextBold}>Nearly there...</Text>{' '}
        Complete your profile and reserve your username, so your friends can
        find you on Choona!
      </Text>
      <Image
        source={ImagePath.chevron}
        style={styles.completeProfileBlockChevron}
      />
    </Pressable>
  );
};

export default CompleteProfileBlock;

const styles = StyleSheet.create({
  completeProfileBlockContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    minHeight: normalise(45),
    position: 'absolute',
    right: 0,
    paddingHorizontal: normalise(12),
    paddingVertical: normalise(8),
    zIndex: 20,
  },
  completeProfileBlockBorder: {
    backgroundColor: 'red',
    height: normalise(2),
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  completeProfileBlockText: {
    fontFamily: 'ProximaNova-Regular',
  },
  completeProfileBlockTextBold: {
    fontFamily: 'ProximaNova-Bold',
  },
  completeProfileBlockChevron: {
    height: normalise(19),
    width: normalise(10),
  },
});
