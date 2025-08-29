import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {deleteMessageRequest} from '../../action/MessageAction';
import {deletePostReq} from '../../action/PostAction';
import {saveSongRequest, unsaveSongRequest} from '../../action/SongAction';
import {
  othersProfileRequest,
  ReportRequest,
  userFollowUnfollowRequest,
} from '../../action/UserAction';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import {SimpleOption} from '../common/SimpleOption';

const MoreModal1 = ({
  setBool,
  bottomSheetRef,
  chatData,
  chatId,
  chatList,
  deleteMessageReq,
  delPostReq,
  followUnfollowReq,
  index,
  navigation,
  openInAppleORSpotify,
  setIndex,
  page,
  postData,
  registerType,
  saveSongReq,
  savedSong,
  show,
  setShow,
  type,
  unsaveSongReq,
  Report,
  userProfileResp,
  othersProfileresp,
  othersProfileReq,
  setReportModal,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    if (othersProfileresp) {
      setIsFollowing(othersProfileresp.isFollowing);
    }
  }, [othersProfileresp]);

  console.log(postData?.[0], 'thisispostdata');

  const saveUnsaveAction = () => {
    if (page === 'savedSongs') {
      unsaveSongReq(savedSong[index]._id);
      setShow(!show);
    } else {
      let saveSongObject = {
        song_uri: postData[index].attributes.previews[0].url,
        song_name: postData[index].attributes.name,
        song_image:
          page === 'insideMessage'
            ? postData[index].image
            : postData[index].attributes?.artwork?.url?.replace(
                '{w}x{h}',
                '500x500',
              ),
        artist_name: postData[index].attributes.artistName,
        album_name: postData[index].attributes.albumName,
        // post_id: postData[index]?._id || postData[index]?.id, //(song id not post id) this id adde here  becasue this song is not related to the post , are only individual song, from top song(not contain post id)
        chat_id:
          page === 'insideMessage' || chatId ? postData[index]?.key : null,
        type: page === 'insideMessage' ? 'chat' : postData[index].type,
        isrc_code: postData[index].attributes.isrc,
        original_song_uri: postData[index].attributes.url,
        original_reg_type: registerType,
        apple_song_id: postData[index]?.id,
      };
      console.log(saveSongObject, 'fdkfjhsdfjdkf');
      saveSongReq(saveSongObject);
    }
  };

  const followUnfollowAction = () => {
    setIsFollowing(!isFollowing);
    followUnfollowReq({
      follower_id: postData[index].userDetails._id,
    });
  };

  const hanldePlaySong = item => {
    navigation.navigate('Player', {
      song_title: registerType === 'spotify' ? item.name : item.attributes.name,
      album_name:
        registerType === 'spotify'
          ? item.album.name
          : item.attributes.albumName,
      song_pic:
        registerType === 'spotify'
          ? item.album.images[0].url
          : item.attributes.artwork.url.replace('{w}x{h}', '300x300'),
      username: '',
      profile_pic: '',
      originalUri:
        registerType === 'spotify'
          ? item.external_urls.spotify
          : item.attributes.url,
      uri:
        registerType === 'spotify'
          ? item.preview_url
          : item.attributes.previews[0].url,
      artist:
        registerType === 'spotify'
          ? singerList(item.artists)
          : item.attributes.artistName,
      changePlayer: true,
      registerType: registerType,
      changePlayer2: registerType === 'spotify' ? true : false,
      id: registerType === 'spotify' ? item.id : item.id,
      apple_song_id: registerType === 'spotify' ? item.id : item.id,
      showPlaylist: false,
    });
  };

  const handleAddSong = (item, from) => {
    const songItem = {
      image:
        registerType === 'spotify'
          ? item.album.images[0].url
          : item.attributes.artwork.url.replace('{w}x{h}', '600x600'),
      title: registerType === 'spotify' ? item.name : item.attributes.name,
      title2:
        registerType === 'spotify'
          ? singerList(item.artists)
          : item.attributes.artistName,
      details: item,
      registerType: registerType,
    };

    console.log(songItem, 'when sent song to session');
    // return;

    switch (from || props?.route?.params?.from) {
      case 'CreatePost':
        navigation.navigate('CreatePost', songItem);
        break;
      case 'Playlist':
        navigation.navigate('CreatePlayList', {
          songItem,
          previousPlaylistData: [],
        });
        break;
      case 'AssembleSession':
        navigation.navigate('AssembleSession', {
          songItem,
          previousSessionData: [],
        });
        break;
      default:
        navigation.navigate('CreatePost', songItem);
        break;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={show}
      presentationStyle={'overFullScreen'}>
      <ImageBackground
        source={ImagePath ? ImagePath.page_gradient : null}
        style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={[styles.modalButton, {marginTop: 0}]}
            onPress={() => {
              setShow(false);
              hanldePlaySong(postData[index]);
            }}>
            <Image
              source={ImagePath ? ImagePath.choonaPlay : null}
              style={styles.modalButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.modalButtonText}>Play Song</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              setShow(false);
              saveUnsaveAction();
            }}>
            <Image
              source={ImagePath ? ImagePath.boxicon : null}
              style={styles.modalButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.modalButtonText}>
              {page === 'savedSongs' ? 'Unsave' : 'Save'} Song
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              setShow(false);
              if (bottomSheetRef) {
                bottomSheetRef.open();
              }

              let sendSongObject = {
                song_image: postData[index].attributes?.artwork?.url?.replace(
                  '{w}x{h}',
                  '500x500',
                ),
                preview_url: postData[index].attributes.previews[0].url,
                song_name: postData[index].attributes.name,
                artist_name: postData[index].attributes.artistName,
                album_name: postData[index]?.attributes?.albumName,
                item: postData[index || 0],
                registerType: registerType,
                isrc_code: postData[index]?.attributes?.isrc,
                apple_song_id: postData[index]?.id,
              };
              navigation.navigate('PlayerScreenSelectUser', {
                item: sendSongObject,
                page: page,
              });
            }}>
            <Image
              source={ImagePath ? ImagePath.sendicon : null}
              style={styles.modalButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.modalButtonText}>Send Song</Text>
          </TouchableOpacity>

          <SimpleOption
            actionIcon={ImagePath.add_white}
            title="Post a Song"
            pressEvent={() => {
              setShow(!show);
              handleAddSong(postData[index], 'CreatePost');
            }}
          />

          <SimpleOption
            actionIcon={ImagePath.add_white}
            title="Post a Playlist"
            pressEvent={() => {
              setShow(!show);
              handleAddSong(postData[index], 'Playlist');
            }}
          />
          <SimpleOption
            actionIcon={ImagePath.add_white}
            title="Create a Playlist"
            pressEvent={() => {
              setShow(!show);
              handleAddSong(postData[index], 'AssembleSession');
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setShow(!show);
              if (page !== 'player') {
                setIndex(0);
              }
            }}
            style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    chatList: state.MessageReducer.chatList,
    othersProfileresp: state.UserReducer.othersProfileresp,
    registerType: state.TokenReducer.registerType,
    savedSong: state.SongReducer.savedSongList,
    userProfileResp: state.UserReducer.userProfileResp,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteMessageReq: payload => {
      dispatch(deleteMessageRequest(payload));
    },
    delPostReq: payload => {
      dispatch(deletePostReq(payload));
    },
    followUnfollowReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },
    othersProfileReq: id => {
      dispatch(othersProfileRequest(id));
    },
    saveSongReq: payload => {
      dispatch(saveSongRequest(payload));
    },
    unsaveSongReq: id => {
      dispatch(unsaveSongRequest(id));
    },
    Report: payload => {
      dispatch(ReportRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreModal1);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: Colors.darkerblack,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  modalButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: normalise(18),
  },
  modalButtonIcon: {
    height: normalise(18),
    width: normalise(18),
  },
  modalButtonText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(13),
    marginLeft: normalise(15),
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: Colors.fadeblack,
    borderRadius: 6,
    height: normalise(40),
    justifyContent: 'center',
    marginBottom: normalise(20),
    marginTop: normalise(24),
    opacity: 10,
  },
  cancelButtonText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalise(12),
    textTransform: 'uppercase',
  },
});
