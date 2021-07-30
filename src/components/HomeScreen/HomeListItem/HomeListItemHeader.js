import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';

const HomeListItemHeader = ({
  onPressMusicbox,
  play,
  postType,
  singer,
  songUri,
  title,
}) => {
  return (
    <View style={styles.listItemHeaderContainer}>
      <View style={styles.listItemHeaderSongDetails}>
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
      </View>
      {songUri && (
        <TouchableOpacity
          onPress={() => onPressMusicbox()}
          style={styles.listItemHeaderPlayButton}>
          <Image
            source={
              ImagePath ? (play ? ImagePath.pause : ImagePath.play) : null
            }
            style={styles.listItemHeaderPlay}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeListItemHeader;

const styles = StyleSheet.create({
  listItemHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalise(12),
    paddingVertical: normalise(12),
    position: 'relative',
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
    marginStart: normalise(5),
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
  listItemHeaderPlay: { height: normalise(24), width: normalise(24) },
});
