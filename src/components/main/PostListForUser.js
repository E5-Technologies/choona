import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Clipboard,
  Linking,
  Modal,
  ImageBackground,
  Platform,
} from 'react-native';
import Loader from '../../widgets/AuthLoader';
import Seperator from './ListCells/Seperator';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import MusicPlayerBar from '../../widgets/MusicPlayerBar';

import _ from 'lodash';
import HomeItemList from '../../components/main/ListCells/HomeItemList';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  HOME_PAGE_REQUEST,
  HOME_PAGE_SUCCESS,
  HOME_PAGE_FAILURE,
  SAVE_SONGS_REQUEST,
  SAVE_SONGS_SUCCESS,
  SAVE_SONGS_FAILURE,
  REACTION_ON_POST_SUCCESS,
  USER_FOLLOW_UNFOLLOW_REQUEST,
  USER_FOLLOW_UNFOLLOW_SUCCESS,
  USER_FOLLOW_UNFOLLOW_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  GET_USER_FROM_HOME_REQUEST,
  GET_USER_FROM_HOME_SUCCESS,
  GET_USER_FROM_HOME_FAILURE,
  CREATE_CHAT_TOKEN_REQUEST,
  CREATE_CHAT_TOKEN_SUCCESS,
  CREATE_CHAT_TOKEN_FAILURE,
  DUMMY_ACTION_SUCCESS,
} from '../../action/TypeConstants';
import { getSpotifyToken } from '../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../utils/helpers/AppleDevToken';
import {
  getProfileRequest,
  homePageReq,
  reactionOnPostRequest,
  userFollowUnfollowRequest,
  getUsersFromHome,
} from '../../action/UserAction';
import { saveSongRequest } from '../../action/SongAction';
import { deletePostReq } from '../../action/PostAction';
import { createChatTokenRequest } from '../../action/MessageAction';
import { connect } from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import axios from 'axios';

import constants from '../../utils/helpers/constants';
import { useScrollToTop } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';

let status = '';
let songStatus = '';
let postStatus = '';
let messageStatus;

