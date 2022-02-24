import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import Colors from '../../../assests/Colors';
import constants from '../../../utils/helpers/constants';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';

import HomeListItemReactions from './HomeListItemReactions';
import Avatar from '../../../components/Avatar';
import { ReactionButtonThumbsUp } from '../../Reactions/Buttons/Buttons';
import ReactionButtonBar from '../../Reactions/ButtonBar/ButtonBar';

const HomeListItemFooter = ({
  commentCount,
  numberOfLines,
  onPressCommentbox,
  onPressImage,
  onPressMenu,
  onPressReactionbox,
  onReactionPress,
  parts,
  postText,
  postTime,
  reactionCount,
  reactions,
  setNumberOfLines,
  setViewMore,
  userAvatar,
  userName,
  viewMore,
  myReactions,
}) => {
  const [actualNumLines, setActualNumLines] = useState(0);
  const onTextLayout = useCallback(
    e => {
      if (actualNumLines == 0) {
        setActualNumLines(e.nativeEvent.lines.length);
      }
    },
    [actualNumLines],
  );

  return (
    <View style={styles.listItemFooterContainer}>
      <View style={styles.listItemFooterTop}>
        <View style={styles.listItemFooterInfo}>
          <TouchableOpacity
            onPress={() => {
              onPressImage();
            }}
            style={styles.listItemFooterAvatar}>
            <Avatar
              image={constants.profile_picture_base_url + userAvatar}
              height={26}
              width={26}
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => onPressImage()}>
              <Text numberOfLines={1} style={styles.listItemFooterName}>
                {userName}
              </Text>
            </TouchableOpacity>
            <Text style={styles.listItemFooterDate}>
              {moment(postTime).fromNow()}
            </Text>
          </View>
        </View>
        <View style={styles.listItemFooterActions}>
          <TouchableOpacity
            style={styles.listItemFooterButton}
            onPress={() => onPressReactionbox()}>
            <Image
              style={
                (styles.listItemFooterButtonIcon,
                {
                  height: normalise(18),
                  width: normalise(18),
                })
              }
              source={ImagePath ? ImagePath.reactionShow : null}
              resizeMode="contain"
            />
            <Text style={styles.listItemFooterButtonText}>{reactionCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItemFooterButton}
            onPress={() => onPressCommentbox()}>
            <Image
              style={styles.listItemFooterButtonIcon}
              source={ImagePath ? ImagePath.comment_grey : null}
              resizeMode="contain"
            />
            <Text style={styles.listItemFooterButtonText}>{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItemFooterButton}
            onPress={() => onPressMenu()}>
            <Image
              style={styles.listItemFooterActionsButton}
              source={ImagePath ? ImagePath.threedots : null}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {postText.length > 0 ? (
          <Text
            numberOfLines={
              actualNumLines == 0 ? null : viewMore ? actualNumLines : 3
            }
            style={styles.listItemFooterText}
            onTextLayout={onTextLayout}>
            {parts}
          </Text>
        ) : (
          <View />
        )}
        {actualNumLines > 3 ? (
          <TouchableOpacity
            onPress={() => {
              !viewMore ? setNumberOfLines(10) : setNumberOfLines(3),
                setViewMore(!viewMore);
            }}>
            <Text style={styles.listItemFooterMoreButton}>
              {!viewMore ? 'View More' : 'View Less'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.listItemFooterReactions}>
        {/* <HomeListItemReactions
          onReactionPress={onReactionPress}
          reactions={reactions}
        /> */}
        <ReactionButtonBar
          myReactions={myReactions}
          onReactPressed={onReactionPress}
        />
      </View>
    </View>
  );
};

export default HomeListItemFooter;

const styles = StyleSheet.create({
  listItemFooterContainer: {
    paddingTop: normalise(10),
    paddingHorizontal: normalise(12),
    backgroundColor: Colors.darkerblack,
    borderBottomColor: Colors.activityBorderColor,
    borderBottomWidth: normalise(0.5),
    paddingBottom: normalise(16),
  },
  listItemFooterTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalise(4),
  },
  listItemFooterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemFooterAvatar: {
    marginRight: normalise(6),
  },
  listItemFooterName: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: 14,
    textTransform: 'lowercase',
    top: normalise(-2),
  },
  listItemFooterDate: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: 11,
    top: normalise(-2),
  },
  listItemFooterText: {
    alignSelf: 'flex-start',
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(10),
    textAlign: 'left',
  },
  listItemFooterMoreButton: {
    color: Colors.white,
    fontFamily: 'ProximaNovaAW07-Medium',
    fontSize: 12,
    marginTop: normalise(4),
    textAlign: 'left',
  },
  listItemFooterActions: {
    flexDirection: 'row',
    top: normalise(-2),
  },
  listItemFooterButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: normalise(16),
  },
  listItemFooterButtonIcon: {
    height: normalise(20),
    width: normalise(20),
  },
  listItemFooterButtonText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalise(9),
    marginLeft: normalise(6),
  },
  listItemFooterActionsButton: {
    transform: [{ rotate: '90deg' }],
    width: normalise(14),
  },
  listItemFooterReactions: {
    marginTop: normalise(12),
  },
});
