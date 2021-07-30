import { Platform, StyleSheet } from 'react-native';

import Colors from '../assests/Colors';
import normalise from '../utils/helpers/Dimens';

const HeaderStyles = StyleSheet.create({
  backIcon: {
    height: normalise(16),
    marginTop: normalise(-8),
    width: normalise(16),
  },
  headerContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.darkerblack,
    borderBottomColor: Colors.fadeblack,
    borderBottomWidth: normalise(1),
    flexDirection: 'row',
    height: normalise(44),
    justifyContent: 'center',
    marginBottom: normalise(0),
    marginTop: Platform.OS === 'android' ? normalise(0) : normalise(0),
    position: 'relative',
    width: '100%',
  },

  headerContainerComments: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.darkerblack,
    borderBottomColor: Colors.fadeblack,
    borderBottomWidth: normalise(1),
    flexDirection: 'row',
    height: normalise(44),
    justifyContent: 'center',
    marginBottom: normalise(0),
    // marginTop: Platform.OS === 'android' ? normalise(20) : normalise(20),
    position: 'relative',
    width: '100%',
  },

  headerIcon: {
    height: normalise(20),
    width: normalise(20),
  },
  headerItemText: {
    color: Colors.white,
    fontSize: normalise(11),
    fontFamily: 'ProximaNova-Bold',
  },
  headerText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalise(15),
    textTransform: 'capitalize',
  },
  leftItem: {
    left: normalise(16),
    position: 'absolute',
  },
  leftItemInner: {
    left: normalise(0),
    position: 'absolute',
  },
  logo: {
    width: normalise(85),
  },
  messageAvatars: {
    flexDirection: 'row',
    left: normalise(26),
    marginTop: normalise(-12),
  },
  messageText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalise(15),
    marginStart: normalise(10),
    marginTop: normalise(4),
  },
  rightItem: {
    position: 'absolute',
    right: normalise(16),
  },
  rightItemIcon: {},
  rightItemNotification: {
    backgroundColor: Colors.red,
    height: 10,
    width: 10,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    right: -5,
  },
});

export default HeaderStyles;

// HeaderStyles.defaultProps = {
//   firstitemtext: true,
//   thirditemtext: true,
//   imageone: '',
//   imagetwo: '',
//   textone: '',
//   texttwo: '',
//   title: '',
//   onPressFirstItem: null,
//   onPressThirdItem: null,
//   imageoneheight: normalise(15),
//   imageonewidth: normalise(15),
//   borderRadius: normalise(7.5),
//   imagesecondheight: normalise(30),
//   imagesecondwidth: normalise(30),
//   imagetwoheight: normalise(15),
//   imagetwowidth: normalise(15),
//   middleImageReq: false,
//   marginTop: normalise(15),
//   height: normalise(44),
//   staticFirstImage: true,
//   notRead: false,
// };
