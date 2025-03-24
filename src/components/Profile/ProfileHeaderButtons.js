import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../assests/Colors';
import normalise from '../../utils/helpers/Dimens';

const ProfileHeaderButtons = ({
  followReq,
  id,
  isFollowing,
  navigation,
  othersProfileresp,
  setIsFollowing,
}) => {
  return (
    <View style={styles.profileHeaderButtonsContainer}>
      <TouchableOpacity
        style={styles.profileHeaderButtonsButton}
        onPress={() => {
          navigation.navigate('AddAnotherSong', {
            othersProfile: true,
            index: 0,
            users: [
              {
                _id: othersProfileresp._id,
                username: othersProfileresp.username,
                full_name: othersProfileresp.full_name,
                profile_image: othersProfileresp.profile_image,
              },
            ],
          });
        }}>
        <Text style={styles.profileHeaderButtonsButtonText}>Send a Song</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.profileHeaderButtonsButton,
          { backgroundColor: isFollowing ? Colors.fadeblack : Colors.white },
        ]}
        onPress={() => {
          setIsFollowing(!isFollowing);
          followReq({ follower_id: id });
        }}>
        <Text
          style={[
            styles.profileHeaderButtonsButtonText,
            {
              color: isFollowing ? Colors.white : Colors.black,
            },
          ]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeaderButtons;

const styles = StyleSheet.create({
  profileHeaderButtonsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: normalise(12),
    paddingHorizontal: normalise(12),
  },
  profileHeaderButtonsButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: normalise(15),
    height: normalise(30),
    justifyContent: 'center',
    marginRight: normalise(8),
    maxWidth: Dimensions.get('window').width / 2 - 16 - 8,
    width: '100%',
  },
  profileHeaderButtonsButtonText: {
    color: Colors.darkerblack,
    fontFamily: 'ProximaNova-SemiBold',
    fontSize: normalise(10),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
