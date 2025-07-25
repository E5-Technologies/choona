import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from 'prop-types';

import HomeListItemHeader from '../../HomeScreen/HomeListItem/HomeListItemHeader';
import HomeListItemFooter from '../../HomeScreen/HomeListItem/HomeListItemFooter';

function HomeItemList(props) {
  const [numberOfLines, setNumberOfLines] = useState(3);
  const [viewMore, setViewMore] = useState(false);
  const {width, height} = useWindowDimensions();

  const onPressImage = () => {
    if (props.onPressImage) {
      props.onPressImage();
    }
  };

  const onPlaylistImagePress = songIndex => {
    if (props.onPlaylistImagePress) {
      props.onPlaylistImagePress(songIndex);
    }
  };

  const onPressSecondImage = () => {
    if (props.onPressSecondImage) {
      props.onPressSecondImage();
    }
  };
  const onPressCommentbox = () => {
    if (props.onPressCommentbox) {
      props.onPressCommentbox();
    }
  };

  const onPressReactionbox = () => {
    if (props.onPressReactionbox) {
      props.onPressReactionbox();
    }
  };

  const onPressMusicbox = () => {
    if (props.onPressMusicbox) {
      props.onPressMusicbox();
    }
  };

  let delimiter = /\s+/;

  //split string
  let _text = props.content;
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
          style={{color: '#3DB2EB'}}
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
      style={{
        backgroundColor: Colors.darkerblack,
        alignSelf: 'center',
        paddingBottom: normalise(16),
      }}>
      <HomeListItemHeader
        // onPressMusicbox={onPressMusicbox}
        // play={props.play}
        // postType={props.postType}
        // singer={props.singer}
        // songUri={props.songUri}
        // title={props.title}
        onPressMenu={onPressSecondImage}
        onPressImage={onPressImage}
        userAvatar={props.picture}
        userName={props.name}
        postTime={props.time}
      />
      {props?.image?.length > 1 ? (
        <View
          style={[
            styles.combienBanerWrapper,
            {
              width: '100%',
              aspectRatio: 1,
            },
          ]}>
          {props.image?.slice(0, 4)?.map((item, index) => {
            return (
              // <TouchableOpacity
              //   style={styles.bannerImageStyle}
              //   onPress={() => onPlaylistImagePress(index)}>
              <View style={styles.bannerImageStyle} key={index}>
                <Image
                  source={{uri: item?.song_image}}
                  style={{flex: 1, aspectRatio: 1}}
                  // style={styles.bannerImageStyle}
                  resizeMode="cover"
                />
              </View>
              // </TouchableOpacity>
            );
          })}
          {props.image?.length > 4 && (
            <View style={styles.moreTextWrapper}>
              <Text style={styles.moreText}>+{props.image?.length - 4}</Text>
            </View>
          )}
        </View>
      ) : (
        <Image
          source={
            ImagePath
              ? props.image === ''
                ? ImagePath.profiletrack1
                : {uri: props.image[0].song_image}
              : null
          }
          style={{
            aspectRatio: 1,
            width: '100%',
          }}
          resizeMode="cover"
        />
      )}

      <HomeListItemFooter
        commentCount={props.comment_count}
        numberOfLines={numberOfLines}
        onPressCommentbox={onPressCommentbox}
        onPressImage={onPressImage}
        onPressMenu={onPressSecondImage}
        onPressReactionbox={onPressReactionbox}
        onReactionPress={props.onReactionPress}
        parts={parts}
        myReactions={props.myReactions}
        myReactionsPending={props.myReactionsPending}
        postText={props.content}
        postTime={props.time}
        reactionCount={props.reaction_count}
        reactions={props.reactions}
        setNumberOfLines={setNumberOfLines}
        setViewMore={setViewMore}
        userAvatar={props.picture}
        userName={props.name}
        viewMore={viewMore}
        relatedId={props.id}
        //new
        onPressMusicbox={onPressMusicbox}
        play={props.play}
        postType={props.postType}
        singer={props.singer}
        songUri={props.songUri}
        title={props.title}
      />
    </View>
  );
}

export default HomeItemList;

HomeItemList.propTypes = {
  id: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  onPressImage: PropTypes.any,
  singer: PropTypes.string,
  marginBottom: PropTypes.number,
  change: PropTypes.bool,
  image2: PropTypes.string,
  onPressSecondImage: PropTypes.func,
  onPressCommentbox: PropTypes.func,
  onPressReactionbox: PropTypes.func,
  onPressReact1: PropTypes.func,
  onPressReact2: PropTypes.func,
  onPressReact3: PropTypes.func,
  onPressReact4: PropTypes.func,
  onAddReaction: PropTypes.func,
  modalVisible: PropTypes.bool,
  play: PropTypes.bool,
  postType: PropTypes.bool,
  myReactions: PropTypes.object,
  myReactionsPending: PropTypes.object,
};

HomeItemList.defaultProps = {
  image: '',
  title: '',
  onPress: null,
  onPressImage: null,
  singer: '',
  marginBottom: 0,
  change: false,
  image2: '',
  onPressSecondImage: null,
  modalVisible: false,
  postType: true,
  play: false,
  myReactions: {},
};

const styles = StyleSheet.create({
  combienBanerWrapper: {
    flexDirection: 'row',
    // backgroundColor: 'green',
    // flexWrap: 'wrap',
    // backgroundColor: Colors.fadeblack,
    // marginBottom: normalise(10),
    // overflow: 'hidden',

    width: '100%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bannerImageStyle: {
    // width: '50%',
    // height: '50%',

    width: '50%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: Colors.darkerblack, // adjust color as needed
    overflow: 'hidden',
  },
  moreTextWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  moreText: {
    color: Colors.black,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(12),
  },
});
