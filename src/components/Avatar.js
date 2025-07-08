import React from 'react';
import {Image, View} from 'react-native';

import ImagePath from '../assests/ImagePath';
import normalise from '../utils/helpers/Dimens';

const Avatar = ({image, height, width, imageWrapper, imageStyle}) => {
  // const noImage =
  // image === 'https://api.choona.co/uploads/user/thumb/' || image === null;
  return (
    <View
      style={[
        {
          borderRadius: normalise(height / 2),
          height: normalise(height),
          overflow: 'hidden',
          width: normalise(width),
        },
        imageWrapper,
      ]}>
      {/* <Image
        source={!noImage ? { uri: image } : ImagePath.userPlaceholder}
        style={{
          height: normalise(height),
          width: normalise(width),
        }}
        resizeMode="contain"
      /> */}
      <Image
        source={image ? {uri: image} : ImagePath.userPlaceholder}
        style={[{
          height: normalise(height),
          width: normalise(width),
        }, imageStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

export default Avatar;
