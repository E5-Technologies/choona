import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import Colors from '../../../assests/Colors';
import constants from '../../../utils/helpers/constants';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';

import HomeListItemReactions from './HomeListItemReactions';

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
}) => {
  return (
    <View style={styles.listItemFooterContainer}>
      <View style={styles.listItemFooterTop}>
        <View style={styles.listItemFooterInfo}>
          <TouchableOpacity
            onPress={() => {
              onPressImage();
            }}>
            <Image
              source={
                ImagePath
                  ? userAvatar === ''
                    ? ImagePath.dp1
                    : { uri: constants.profile_picture_base_url + userAvatar }
                  : null
              }
              style={styles.listItemFooterAvatar}
              resizeMode="contain"
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
          <Text numberOfLines={numberOfLines} style={styles.listItemFooterText}>
            {parts}
          </Text>
        ) : (
          <View />
        )}
        {postText.length > 180 ? (
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
        <HomeListItemReactions
          onReactionPress={onReactionPress}
          reactions={reactions}
        />
      </View>
    </View>
  );
};

export default HomeListItemFooter;

const styles = StyleSheet.create({
  listItemFooterContainer: {
    marginTop: normalise(10),
    paddingHorizontal: normalise(12),
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
    borderRadius: normalise(42),
    height: normalise(22),
    marginRight: normalise(6),
    width: normalise(22),
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
