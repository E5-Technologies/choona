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
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RBSheet from 'react-native-raw-bottom-sheet';

import Colors from '../../assests/Colors';
import constants from '../../utils/helpers/constants';
import ImagePath from '../../assests/ImagePath';
import isInternetConnected from '../../utils/helpers/NetInfo';
import normalise from '../../utils/helpers/Dimens';
import normaliseNew from '../../utils/helpers/DimensNew';
import toast from '../../utils/helpers/ShowErrorAlert';
import { updateMessageCommentRequest } from '../../action/MessageAction';
import {
  COMMENT_ON_POST_REQUEST,
  COMMENT_ON_POST_SUCCESS,
  COMMENT_ON_POST_FAILURE,
  FOLLOWER_LIST_FAILURE,
  FOLLOWER_LIST_SUCCESS,
  FOLLOWER_LIST_REQUEST,
} from '../../action/TypeConstants';
import { commentOnPostReq, followingListReq } from '../../action/UserAction';

import CommentList from '../main/ListCells/CommentList';

import HeaderComponentComments from '../../widgets/HeaderComponentComments';

let status;
let RbSheetRef;

let comment_count = 0;
let DataBack = [];

function HomeItemComments(props) {
  const refs = React.useRef();
  const [comments, setComments] = useState(props.route.params.commentData);
  const [followingList, setFollowingList] = useState(props.followingData);

  const [showmention, setShowMention] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [id] = useState(props.route.params.id);
  const [Selection, setSelection] = useState({ start: -1, end: -1 });
  //   const [image] = useState(props.route.params.image);
  //   const [time] = useState(props.route.params.time);
  //   const [username] = useState(props.route.params.username);
  //   const [userComment] = useState(props.route.params.userComment);
  const [totalcount, setTotalCount] = useState(0);
  const [textinputHeight, setHeight] = useState(normalise(20));
  useEffect(() => {
    //       console.log("id"+props.route.params.id)
    //     fetchCommentsOnPost(props.route.params.id, props.header.token)
    //       .then(res => {

    //  console.log("res"+JSON.stringify(res))
    //         setCommentsLoading(false);
    //         if (res) {
    //           setTotalCount(res.length)

    //           comment_count = res.length;
    //           setComments(res);

    //         }
    //       })

    //       .catch(err => {
    //         toast('Error', err);
    //       });
    props.followingListReq('user', '');
    DataBack = comments;
    BackHandler.addEventListener('hardwareBackPress', _onBackHandlerPress);

    //       //  return () =>
    //       //  BackHandler.removeEventListener("hardwareBackPress", _onBackHandlerPress);
  }, []);

  function renderItem(data) {
    console.log('commentItem' + JSON.stringify(data));
    return (
      <CommentList
        image={constants.profile_picture_base_url + data.item.profile_image}
        name={data.item.username}
        comment={data.item.text}
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
        alert('status' + props.status);
        break;

      case FOLLOWER_LIST_SUCCESS:
        status = props.status;
        alert('alert');
        setFollowingList(props.followingData);
        break;

      case FOLLOWER_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  const _onBackPress = () => {
    let data = comments;
    let Comment = comments.length;

    const { navigation, route } = props;
    route.params.onSelect(data, Comment);
    navigation.goBack();
  };

  const _onBackHandlerPress = () => {
    console.log('count' + JSON.stringify(DataBack).length);
    let data = DataBack;
    let Comment = comment_count;
    const { navigation, route } = props;
    route.params.onSelect(data, data.length);
    navigation.goBack();
    return true;
  };

  const RbSheet = () => {
    return (
      <RBSheet
        ref={ref => {
          if (ref) {
            RbSheetRef = ref;
          }
        }}
        animationType={'slide'}
        closeOnDragDown={false}
        closeOnPressMask={true}
        nestedScrollEnabled={true}
        customStyles={{
          container: {
            minHeight: Dimensions.get('window').height / 2.2,
            borderTopEndRadius: normalise(8),
            borderTopStartRadius: normalise(8),
            backgroundColor: 'transparent',
          },
        }}>
        {/* > height: Dimensions.get('window').height / 2.2, backgroundColor:
        'black', borderTopEndRadius: normalise(8), borderTopStartRadius:
        normalise(8), }}> */}
        <View style={{ width: '95%', flex: 1, alignSelf: 'center' }}>
          {/* <FlatList
            style={{height:'40%'}}
            data={commentData}
            renderItem={renderFlatlistData}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator={false}
          /> */}
        </View>
      </RBSheet>
    );
  };

  const updateSize = height => {
    setHeight(height);
  };

  const onSelectionChange = ({ nativeEvent: { selection, text } }) => {
    console.log('change selection to', selection, 'for value');

    // );
    // console.log("selectestext"+text);
    // this.setState({ selection });
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

  //highlight hashtags
  parts = parts.map(text => {
    if (/^@/.test(text)) {
      return (
        <Text key={text} style={{ color: 'red' }}>
          {text}
        </Text>
      );
    } else {
      return text;
    }
  });

  return (
    <View style={styles.container}>
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
      {/* <ScrollView> */}
      <ScrollView>
        <SafeAreaView>
          <View style={styles.commentHeader}>
            <View style={styles.commentHeaderDetails}>
              <TouchableOpacity style={styles.commentHeaderAvatarButton}>
                <Image
                  source={ImagePath.play}
                  style={{
                    height: normalise(20),
                    width: normalise(20),
                    position: 'absolute',
                    alignSelf: 'center',
                  }}
                />
                <Image
                  source={{
                    uri: props.route.params.pic.replace(
                      '100x100bb.jpg',
                      '500x500bb.jpg',
                    ),
                  }}
                  style={styles.commentHeaderAvatar}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.commentHeaderInfoContainer}>
                <View style={styles.commentHeaderInfoTop}>
                  <Text style={styles.commentHeaderInfoUsername}>
                    {props.route.params.username}
                  </Text>

                  {/* <Text style={styles.commentHeaderInfoTime}>
                  {moment(props.route.params.time).from()}
                </Text> */}
                </View>
                <View>
                  {/* <Text style={styles.commentHeaderInfoComment}>
                  {userComment}
                </Text> */}
                </View>
              </View>
            </View>
          </View>
          {/* </ScrollView> */}
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
        </SafeAreaView>
      </ScrollView>
      {showmention ? (
        <View
          style={{
            backgroundColor: 'black',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            marginRight: '20%',
            minHeight: Dimensions.get('window').height / 7,
            maxHeight: Dimensions.get('window').height / 4.2,
          }}>
          <FlatList
            data={followingList}
            keyboardShouldPersistTaps="always"
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{ flexDirection: 'row', paddingTop: '3%' }}
                  onPress={() => {
                    alert(JSON.stringify(Selection));
                    let lastIndex = commentText.lastIndexOf('@');
                    // setSelection({start:lastIndex,end:lastIndex+item.full_name.length})
                    let newString = commentText.substr(
                      0,
                      commentText.lastIndexOf('@') + 1,
                    );
                    setCommentText(newString + item.full_name);
                    setShowMention(false);
                  }}>
                  <Image
                    source={
                      item.profile_image
                        ? {
                            uri:
                              constants.profile_picture_base_url +
                              item.profile_image,
                          }
                        : ImagePath.userPlaceholder
                    }
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 12,
                      width: Dimensions.get('window').width / 12,
                      borderRadius: Dimensions.get('window').width,
                      marginLeft: '5%',
                      marginRight: '4%',
                      marginBottom: '3%',
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#25262A',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        marginBottom: '5%',
                      }}>
                      {item.full_name}
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
              //   flexWrap:'wrap',
              height: textinputHeight,
            },
          ]}
          // value={commentText}
          multiline
          autoFocus={true}
          maxHeight={100}
          keyboardAppearance="dark"
          // onSelectionChange={ event => {
          //   const selections = event.nativeEvent.selection;
          //   setSelection({start:selections.start,end:selections.end})

          // } }

          // selection={Selection}
          selectionColor="blue"
          onContentSizeChange={e =>
            updateSize(e.nativeEvent.contentSize.height)
          }
          placeholder={'Add a comment...'}
          placeholderTextColor={Colors.white}
          onChangeText={text => {
            let indexvalue = text.lastIndexOf('@');
            let newString = text.substr(text.lastIndexOf('@'));
            if (indexvalue !== -1) {
              if (newString.length === 1) {
                setFollowingList([...props.followingData]);
                props.followingData.length === 0
                  ? setShowMention(false)
                  : setShowMention(true);
              } else {
                let newSubString = newString.substr(1, newString.length - 1);
                let newArray = [];
                props.followingData.map((item, index) => {
                  console.log('mapItem' + item.full_name);
                  if (item.full_name.includes(newSubString)) {
                    newArray.push(item);
                  }
                  if (index === props.followingData.length - 1) {
                    newArray.length === 0
                      ? setShowMention(false)
                      : (setFollowingList(newArray), setShowMention(true));
                  }
                });
              }
            }

            setCommentText(text);
          }}>
          <Text>{parts}</Text>
        </TextInput>
        {commentText !== '' ? (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: '3%',
            }}
            onPress={() => {
              // alert("post click")

              Keyboard.dismiss();
              setCommentText('');
              let commentObject = {
                post_id: id,
                text: commentText,
              };
              let updateMessagPayload = {};

              if (props.route.params.comingFromMessage) {
                let tempData = [...comments];
                tempData.push({
                  profile_image: props.userProfileResp.profile_image,
                  text: commentText,
                  username: props.userProfileResp.username,
                  createdAt: moment().toString(),
                  user_id: props.userProfileResp._id,
                });
                //   setArrayLength(
                //     `${tempData.length} ${
                //       tempData.length > 1 ? 'COMMENTS' : 'COMMENT'
                //     }`,
                //   );
                setComments(tempData);
                DataBack = [...tempData];
                setCommentText('');

                updateMessagPayload = {
                  ChatId: props.route.params.key,
                  chatToken: props.route.params.chatToken,
                  message: tempData,
                  receiverId: props.route.params.receiverId,
                  senderId: props.route.params.senderId,
                  songTitle: props.route.params.songTitle,
                  artist: props.route.params.artist,
                };
              }
              isInternetConnected()
                .then(() => {
                  props.route.params.comingFromMessage
                    ? props.updateMessageCommentRequest(updateMessagPayload)
                    : props.commentOnPost(commentObject);
                })
                .catch(error => {
                  toast('Error', 'Please Connect To Internet' + error);
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
  console.log(
    'followingdata' + JSON.stringify(state.UserReducer.followingData),
  );
  return {
    status: state.UserReducer.status,
    commentResp: state.UserReducer.commentResp,
    userProfileResp: state.UserReducer.userProfileResp,
    header: state.TokenReducer,
    followingData: state.UserReducer.followingData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentOnPost: payload => {
      dispatch(commentOnPostReq(payload));
    },
    updateMessageCommentRequest: payload => {
      dispatch(updateMessageCommentRequest(payload));
    },
    followingListReq: (usertype, id) => {
      dispatch(followingListReq(usertype, id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeItemComments);
