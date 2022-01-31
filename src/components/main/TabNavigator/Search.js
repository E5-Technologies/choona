import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import Seperator from '../ListCells/Seperator';

import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import StatusBar from '../../../utils/MyStatusBar';
import HeaderComponent from '../../../widgets/HeaderComponent';
import ImagePath from '../../../assests/ImagePath';
import { FlatList } from 'react-native-gesture-handler';
import ActivityListItem from '../ListCells/ActivityListItem';
import HomeItemList from '../ListCells/HomeItemList';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  USER_SEARCH_REQUEST,
  USER_SEARCH_SUCCESS,
  USER_SEARCH_FAILURE,
  USER_FOLLOW_UNFOLLOW_REQUEST,
  USER_FOLLOW_UNFOLLOW_SUCCESS,
  USER_FOLLOW_UNFOLLOW_FAILURE,
  SEARCH_POST_REQUEST,
  SEARCH_POST_SUCCESS,
  SEARCH_POST_FAILURE,
  TOP_50_SONGS_REQUEST,
  TOP_50_SONGS_SUCCESS,
  TOP_50_SONGS_FAILURE,
  GET_USER_FROM_HOME_REQUEST,
  GET_USER_FROM_HOME_SUCCESS,
  GET_USER_FROM_HOME_FAILURE,
} from '../../../action/TypeConstants';
import {
  userSearchRequest,
  userFollowUnfollowRequest,
  reactionOnPostRequest,
} from '../../../action/UserAction';
import {
  saveSongRequest,
  getTop50SongsRequest,
} from '../../../action/SongAction';
import { searchPostReq } from '../../../action/PostAction';
import { deletePostReq } from '../../../action/PostAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import constants from '../../../utils/helpers/constants';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import { getUsersFromHome } from '../../../action/UserAction';
import Contacts from 'react-native-contacts';
import EmptyComponent from '../../Empty/EmptyComponent';
import MoreModal from '../../Posts/MoreModal';

let status;
let postStatus;
let top50Status;
let userstatus;

