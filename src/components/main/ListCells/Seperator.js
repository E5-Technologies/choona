import React from 'react';
import { View } from 'react-native';

import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';

const Seperator = () => {
  return (
    <View
      style={{
        height: normalise(0.5),
        backgroundColor: Colors.activityBorderColor,
        marginLeft: normalise(16),
        marginRight: normalise(16),
      }}
    />
  );
};

export default Seperator;
