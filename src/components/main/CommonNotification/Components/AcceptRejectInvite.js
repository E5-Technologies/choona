import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../../../assests/Colors';
import normalise from '../../../../utils/helpers/Dimens';
import normaliseNew from '../../../../utils/helpers/DimensNew';

export const AcceptRejectInvite = ({
  title,
  image,
  touchableOpacityDisabled,
  user,
  session_id,
  showButton = true,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container1}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsInfo}>
          <TouchableOpacity
            onPress={() => {
              null;
              // onPressImage();
            }}
            ß
            style={{marginRight: normaliseNew(8)}}>
            <Avatar
              image={
                image !== 'https://api.choona.co/uploads/user/thumb/'
                  ? image
                  : null
              }
              height={26}
              width={26}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
            disabled={touchableOpacityDisabled}
            onPress={() => null}>
            <Text style={styles.detailsText} numberOfLines={2}>
              <>
                <Text style={styles.detailsTextBold}>{user} </Text>
                {title}
              </>
            </Text>
          </TouchableOpacity>
          {showButton && (
            <View>
              <TouchableOpacity
                style={[styles.followButton, {backgroundColor: Colors.white}]}
                onPress={() =>
                  navigation('SessionDetail', {
                    sessionId: session_id,
                    fromScreen: 'notificionScreen',
                  })
                }>
                {/* {follow ? (
              <Text style={[styles.followButtonText, {}]}>FOLLOW</Text>
            ) : ( */}
                <Text style={[styles.followButtonText, {color: Colors.black}]}>
                  JOIN
                </Text>
                {/* )} */}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    marginHorizontal: normaliseNew(16),
    paddingVertical: normaliseNew(16),
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: normaliseNew(16),
    height: normaliseNew(32),
    justifyContent: 'center',
    width: normaliseNew(85),
    marginLeft: normaliseNew(5),
  },
  followButtonText: {
    color: Colors.black,
    fontFamily: 'Kallisto',
    fontSize: normaliseNew(10),
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    // marginRight: normaliseNew(8),
  },
  detailsAvatar: {
    borderRadius: normaliseNew(16),
    height: normaliseNew(32),
    marginRight: normaliseNew(8),
    width: normaliseNew(32),
  },
  detailsText: {
    color: Colors.white,
    flexWrap: 'wrap',
    fontSize: normaliseNew(12),
    lineHeight: normaliseNew(15),
    flex: 1,
    textAlign: 'left',
  },
  detailsTextBold: {
    fontFamily: 'ProximaNova-Bold',
  },
});
