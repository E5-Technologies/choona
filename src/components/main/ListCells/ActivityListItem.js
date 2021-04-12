import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

import ImagePath from '../../../assests/ImagePath';
import normaliseNew from '../../../utils/helpers/DimensNew';
import Colors from '../../../assests/Colors';

function ActivityListItem(props) {
  const [follow, setFollow] = useState(props.follow);

  const onPress = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  const onPressImage = () => {
    if (props.onPressImage) {
      props.onPressImage();
    }
  };

  return (
    <View style={styles.container}>
     
      <View style={styles.detailsContainer}>
        <View style={styles.detailsInfo}>
          <TouchableOpacity
            onPress={() => {
              onPressImage();
            }}>
            <Image
              source={props.image === '' ? ImagePath.dp : { uri: props.image }}
              style={styles.detailsAvatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity
          style={{flex:1}}
            disabled={props.TouchableOpacityDisabled}
            onPress={() => {
               onPress();
            }}>
            <Text style={styles.detailsText} numberOfLines={2}>
              {props.title ? (
                <>
                  <Text style={styles.detailsTextBold}>{props.user} </Text>
                  {props.title}
                </>
              ) : props.reaction ? (
                <>
                  <Text style={styles.detailsTextBold}>{props.user} </Text>
                  reacted {props.reaction} on your post
                </>
              ) : props.comment ? (
                <>
                  <Text style={styles.detailsTextBold}>{props.user} </Text>
                  commented "{props.comment}" on your post
                </>
              ) : props.user ? (
                <Text style={styles.detailsTextBold}>{props.user}</Text>
              ) : (
                ''
              )}
            </Text>
          </TouchableOpacity>
     
   
        </View>
        {
          // props.userId != props.loginUserId?
        
        props.type ? (
          props.userId != props.loginUserId?
          <TouchableOpacity
            style={[
              styles.followButton,
              { backgroundColor: follow ? Colors.white : Colors.fadeblack },
            ]}
            onPress={() => {
              onPress();
              setFollow(!follow);
            }}>
            {follow ? (
              <Text style={[styles.followButtonText,{}]}>FOLLOW</Text>
            ) : (
              <Text style={[styles.followButtonText, { color: Colors.white }]}>
                FOLLOWING
              </Text>
            )}
          </TouchableOpacity>:
          null
        ) : (
          <TouchableOpacity
            onPress={() => {
              onPress();
            }}>
            <Image
              source={
                props.image2 === '' ? ImagePath.dp2 : { uri: props.image2 }
              }
              style={{ height: normaliseNew(35), width: normaliseNew(35) }}
              resizeMode="contain"
            />
            
          </TouchableOpacity>
        )
      
      }
      </View>
    </View>
  );
}

export default ActivityListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: normaliseNew(16),
    paddingVertical: normaliseNew(16),
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
    marginRight: normaliseNew(8),
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
    textAlign: 'left',
  },
  detailsTextBold: {
    fontFamily: 'ProximaNova-Bold',
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: normaliseNew(16),
    height: normaliseNew(32),
    justifyContent: 'center',
    width: normaliseNew(90),
  },
  followButtonText: {
    color: Colors.black,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normaliseNew(10),
  },
});

ActivityListItem.propTypes = {
  image: PropTypes.string,
  image2: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  type: PropTypes.bool,
  follow: PropTypes.bool,
  marginBottom: PropTypes.number,
  onPressImage: PropTypes.bool,
  marginTop: PropTypes.number,
  TouchableOpacityDisabled: PropTypes.bool,
};

ActivityListItem.defaultProps = {
  image: '',
  image2: '',
  title: '',
  onPress: null,
  type: true,
  marginBottom: 0,
  onPressImage: null,
  marginTop: 0,
  TouchableOpacityDisabled: true,
  userId:'',
  loginUserId:''
};