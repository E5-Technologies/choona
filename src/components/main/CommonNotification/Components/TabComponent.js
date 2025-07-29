import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../../../assests/Colors';
import ImagePath from '../../../../assests/ImagePath';
import normalise from '../../../../utils/helpers/Dimens';

export const TabComponent = ({activeTab, setActiveTab = () => {}}) => {
  const tabItem = [
    {
      key: 'inbox',
      title: 'INBOX',
      isActive: activeTab === 0,
      onPress: () => setActiveTab(0),
    },
    {
      key: 'notification',
      title: 'NOTIFICATION',
      isActive: activeTab === 1,
      onPress: () => setActiveTab(1),
    },
  ];

  return (
    <View style={styles.tabBarWrapperStyle}>
      {tabItem.map((item, index) => (
        <TouchableOpacity
          key={item.key}
          style={styles.tabBarButtonStyle}
          onPress={item.onPress}>
          <Text
            style={[
              styles.tabBarTextStyle,
              {
                color: item.isActive ? Colors.white : Colors.grey_text,
              },
            ]}>
            {item.title}
          </Text>
          {item.isActive && (
            <Image
              source={ImagePath.gradient_border_horizontal}
              style={styles.ActiveTabBar}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  tabBarWrapperStyle: {
    backgroundColor: Colors.darkerblack,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: normalise(40),
    marginHorizontal: normalise(50),
    // borderBottomColor: Colors.fadeblack,
    // borderBottomWidth: 1,
  },
  tabBarButtonStyle: {
    width: '50%',
    height: normalise(40),
    alignItems: 'center',
    justifyContent: 'center',
    // borderRightWidth: normalise(1),
    // borderRightColor: Colors.darkerblack,
  },
  tabBarTextStyle: {
    fontSize: normalise(10),
    textTransform: 'uppercase',
    fontFamily: 'ProximaNova-Bold',
  },
  ActiveTabBar: {
    width: '100%',
    height: normalise(3),
    position: 'absolute',
    bottom: 0,
  },
});
