import React, {memo} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import normalise from '../../utils/helpers/Dimens';

export const SimpleAlert = ({
  title = '',
  cancelTitle = "No, Don't",
  confirmTitle = 'Yes, Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  children,
  style,
  buttonLeftStyle,
  buttonRightStyle,
  gradientButton = true,
  buttonContainerStyle,
  showBar = true,
}) => {
  return (
    <View style={[styles.contentContainer, style]}>
      {showBar && <View style={styles.barStyle}></View>}
      <Text style={styles.alertText}>{title}</Text>

      {children}

      <View style={[styles.buttonContainer, buttonContainerStyle]}>
        <TouchableOpacity
          style={[styles.cancelButton, buttonLeftStyle]}
          onPress={() => {
            onCancel?.();
          }}>
          <Text style={styles.cancelButtonText}>{cancelTitle}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, buttonRightStyle]}
          onPress={() => {
            onConfirm?.();
          }}>
          <Text style={styles.cancelButtonText}>{confirmTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(SimpleAlert);

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: normalise(20),
    paddingVertical: normalise(30),
    backgroundColor: '#000',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    fontSize: normalise(18, 0.3),
    fontFamily: 'ProximaNova-Bold',
    lineHeight: normalise(21),
    textAlign: 'center',
    marginBottom: normalise(30),
    color: '#fff',
  },
  buttonContainer: {
    marginBottom: normalise(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    // backgroundColor: "#fff",
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: normalise(8),
    height: normalise(50),
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: normalise(8),
    height: normalise(50),
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: normalise(15, 0.3),
    fontFamily: 'ProximaNova-Bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: normalise(15, 0.3),
    fontFamily: 'ProximaNova-Bold',
  },
  barStyle: {
    width: normalise(50),
    height: normalise(5),
    borderRadius: normalise(12),
    backgroundColor: '#fff',
    marginBottom: normalise(18),
  },
});
