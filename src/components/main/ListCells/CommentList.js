import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';

// import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normaliseNew from '../../../utils/helpers/DimensNew';
import Hyperlink from 'react-native-hyperlink'


const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

function CommentList(props) {
  const onPressImage = () => {
    if (props.onPressImage) {
      props.onPressImage();
    }
  };

  return (
    <View style={styles.commentContainer}>
      <TouchableOpacity
        style={styles.commentAvatarButton}
        onPress={() => {
          onPressImage();
        }}>
        <Image
          source={props.image === '' ? ImagePath.dp1 : { uri: props.image }}
          style={styles.commentAvatar}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.commentInfoContainer}>
        <View style={styles.commentInfo}>
          <TouchableOpacity
            onPress={() => {
              onPressImage();
            }}>
            <Text style={styles.commentUsername}>{props.name}</Text>
          </TouchableOpacity>
          <Text style={styles.commentTime}>{props.time}</Text>
        </View>
        {/* {
         pattern.test(props.comment)? <Text style={[styles.commentText,{color:'#007ACC'}]} onPress={()=>{ props.comment.substring(0,3)==='Www'||props.comment.substring(0,3)==='www'?Linking.openURL('https://'+props.comment) :Linking.openURL(props.comment)}}>{props.comment}</Text>:
         <Text style={styles.commentText}>{props.comment}</Text>
        } */}
          <Hyperlink linkDefault={ true }>

        <Text  style={styles.commentText}>{props.comment}</Text>
        </Hyperlink>
      </View>
    </View>
  );
}

export default CommentList;

const styles = StyleSheet.create({
  commentContainer: {
    // borderBottomWidth: normaliseNew(0.5),
    // borderColor: Colors.activityBorderColor,
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: normaliseNew(16),
    paddingVertical: normaliseNew(16),
  },
  commentInfoContainer: {
    flex: 1,
  },
  commentAvatarButton: {
    marginRight: normaliseNew(8),
    width: normaliseNew(26),
  },
  commentAvatar: {
    borderRadius: normaliseNew(13),
    height: normaliseNew(26),
    width: normaliseNew(26),
  },
  commentInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentUsername: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normaliseNew(13),
  },
  commentTime: {
    color: Colors.grey_text,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normaliseNew(12),
  },
  commentText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normaliseNew(12),
    lineHeight: normaliseNew(15),
    textAlign: 'left',
  },
});

CommentList.propTypes = {
  image: PropTypes.string,
  onPress: PropTypes.func,
  onPressImage: PropTypes.bool,
  singer: PropTypes.string,
  change: PropTypes.bool,
  image2: PropTypes.string,
  onPressSecondImage: PropTypes.func,
  comments: PropTypes.bool,
};
CommentList.defaultProps = {
  image: '',
  onPress: null,
  onPressImage: null,
  singer: '',
  change: false,
  image2: '',
  onPressSecondImage: null,
  comments: false,
};