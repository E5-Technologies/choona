import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from 'prop-types';

import HomeListItemHeader from '../../HomeScreen/HomeListItem/HomeListItemHeader';
import HomeListItemFooter from '../../HomeScreen/HomeListItem/HomeListItemFooter';

function HomeItemList(props) {
  const [numberOfLines, setNumberOfLines] = useState(3);
  const [viewMore, setViewMore] = useState(false);

  const onPressImage = () => {
    if (props.onPressImage) {
      props.onPressImage();
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

  const onReactionPress = reaction => {
    if (props.onReactionPress) {
      props.onReactionPress(reaction);
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
        alignSelf: 'center',
        borderBottomColor: Colors.activityBorderColor,
        borderBottomWidth: normalise(0.5),
        marginBottom: normalise(8),
        paddingBottom: normalise(16),
      }}>
      <HomeListItemHeader
        onPressMusicbox={onPressMusicbox}
        play={props.play}
        postType={props.postType}
        singer={props.singer}
        songUri={props.songUri}
        title={props.title}
      />
      <TouchableOpacity
        onPress={() => {
          props.navi.navigation.navigate('Player', {
            comments: [],
            song_title: props.playingSongRef.song_name,
            album_name: props.playingSongRef.album_name,
            song_pic: props.playingSongRef.song_pic,
            username: props.playingSongRef.username,
            profile_pic: props.playingSongRef.profile_pic,
            uri: props.playingSongRef.uri,
            reactions: props.playingSongRef.reactionData,
            id: props.playingSongRef.id,
            artist: props.playingSongRef.artist,
            changePlayer: props.playingSongRef.changePlayer,
            originalUri: props.playingSongRef.originalUri,
            isrc: props.playingSongRef.isrc,
            registerType: props.playingSongRef.regType,
            details: props.playingSongRef.details,
            showPlaylist: props.playingSongRef.showPlaylist,
            comingFromMessage: props.playingSongRef.comingFromMessage,
          });
        }}>
        <Image
          source={
            props.image === '' ? ImagePath.profiletrack1 : { uri: props.image }
          }
          style={{
            aspectRatio: 1,
            width: '100%',
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <HomeListItemFooter
        commentCount={props.comment_count}
        numberOfLines={numberOfLines}
        onPressCommentbox={onPressCommentbox}
        onPressImage={onPressImage}
        onPressMenu={onPressSecondImage}
        onPressReactionbox={onPressReactionbox}
        onReactionPress={onReactionPress}
        parts={parts}
        postText={props.content}
        postTime={props.time}
        reactionCount={props.reaction_count}
        reactions={props.reactions}
        setNumberOfLines={setNumberOfLines}
        setViewMore={setViewMore}
        userAvatar={props.picture}
        userName={props.name}
        viewMore={viewMore}
      />
    </View>
  );
}

export default HomeItemList;

HomeItemList.propTypes = {
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
};
