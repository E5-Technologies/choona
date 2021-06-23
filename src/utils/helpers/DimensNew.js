import { PixelRatio, Dimensions } from 'react-native';

const scale = Dimensions.get('window').width / 375;

// eslint-disable-next-line no-undef
export default normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