function PostListForUser(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState('');
  const [modal1Visible, setModal1Visible] = useState(false);
  const [positionInArray, setPositionInArray] = useState(0);

  const [bool, setBool] = useState(false);
  const [userClicked, setUserClicked] = useState(false);
  const [userSeach, setUserSeach] = useState('');
  const [userSearchData, setUserSearchData] = useState([]);
  const [usersToSEndSong, sesUsersToSEndSong] = useState([]);

  const [totalReact, setTotalReact] = useState([]);
  const [posts, setPosts] = useState(props.route.params.posts);

  // console.log("prosts"+JSON.stringify(props.route.params.posts));

  const ref = React.useRef(null);
  var bottomSheetRef;
  let changePlayer = false;

  useScrollToTop(ref);

  useEffect(() => {
    let newarray = [];
    posts.map((item, index) => {
      let newObject = {
        id: item._id,
        react: [
          item.fire_count,
          item.love_count,
          item.dancer_count,
          item.man_dancing_count,
          item.face_count,
          item.thumbsup_count,
        ],
      };

      newarray.push(newObject);
      if (index === posts.length - 1) {
        setTotalReact(newarray);
        // console.log("newarrr"+ JSON.stringify(newarray))
      }
    });
  }, []);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case USER_PROFILE_REQUEST:
        status = props.status;
        break;

      case USER_PROFILE_SUCCESS:
        status = props.status;
        break;

      case USER_PROFILE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case HOME_PAGE_REQUEST:
        status = props.status;
        break;

      case HOME_PAGE_SUCCESS:
        status = props.status;
        break;

      case HOME_PAGE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case REACTION_ON_POST_SUCCESS:
        status = props.status;
        props.homePage(1);
        break;

      case USER_FOLLOW_UNFOLLOW_REQUEST:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_SUCCESS:
        status = props.status;
        props.homePage(1);
        setPositionInArray(0);
        break;

      case USER_FOLLOW_UNFOLLOW_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case GET_USER_FROM_HOME_REQUEST:
        status = props.status;
        break;

      case GET_USER_FROM_HOME_SUCCESS:
        status = props.status;
        setUserSearchData(props.userSearchFromHome);
        break;

      case GET_USER_FROM_HOME_FAILURE:
        status = props.status;
        break;
    }
  }

  if (songStatus === '' || props.songStatus !== songStatus) {
    switch (props.songStatus) {
      case SAVE_SONGS_REQUEST:
        songStatus = props.songStatus;
        break;

      case SAVE_SONGS_SUCCESS:
        songStatus = props.songStatus;
        if (props.savedSongResponse.status === 200) {
          toast('Success', props.savedSongResponse.message);
        } else {
          toast('Success', props.savedSongResponse.message);
        }
        break;

      case SAVE_SONGS_FAILURE:
        songStatus = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  if (postStatus === '' || props.postStatus !== postStatus) {
    switch (props.postStatus) {
      case DELETE_POST_REQUEST:
        postStatus = props.postStatus;
        break;

      case DELETE_POST_SUCCESS:
        postStatus = props.postStatus;
        props.navigation.goBack();
        setPositionInArray(0);
        break;

      case DELETE_POST_FAILURE:
        postStatus = props.postStatus;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  if (messageStatus === '' || props.messageStatus !== messageStatus) {
    switch (props.messageStatus) {
      case CREATE_CHAT_TOKEN_REQUEST:
        messageStatus = props.messageStatus;
        break;

      case CREATE_CHAT_TOKEN_SUCCESS:
        messageStatus = props.messageStatus;
        // console.log('profile page');
        setUserSearchData([]);
        sesUsersToSEndSong([]);
        setUserSeach('');
        props.navigation.navigate('SendSongInMessageFinal', {
          image: posts[positionInArray].song_image,
          title: posts[positionInArray].song_name,
          title2: posts[positionInArray].artist_name,
          users: usersToSEndSong,
          details: posts[positionInArray],
          registerType: props.registerType,
          fromAddAnotherSong: false,
          index: 0,
          fromHome: true,
        });
        break;

      case CREATE_CHAT_TOKEN_FAILURE:
        messageStatus = props.messageStatus;
        toast('Error', 'Something Went Wong, Please Try Again');
        break;
    }
  }

  const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];
  let val = 0;

  function hitreact(x, rindex) {
    // alert("reaction"+(JSON.stringify(posts[rindex])))
    if (!_.isEmpty(posts[rindex].reaction)) {
      // console.log('here');

      const present = posts[rindex].reaction.some(
        obj =>
          obj.user_id.includes(props.userProfileResp._id) &&
          obj.text.includes(x),
      );

      if (present) {
        // console.log('nooo');
      } else {
        setVisible(true);
        setModalReact(x);
        setTimeout(() => {
          setVisible(false);
        }, 2000);
      }
    } else {
      setVisible(true);
      setModalReact(x);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  }

  function hitreact1(modal1Visible) {
    if (modal1Visible === true) {
      setModal1Visible(false);
    } else {
      setModal1Visible(true);
    }
  }

  function modal() {
    return (val = 1);
  }

  function sendReaction(id, reaction) {
    //  alert("resat"+reaction)
    const myReaction =
      reaction === react[0]
        ? 'A'
        : reaction === react[1]
        ? 'B'
        : reaction === react[2]
        ? 'C'
        : reaction === react[3]
        ? 'D'
        : reaction === react[4]
        ? 'E'
        : 'F';

    let reactionObject = {
      post_id: id,
      text: reaction,
      text_match: myReaction,
    };

    posts.map((item, index) => {
      if (id === item._id) {
        if (myReaction === 'A') {
          if (posts[index].fire_count === totalReact[index].react[0]) {
            posts[index].fire_count = posts[index].fire_count + 1;
            posts[index].reaction_count = posts[index].reaction_count + 1;
          } else {
            if (posts[index].fire_count !== 0) {
              posts[index].fire_count = posts[index].fire_count - 1;
              posts[index].reaction_count = posts[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'B') {
          if (posts[index].love_count === totalReact[index].react[1]) {
            posts[index].love_count = posts[index].love_count + 1;
            posts[index].reaction_count = posts[index].reaction_count + 1;
          } else {
            if (posts[index].love_count !== 0) {
              posts[index].love_count = posts[index].love_count - 1;
              posts[index].reaction_count = posts[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'C') {
          if (posts[index].dancer_count === totalReact[index].react[2]) {
            posts[index].dancer_count = posts[index].dancer_count + 1;
            posts[index].reaction_count = posts[index].reaction_count + 1;
          } else {
            if (posts[index].dancer_count !== 0) {
              posts[index].dancer_count = posts[index].dancer_count - 1;
              posts[index].reaction_count = posts[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'D') {
          if (posts[index].man_dancing_count === totalReact[index].react[3]) {
            posts[index].man_dancing_count = posts[index].man_dancing_count + 1;
            posts[index].reaction_count = posts[index].reaction_count + 1;
          } else {
            if (posts[index].man_dancing_count !== 0) {
              posts[index].man_dancing_count =
                posts[index].man_dancing_count - 1;
              posts[index].reaction_count = posts[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'E') {
          if (posts[index].face_count === totalReact[index].react[4]) {
            posts[index].face_count = posts[index].face_count + 1;
            posts[index].reaction_count = posts[index].reaction_count + 1;
          } else {
            if (posts[index].face_count !== 0) {
              posts[index].face_count = posts[index].face_count - 1;
              posts[index].reaction_count = posts[index].reaction_count - 1;
            }
          }
        } else {
          if (posts[index].thumbsup_count === totalReact[index].react[5]) {
            posts[index].thumbsup_count = posts[index].thumbsup_count + 1;
            posts[index].reaction_count = posts[index].reaction_count + 1;
          } else {
            if (posts[index].thumbsup_count !== 0) {
              posts[index].thumbsup_count = posts[index].thumbsup_count - 1;
              posts[index].reaction_count = posts[index].reaction_count - 1;
            }
          }
        }
      }
      isInternetConnected()
        .then(() => {
          props.reactionOnPostRequest(reactionObject);
        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet');
        });
    });
  }

  function _onSelectBack(ID, comment) {
    //  console.log("aaa"+ posts)
    let newarray = posts;
    newarray.map((item, index) => {
      //  console.log("items"+index+JSON.stringify(item))
      if (item._id === ID) {
        newarray[index].comment_count = comment;
        // console.log("item",item)
      }

      if (index === newarray.length - 1) {
        setPosts([...newarray]);
      }
    });
  }

  function _onReaction(ID, reaction, reactionList) {
    let newarray = posts;
    // console.log("items"+JSON.stringify(reactionList[0].data[0].text_match))
    newarray.map((item, index) => {
      if (item._id === ID) {
        if (reactionList.length > 0) {
          var found = reactionList.findIndex(element => {
            return element.header === react[0];
          });
          var found_love = reactionList.findIndex(element => {
            return element.header === react[1];
          });
          var found_dance = reactionList.findIndex(element => {
            return element.header === react[2];
          });
          var found_ManDance = reactionList.findIndex(element => {
            return element.header === react[3];
          });
          var found_face = reactionList.findIndex(element => {
            return element.header === react[4];
          });
          var found_thumb = reactionList.findIndex(element => {
            return element.header === react[5];
          });

          //  alert("found"+found + found_love  + found_dance+ found_ManDance + found_face+ found_thumb)
          if (found !== -1) {
            newarray[index].fire_count = reactionList[found].data.length;
          } else {
            newarray[index].fire_count = 0;
          }
          if (found_love !== -1) {
            newarray[index].love_count = reactionList[found_love].data.length;
          } else {
            newarray[index].love_count = 0;
          }
          if (found_dance !== -1) {
            newarray[index].dancer_count =
              reactionList[found_dance].data.length;
          } else {
            newarray[index].dancer_count = 0;
          }
          if (found_ManDance !== -1) {
            newarray[index].man_dancing_count =
              reactionList[found_ManDance].data.length;
          } else {
            newarray[index].man_dancing_count = 0;
          }
          if (found_face !== -1) {
            newarray[index].face_count = reactionList[found_face].data.length;
          } else {
            newarray[index].face_count = 0;
          }
          if (found_thumb !== -1) {
            newarray[index].thumbsup_count =
              reactionList[found_thumb].data.length;
          } else {
            newarray[index].thumbsup_count = 0;
          }
          newarray[index].reaction_count = reaction;
        }
      }

      if (index === newarray.length - 1) {
        setPosts([...newarray]);
        let array = [];
        // newarray.map((item,index)=>{
        //   let newObject = {"id":item._id,'react':[item.fire_count,item.love_count,item.dancer_count,item.man_dancing_count,item.face_count,item.thumbsup_count]}

        //   array.push(newObject)
        //   if(index===posts.length-1){
        //     setTotalReact(array)
        //     // console.log("newarrr"+ JSON.stringify(newarray))
        //   }

        // })
      }
    });
  }

  function renderItem(data) {
    return (
      <HomeItemList
        image={data.item.song_image}
        picture={data.item.userDetails.profile_image}
        name={data.item.userDetails.username}
        comment_count={data.item.comment_count ? data.item.comment_count : 0}
        reaction_count={data.item.reaction_count ? data.item.reaction_count : 0}
        reactions={{
          fire_count: data.item.fire_count,
          love_count: data.item.love_count,
          dancer_count: data.item.dancer_count,
          man_dancing_count: data.item.man_dancing_count,
          face_count: data.item.face_count,
          thumbsup_count: data.item.thumbsup_count,
        }}
        content={data.item.post_content}
        navi={props}
        time={data.item.createdAt}
        title={data.item.song_name}
        singer={data.item.artist_name}
        songUri={data.item.song_uri}
        modalVisible={modal1Visible}
        postType={data.item.social_type === 'spotify'}
        onReactionPress={reaction => {
          hitreact(reaction, data.index);
          sendReaction(data.item._id, reaction);
        }}
        onPressImage={() => {
          if (props.userProfileResp._id === data.item.user_id) {
            props.navigation.navigate('Profile', { fromAct: false });
          } else {
            props.navigation.navigate('OthersProfile', {
              id: data.item.user_id,
            });
          }
        }}
        onAddReaction={() => {
          hitreact1(modal1Visible);
        }}
        onPressMusicbox={() => {
          props.navigation.navigate('Player', {
            comments: [],
            song_title: data.item.song_name,
            album_name: data.item.album_name,
            song_pic: data.item.song_image,
            username: data.item.userDetails.username,
            profile_pic: data.item.userDetails.profile_image,
            time: data.item.time,
            title: data.item.title,
            uri: data.item.song_uri,
            reactions: data.item.reaction,
            id: data.item._id,
            artist: data.item.artist_name,
            changePlayer: changePlayer,
            originalUri:
              data.item.original_song_uri !== ''
                ? data.item.original_song_uri
                : undefined,
            registerType: data.item.userDetails.register_type,
            isrc: data.item.isrc_code,
            details: data.item,
          });
        }}
        onPressReactionbox={() => {
          props.navigation.navigate('HomeItemReactions', {
            reactions: data.item.reaction,
            post_id: data.item._id,
            onSelectReaction: (ID, reaction, reactionList) =>
              _onReaction(ID, reaction, reactionList),
          });
        }}
        onPressCommentbox={() => {
          props.navigation.navigate('HomeItemComments', {
            index: data.index,
            comment: data.item.comment,
            image: data.item.song_image,
            username: data.item.userDetails.username,
            userComment: data.item.post_content,
            time: data.item.createdAt,
            id: data.item._id,
            onSelect: (ID, comment) => _onSelectBack(ID, comment),
          });
        }}
        onPressSecondImage={() => {
          setPositionInArray(data.index);
          setModalVisible(true);
        }}
        marginBottom={data.index === posts.length - 1 ? normalise(60) : 0}
      />
      // </TouchableOpacity>
    );
  }

  // RENDER USER SEARCH FLATLIST DATA
  function renderAddUsersToMessageItem(data) {
    return (
      <TouchableOpacity
        style={{
          marginTop: normalise(10),
          width: '89%',
          alignSelf: 'center',
        }}
        onPress={() => {
          if (usersToSEndSong.length > 0) {
            // let idArray = [];

            // usersToSEndSong.map((item, index) => {

            //     idArray.push(item._id)

            // });
            // if (idArray.includes(data.item._id)) {
            //     // console.log('Already Exists');
            // }
            // else {
            //     let array = [...usersToSEndSong]
            //     array.push(data.item)
            //     sesUsersToSEndSong(array);
            // };

            toast('Error', 'You can select one user at a time');
          } else {
            let array = [...usersToSEndSong];
            array.push(data.item);
            sesUsersToSEndSong(array);
          }
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{
              uri: constants.profile_picture_base_url + data.item.profile_image,
            }}
            style={{
              height: 35,
              width: 35,
              borderRadius: 2 * normalise(13.5),
            }}
          />
          <View
            style={{
              // flexDirection: 'row',
              marginLeft: '5%',
              paddingBottom: '5%',
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'ProximaNova-Semibold',
              }}>
              {data.item.full_name}
            </Text>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'ProximaNova-Semibold',
              }}>
              {data.item.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // RENDER ADD TO FLATLIST DATA
  function renderUsersToSendSongItem(data) {
    return (
      <TouchableOpacity
        style={{
          height: normalise(30),
          paddingHorizontal: normalise(18),
          marginStart: normalise(20),
          marginTop: normalise(5),
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          marginEnd:
            data.index === usersToSEndSong.length - 1 ? normalise(20) : 0,
        }}>
        <Text style={{ color: Colors.black, fontWeight: 'bold' }}>
          {data.item.username}
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            top: -4,
            height: 25,
            width: 25,
            borderRadius: 12,
          }}
          onPress={() => {
            let popArray = [...usersToSEndSong];
            popArray.splice(data.index, 1);
            sesUsersToSEndSong(popArray);
          }}>
          <Image
            source={ImagePath.crossIcon}
            style={{
              marginTop: normalise(-1.5),
              marginStart: normalise(8.5),
              height: 25,
              width: 25,
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  const searchUser = text => {
    if (text.length >= 1) {
      props.getusersFromHome({ keyword: text });
    }
  };

  function sendMessagesToUsers() {
    var userIds = [];
    usersToSEndSong.map(users => {
      userIds.push(users._id);
    });
    props.createChatTokenRequest(userIds);
  }

  // BOTTOM SHEET FOR SELECTING USERS
  const renderAddToUsers = () => {
    return (
      <RBSheet
        ref={ref => {
          if (ref) {
            bottomSheetRef = ref;
          }
        }}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={() => {
          //sesUsersToSEndSong([])
        }}
        nestedScrollEnabled={true}
        keyboardAvoidingViewEnabled={true}
        height={normalise(500)}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: Colors.black,
            borderTopEndRadius: normalise(8),
            borderTopStartRadius: normalise(8),
          },
          // wrapper: {
          //     backgroundColor: 'rgba(87,97,145,0.5)'

          // },
          draggableIcon: {
            backgroundColor: Colors.grey,
            width: normalise(70),
            height: normalise(3),
          },
        }}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View
              style={{
                flexDirection: 'row',
                width: '75%',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(14),
                  fontWeight: 'bold',
                  marginTop: normalise(10),
                  textAlign: 'right',
                }}>
                SELECT USER TO SEND TO
              </Text>

              {userClicked ? (
                <Text
                  style={{
                    color: Colors.white,
                    marginTop: normalise(10),
                    fontSize: normalise(14),
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  (1)
                </Text>
              ) : null}
            </View>

            {usersToSEndSong.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.close();
                  sendMessagesToUsers();
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(12),
                    fontWeight: 'bold',
                    marginTop: normalise(10),
                    marginEnd: normalise(15),
                  }}>
                  {'NEXT'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              height: normalise(35),
              marginTop: normalise(20),
              borderRadius: normalise(8),
              backgroundColor: Colors.white,
            }}>
            <TextInput
              autoCorrect={false}
              keyboardAppearance={'dark'}
              style={{
                height: normalise(35),
                width: '85%',
                padding: normalise(10),
                // color: Colors.white,
                paddingLeft: normalise(30),
              }}
              value={userSeach}
              placeholder={'Search'}
              placeholderTextColor={Colors.grey_text}
              onChangeText={text => {
                setUserSeach(text);
                searchUser(text);
              }}
            />

            <Image
              source={ImagePath.searchicongrey}
              style={{
                height: normalise(15),
                width: normalise(15),
                bottom: normalise(25),
                paddingLeft: normalise(30),
              }}
              resizeMode="contain"
            />

            {userSeach === '' ? null : (
              <TouchableOpacity
                onPress={() => {
                  setUserSeach('');
                  setUserSearchData([]);
                }}
                style={{
                  backgroundColor: Colors.fordGray,
                  padding: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                  position: 'absolute',
                  right: 0,
                  borderRadius: 5,
                  bottom: Platform.OS === 'ios' ? normalise(8) : normalise(7),
                  marginRight: normalise(10),
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(10),
                    fontWeight: 'bold',
                  }}>
                  CLEAR
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {usersToSEndSong.length > 0 ? ( // ADD TO ARRAY FLATLIST
            <FlatList
              style={{
                marginTop: normalise(10),
                maxHeight: normalise(50),
              }}
              horizontal={true}
              data={usersToSEndSong}
              renderItem={renderUsersToSendSongItem}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              showsHorizontalScrollIndicator={false}
            />
          ) : null}

          <FlatList // USER SEARCH FLATLIST
            style={{
              height: '65%',
              marginTop: usersToSEndSong.length > 0 ? 0 : normalise(5),
            }}
            data={userSearchData}
            renderItem={renderAddUsersToMessageItem}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={Seperator}
          />
        </View>
      </RBSheet>
    );
  };

  // console.log(posts[positionInArray]);

  const callApi = async () => {
    if (props.registerType === 'spotify') {
      const spotifyToken = await getSpotifyToken();

      return await axios.get(
        `https://api.spotify.com/v1/search?q=isrc:${posts[positionInArray].isrc_code}&type=track`,
        {
          headers: {
            Authorization: spotifyToken,
          },
        },
      );
    } else {
      const AppleToken = await getAppleDevToken();

      return await axios.get(
        `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${posts[positionInArray].isrc_code}`,
        {
          headers: {
            Authorization: AppleToken,
          },
        },
      );
    }
  };

  const openInAppleORSpotify = async () => {
    try {
      const res = await callApi();
      // console.log(res);

      if (res.status === 200) {
        if (
          !_.isEmpty(
            props.registerType === 'spotify'
              ? res.data.tracks.items
              : res.data.data,
          )
        ) {
          if (props.userProfileResp.register_type === 'spotify') {
            // console.log('success - spotify');
            // console.log(res.data.tracks.items[0].external_urls.spotify);
            Linking.canOpenURL(res.data.tracks.items[0].external_urls.spotify)
              .then(supported => {
                if (supported) {
                  Linking.openURL(
                    res.data.tracks.items[0].external_urls.spotify,
                  )
                    .then(() => {
                      // console.log('success');
                    })
                    .catch(() => {
                      // console.log('error');
                    });
                }
              })
              .catch(() => {
                // console.log('not supported');
              });
            setBool(false);
          } else {
            // console.log('success - apple');
            // console.log(res.data.data[0].attributes.url);
            Linking.canOpenURL(res.data.data[0].attributes.url)
              .then(supported => {
                if (supported) {
                  Linking.openURL(res.data.data[0].attributes.url)
                    .then(() => {
                      // console.log('success');
                    })
                    .catch(() => {
                      // console.log('error');
                    });
                }
              })
              .catch(() => {
                // console.log('not supported');
              });
            setBool(false);
          }
        } else {
          setBool(false);
          toast('', 'No Song Found');
        }
      } else {
        setBool(false);
        toast('Oops', 'Something Went Wrong');
      }
    } catch (error) {
      setBool(false);
      // console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <Loader visible={bool} />
      <HeaderComponent
        firstitemtext={false}
        imageone={ImagePath.backicon}
        title={props.route.params.profile_name}
        thirditemtext={true}
        texttwo={''}
        onPressFirstItem={() => {
          props.navigation.goBack();
        }}
      />

      {_.isEmpty(posts) ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={ImagePath.noposts}
            style={{
              height: normalise(150),
              width: normalise(150),
              marginTop: '28%',
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              marginBottom: '20%',
              marginTop: normalise(10),
              color: Colors.white,
              fontSize: normalise(14),
              fontWeight: 'bold',
            }}>
            NO POSTS YET
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            // style={{ marginTop: normalise(10) }}
            data={posts}
            renderItem={renderItem}
            initialScrollIndex={props.route.params.index}
            getItemLayout={(data, index) => ({
              length: 250,
              offset: normalise(385) * index,
              index,
            })}
            onScrollToIndexFailed={val => {
              // console.log(val);
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            ref={ref}
          />

          {renderAddToUsers()}

          {props.status === DUMMY_ACTION_SUCCESS ? (
            <MusicPlayerBar
              onPress={() => {
                props.navigation.navigate('Player', {
                  comments: [],
                  song_title: props.playingSongRef.song_name,
                  album_name: props.playingSongRef.album_name,
                  song_pic: props.playingSongRef.song_pic,
                  username: props.playingSongRef.username,
                  profile_pic: props.playingSongRef.profile_pic,
                  uri: props.playingSongRef.uri,
                  reactions: props.playingSongRef.reactionData,
                  id: props.playingSongRef.id,
                  artist: props.playingSongRef.artist,
                  changePlayer: props.playingSongRef.changePlayer,
                  originalUri: props.playingSongRef.originalUri,
                  isrc: props.playingSongRef.isrc,
                  registerType: props.playingSongRef.regType,
                  details: props.playingSongRef.details,
                  showPlaylist: props.playingSongRef.showPlaylist,
                  comingFromMessage: props.playingSongRef.comingFromMessage,
                });
              }}
              onPressPlayOrPause={() => {
                setTimeout(() => {
                  findPlayingSong(props.postData);
                }, 500);
              }}
            />
          ) : null}

          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              //Alert.alert("Modal has been closed.");
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#000000',
                opacity: 0.9,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize:
                    Platform.OS === 'android' ? normalise(70) : normalise(100),
                }}>
                {modalReact}
              </Text>
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            presentationStyle={'overFullScreen'}
            onRequestClose={() => {
              //Alert.alert("Modal has been closed.");
            }}>
            <ImageBackground
              source={ImagePath.page_gradient}
              style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    let saveSongObject = {
                      song_uri: posts[positionInArray].song_uri,
                      song_name: posts[positionInArray].song_name,
                      song_image: posts[positionInArray].song_image,
                      artist_name: posts[positionInArray].artist_name,
                      album_name: posts[positionInArray].album_name,
                      post_id: posts[positionInArray]._id,
                    };

                    props.saveSongReq(saveSongObject);
                    setModalVisible(!modalVisible);
                  }}>
                  <Image
                    source={ImagePath.boxicon}
                    style={{ height: normalise(18), width: normalise(18) }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    Save Song
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: normalise(18),
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (bottomSheetRef) {
                      setModalVisible(false);
                      bottomSheetRef.open();
                    }
                  }}>
                  <Image
                    source={ImagePath.sendicon}
                    style={{ height: normalise(18), width: normalise(18) }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: normalise(13),
                      marginLeft: normalise(15),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    Send Song
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(
                      posts[positionInArray].original_song_uri,
                    );
                    setModalVisible(!modalVisible);

                    setTimeout(() => {
                      toast('Success', 'Song copied to clipboard.');
                    }, 1000);
                  }}
                  style={{
                    flexDirection: 'row',
                    marginTop: normalise(18),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={ImagePath.more_copy}
                    style={{ height: normalise(18), width: normalise(18) }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    Copy Link
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: normalise(18),
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);

                    props.userProfileResp._id !== posts[positionInArray].user_id // USER - FOLLOW/UNFOLLOW
                      ? props.followUnfollowReq({
                          follower_id: posts[positionInArray].userDetails._id,
                        }) // USER - FOLLOW/UNFOLLOW
                      : props.deletePostReq(posts[positionInArray]._id); //  DELETE POST
                  }}>
                  <Image
                    source={ImagePath.more_unfollow}
                    style={{ height: normalise(18), width: normalise(18) }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    {props.userProfileResp._id ===
                    posts[positionInArray].user_id
                      ? 'Delete Post'
                      : `Unfollow ${posts[positionInArray].userDetails.username}`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: normalise(18),
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (
                      posts[positionInArray].userDetails.register_type ===
                      props.registerType
                    ) {
                      // console.log('same reg type');
                      setModalVisible(false);

                      Linking.canOpenURL(
                        posts[positionInArray].original_song_uri,
                      )
                        .then(() => {
                          Linking.openURL(
                            posts[positionInArray].original_song_uri,
                          )
                            .then(() => {
                              // console.log('success');
                              // setBool(false);
                            })
                            .catch(() => {
                              // console.log('error');
                            });
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    } else {
                      // console.log('diffirent reg type');
                      // setModalVisible(false)
                      console.log(1);
                      openInAppleORSpotify();
                    }
                  }}>
                  <Image
                    source={
                      props.userProfileResp.register_type === 'spotify'
                        ? ImagePath.spotifyicon
                        : ImagePath.applemusic
                    }
                    style={{
                      height: normalise(18),
                      width: normalise(18),
                      borderRadius: normalise(9),
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    {props.userProfileResp.register_type === 'spotify'
                      ? 'Open on Spotify'
                      : 'Open on Apple'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: normalise(18),
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    if (props.userProfileResp.register_type === 'spotify') {
                      props.navigation.navigate('AddToPlayListScreen', {
                        originalUri: posts[positionInArray].original_song_uri,
                        registerType: posts[positionInArray].social_type,
                        isrc: posts[positionInArray].isrc_code,
                      });
                      // setTimeout(()=>{
                      //     toast("Oops", "Only, Spotify users can add to their playlist now.")
                      // }, 1000)
                    } else {
                      props.navigation.navigate('AddToPlayListScreen', {
                        isrc: posts[positionInArray].isrc_code,
                      });
                    }
                  }}>
                  <Image
                    source={ImagePath.addicon}
                    style={{
                      height: normalise(18),
                      width: normalise(18),
                      borderRadius: normalise(9),
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>
                    Add to Playlist
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setPositionInArray(0);
                  }}
                  style={{
                    // marginStart: normalise(20),
                    // marginEnd: normalise(20),
                    marginTop: normalise(24),
                    marginBottom: normalise(20),
                    height: normalise(40),
                    // width: '95%',
                    backgroundColor: Colors.fadeblack,
                    opacity: 10,
                    borderRadius: 6,
                    // padding: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: normalise(12),
                      fontFamily: 'ProximaNova-Bold',
                      color: Colors.white,
                    }}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>
        </View>
      )}

      {modal1Visible === true ? (
        <View
          style={{
            position: 'absolute',
            margin: 20,
            height: normalise(280),
            width: '92%',
            alignSelf: 'center',
            marginHorizontal: normalise(15),
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 35,
            bottom: 50,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <EmojiSelector
            category={Categories.history}
            showHistory={true}
            onEmojiSelected={emoji => {
              setVisible(true);
              setModalReact(emoji);
              setTimeout(() => {
                setVisible(false);
              }, 2000);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    // marginBottom: normalise(10),
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: Colors.darkerblack,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // margin: 20,
    padding: 20,
    paddingTop: normalise(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
});

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    postData: state.UserReducer.postData,
    reactionResp: state.UserReducer.reactionResp,
    songStatus: state.SongReducer.status,
    savedSongResponse: state.SongReducer.savedSongResponse,
    playingSongRef: state.SongReducer.playingSongRef,
    chatList: state.MessageReducer.chatList,
    messageStatus: state.MessageReducer.status,
    postStatus: state.PostReducer.status,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
    registerType: state.TokenReducer.registerType,
    header: state.TokenReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfileReq: () => {
      dispatch(getProfileRequest());
    },

    homePage: offset => {
      dispatch(homePageReq(offset));
    },

    saveSongReq: payload => {
      dispatch(saveSongRequest(payload));
    },

    reactionOnPostRequest: payload => {
      dispatch(reactionOnPostRequest(payload));
    },

    followUnfollowReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },

    deletePostReq: payload => {
      dispatch(deletePostReq(payload));
    },

    getusersFromHome: payload => {
      dispatch(getUsersFromHome(payload));
    },

    createChatTokenRequest: payload => {
      dispatch(createChatTokenRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostListForUser);
