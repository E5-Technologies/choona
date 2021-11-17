import React from 'react';
import { Image, View } from 'react-native';

import ImagePath from '../assests/ImagePath';
import normalise from '../utils/helpers/Dimens';

const Avatar = ({ image, height, width }) => {
  return (
    <View
      style={{
        borderRadius: normalise(height),
        height: normalise(height),
        overflow: 'hidden',
        width: normalise(width),
      }}>
      <Image
        source={image ? { uri: image } : ImagePath.userPlaceholder}
        style={{
          height: normalise(height),
          width: normalise(width),
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Avatar;
