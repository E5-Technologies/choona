import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Linking,
  TextInput,
  Image,
} from 'react-native';
import Seperator from './ListCells/Seperator';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import InsideMessegeHeader from '../../widgets/InsideMessegeHeader';
import SavedSongsListItem from '../main/ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import StatusBar from '../../utils/MyStatusBar';
import {
  loadChatMessageRequest,
  searchMessageRequest,
  deleteMessageRequest,
  createChatTokenRequest,
} from '../../action/MessageAction';
import { getUsersFromHome } from '../../action/UserAction';
import { saveSongRequest } from '../../action/SongAction';
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import {
  CHAT_LOAD_REQUEST,
  GET_USER_FROM_HOME_REQUEST,
  GET_USER_FROM_HOME_SUCCESS,
  GET_USER_FROM_HOME_FAILURE,
  CREATE_CHAT_TOKEN_REQUEST,
  CREATE_CHAT_TOKEN_SUCCESS,
  CREATE_CHAT_TOKEN_FAILURE,
} from '../../action/TypeConstants';
import toast from '../../utils/helpers/ShowErrorAlert';
import Loader from '../../widgets/AuthLoader';
import _ from 'lodash';
import { getSpotifyToken } from '../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../utils/helpers/AppleDevToken';
import axios from 'axios';

let status = '';
let userStatus = '';
import database from '@react-native-firebase/database';
import MoreModal from '../Posts/MoreModal';

const FIREBASE_REF_MESSAGES = database().ref('chatMessages');

