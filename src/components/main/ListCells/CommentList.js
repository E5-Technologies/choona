import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from 'prop-types';

function CommentList(props) {
  const onPressImage = () => {
    if (props.onPressImage) {
      props.onPressImage();
    }
  };

  return (
    <View
      style={{
        width: props.width,
        alignSelf: 'center',
        marginTop: normalise(16),
        marginBottom: normalise(16),
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={{ width: '13%' }}>
          <TouchableOpacity
            onPress={() => {
              onPressImage();
            }}>
            <Image
              source={props.image === '' ? ImagePath.dp1 : { uri: props.image }}
              style={{
                height: normalise(30),
                width: normalise(30),
                borderRadius: normalise(15),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '87%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              onPressImage();
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'ProximaNova-Semibold',
              }}>
              {props.name}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: Colors.grey_text,
              fontSize: 12,
              fontFamily: 'ProximaNovaAW07-Medium',
            }}>
            {props.time}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: Colors.white,
          fontSize: 12,
          marginTop: normalise(-15),
          alignSelf: 'flex-end',
          width: '86.6%',
          textAlign: 'left',
          fontFamily: 'ProximaNova-Regular',
        }}>
        {props.comment}
      </Text>
    </View>
  );
}

export default CommentList;

CommentList.propTypes = {
  image: PropTypes.string,
  onPress: PropTypes.func,
  onPressImage: PropTypes.bool,
  singer: PropTypes.string,
  marginBottom: PropTypes.number,
  change: PropTypes.bool,
  image2: PropTypes.string,
  onPressSecondImage: PropTypes.func,
  comments: PropTypes.bool,
  width: PropTypes.string,
};
CommentList.defaultProps = {
  image: '',
  onPress: null,
  onPressImage: null,
  singer: '',
  marginBottom: 0,
  change: false,
  image2: '',
  onPressSecondImage: null,
  comments: false,
  width: '90%',
};
