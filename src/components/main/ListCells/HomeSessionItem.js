import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';
import {useNavigation} from '@react-navigation/native';
import constants from '../../../utils/helpers/constants';

const HomeSessionItem = ({
  item,
  onPressMusicbox,
  play,
  postType,
  singer,
  songUri,
  // title = 'This is new song',
  verified = true,
  userId,
}) => {
  // console.log(JSON.stringify(item), 'its session item');
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.listItemHeaderContainer}
      onPress={() =>
        navigation.navigate(
          userId == item?.own_user?._id
            ? 'MySessionDetailScreen'
            : 'SessionDetail',
          {sessionId: item?._id},
        )
      }>
      <View style={styles.listItemHeaderSongDetails}>
        <View style={styles.nameWrapper}>
          <Text
            style={[
              styles.listItemHeaderSongTextTitle,
              {
                textTransform: 'uppercase',
                fontSize: normalise(12),
                marginHorizontal: 10,
              },
            ]}
            numberOfLines={1}>
            {item?.own_user?.username}
          </Text>
          {/* {verified &&
                        <Image
                            source={ImagePath.blueTick}
                            style={{ width: 16, height: 16 }}
                            resizeMode="contain"
                        />
                    } */}
        </View>
        <Image
          source={
            item?.own_user?.profile_image
              ? {
                  uri:
                    constants.profile_picture_base_url +
                    item?.own_user?.profile_image,
                }
              : ImagePath.userPlaceholder
          }
          style={styles.listItemHeaderSongTypeIcon}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.listItemHeaderSongTextTitle,
            {fontSize: normalise(11), marginTop: 10},
          ]}
          numberOfLines={2}>
          {item?.isPrivate ? 'Private' : 'Public'}
        </Text>
      </View>
      <View style={styles.songlistWrapperBox}>
        <FlatList
          data={item?.session_songs?.slice(0, 4) ?? []}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: normalise(3),
                  flex: 1,
                }}>
                <Image
                  source={{uri: item?.song_image}}
                  style={styles.songListItemImage}
                  resizeMode="contain"
                />
                <View style={styles.listItemHeaderSongText}>
                  <Text
                    style={styles.songlistItemHeaderSongTextTitle}
                    numberOfLines={1}>
                    {item?.song_name}
                  </Text>
                  <Text
                    style={styles.songlistItemHeaderSongTextArtist}
                    numberOfLines={1}>
                    {item?.artist_name}
                  </Text>
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?._id}
        />
        <View style={styles.bottomLineStyle}></View>
      </View>
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
    </Pressable>
  );
};

export default HomeSessionItem;

const styles = StyleSheet.create({
  listItemHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalise(12),
    paddingVertical: normalise(12),
    position: 'relative',
    backgroundColor: Colors.darkerblack,
    flex: 1,
  },
  nameWrapper: {
    // alignItems: 'center',
    flexDirection: 'row',
  },
  listItemHeaderSongDetails: {
    alignItems: 'center',
    flex: 0.8,
    // flexDirection: 'row',
  },
  listItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(14),
    marginBottom: normalise(5),
    marginRight: normalise(5),
  },
  listItemHeaderSongTypeIcon: {
    borderRadius: normalise(10),
    height: normalise(70),
    width: normalise(70),
    borderRadius: normalise(80),
  },
  listItemHeaderSongText: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(10),
    // maxWidth: normalise(240),
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.fadeblack,
    paddingBottom: normalise(3),
    flex: 1,
  },
  songlistWrapperBox: {
    marginLeft: normalise(10),
    flex: 1.2,
    // borderBottomWidth: 0.5,
    // paddingBottom: normalise(5),
    // borderBottomColor: Colors.white,
  },

  songListItemImage: {
    borderRadius: normalise(5),
    height: normalise(30),
    width: normalise(30),
  },
  songlistItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(13),
    marginBottom: normalise(5),
    // paddingRight: normalise(5),
  },

  songlistItemHeaderSongTextArtist: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(9),
    // paddingRight: normalise(5)
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
  bottomLineStyle: {
    marginTop: normalise(7),
    backgroundColor: Colors.white,
    height: 0.5,
    width: '80%',
    alignSelf: 'center',
    opacity: 0.5,
  },
  listItemHeaderPlay: {height: normalise(24), width: normalise(24)},
});
