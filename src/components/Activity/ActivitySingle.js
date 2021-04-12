import React from 'react';

import constants from '../../utils/helpers/constants';
// import normaliseNew from '../../utils/helpers/DimensNew';

import ActivityListItem from '../main/ListCells/ActivityListItem';

function ActivitySingle({ item, props }) {
 
  if (item.activity_type === 'following') {
    return (
      <ActivityListItem
        image={constants.profile_picture_base_url + item.profile_image}
        title={'started following you'}
        user={item.username}
        follow={!item.isFollowing}
        userId={item.user_id}
        onPressImage={() => {
          props.navigation.navigate('OthersProfile', {
            id: item.user_id,
            following: item.isFollowing,
          });
        }}
        onPress={() => {
          props.followReq({ follower_id: item.user_id });
        }}
      />
    );
  } else if (item.activity_type === 'reaction') {
    return (
      <ActivityListItem
        image={constants.profile_picture_base_url + item.profile_image}
        reaction={item.text}
        user={item.username}
        userId={item.user_id}
        type={false}
        image2={item.image}
        onPressImage={() => {
          props.navigation.navigate('OthersProfile', {
            id: item.user_id,
            following: item.isFollowing,
          });
        }}
        onPress={() => {
          // props.navigation.navigate('Profile', {
          //   postId: item.post_id,
          //   fromAct: true,
          props.navigation.navigate('GenreSongClicked', {
            data: item.post_id,
            ptID:1,
          });
          // });
        }}
      />
    );
  } else {
    return (
      <ActivityListItem
        image={constants.profile_picture_base_url + item.profile_image}
        user={item.username}
        comment={item.text}
        userId={item.user_id}
        type={false}
        image2={item.image}
        onPressImage={() => {
          props.navigation.navigate('OthersProfile', {
            id: item.user_id,
            following: item.isFollowing,
          });
        }}
        onPress={() => {
          // props.navigation.navigate('Profile', {
          //   postId: item.post_id,
          //   fromAct: true,
          // });
          props.navigation.navigate('GenreSongClicked', {
            data: item.post_id,
            ptID:1,
          });
        }}
      />
    );
  }
}

export default ActivitySingle;