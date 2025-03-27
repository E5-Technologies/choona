import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';

import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';

const ProfileHeaderFeatured = ({ navigation, profile, user }) => {
  return (
    <ImageBackground
      source={ImagePath.gradientbar}
      style={styles.profileHeaderFeaturedBackground}
      resizeMode="cover">
      {_.isEmpty(profile.feature_song) ? (
        user ? (
          <View style={styles.profileHeaderFeaturedContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('FeaturedTrack');
              }}
              style={styles.profileHeaderFeaturedSong}>
              <Image
                source={ImagePath.add_white}
                style={styles.profileHeaderFeaturedSongButton}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View
              style={[styles.profileHeaderFeaturedDetails, { width: '50%' }]}>
              <Text style={styles.profileHeaderFeaturedDetailsTitle}>
                Featured Track
              </Text>
              <Text style={styles.profileHeaderFeaturedDetailsSong}>
                You don't currently have a featured track, let's add one.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.profileHeaderFeaturedEmpty}>
            <Text style={styles.profileHeaderFeaturedDetailsTitle}>
              No Featured Track
            </Text>
          </View>
        )
      ) : (
        <View style={styles.profileHeaderFeaturedContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Player', {
                song_title: JSON.parse(profile.feature_song)[0].song_name,
                album_name: JSON.parse(profile.feature_song)[0].album_name,
                song_pic: JSON.parse(profile.feature_song)[0].song_pic,
                uri: JSON.parse(profile.feature_song)[0].song_uri,
                artist: JSON.parse(profile.feature_song)[0].artist_name,
                changePlayer: true,
                originalUri: JSON.parse(profile.feature_song)[0].hasOwnProperty(
                  'original_song_uri',
                )
                  ? JSON.parse(profile.feature_song)[0].original_song_uri
                  : undefined,
                registerType: profile.register_type,
                isrc: JSON.parse(profile.feature_song)[0].isrc_code,
              });
            }}>
            <Image
              source={{
                uri: JSON.parse(profile.feature_song)[0].song_pic,
              }}
              style={styles.profileHeaderFeaturedSong}
              resizeMode="contain"
            />
            <Image
              source={ImagePath.play}
              style={styles.profileHeaderFeaturedSongButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={[
              styles.profileHeaderFeaturedDetails,
              {
                maxWidth: user ? '62%' : '70%',
              },
            ]}>
            <Text style={styles.profileHeaderFeaturedDetailsTitle}>
              Featured Track
            </Text>
            <Text
              numberOfLines={1}
              style={styles.profileHeaderFeaturedDetailsArtist}>
              {JSON.parse(profile.feature_song)[0].song_name}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.profileHeaderFeaturedDetailsSong}>
              {JSON.parse(profile.feature_song)[0].album_name}
            </Text>
          </View>
          {user && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('FeaturedTrack');
              }}
              style={{ marginLeft: normalise(12) }}>
              <Image
                source={ImagePath.change}
                style={{
                  height: normalise(40),
                  width: normalise(40),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </ImageBackground>
  );
};

export default ProfileHeaderFeatured;

const styles = StyleSheet.create({
  profileHeaderFeaturedBackground: {
    height: normalise(60),
    marginTop: normalise(16),
    paddingHorizontal: normalise(12),
    paddingVertical: normalise(6),
  },
  profileHeaderFeaturedEmpty: {
    alignItems: 'center',
    flexDirection: 'row',
    height: normalise(48),
    justifyContent: 'center',
  },
  profileHeaderFeaturedContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  profileHeaderFeaturedSong: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: normalise(48),
    width: normalise(48),
  },
  profileHeaderFeaturedSongButton: {
    height: normalise(24),
    marginLeft: normalise(12),
    marginTop: normalise(12),
    position: 'absolute',
    width: normalise(24),
  },
  profileHeaderFeaturedDetails: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginStart: normalise(10),
    width: '100%',
  },
  profileHeaderFeaturedDetailsTitle: {
    color: Colors.white,
    fontSize: normalise(9),
    fontFamily: 'ProximaNova-SemiBold',
    opacity: 0.5,
    textTransform: 'uppercase',
  },
  profileHeaderFeaturedDetailsArtist: {
    color: Colors.white,
    fontSize: normalise(12),
    fontFamily: 'ProximaNova-SemiBold',
  },
  profileHeaderFeaturedDetailsSong: {
    color: Colors.white,
    fontSize: normalise(11),
    fontFamily: 'ProximaNova-Regular',
  },
});
