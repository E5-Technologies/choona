import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../assests/Colors';
import constants from '../../utils/helpers/constants';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';

const ProfileHeader = ({ navigation, profile, totalCount, user }) => {
  return (
    <View style={styles.profileHeaderContainer}>
      <View style={styles.avatarBackground}>
        {profile.profile_image ? (
          <Image
            source={{
              uri: constants.profile_picture_base_url + profile.profile_image,
            }}
            style={styles.profileAvatar}
          />
        ) : (
          <Image
            source={ImagePath.userPlaceholder}
            style={styles.emptyAvatar}
          />
        )}
      </View>
      <View style={styles.profileHeaderDetailsContainer}>
        <Text style={styles.profileHeaderDetailsName}>
          @{profile.username ? profile.username : 'username'}
        </Text>
        <Text style={styles.profileHeaderDetailsSubText}>
          {`${totalCount} ${totalCount > 1 ? 'Posts' : 'Post'}`}
        </Text>
        <Text style={styles.profileHeaderDetailsSubText}>
          {profile.location ? profile.location : 'Location'}
        </Text>
        <View style={styles.profileHeaderDetailsLinkContainer}>
          <TouchableOpacity
            onPress={() => {
              user
                ? navigation.push('Following', { type: 'user', id: '' })
                : navigation.push('Following', {
                    type: 'public',
                    id: profile._id,
                  });
            }}>
            <Text style={styles.profileHeaderDetailsLink}>
              <Text style={styles.profileHeaderDetailsLinkSub}>
                {profile.following ? profile.following : 0}
              </Text>{' '}
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              user
                ? navigation.push('Followers', { type: 'user', id: '' })
                : navigation.push('Followers', {
                    type: 'public',
                    id: profile._id,
                  });
            }}>
            <Text style={styles.profileHeaderDetailsLink}>
              <Text style={styles.profileHeaderDetailsLinkSub}>
                {profile.follower ? profile.follower : 0}
              </Text>{' '}
              Followers
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  profileHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: normalise(10),
    paddingHorizontal: normalise(12),
  },
  avatarBackground: {
    alignItems: 'center',
    backgroundColor: Colors.fadeblack,
    borderRadius: normalise(32),
    height: normalise(64),
    justifyContent: 'center',
    width: normalise(64),
  },
  profileAvatar: {
    borderRadius: normalise(32),
    height: normalise(64),
    width: normalise(64),
  },
  emptyAvatar: {
    borderRadius: normalise(21),
    height: normalise(42),
    width: normalise(42),
  },
  profileHeaderDetailsContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(8),
  },
  profileHeaderDetailsName: {
    color: Colors.white,
    fontSize: normalise(12),
    fontFamily: 'ProximaNova-Regular',
    marginBottom: normalise(2),
  },
  profileHeaderDetailsSubText: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(11),
    marginBottom: normalise(2),
  },
  profileHeaderDetailsLinkContainer: {
    flexDirection: 'row',
    marginTop: normalise(1),
  },
  profileHeaderDetailsLink: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(11),
    width: normalise(78),
  },
  profileHeaderDetailsLinkSub: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(11),
  },
});
