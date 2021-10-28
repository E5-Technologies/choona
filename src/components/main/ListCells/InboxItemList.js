import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from 'prop-types';

function InboxListItem(props) {
  const onPress = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  const onPressDelete = () => {
    if (props.onPressImage) {
      props.onPressDelete();
    }
  };

  return (
    <TouchableOpacity
      style={{
        // alignSelf: 'center',
        marginTop: normalise(10),
        marginBottom: normalise(10),
        marginHorizontal: normalise(16),
      }}
      onPress={() => {
        onPress();
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // backgroundColor: 'blue',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={
              props.image.endsWith('thumb/')
                ? ImagePath.userPlaceholder
                : { uri: props.image }
            }
            style={{
              height: normalise(30),
              width: normalise(30),
              borderRadius: 2 * normalise(60),
            }}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '70%',
              alignSelf: 'center',
              marginHorizontal: normalise(10),
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: normalise(11),
                fontFamily: 'ProximaNova-Bold',
              }}
              numberOfLines={1}>
              {props.title}
            </Text>
            <Text
              style={{
                marginTop: normalise(2),
                color: props.read ? Colors.darkgrey : Colors.white,
                fontSize: normalise(10),
                fontFamily: 'ProximaNova-Regular',
              }}
              numberOfLines={2}>
              {props.description}
            </Text>
          </View>
        </View>
        {!props.read && (
          <View
            style={{
              height: normalise(10),
              width: normalise(10),
              borderRadius: normalise(5),
              alignSelf: 'center',
              backgroundColor: Colors.red,
            }}
          />
        )}
        {/* <TouchableOpacity
          style={{
            height: normalise(25),
            width: normalise(45),
            borderRadius: normalise(5),
            alignSelf: 'center',
            backgroundColor: Colors.fadeblack,
            marginHorizontal: normalise(5),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            onPressDelete();
          }}>
          <Image
            source={ImagePath.threedots}
            style={{ height: normalise(15), width: normalise(15) }}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
}

export default InboxListItem;

InboxListItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  marginBottom: PropTypes.number,
  description: PropTypes.string,
  read: PropTypes.bool,
  onPressImage: PropTypes.func,
  onPressDelete: PropTypes.func,
};

InboxListItem.defaultProps = {
  image: '',
  title: '',
  onPress: null,
  marginBottom: 0,
  description: '',
  read: false,
  onPressImage: null,
  onPressDelete: null,
};
