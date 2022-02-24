import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
} from 'react-native';
import Loader from '../../widgets/AuthLoader';
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
import { connect } from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import axios from 'axios';

import { useScrollToTop } from '@react-navigation/native';
import MoreModal from '../Posts/MoreModal';
import Reactions from '../Reactions/Reactions';

let status = '';
let songStatus = '';
let postStatus = '';

function PostListForUser(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState('');
  const [modal1Visible, setModal1Visible] = useState(false);
  const [positionInArray, setPositionInArray] = useState(0);

  const [bool, setBool] = useState(false);
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

  const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];

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
      }
    });
  }
  /** REACTION - ADDITION */
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const [pendingReacts, setPendingReacts] = useState({});
  const addPendingReactTimer = (reactId, postId) => {
    setPendingReacts(old => {
      return {
        ...old,
        [`${getPendingReactKey(reactId, postId)}`]: true,
      };
    });
    wait(5000).then(() => {
      removePendingReact(reactId, postId);
    });
  };

  const removePendingReact = (reactId, postId) => {
    setPendingReacts(old => {
      return {
        ...old,
        [`${getPendingReactKey(reactId, postId)}`]: false,
      };
    });
  };

  const getPendingReactKey = (reactId, postId) => {
    return `${reactId}##${postId}`;
  };

  function hitReact(reactId, postId) {
    let reactionObject = {
      post_id: postId,
      text: Reactions[reactId].oldText,
      text_match: Reactions[reactId].map,
    };
    isInternetConnected()
      .then(() => {
        addPendingReactTimer(reactId, postId);
        props.reactionOnPostRequest(reactionObject);
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
  }
  /** ------------ */

  function renderItem(data) {
    /** REACTION - ADDITION */
    const reactionMap = {
      thumbsUp: data.item.fireReactionIds
        ? data.item.fireReactionIds.includes(`${props.userProfileResp?._id}`)
        : false,
      fire: data.item.loveReactionIds
        ? data.item.loveReactionIds.includes(`${props.userProfileResp?._id}`)
        : false,
      heart: data.item.dancerReactionIds
        ? data.item.dancerReactionIds.includes(`${props.userProfileResp?._id}`)
        : false,
      disco: data.item.manDancingReactionIds
        ? data.item.manDancingReactionIds.includes(
            `${props.userProfileResp?._id}`,
          )
        : false,
      throwback: data.item.faceReactionIds
        ? data.item.faceReactionIds.includes(`${props.userProfileResp?._id}`)
        : false,
      thumbsDown: data.item.thumbsUpReactionIds
        ? data.item.thumbsUpReactionIds.includes(
            `${props.userProfileResp?._id}`,
          )
        : false,
    };

    return (
      <HomeItemList
        onReactionPress={reaction => {
          if (!pendingReacts[getPendingReactKey(reaction, data.item._id)]) {
            hitReact(reaction, data.item._id);
            return true;
          }
          return false;
        }}
        myReactions={reactionMap}
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
          props.navigation.push('HomeItemComments', {
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
              .then(() => {
                Linking.openURL(res.data.tracks.items[0].external_urls.spotify)
                  .then(() => {
                    // console.log('success');
                  })
                  .catch(() => {
                    // console.log('error');
                  });
              })
              .catch(() => {
                // console.log('not supported');
              });
            setBool(false);
          } else {
            // console.log('success - apple');
            // console.log(res.data.data[0].attributes.url);
            Linking.canOpenURL(res.data.data[0].attributes.url)
              .then(() => {
                Linking.openURL(res.data.data[0].attributes.url)
                  .then(() => {
                    // console.log('success');
                  })
                  .catch(() => {
                    // console.log('error');
                  });
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
            animationType="fade"
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

          {modalVisible && (
            <MoreModal
              setBool={setBool}
              bottomSheetRef={bottomSheetRef}
              index={positionInArray}
              setIndex={setPositionInArray}
              navigation={props.navigation}
              openInAppleORSpotify={openInAppleORSpotify}
              postData={posts}
              show={modalVisible}
              setShow={setModalVisible}
            />
          )}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostListForUser);
