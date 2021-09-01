import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normaliseNew from '../../../utils/helpers/DimensNew';
import Hyperlink from 'react-native-hyperlink';

function CommentList(props) {
  const onPressImage = () => {
    if (props.onPressImage) {
      props.onPressImage();
    }
  };

  let delimiter = /\s+/;

  //split string
  let _text = props.comment;
  let token,
    index,
    parts = [];
  while (_text) {
    delimiter.lastIndex = 0;
    token = delimiter.exec(_text);
    if (token === null) {
      break;
    }
    index = token.index;
    if (token[0].length === 0) {
      index = 1;
    }
    parts.push(_text.substr(0, index));
    parts.push(token[0]);
    index = index + token[0].length;
    _text = _text.slice(index);
  }
  parts.push(_text);

  //highlight hashtags
  parts = parts.map(text => {
    if (/^@/.test(text)) {
      return (
        <Text
          key={text}
          style={{ color: '#3DB2EB' }}
          onPress={() => {
            props.navi.navigation.navigate('OthersProfile', {
              id: text.substr(1, text.length - 1),
            });
          }}>
          {text}
        </Text>
      );
    } else {
      return text;
    }
  });
  return (
    <View
      style={[
        styles.commentContainer,
        {
          borderBottomWidth: props.showLine ? 1 : null,
          borderBottomColor: props.showLine ? '#25262A' : null,
        },
      ]}>
      <TouchableOpacity
        style={styles.commentAvatarButton}
        onPress={() => {
          onPressImage();
        }}>
        <Image
          source={
            props.image
              ? props.image === ''
                ? ImagePath.userPlaceholder
                : { uri: props.image }
              : ImagePath.userPlaceholder
          }
          style={styles.commentAvatar}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.commentInfoContainer}>
        <View style={[styles.commentInfo, { marginBottom: '1%' }]}>
          <TouchableOpacity
            onPress={() => {
              onPressImage();
            }}>
            <Text style={styles.commentUsername}>{props.name}</Text>
          </TouchableOpacity>
          <Text style={styles.commentTime}>{props.time}</Text>
        </View>

        <Hyperlink
          linkDefault={true}
          linkStyle={{
            color: '#ffffff',
            textDecorationLine: 'underline',
            textDecorationStyle: 'dotted',
            fontWeight: 'bold',
          }}>
          <Text style={[styles.commentText, { paddingRight: '8%' }]}>
            {parts}
          </Text>
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
    paddingTop: normaliseNew(16),
    paddingBottom: normaliseNew(18),
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
    textTransform: 'lowercase',
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
  showLine: PropTypes.bool,
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
  showLine: false,
};
