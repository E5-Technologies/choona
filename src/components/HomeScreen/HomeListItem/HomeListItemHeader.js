import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';
import constants from '../../../utils/helpers/constants';
import Avatar from '../../Avatar';
import moment from 'moment';

const HomeListItemHeader = ({
  onPressMusicbox,
  play,
  postType,
  singer,
  songUri,
  title,
  onPressMenu,
  onPressImage,
  userAvatar,
  userName,
  postTime,
}) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <View style={styles.listItemHeaderContainer}>
      {/* <View style={styles.listItemHeaderSongDetails}>
        <Image
          source={
            ImagePath
              ? postType
                ? ImagePath.spotifyicon
                : ImagePath.apple_icon_round
              : null
          }
          style={styles.listItemHeaderSongTypeIcon}
          resizeMode="contain"
        />
        <View style={styles.listItemHeaderSongText}>
          <Text style={styles.listItemHeaderSongTextTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.listItemHeaderSongTextArtist} numberOfLines={1}>
            {singer}
          </Text>
        </View>
      </View> */}

      {/* {songUri && (
        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            setDisabled(true);
            onPressMusicbox();
            setTimeout(() => {
              setDisabled(false);
            }, 1000);
          }}
          style={styles.listItemHeaderPlayButton}>
          <Image
            source={
              ImagePath ? (play ? ImagePath.pause : ImagePath.play) : null
            }
            style={styles.listItemHeaderPlay}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )} */}

      <View style={styles.listItemFooterInfo}>
        <TouchableOpacity
          onPress={() => {
            onPressImage();
          }}
          style={styles.listItemFooterAvatar}>
          <Avatar
            image={
              userAvatar
                ? constants.profile_picture_base_url + userAvatar
                : null
            }
            height={26}
            width={26}
          />
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'center'}}>
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
  );
};

export default HomeListItemHeader;

const styles = StyleSheet.create({
  listItemHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalise(7),
    paddingVertical: normalise(12),
    position: 'relative',
    backgroundColor: Colors.darkerblack,
  },
  listItemHeaderSongDetails: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  listItemHeaderSongTypeIcon: {
    borderRadius: normalise(10),
    height: normalise(20),
    width: normalise(20),
  },
  listItemHeaderSongText: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(10),
    maxWidth: normalise(240),
    width: '100%',
  },
  listItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(10),
  },
  listItemHeaderSongTextArtist: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(9),
  },
  listItemHeaderPlayButton: {
    height: normalise(36),
    paddingLeft: normalise(6),
    paddingTop: normalise(6),
    position: 'absolute',
    right: normalise(6),
    top: normalise(6),
    width: normalise(36),
  },
  listItemHeaderPlay: {height: normalise(24), width: normalise(24)},
  listItemFooterButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: normalise(16),
  },
  listItemFooterActionsButton: {
    transform: [{rotate: '90deg'}],
    width: normalise(14),
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
    flex: 1,
  },
  listItemFooterAvatar: {
    marginRight: normalise(6),
  },
  listItemFooterName: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(11),
    textTransform: 'lowercase',
    top: normalise(-2),
  },
  listItemFooterDate: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(10),
    top: normalise(-2),
  },
});