const Search = props => {
  const [usersSearch, setUsersSearch] = useState(false);
  const [genreSearch, setGenreSearch] = useState(true);
  const [songSearch, setSongSearch] = useState(false);

  const [usersSearchText, setUsersSearchText] = useState('');
  const [genreSearchText, setGenreSearchText] = useState('');
  const [songSearchText, setSongSearchText] = useState('');
  const [bool, setBool] = useState(false);

  const [songData, setSongData] = useState([]); // user search data...ignore the naming
  const [searchPostData, setSearchPostData] = useState([]); //search post data
  const [top50, setTop50] = useState([]); //top 50 data

  const [positionInArray, setPositionInArray] = useState(0);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState('');

  const [typingTimeout, setTypingTimeout] = useState(0);
  // SEND SONG VARIABLES
  const [totalReact, setTotalReact] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  let changePlayer = false;
  let sendSong = false;
  let flag = true;
  var bottomSheetRef;

  useEffect(() => {
    props.getTop50SongReq();
  }, [props.getTop50SongReq]);

  const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];

  if (status === '' || status !== props.status) {
    switch (props.status) {
      case USER_SEARCH_REQUEST:
        status = props.status;
        break;

      case USER_SEARCH_SUCCESS:
        status = props.status;
        setBool(true);
        setSongData([]);
        setTimeout(() => {
          setSongData(props.userSearch);

          setBool(false);
        }, 1000);
        break;

      case USER_SEARCH_FAILURE:
        toast('Opps', 'Something went wrong, Please try again');
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_REQUEST:
        status = props.status;
        break;

      case USER_FOLLOW_UNFOLLOW_SUCCESS:
        status = props.status;
        //props.userSearchReq({ keyword: usersSearchText })
        break;

      case USER_FOLLOW_UNFOLLOW_FAILURE:
        toast('Opps', 'Something went wrong, Please try again');
        status = props.status;
        break;
    }
  }

  if (postStatus === '' || postStatus !== props.postStatus) {
    switch (props.postStatus) {
      case SEARCH_POST_REQUEST:
        postStatus = props.postStatus;
        break;

      case SEARCH_POST_SUCCESS:
        postStatus = props.postStatus;
        setSearchPostData(props.searchPostData);
        // console.log("userpost"+props.userSearchFromHome)
        let newarray = [];
        props.searchPostData.map((item, index) => {
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
          if (index === props.searchPostData.length - 1) {
            setTotalReact(newarray);
            //  console.log("newarrr"+ JSON.stringify(newarray))
          }
        });

        break;

      case SEARCH_POST_FAILURE:
        toast('Opps', 'Something went wrong, Please try again');
        postStatus = props.postStatus;
        break;
    }
  }

  if (top50Status === '' || top50Status !== props.top50SongsStatus) {
    switch (props.top50SongsStatus) {
      case TOP_50_SONGS_REQUEST:
        top50Status = props.top50SongsStatus;
        break;

      case TOP_50_SONGS_SUCCESS:
        top50Status = props.top50SongsStatus;
        setTop50(
          props.top50SongsResponse
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .sort((a, b) => (a.count < b.count ? 1 : -1)),
        );

        break;

      case TOP_50_SONGS_FAILURE:
        top50Status = props.top50SongsStatus;
        // console.log('ERROR', props.error.response);
        break;
    }
  }

  if (userstatus === '' || props.userstatus !== userstatus) {
    // console.log('status' + props.userstatus);
    switch (props.userstatus) {
      case GET_USER_FROM_HOME_REQUEST:
        userstatus = props.userstatus;
        break;

      case GET_USER_FROM_HOME_SUCCESS:
        userstatus = props.userstatus;
        setUserSearchData(props.userSearchFromHome);

        break;

      case GET_USER_FROM_HOME_FAILURE:
        userstatus = props.userstatus;
        break;
    }
  }

  // RENDER FUNCTION FLATLIST
  function renderUserData(data) {
    return (
      <ActivityListItem
        image={constants.profile_picture_base_url + data.item.profile_image}
        user={data.item.username}
        type={true}
        userId={data.item.user_id}
        loginUserId={props.userProfileResp._id}
        follow={data.item.isFollowing ? false : true}
        bottom={data.index === props.userSearch.length - 1 ? true : false}
        marginBottom={
          data.index === props.userSearch.length - 1
            ? normalise(80)
            : normalise(0)
        }
        onPressImage={() => {
          props.navigation.navigate('OthersProfile', {
            id: data.item._id,
            following: data.item.isFollowing,
          });
        }}
        onPress={() => {
          props.followReq({ follower_id: data.item._id });
        }}
        TouchableOpacityDisabled={false}
      />
    );
  }

  function _onReaction(ID, reaction, reactionList) {
    let newarray = searchPostData;
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
        setSearchPostData([...newarray]);
      }
    });
  }

  function _onSelectBack(ID, comment) {
    let newarray = searchPostData;
    newarray.map((item, index) => {
      if (item._id === ID) {
        newarray[index].comment_count = comment;
      }
      if (index === newarray.length - 1) {
        setSearchPostData([...newarray]);
      }
    });
  }

  function renderSongData(data) {
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
            type: 'search',
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
        marginBottom={
          data.index === searchPostData.length - 1 ? normalise(50) : 0
        }
      />
    );
  }

  function renderGenreData(data) {
    return (
      <TouchableOpacity
        style={{
        //   margin: normalise(4),
        }}
        onPress={() => {
          props.navigation.navigate('GenreSongClicked', {
            data: data.item._id,
            ptID: 0,
          });
        }}>
        <Image
          source={{
            uri: data.item.song_image.replace('100x100bb.jpg', '500x500bb.jpg'),
          }}
          style={{
            width: Math.floor(Dimensions.get('window').width / 2),
            height: Math.floor(Dimensions.get('window').width / 2),
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }
  // RENDER FUNCTION FLATLIST END

  // SEND REACTION
  function sendReaction(id, reaction) {
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

    searchPostData.map((item, index) => {
      if (id === item._id) {
        if (myReaction === 'A') {
          if (searchPostData[index].fire_count === totalReact[index].react[0]) {
            searchPostData[index].fire_count =
              searchPostData[index].fire_count + 1;
            searchPostData[index].reaction_count =
              searchPostData[index].reaction_count + 1;
          } else {
            if (searchPostData[index].fire_count !== 0) {
              searchPostData[index].fire_count =
                searchPostData[index].fire_count - 1;
              searchPostData[index].reaction_count =
                searchPostData[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'B') {
          if (searchPostData[index].love_count === totalReact[index].react[1]) {
            searchPostData[index].love_count =
              searchPostData[index].love_count + 1;
            searchPostData[index].reaction_count =
              searchPostData[index].reaction_count + 1;
          } else {
            if (searchPostData[index].love_count !== 0) {
              searchPostData[index].love_count =
                searchPostData[index].love_count - 1;
              searchPostData[index].reaction_count =
                searchPostData[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'C') {
          if (
            searchPostData[index].dancer_count === totalReact[index].react[2]
          ) {
            searchPostData[index].dancer_count =
              searchPostData[index].dancer_count + 1;
            searchPostData[index].reaction_count =
              searchPostData[index].reaction_count + 1;
          } else {
            if (searchPostData[index].dancer_count !== 0) {
              searchPostData[index].dancer_count =
                searchPostData[index].dancer_count - 1;
              searchPostData[index].reaction_count =
                searchPostData[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'D') {
          if (
            searchPostData[index].man_dancing_count ===
            totalReact[index].react[3]
          ) {
            searchPostData[index].man_dancing_count =
              searchPostData[index].man_dancing_count + 1;
            searchPostData[index].reaction_count =
              searchPostData[index].reaction_count + 1;
          } else {
            if (searchPostData[index].man_dancing_count !== 0) {
              searchPostData[index].man_dancing_count =
                searchPostData[index].man_dancing_count - 1;
              searchPostData[index].reaction_count =
                searchPostData[index].reaction_count - 1;
            }
          }
        } else if (myReaction === 'E') {
          if (searchPostData[index].face_count === totalReact[index].react[4]) {
            searchPostData[index].face_count =
              searchPostData[index].face_count + 1;
            searchPostData[index].reaction_count =
              searchPostData[index].reaction_count + 1;
          } else {
            if (searchPostData[index].face_count !== 0) {
              searchPostData[index].face_count =
                searchPostData[index].face_count - 1;
              searchPostData[index].reaction_count =
                searchPostData[index].reaction_count - 1;
            }
          }
        } else {
          if (
            searchPostData[index].thumbsup_count === totalReact[index].react[5]
          ) {
            searchPostData[index].thumbsup_count =
              searchPostData[index].thumbsup_count + 1;
            searchPostData[index].reaction_count =
              searchPostData[index].reaction_count + 1;
          } else {
            if (searchPostData[index].thumbsup_count !== 0) {
              searchPostData[index].thumbsup_count =
                searchPostData[index].thumbsup_count - 1;
              searchPostData[index].reaction_count =
                searchPostData[index].reaction_count - 1;
            }
          }
        }
      }
    });

    isInternetConnected()
      .then(() => {
        props.reactionOnPostRequest(reactionObject);
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
  }

  // HIT REACT
  function hitreact(x, rindex) {
    if (!_.isEmpty(props.searchPostData[rindex].reaction)) {
      // console.log('here');

      const present = props.searchPostData[rindex].reaction.some(
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

  // SEARCH AND CLEAR FUNCTIONS
  const search = text => {
    if (usersSearch) {
      if (text.length >= 1) {
        isInternetConnected()
          .then(() => {
            props.userSearchReq({ keyword: text }, sendSong);
          })
          .catch(() => {
            toast('Error', 'Please Connect To Internet');
          });
      }
    } else if (songSearch) {
      if (text.length >= 0) {
        isInternetConnected()
          .then(() => {
            props.searchPost(text, flag);
          })
          .catch(() => {
            toast('Error', 'Please Connect To Internet');
          });
      }
    } else {
      let search = _.filter(props.top50SongsResponse, item => {
        return item._id.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      });
      // alert("search"+JSON.stringify(search))
      setTop50(search);
    }
  };

  const clearSearch = () => {
    if (usersSearch) {
      setSongData([]);
    } else if (songSearch) {
      setSearchPostData([]);
      setPositionInArray(0);
    } else {
      setTop50(props.top50SongsResponse);
    }
  };

  const getContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        // console.log(err);
      } else {
        let contactsArray = contacts;
        let finalArray = [];
        setContactsLoading(false);
        //// console.log(JSON.stringify(contacts));
        contactsArray.map(item => {
          item.phoneNumbers.map(item => {
            let number = item.number.replace(/[- )(]/g, '');
            let check = number.charAt(0);
            let number1 = parseInt(number);
            if (check === 0) {
              finalArray.push(number1);
            } else {
              const converToString = number1.toString();
              const myVar = number1.toString().substring(0, 2);
              const threeDigitVar = number1.toString().substring(0, 3);

              if (threeDigitVar === '440') {
                let backToInt = converToString.replace(threeDigitVar, '0');
                finalArray.push(backToInt);
              } else {
                if (myVar === '44' || myVar === '91') {
                  let backToInt = converToString.replace(myVar, '0');
                  finalArray.push(backToInt);
                } else {
                  let updatednumber = `0${number1}`;
                  finalArray.push(updatednumber);
                }
              }
            }
          });
        });

        // console.log(finalArray);
        props.navigation.navigate('UsersFromContacts', { data: finalArray });
      }
    });
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //VIEW
  return (
    <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
      <StatusBar backgroundColor={Colors.darkerblack} />

      <Loader visible={props.status === USER_SEARCH_REQUEST} />

      <Loader visible={props.postStatus === SEARCH_POST_REQUEST} />

      <Loader visible={props.top50SongsStatus === TOP_50_SONGS_REQUEST} />

      <Loader visible={contactsLoading} />

      <Loader visible={bool} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderComponent
            firstitemtext={true}
            textone={''}
            title={'EXPLORE'}
            thirditemtext={true}
            texttwo={''}
            hideBorderBottom={true}
          />
          <View
            style={{
              backgroundColor: Colors.darkerblack,
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: normalise(40),
              borderBottomColor: Colors.fadeblack,
              borderBottomWidth: 1,
            }}>
            <TouchableOpacity
              style={{
                width: '33%',
                height: normalise(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRightWidth: normalise(1),
                borderRightColor: Colors.darkerblack,
              }}
              onPress={() => {
                props.getTop50SongReq();
                setUsersSearch(false);
                setGenreSearch(true);
                setSongSearch(false);
              }}>
              <Text
                style={{
                  color: genreSearch ? Colors.white : Colors.grey_text,
                  fontFamily: 'Kallisto',
                  fontSize: normalise(10),
                  textTransform: 'uppercase',
                }}>
                Top Songs
              </Text>
              {genreSearch ? (
                <Image
                  source={ImagePath.gradient_border_horizontal}
                  style={{
                    width: '100%',
                    height: normalise(3),
                    position: 'absolute',
                    bottom: 0,
                  }}
                  resizeMode="contain"
                />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '33%',
                height: normalise(40),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setUsersSearch(true);
                setGenreSearch(false);
                setSongSearch(false);
              }}>
              <Text
                style={{
                  color: usersSearch ? Colors.white : Colors.grey_text,
                  fontFamily: 'Kallisto',
                  fontSize: normalise(10),
                  textTransform: 'uppercase',
                }}>
                Users
              </Text>
              {usersSearch ? (
                <Image
                  source={ImagePath.gradient_border_horizontal}
                  style={{
                    width: '100%',
                    height: normalise(3),
                    position: 'absolute',
                    bottom: 0,
                  }}
                  resizeMode="contain"
                />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '33%',
                height: normalise(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderLeftWidth: normalise(1),
                borderLeftColor: Colors.darkerblack,
              }}
              onPress={() => {
                setUsersSearch(false);
                setGenreSearch(false);
                setSongSearch(true);
              }}>
              <Text
                style={{
                  color: songSearch ? Colors.white : Colors.grey_text,
                  fontFamily: 'Kallisto',
                  fontSize: normalise(10),
                  textTransform: 'uppercase',
                }}>
                Songs
              </Text>
              {songSearch ? (
                <Image
                  source={ImagePath.gradient_border_horizontal}
                  style={{
                    width: '100%',
                    height: normalise(3),
                    position: 'absolute',
                    bottom: 0,
                  }}
                  resizeMode="contain"
                />
              ) : null}
            </TouchableOpacity>
          </View>
          {usersSearch || songSearch ? (
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                marginTop: normalise(16),
                marginBottom: normalise(16),
              }}>
              <TextInput
                style={{
                  height: normalise(35),
                  // width: '92%',
                  // backgroundColor: Colors.fadeblack,
                  borderRadius: normalise(8),
                  padding: normalise(10),
                  color: Colors.white,
                  marginHorizontal: normalise(12),
                  backgroundColor: Colors.fadeblack,
                  paddingLeft: normalise(35),
                }}
                keyboardAppearance="dark"
                autoCorrect={false}
                value={usersSearch ? usersSearchText : songSearchText}
                placeholder={usersSearch ? 'Search Users' : 'Search Songs'}
                placeholderTextColor={Colors.darkgrey}
                onChangeText={text => {
                  search(text);
                  usersSearch
                    ? setUsersSearchText(text)
                    : setSongSearchText(text);
                }}
              />
              <Image
                source={ImagePath.searchicongrey}
                style={{
                  position: 'absolute',
                  height: normalise(15),
                  width: normalise(15),
                  bottom: normalise(10),
                  paddingLeft: normalise(35),
                  marginHorizontal: normalise(12),
                  transform: [{ scaleX: -1 }],
                }}
                resizeMode="contain"
              />
              {(usersSearch && usersSearchText) ||
                (songSearch && songSearchText) ? (
                <TouchableOpacity
                  onPress={() => {
                    clearSearch();
                    usersSearch
                      ? setUsersSearchText('')
                      : genreSearch
                        ? setGenreSearchText('')
                        : setSongSearchText('');
                  }}
                  style={{
                    // backgroundColor: Colors.black,
                    padding: 10,
                    paddingTop: 4,
                    paddingBottom: 4,
                    borderRadius: 5,
                    backgroundColor: Colors.darkerblack,
                    position: 'absolute',
                    right: 12,
                    bottom:
                      Platform.OS === 'ios' ? normalise(8) : normalise(8),
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
              ) : null}
            </View>
          ) : (
            <View />
          )}
          {usersSearch ? ( //USERS VIEW
            songData.length === 0 ? (
              !isKeyboardVisible && (
                <EmptyComponent
                  buttonPress={() => {
                    setContactsLoading(true);
                    getContacts();
                  }}
                  buttonText={'Search Phonebook'}
                  image={ImagePath.emptyUser}
                  text={
                    'Search above to find users you want to follow by either their username or just typing their name.'
                  }
                  title={'Search Users to Follow'}
                />
              )
            ) : (
              <View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: normalise(12),
                    paddingBottom: normalise(8),
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'ProximaNova-Bold',
                      color: Colors.white,
                      fontSize: normalise(12),
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    RESULTS ({songData.length})
                  </Text>
                </View> */}
                <FlatList
                  style={{
                    height: Dimensions.get('window').height - 295,
                  }}
                  data={songData}
                  renderItem={renderUserData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={Seperator}
                />
              </View>
            )
          ) : null}

          {songSearch ? ( //SONG VIEW
            searchPostData.length === 0 ? (
              !isKeyboardVisible && (
                <EmptyComponent
                  image={ImagePath.emptySong}
                  text={
                    'Search for a song or artist you love to find which other Choona users are posting them as well.'
                  }
                  title={'Explore posts containing a song'}
                />
              )
            ) : (
              <View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: normalise(12),
                    paddingBottom: normalise(8),
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'ProximaNova-Bold',
                      color: Colors.white,
                      fontSize: normalise(12),
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    RESULTS ({searchPostData.length})
                  </Text>
                </View> */}

                <FlatList
                  style={{ height: '70%' }}
                  data={searchPostData}
                  renderItem={renderSongData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                />
                {modalVisible && (
                  <MoreModal
                    setBool={setBool}
                    bottomSheetRef={bottomSheetRef}
                    index={positionInArray}
                    setIndex={setPositionInArray}
                    navigation={props.navigation}
                    postData={props.searchPostData}
                    show={modalVisible}
                    setShow={setModalVisible}
                  />
                )}
              </View>
            )
          ) : null}
          {genreSearch ? ( //Top Songs VIEW
            top50.length === 0 ? (
              !isKeyboardVisible && (
                <EmptyComponent
                  image={ImagePath.emptyPost}
                  text={'No songs have been posted today.'}
                // title={'No songs have been posted today'}
                />
              )
            ) : (
              <>
                <FlatList
                  data={top50}
                  renderItem={renderGenreData}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <BannerAd
                    unitId={
                      Platform.OS === 'android'
                        ? 'ca-app-pub-2232736176622960/2335890938'
                        : 'ca-app-pub-2232736176622960/3492936227'
                    }
                    size={BannerAdSize.BANNER}
                    requestOptions={{
                      requestNonPersonalizedAdsOnly: true,
                    }}
                    onAdLoaded={() => {
                      // console.log('Advert loaded');
                    }}
                    onAdFailedToLoad={error => {
                      console.error('Advert failed to load: ', error);
                    }}
                  />
                </View>
              </>
            )
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    userSearch: state.UserReducer.userSearch,
    postStatus: state.PostReducer.status,
    searchPostData: state.PostReducer.searchPost,
    savedSongResponse: state.SongReducer.savedSongResponse,
    userProfileResp: state.UserReducer.userProfileResp,
    top50SongsResponse: state.SongReducer.top50SongsResponse,
    top50SongsStatus: state.SongReducer.status,
    error: state.SongReducer.error,
    messageStatus: state.MessageReducer.status,
    userstatus: state.UserReducer.status,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userSearchReq: (payload, sendSong) => {
      dispatch(userSearchRequest(payload, sendSong));
    },

    followReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },

    searchPost: (text, flag) => {
      dispatch(searchPostReq(text, flag));
    },

    reactionOnPostRequest: payload => {
      dispatch(reactionOnPostRequest(payload));
    },

    saveSongReq: payload => {
      dispatch(saveSongRequest(payload));
    },

    deletePostReq: payload => {
      dispatch(deletePostReq(payload));
    },

    getTop50SongReq: () => {
      dispatch(getTop50SongsRequest());
    },

    getusersFromHome: payload => {
      dispatch(getUsersFromHome(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
