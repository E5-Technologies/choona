import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';

import Colors from '../../assests/Colors';
import constants from '../../utils/helpers/constants';
import ImagePath from '../../assests/ImagePath';
import isInternetConnected from '../../utils/helpers/NetInfo';
import normalise from '../../utils/helpers/Dimens';
import normaliseNew from '../../utils/helpers/DimensNew';
import toast from '../../utils/helpers/ShowErrorAlert';

import {
  COMMENT_ON_POST_REQUEST,
  COMMENT_ON_POST_SUCCESS,
  COMMENT_ON_POST_FAILURE,
} from '../../action/TypeConstants';
import { commentOnPostReq } from '../../action/UserAction';

import Loader from '../../widgets/AuthLoader';
import HeaderComponent from '../../widgets/HeaderComponent';
import CommentList from '../main/ListCells/CommentList';

import { fetchCommentsOnPost } from '../../helpers/post';
import HeaderComponentComments from '../../widgets/HeaderComponentComments';

let status;

function HomeItemComments(props) {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [id] = useState(props.route.params.id);
  const [image] = useState(props.route.params.image);
  const [time] = useState(props.route.params.time);
  const [username] = useState(props.route.params.username);
  const [userComment] = useState(props.route.params.userComment);

  useEffect(() => {
    fetchCommentsOnPost(props.route.params.id, props.header.token)
      .then(res => {
        setCommentsLoading(false);
        if (res) {
          setComments(res);
        }
      })
      .catch(err => {
        toast('Error', err);
      });
  }, [props.header.token, props.route.params.id]);

  function renderItem(data) {
    return (
      <CommentList
        image={constants.profile_picture_base_url + data.item.profile_image}
        name={data.item.name}
        comment={data.item.text}
        time={moment(data.item.createdAt).from()}
        onPressImage={() => {
          if (props.userProfileResp._id === data.item.user_id) {
            props.navigation.navigate('Profile', { fromAct: false });
          } else {
            props.navigation.navigate('OthersProfile', {
              id: data.item.user_id,
            });
          }
        }}
      />
    );
  }

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case COMMENT_ON_POST_REQUEST:
        status = props.status;
        break;

      case COMMENT_ON_POST_SUCCESS:
        status = props.status;
        setCommentText('');
        let data = {};
        data.name = props.commentResp.name;
        data.text = props.commentResp.text;
        data.createdAt = props.commentResp.createdAt;
        data.user_id = props.commentResp.user_id;
        data.post_id = props.commentResp.post_id;
        data.profile_image = props.commentResp.profile_image;
        comments.push(data);
        break;

      case COMMENT_ON_POST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong');
        break;
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <Loader visible={commentsLoading} />
      <StatusBar />
      <Loader visible={props.status === COMMENT_ON_POST_REQUEST} />
      <SafeAreaView style={styles.safeContainer}>
        <HeaderComponentComments
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={
            comments.length > 0
              ? comments.length === 1
                ? '1 COMMENT'
                : `${comments.length} COMMENTS`
              : 'COMMENTS'
          }
          thirditemtext={false}
          marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />
        <View style={styles.commentHeader}>
          <View style={styles.commentHeaderDetails}>
            <TouchableOpacity style={styles.commentHeaderAvatarButton}>
              {/* <Image
                source={ImagePath.play}
                style={{
                  height: normalise(20),
                  width: normalise(20),
                  position: 'absolute',
                  alignSelf: 'center',
                }}
              /> */}
              <Image
                source={{ uri: image }}
                style={styles.commentHeaderAvatar}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.commentHeaderInfoContainer}>
              <View style={styles.commentHeaderInfoTop}>
                <Text style={styles.commentHeaderInfoUsername}>{username}</Text>

                <Text style={styles.commentHeaderInfoTime}>
                  {moment(time).from()}
                </Text>
              </View>
              <View>
                <Text style={styles.commentHeaderInfoComment}>
                  {userComment}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <SwipeListView
          data={comments}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            index.toString();
          }}
          disableRightSwipe={true}
          rightOpenValue={-75}
        />
        <View style={[styles.commentFooterContainer,{flexDirection:'row',}]}>
          <TextInput
            // multiline
            style={[styles.commentFooterInput,{flex:0.98}]}
            value={commentText}
            placeholder={'Add a comment...'}
            placeholderTextColor={Colors.white}
            onChangeText={text => {
              setCommentText(text);
            }}
          />
          {commentText !== '' ? (
            <TouchableOpacity
              style={{
               alignItems:'center',
              justifyContent:'center',
              paddingHorizontal:'3%'
            
              }}
              onPress={() => {
                let commentObject = {
                  post_id: id,
                  text: commentText,
                };
                isInternetConnected()
                  .then(() => {
                    props.commentOnPost(commentObject);
                  })
                  .catch(() => {
                    toast('Error', 'Please Connect To Internet');
                  });
              }}>
              <Text style={{
                 color: Colors.white,
                fontFamily: 'ProximaNova-Bold',
              }}>POST</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkerblack },
  safeContainer: { flex: 1 },
  commentHeader: {
    backgroundColor: Colors.darkerblack,
    paddingLeft: normaliseNew(16),
    paddingRight: normaliseNew(16),
    paddingTop: normaliseNew(12),
    borderBottomWidth: normaliseNew(0.5),
    borderColor: Colors.fadeblack,
    paddingBottom: normaliseNew(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 11,
  },
  commentHeaderDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentHeaderAvatarButton: { justifyContent: 'center' },
  commentHeaderAvatar: {
    borderRadius: normaliseNew(4),
    height: normaliseNew(64),
    width: normaliseNew(64),
  },
  commentHeaderInfoContainer: {
    flex: 1,
    marginLeft: normaliseNew(16),
  },
  commentHeaderInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentHeaderInfoUsername: {
    color: Colors.white,
    fontSize: normaliseNew(13),
    fontFamily: 'ProximaNova-Semibold',
  },
  commentHeaderInfoTime: {
    color: Colors.grey_text,
    fontSize: normaliseNew(12),
    fontFamily: 'ProximaNova-Regular',
  },
  commentHeaderInfoComment: {
    color: Colors.white,
    fontSize: normaliseNew(12),
    lineHeight: normaliseNew(15),
    marginTop: normaliseNew(2),
    fontFamily: 'ProximaNova-Regular',
  },
  commentFooterContainer: {
    borderColor: Colors.activityBorderColor,
    borderTopWidth: normaliseNew(1),
    paddingHorizontal: normaliseNew(16),
    paddingVertical: normaliseNew(6),
    position: 'relative',
  },
  commentFooterInput: {
    backgroundColor: Colors.darkerblack,
    borderColor: Colors.activityBorderColor,
    borderRadius: normaliseNew(24),
    borderWidth: normaliseNew(0.5),
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normaliseNew(14),
    height: normaliseNew(48),
    paddingBottom: normaliseNew(12),
    paddingEnd: normaliseNew(44),
    paddingStart: normaliseNew(16),
    paddingTop: normaliseNew(14),
    maxHeight: normaliseNew(100),
  },
  commentFooterPostButtonText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normaliseNew(12),
    position: 'absolute',
    right: normaliseNew(16),
    bottom: normaliseNew(16),
  },
  commentFooterPostButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    commentResp: state.UserReducer.commentResp,
    userProfileResp: state.UserReducer.userProfileResp,
    header: state.TokenReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentOnPost: payload => {
      dispatch(commentOnPostReq(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeItemComments);