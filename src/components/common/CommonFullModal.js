import React, {memo} from 'react';
import {Modal, SafeAreaView, StyleSheet, View} from 'react-native';

export const CommonFullScreenModal = ({
  visible,
  onClose = () => null,
  onConfirm = () => null,
  onCancel = () => null,
  confirmText = 'OK',
  cancelText = 'Cancel',
  children,
  containerStyle,
  contentStyle,
  ...rest
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      style={{flex: 1}}
      transparent
      {...rest}>
      <SafeAreaView style={[styles.container, containerStyle]}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#808080',
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default memo(CommonFullScreenModal);
