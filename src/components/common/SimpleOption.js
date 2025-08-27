import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../../assests/Colors';
import normalise from '../../utils/helpers/Dimens';

export const SimpleOption = ({actionIcon, title, mainStyle, pressEvent}) => {
  return (
    <TouchableOpacity
      style={[styles.modalButton, mainStyle]}
      onPress={() => pressEvent()}>
      <Image
        source={actionIcon ?? null}
        style={styles.modalButtonIcon}
        resizeMode="contain"
      />
      <Text style={styles.modalButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: Colors.darkerblack,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: normalise(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: normalise(18),
  },
  modalButtonIcon: {
    height: normalise(18),
    width: normalise(18),
  },
  modalButtonText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(13),
    marginLeft: normalise(15),
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: Colors.fadeblack,
    borderRadius: 6,
    height: normalise(40),
    justifyContent: 'center',
    marginBottom: normalise(20),
    marginTop: normalise(24),
    opacity: 10,
  },
  cancelButtonText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalise(12),
    textTransform: 'uppercase',
  },
});