function InsideaMessage(props) {
  // console.log(props);
  const [index, setIndex] = useState(props.route.params.index);
  const [chatData, setChatData] = useState([]);

  const [search, setSearch] = useState('');
  const [bool, setBool] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [positionInArray, setPositionInArray] = useState(0);
  const [userSeach, setUserSeach] = useState('');
  const [userSearchData, setUserSearchData] = useState([]);
  const [usersToSEndSong, sesUsersToSEndSong] = useState([]);

  var bottomSheetRef;

  useEffect(function () {
    props.loadChatMessageRequest({
      chatToken: props.chatList[index].chat_token,
      isMount: true,
      userId: props.userProfileResp._id,
    });

    return () => {
      props.loadChatMessageRequest({
        chatToken: props.chatList[index].chat_token,
        isMount: false,
        userId: props.userProfileResp._id,
      });
    };
  }, []);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case CREATE_CHAT_TOKEN_REQUEST:
        status = props.status;
        break;

      case CREATE_CHAT_TOKEN_SUCCESS:
        status = props.status;
        // console.log('inside a message');
        setUserSearchData([]);
        sesUsersToSEndSong([]);
        setUserSeach('');
        props.navigation.navigate('SendSongInMessageFinal', {
          image: props.searchedChatData[positionInArray].image,
          title: props.searchedChatData[positionInArray].song_name,
          title2: props.searchedChatData[positionInArray].artist_name,
          users: usersToSEndSong,
          details: props.searchedChatData[positionInArray],
          registerType: props.registerType,
          fromAddAnotherSong: false,
          index: 0,
          fromHome: true,
        });
        break;

      case CREATE_CHAT_TOKEN_FAILURE:
        status = props.status;
        toast('Error', 'Something Went Wong, Please Try Again');
        break;
    }
  }

  if (userStatus === '' || props.userStatus !== userStatus) {
    switch (props.userStatus) {
      case GET_USER_FROM_HOME_REQUEST:
        userStatus = props.userStatus;
        break;

      case GET_USER_FROM_HOME_SUCCESS:
        userStatus = props.userStatus;
        setUserSearchData(props.userSearchFromHome);
        break;

      case GET_USER_FROM_HOME_FAILURE:
        userStatus = props.userStatus;
        break;
    }
  }

  function renderItem(data) {
    // console.log(JSON.stringify(data.item.userDeletedArr));
    if (data.item === null) {
      return false;
    }

    return (
      <View>
        {data.item.hasOwnProperty('userDeletedArr') ? (
          data.item.userDeletedArr.includes(
            props.userProfileResp._id,
          ) ? null : (
            <SavedSongsListItem
              playIcon={false}
              image={data.item.image}
              title={data.item.song_name}
              singer={data.item.artist_name}
              comments={data.item.message[data.item.message.length - 1].text}
              onPress={() => {
                setModalVisible(true);
                setPositionInArray(data.index);
              }}
              onPressItem={() => {
                props.navigation.navigate('Player', {
                  username: props.chatList[index].username,
                  time: props.chatList[index].time,
                  song_title: data.item.song_name,
                  album_name: data.item.album_name,
                  song_pic: data.item.image,
                  uri: data.item.hasOwnProperty('song_uri')
                    ? data.item.song_uri
                    : null,
                  artist: data.item.artist_name,
                  changePlayer: true,
                  comingFromMessage: true,
                  comments: data.item.message,
                  key: data.item.key,
                  chatToken: props.chatList[index].chat_token,
                  receiver_id:
                    props.userProfileResp._id === data.item.receiver_id
                      ? data.item.sender_id
                      : data.item.receiver_id, //data.item.sender_id
                  sender_id: props.userProfileResp._id, //data.item.receiver_id
                  isrc: data.item.isrc_code,
                  originalUri: data.item.hasOwnProperty('original_song_uri')
                    ? data.item.original_song_uri
                    : undefined,
                  registerType: data.item.original_reg_type,
                  details: data.item,
                });
              }}
              onPressImage={() => {
                props.navigation.navigate('Player', {
                  username: props.chatList[index].username,
                  time: props.chatList[index].time,
                  song_title: data.item.song_name,
                  album_name: data.item.album_name,
                  song_pic: data.item.image,
                  uri: data.item.hasOwnProperty('song_uri')
                    ? data.item.song_uri
                    : null,
                  artist: data.item.artist_name,
                  changePlayer: true,
                  comingFromMessage: true,
                  comments: data.item.message,
                  key: data.item.key,
                  chatToken: props.chatList[index].chat_token,
                  receiver_id:
                    props.userProfileResp._id === data.item.receiver_id
                      ? data.item.sender_id
                      : data.item.receiver_id, //data.item.sender_id
                  sender_id: props.userProfileResp._id, //data.item.receiver_id
                  isrc: data.item.isrc_code,
                  originalUri: data.item.hasOwnProperty('original_song_uri')
                    ? data.item.original_song_uri
                    : undefined,
                  registerType: data.item.original_reg_type,
                  details: data.item,
                });
              }}
              marginBottom={
                data.index === chatData.length - 1 ? normalise(20) : 0
              }
            />
          )
        ) : (
          <SavedSongsListItem
            playIcon={false}
            receiver_id={data.item.receiver_id}
            user_id={props.userProfileResp._id}
            read={data.item.read}
            image={data.item.image}
            title={data.item.song_name}
            singer={data.item.artist_name}
            comments={data.item.message[data.item.message.length - 1].text}
            onPress={() => {
              setModalVisible(true), setPositionInArray(data.index);
            }}
            onPressItem={() => {
              if (props.userProfileResp._id === data.item.receiver_id) {
                const listener = FIREBASE_REF_MESSAGES.child(
                  props.chatList[index].chat_token,
                )
                  .child(data.item.key)
                  .update(
                    {
                      read: true,
                    },
                    error => {
                      emiter({ error: error || null });
                    },
                  );
              }

              props.navigation.navigate('Player', {
                username: props.chatList[index].username,
                time: props.chatList[index].time,
                song_title: data.item.song_name,
                album_name: data.item.album_name,
                song_pic: data.item.image,
                uri: data.item.hasOwnProperty('song_uri')
                  ? data.item.song_uri
                  : null,
                artist: data.item.artist_name,
                changePlayer: true,
                comingFromMessage: true,
                comments: data.item.message,
                key: data.item.key,
                chatToken: props.chatList[index].chat_token,
                receiver_id:
                  props.userProfileResp._id === data.item.receiver_id
                    ? data.item.sender_id
                    : data.item.receiver_id, //data.item.sender_id
                sender_id: props.userProfileResp._id, //data.item.receiver_id
                isrc: data.item.isrc_code,
                originalUri: data.item.hasOwnProperty('original_song_uri')
                  ? data.item.original_song_uri
                  : undefined,
                registerType: data.item.original_reg_type,
                details: data.item,
              });
            }}
            onPressImage={() => {
              props.navigation.navigate('Player', {
                song_title: data.item.song_name,
                album_name: data.item.album_name,
                song_pic: data.item.image,
                uri: data.item.hasOwnProperty('song_uri')
                  ? data.item.song_uri
                  : null,
                artist: data.item.artist_name,
                changePlayer: true,
                comingFromMessage: true,
                comments: data.item.message,
                key: data.item.key,
                chatToken: props.chatList[index].chat_token,
                receiver_id:
                  props.userProfileResp._id === data.item.receiver_id
                    ? data.item.sender_id
                    : data.item.receiver_id, //data.item.sender_id
                sender_id: props.userProfileResp._id, //data.item.receiver_id
                isrc: data.item.isrc_code,
                originalUri: data.item.hasOwnProperty('original_song_uri')
                  ? data.item.original_song_uri
                  : undefined,
                registerType: data.item.original_reg_type,
                details: data.item,
              });
            }}
            marginBottom={
              data.index === chatData.length - 1 ? normalise(20) : 0
            }
          />
        )}
      </View>
    );
  }

  // GET ISRC CODE
  const callApi = async () => {
    if (props.registerType === 'spotify') {
      const spotifyToken = await getSpotifyToken();

      return await axios.get(
        `https://api.spotify.com/v1/search?q=isrc:${props.searchedChatData[positionInArray].isrc_code}&type=track`,
        {
          headers: {
            Authorization: spotifyToken,
          },
        },
      );
    } else {
      const AppleToken = await getAppleDevToken();

      return await axios.get(
        `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${props.searchedChatData[positionInArray].isrc_code}`,
        {
          headers: {
            Authorization: AppleToken,
          },
        },
      );
    }
  };

  //OPEN IN APPLE / SPOTIFY
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
          }
        } else {
          toast('', 'No Song Found');
        }
      } else {
        toast('Oops', 'Something Went Wrong');
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <Loader visible={props.status === CHAT_LOAD_REQUEST} />

      <StatusBar backgroundColor={Colors.darkerblack} />

      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}> */}
      <SafeAreaView style={{ flex: 1 }}>
        <InsideMessegeHeader
          firstitemtext={false}
          imageone={
            constants.profile_picture_base_url +
            props.userProfileResp.profile_image
          }
          imagesecond={
            constants.profile_picture_base_url +
            props.chatList[index].profile_image
          }
          title={props.chatList[index].username}
          thirditemtext={false}
          imagetwoheight={25}
          imagetwowidth={25}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />
        <View
          style={{
            width: '92%',
            alignSelf: 'center',
          }}>
          <TextInput
            autoCorrect={false}
            keyboardAppearance={'dark'}
            style={{
              height: normalise(35),
              width: '100%',
              backgroundColor: Colors.white,
              borderRadius: normalise(8),
              marginTop: normalise(20),
              padding: normalise(10),
              // color: Colors.white,
              paddingLeft: normalise(30),
              paddingRight: normalise(50),
            }}
            value={search}
            placeholder={'Search'}
            placeholderTextColor={Colors.darkgrey}
            onChangeText={text => {
              setSearch(text), props.searchMessageRequest(text);
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

          {search === '' ? null : (
            <TouchableOpacity
              onPress={() => {
                setSearch(''), props.searchMessageRequest('');
              }}
              style={{
                backgroundColor: Colors.fordGray,
                padding: 6,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 5,

                position: 'absolute',
                right: 0,
                bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
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

        <SwipeListView
          data={props.searchedChatData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            index.toString();
          }}
          disableRightSwipe={true}
          rightOpenValue={-75}
          ItemSeparatorComponent={Seperator}
        />

        <TouchableOpacity
          style={{
            marginBottom: normalise(10),
            marginTop: normalise(10),
            height: normalise(44),
            width: '90%',
            alignSelf: 'center',
            borderRadius: normalise(25),
            backgroundColor: Colors.white,
            borderWidth: normalise(0.5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 9,
            elevation: 11,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: Colors.white,
          }}
          onPress={() => {
            props.navigation.replace('AddAnotherSong', {
              users: [
                {
                  _id:
                    props.searchedChatData[0].receiver_id ===
                      props.userProfileResp._id
                      ? props.searchedChatData[0].sender_id
                      : props.searchedChatData[0].receiver_id,
                  username: props.chatList[index].username,
                  full_name: props.chatList[index].full_name,
                  profile_image: props.chatList[index].profile_image,
                },
              ],
              index: index,
              othersProfile: false,
            });
          }}>
          <Text
            style={{
              marginLeft: normalise(10),
              color: Colors.gray,
              fontSize: normalise(14),
              fontFamily: 'ProximaNova-Bold',
            }}>
            SEND ANOTHER SONG
          </Text>
        </TouchableOpacity>
        {modalVisible && (
          <MoreModal
            setBool={setBool}
            bottomSheetRef={bottomSheetRef}
            chatData={props.chatData}
            chatList={props.chatList}
            index={positionInArray}
            setIndex={setPositionInArray}
            navigation={props.navigation}
            page={'insideMessage'}
            openInAppleORSpotify={openInAppleORSpotify}
            postData={props.searchedChatData}
            show={modalVisible}
            setShow={setModalVisible}
          />
        )}
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
}

const mapStateToProps = state => {
  return {
    chatList: state.MessageReducer.chatList,
    chatData: state.MessageReducer.chatData,
    searchedChatData: state.MessageReducer.searchedChatData,
    userProfileResp: state.UserReducer.userProfileResp,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
    registerType: state.TokenReducer.registerType,
    status: state.MessageReducer.status,
    userStatus: state.UserReducer.status,
    error: state.MessageReducer.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadChatMessageRequest: payload => {
      dispatch(loadChatMessageRequest(payload));
    },
    searchMessageRequest: payload => {
      dispatch(searchMessageRequest(payload));
    },
    deleteMessageRequest: payload => {
      dispatch(deleteMessageRequest(payload));
    },
    getusersFromHome: payload => {
      dispatch(getUsersFromHome(payload));
    },
    createChatTokenRequest: payload => {
      dispatch(createChatTokenRequest(payload));
    },
    saveSongReq: payload => {
      dispatch(saveSongRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InsideaMessage);

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
