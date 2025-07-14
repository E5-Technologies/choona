import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

export default function HeaderMenu({menuVisible, setMenuVisible, optionList}) {
  const handleOption = option => {
    setMenuVisible();
    option?.pressEvent();
  };

  return (
    <>
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={setMenuVisible}
        style={{marginTop: 50}}>
        <Pressable style={styles.overlay} onPress={setMenuVisible}>
          <View style={styles.menuContainer}>
            {optionList.map(item => {
              return (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleOption(item)}>
                  <Image source={item?.icon} style={styles.iconStyle} />
                  {/* <Text style={styles.menuText}>{item?.name}</Text> */}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 120,
    right: 16,
    width: 55,
    backgroundColor: '#222',
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
