import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  BackHandler,
  Keyboard,
  Dimensions,
  FlatList,
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
  FOLLOWER_LIST_FAILURE,
  FOLLOWER_LIST_SUCCESS,
  FOLLOWER_LIST_REQUEST,
  FOLLOWING_LIST_REQUEST,
  FOLLOWING_LIST_SUCCESS,
  FOLLOWING_LIST_FAILURE,
} from '../../action/TypeConstants';
import {
  commentOnPostReq,
  followingListReq,
  followerListReq,
} from '../../action/UserAction';

import Loader from '../../widgets/AuthLoader';
import CommentList from '../main/ListCells/CommentList';

import { fetchCommentsOnPost } from '../../helpers/post';
import HeaderComponentComments from '../../widgets/HeaderComponentComments';

let status;

let comment_count = 0;

function HomeItemComments(props) {
  const [comments, setComments] = useState([]);

  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [id] = useState(props.route.params.id);
  const [image] = useState(props.route.params.image);
  const [time] = useState(props.route.params.time);
  const [username] = useState(props.route.params.username);
  const [userComment] = useState(props.route.params.userComment);
  const [totalcount, setTotalCount] = useState(0);
  const [textinputHeight, setHeight] = useState(50);
  const [emoji, setEmoji] = useState(false);
  const [followingList, setFollowingList] = useState(props.followingData);
  const [followerList, setFollower] = useState(props.followerData);
  const [tagFriend, setTagFriend] = useState([]);

  const [showmention, setShowMention] = useState(false);
  const [Selection, setSelection] = useState({ start: 0, end: 0 });
  useEffect(() => {
    props.followingListReq('user', '');
    props.followListReq('user', '');
    fetchCommentsOnPost(props.route.params.id, props.header.token)
      .then(res => {
        // console.log("res"+JSON.stringify(res.reverse()))
        setCommentsLoading(false);
        if (res) {
          setTotalCount(res.length);

          comment_count = res.length;
          setComments(res);
        }
      })

      .catch(err => {
        toast('Error', err);
      });
    BackHandler.addEventListener('hardwareBackPress', _onBackHandlerPress);
  }, [props.header.token, props.route.params.id]);

  function renderItem(data) {
    return (
      <CommentList
        image={constants.profile_picture_base_url + data.item.profile_image}
        name={data.item.name}
        comment={data.item.text}
        navi={props}
        showLine={comments.length - 1 === data.index ? false : true}
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
        comment_count = comment_count + 1;
        break;

      case COMMENT_ON_POST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong');
        break;

      case FOLLOWER_LIST_REQUEST:
        status = props.status;
        break;

      case FOLLOWER_LIST_SUCCESS:
        status = props.status;
        setFollowingList(props.followingData);
        break;

      case FOLLOWER_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case FOLLOWING_LIST_REQUEST:
        status = props.status;
        break;

      case FOLLOWING_LIST_SUCCESS:
        status = props.status;
        setFollower(props.followerData);
        break;

      case FOLLOWING_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  const _onBackPress = () => {
    let ID = props.route.params.id;
    let Comment = comments.length;
    const { navigation, route } = props;
    route.params.onSelect(ID, Comment);
    navigation.goBack();
  };

  const _onBackHandlerPress = () => {
    let ID = props.route.params.id;
    let Comment = comment_count;

    const { navigation, route } = props;
    console.log(ID + ':' + Comment);
    route.params.onSelect(ID, Comment);
    navigation.goBack();
    return true;
  };

  const updateSize = height => {
    setHeight(height);
  };

  let delimiter = /\s+/;

  //split string
  let _text = commentText;
  let token,
    index,
    parts = [];
  while (_text) {
    delimiter.lastIndex = 0;
    token = delimiter.exec(_text);
    if (token === null) {
      break;
    }
    index = token.index;
    if (token[0].length === 0) {
      index = 1;
    }
    parts.push(_text.substr(0, index));
    parts.push(token[0]);
    index = index + token[0].length;
    _text = _text.slice(index);
  }
  parts.push(_text);
  // console.log('parts' + parts);
  //highlight hashtags
  parts = parts.map(text => {
    if (/^@/.test(text)) {
      return (
        <Text key={text} style={{ color: '#3DB2EB' }}>
          {text}
        </Text>
      );
    } else {
      return text;
    }
  });

  return (
    <View style={styles.container} keyboardShouldPersistTaps="always">
      <StatusBar />
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
          // props.navigation.goBack();
          _onBackPress();
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Loader visible={commentsLoading} />
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
                source={image ? { uri: image } : null}
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
          style={{ flex: 1 }}
          data={comments}
          keyboardShouldPersistTaps="always"
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            index.toString();
          }}
          disableRightSwipe={true}
          rightOpenValue={-75}
        />
      </SafeAreaView>
      {showmention ? (
        <View
          style={{
            backgroundColor: 'black',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            marginRight: '20%',
            //  minHeight:Dimensions.get('window').height/7,
            //  maxHeight:Dimensions.get("window").height/4.2,
            height:
              followingList.length + followerList.length === 2 ||
                followingList.length + followerList.length === 1
                ? Dimensions.get('window').height / 5
                : followingList.length + followerList.length === 3
                  ? Dimensions.get('window').height / 3.5
                  : Dimensions.get('window').height / 3,
            //  bottom: Dimensions.get("window").width/7,
            width: Dimensions.get('window').width / 1.25,
          }}>
          <FlatList
            data={followerList.concat(followingList).filter(function (o) {
              return this[o.username] ? false : (this[o.username] = true);
            }, {})}
            style={{ marginBottom: '0%' }}
            keyboardShouldPersistTaps="always"
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{ flexDirection: 'row', paddingTop: '3%' }}
                  onPress={() => {
                    setSelection({
                      start: commentText.lastIndexOf('@'),
                      end: Selection.end,
                    });
                    let newString = commentText.substr(
                      0,
                      commentText.lastIndexOf('@') + 1,
                    );
                    setCommentText(newString + item.username + ' ');
                    setShowMention(false);
                    tagFriend.push(item.username);
                  }}>
                  <Image
                    source={
                      item
                        ? item.profile_image
                          ? {
                            uri:
                              constants.profile_picture_base_url +
                              item.profile_image,
                          }
                          : ImagePath.userPlaceholder
                        : null
                    }
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 12,
                      width: Dimensions.get('window').width / 12,
                      borderRadius: Dimensions.get('window').width,
                      marginLeft: '5%',
                      marginRight: '4%',
                      // marginBottom:'3%'
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#25262A',
                      justifyContent: 'center',
                    }}>
                    <Text style={{ fontSize: 14, color: 'white' }}>
                      {item.full_name}
                    </Text>

                    <Text
                      style={{
                        fontSize: 11,
                        color: 'grey',
                        marginBottom: '5%',
                        textTransform: 'lowercase',
                      }}>
                      @{item.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
      <View
        style={[
          styles.commentFooterContainer,
          {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#000000',
          },
        ]}>
        <TextInput
          style={[
            styles.commentFooterInput,
            {
              flex: 1,
              //flexWrap:'wrap',
              //alignItems:'center'
            },
          ]}
          multiline
          // maxHeight={100}
          autoFocus={true}
          keyboardAppearance="dark"
          onContentSizeChange={e =>
            updateSize(e.nativeEvent.contentSize.height)
          }
          placeholder={'Add a comment...'}
          placeholderTextColor={Colors.white}
          onFocus={() => setEmoji(true)}
          scrollEnabled={false}
          onChangeText={text => {
            let indexvalue = text.lastIndexOf('@');
            let newString = text.substr(text.lastIndexOf('@'));

            if (indexvalue !== -1) {
              if (newString.length === 1) {
                if (
                  commentText.substr(indexvalue - 1) === ' ' ||
                  commentText.substr(indexvalue - 1) === ''
                ) {
                  setFollowingList([...props.followingData]);
                  setFollower([...props.followerData]);
                  props.followingData.length === 0
                    ? setShowMention(false)
                    : setShowMention(true);
                } else {
                  setShowMention(false);
                }
              } else {
                let newSubString = newString.substr(1, newString.length - 1);
                let newArray = [];
                let newFollowArray = [];
                if (props.followingData.length !== 0) {
                  props.followingData.map((item, index) => {
                    //  console.log("mapItem"+item.full_name)
                    if (item.username.includes(newSubString)) {
                      newArray.push(item);
                    }
                    if (index === props.followingData.length - 1) {
                      if (props.followerData.length !== 0) {
                        props.followerData.map((items, indexs) => {
                          if (items.username.includes(newSubString)) {
                            newFollowArray.push(items);
                          }
                          if (indexs === props.followerData.length - 1) {
                            newFollowArray.length === 0
                              ? setShowMention(false)
                              : (setFollowingList(newArray),
                                setFollower(newFollowArray),
                                setShowMention(true));
                          }
                        });
                      } else {
                        setFollowingList(newArray), setShowMention(true);
                      }
                    }
                  });
                } else {
                  props.followerData.map((items, indexs) => {
                    if (items.username.includes(newSubString)) {
                      newFollowArray.push(items);
                    }
                    if (indexs === props.followerData.length - 1) {
                      newArray.length === 0
                        ? setShowMention(false)
                        : (setFollower(newFollowArray), setShowMention(true));
                    }
                  });
                }
              }
            } else {
              setShowMention(false);
            }
            setCommentText(text);
          }}>
          {parts}
        </TextInput>
        {commentText !== '' ? (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: '3%',
            }}
            onPress={async () => {
              setCommentsLoading(true);
              let tapUser = [];
              await props.followingData.map((item, index) => {
                if (commentText.search(item.username) !== -1) {
                  tagFriend.map(items => {
                    if (items === item.username) {
                      tapUser.push(item.username);
                    }
                  });
                }
                if (index === props.followingData.length - 1) {
                  setTagFriend([]);
                }
              });

              // Keyboard.dismiss();
              let commentObject = {
                post_id: id,
                text: commentText,
                tag: tapUser,
              };
              // console.log("ffff"+ JSON.stringify(commentObject))
              isInternetConnected()
                .then(() => {
                  props.commentOnPost(commentObject);
                  setCommentText('');
                  setCommentsLoading(false);
                  Keyboard.dismiss();
                })
                .catch(() => {
                  setCommentsLoading(false);
                  toast('Error', 'Please Connect To Internet');
                });
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: 'ProximaNova-Bold',
              }}>
              POST
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {Platform.OS === 'ios' && <KeyboardSpacer />}
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <Loader visible={commentsLoading} />
  //     <StatusBar />
  //     <Loader visible={props.status === COMMENT_ON_POST_REQUEST} />
  //     <SafeAreaView style={styles.safeContainer}>
  //       <HeaderComponentComments
  //         firstitemtext={false}
  //         imageone={ImagePath.backicon}
  //         title={
  //           comments.length > 0
  //             ? comments.length === 1
  //               ? '1 COMMENT'
  //               : `${comments.length} COMMENTS`
  //             : 'COMMENTS'
  //         }
  //         thirditemtext={false}
  //         marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
  //         onPressFirstItem={() => {
  //           // props.navigation.goBack();
  //           _onBackPress();
  //         }}
  //       />
  //       {/* <ScrollView> */}
  //       <View style={styles.commentHeader}>
  //         <View style={styles.commentHeaderDetails}>
  //           <TouchableOpacity style={styles.commentHeaderAvatarButton}>
  //             {/* <Image
  //               source={ImagePath.play}
  //               style={{
  //                 height: normalise(20),
  //                 width: normalise(20),
  //                 position: 'absolute',
  //                 alignSelf: 'center',
  //               }}
  //             /> */}
  //             <Image
  //               source={{ uri: image }}
  //               style={styles.commentHeaderAvatar}
  //               resizeMode="contain"
  //             />
  //           </TouchableOpacity>
  //           <View style={styles.commentHeaderInfoContainer}>
  //             <View style={styles.commentHeaderInfoTop}>
  //               <Text style={styles.commentHeaderInfoUsername}>{username}</Text>

  //               <Text style={styles.commentHeaderInfoTime}>
  //                 {moment(time).from()}
  //               </Text>
  //             </View>
  //             <View>
  //               <Text style={styles.commentHeaderInfoComment}>
  //                 {userComment}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //       {/* </ScrollView> */}
  //       <SwipeListView
  //         data={comments}
  //         renderItem={renderItem}
  //         showsVerticalScrollIndicator={false}
  //         keyExtractor={(item, index) => {
  //           index.toString();
  //         }}
  //         disableRightSwipe={true}
  //         rightOpenValue={-75}
  //       />
  //       <View
  //         style={[
  //           styles.commentFooterContainer,
  //           {
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             backgroundColor: '#000000', ///bottom: emoji ? Platform.OS==='ios'?299:10 : 20
  //           },
  //         ]}>
  //         <TextInput
  //           style={[
  //             styles.commentFooterInput,
  //             {
  //               flex: 1,
  //               flexWrap: 'wrap',
  //               alignItems: 'center',
  //             },
  //           ]}
  //           value={commentText}
  //           multiline
  //           maxHeight={100}
  //           onContentSizeChange={e =>
  //             updateSize(e.nativeEvent.contentSize.height)
  //           }
  //           placeholder={'Add a comment...'}
  //           placeholderTextColor={Colors.white}
  //           onFocus={() => setEmoji(true)}
  //           onChangeText={text => {
  //             setCommentText(text);
  //           }}
  //         />
  //         {commentText !== '' ? (
  //           <TouchableOpacity
  //             style={{
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               paddingHorizontal: '3%',
  //             }}
  //             onPress={() => {
  //               // setEmoji(false)
  //               Keyboard.dismiss();
  //               let commentObject = {
  //                 post_id: id,
  //                 text: commentText,
  //               };
  //               isInternetConnected()
  //                 .then(() => {
  //                   props.commentOnPost(commentObject);
  //                 })
  //                 .catch(() => {
  //                   toast('Error', 'Please Connect To Internet');
  //                 });
  //             }}>
  //             <Text
  //               style={{
  //                 color: Colors.white,
  //                 fontFamily: 'ProximaNova-Bold',
  //               }}>
  //               POST
  //             </Text>
  //           </TouchableOpacity>
  //         ) : null}
  //       </View>
  //     </SafeAreaView>
  //   </View>
  // );
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
    textTransform: 'lowercase',
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
    paddingBottom: normaliseNew(12),
    paddingEnd: normaliseNew(14),
    paddingStart: normaliseNew(16),
    paddingTop: normaliseNew(13),
    // maxHeight: normaliseNew(100),
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
    followingData: state.UserReducer.followingData,
    followerData: state.UserReducer.followerData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentOnPost: payload => {
      dispatch(commentOnPostReq(payload));
    },
    followingListReq: (usertype, id) => {
      dispatch(followingListReq(usertype, id));
    },
    followListReq: (usertype, id) => {
      dispatch(followerListReq(usertype, id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeItemComments);
