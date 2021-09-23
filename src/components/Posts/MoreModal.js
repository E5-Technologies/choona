import React, { useEffect, useState } from 'react';
import {
  Clipboard,
  Image,
  ImageBackground,
  Linking,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { deleteMessageRequest } from '../../action/MessageAction';
import { deletePostReq } from '../../action/PostAction';
import { saveSongRequest, unsaveSongRequest } from '../../action/SongAction';
import {
  othersProfileRequest,
  userFollowUnfollowRequest,
} from '../../action/UserAction';

import Colors from '../../assests/Colors';
import constants from '../../utils/helpers/constants';
import ImagePath from '../../assests/ImagePath';
import isInternetConnected from '../../utils/helpers/NetInfo';
import normalise from '../../utils/helpers/Dimens';
import toast from '../../utils/helpers/ShowErrorAlert';

const MoreModal = ({
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
  userProfileResp,
  othersProfileresp,
  othersProfileReq,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const userId = postData && postData[index].userDetails?._id;

  useEffect(() => {
    if (userId) {
      othersProfileReq(userId);
    }
  }, [othersProfileReq, userId]);

  useEffect(() => {
    if (othersProfileresp) {
      setIsFollowing(othersProfileresp.isFollowing);
    }
  }, [othersProfileresp]);

  const saveUnsaveAction = () => {
    if (page === 'savedSongs') {
      unsaveSongReq(savedSong[index]._id);
      setShow(!show);
    } else {
      let saveSongObject = {
        song_uri: postData[index].song_uri,
        song_name: postData[index].song_name,
        song_image:
          page === 'insideMessage'
            ? postData[index].image
            : postData[index].song_image,
        artist_name: postData[index].artist_name,
        album_name: postData[index].album_name,
        post_id: postData[index]._id,
        chat_id:
          page === 'insideMessage' || chatId ? postData[index].key : null,
        type: page === 'insideMessage' ? 'chat' : type,
        isrc_code: postData[index].isrc_code,
        original_song_uri: postData[index].original_song_uri,
        original_reg_type:
          page === 'insideMessage' || page === 'player'
            ? postData[index].original_reg_type
            : postData[index].userDetails.register_type,
      };
      saveSongReq(saveSongObject);
      setShow(!show);
    }
  };

  const deletePostAction = () => {
    if (chatData.length > 1) {
      let deleteMessagPayload = {
        ChatId: postData[index].key,
        chatToken: chatList[0].chat_token,
      };
      deleteMessageReq(deleteMessagPayload);
      setShow(!show);
      setIndex(0);
    } else {
      setShow(!show);
      setTimeout(() => {
        toast('', 'Last Message of a converstaion cannot be deleted');
      }, 1000);
    }
  };

  const openOnRegisterType = () => {
    if (
      page === 'savedSongs' || page === 'insideMessage' || page === 'player'
        ? postData[index].original_reg_type === registerType
        : postData[index].userDetails.register_type === registerType
    ) {
      setShow(false);
      setBool(true);
      Linking.canOpenURL(postData[index].original_song_uri)
        .then(() => {
          Linking.openURL(postData[index].original_song_uri)
            .then(() => {
              setBool(false);
            })
            .catch(() => { });
        })
        .catch(_err => { });
    } else {
      setShow(false);
      setBool(true);
      isInternetConnected()
        .then(() => {
          openInAppleORSpotify();
        })
        .catch(() => {
          toast('', 'Please Connect To Internet');
        });
    }
  };

  const followUnfollowAction = () => {
    setIsFollowing(!isFollowing);
    followUnfollowReq({
      follower_id: postData[index].userDetails._id,
    });
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
          {/* Save Song Action */}
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
            style={[styles.modalButton, { marginTop: 0 }]}
            onPress={() => {
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
          {/* Save Song Action */}
          {/* Send Song Action */}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShow(false);
              if (bottomSheetRef) {
                bottomSheetRef.open();
              }
              navigation.navigate('PlayerScreenSelectUser', {
                item: postData[index ? index : 0],
                page: page,
              });
            }}>
            <Image
              source={ImagePath ? ImagePath.sendicon : null}
              style={styles.modalButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.modalButtonText}>
              {page === 'insideMessage'
                ? 'Send Song to another user'
                : 'Send Song'}
            </Text>
          </TouchableOpacity>
          {/* Send Song Action */}
          {/* Copy Link to Song */}
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(postData[index].original_song_uri);
              setShow(!show);

              setTimeout(() => {
                toast('Success', 'Song Link copied to clipboard.');
              }, 1000);
            }}
            style={styles.modalButton}>
            <Image
              source={ImagePath ? ImagePath.more_copy : null}
              style={styles.modalButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.modalButtonText}>Copy Link to Song</Text>
          </TouchableOpacity>
          {/* Copy Link to Song */}
          {/* Copy Link to Post */}
          {page !== 'insideMessage' && (
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(
                  constants.website_url + '/s/' + postData[index]._id,
                );
                setShow(!show);

                setTimeout(() => {
                  toast('Success', 'Post Link copied to clipboard.');
                }, 1000);
              }}
              style={styles.modalButton}>
              <Image
                source={ImagePath ? ImagePath.more_copy_web : null}
                style={styles.modalButtonIcon}
                resizeMode="contain"
              />
              <Text style={styles.modalButtonText}>Copy Web Link to Post</Text>
            </TouchableOpacity>
          )}
          {/* Copy Link to Post */}
          {/* Unfollow/Delete Post Action */}
          {page !== 'savedSongs' && page !== 'player' && (
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                if (page === 'insideMessage') {
                  deletePostAction();
                } else {
                  setShow(!show);
                  userProfileResp._id !== postData[index].user_id // USER - FOLLOW/UNFOLLOW
                    ? followUnfollowAction()
                    : delPostReq(postData[index]._id);
                  //  DELETE POST
                }
              }}>
              <Image
                source={ImagePath ? ImagePath.more_unfollow : null}
                style={styles.modalButtonIcon}
                resizeMode="contain"
              />
              <Text style={styles.modalButtonText}>
                {page === 'insideMessage'
                  ? 'Delete Song'
                  : !_.isEmpty(userProfileResp)
                    ? userProfileResp._id === postData[index]?.user_id
                      ? 'Delete Post'
                      : isFollowing
                        ? `Unfollow ${postData[index]?.userDetails.username}`
                        : `Follow ${postData[index]?.userDetails.username}`
                    : ''}
              </Text>
            </TouchableOpacity>
          )}
          {/* Unfollow/Delete Post Action */}
          {/* Open on Platform Action */}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              openOnRegisterType();
            }}>
            <Image
              source={
                ImagePath
                  ? !_.isEmpty(userProfileResp)
                    ? userProfileResp.register_type === 'spotify'
                      ? ImagePath.spotifyicon
                      : ImagePath.applemusic
                    : null
                  : null
              }
              style={styles.modalButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.modalButtonText}>
              {!_.isEmpty(userProfileResp)
                ? userProfileResp.register_type === 'spotify'
                  ? 'Open on Spotify'
                  : 'Open on Apple'
                : ''}
            </Text>
          </TouchableOpacity>
          {/* Open on Platform Action */}
          {/* Add to Playlist Action */}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShow(!show);
              if (userProfileResp.register_type === 'spotify') {
                navigation.navigate('AddToPlayListScreen', {
                  originalUri: postData[index].original_song_uri,
                  registerType: postData[index].social_type,
                  isrc: postData[index].isrc_code,
                });
              } else {
                navigation.navigate('AddToPlayListScreen', {
                  isrc: postData[index].isrc_code,
                });
              }
            }}>
            <Image
              source={ImagePath ? ImagePath.addicon : null}
              style={styles.modalButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.modalButtonText}>Add to Playlist</Text>
          </TouchableOpacity>
          {/* Add to Playlist Action */}
          {/* Cancel Button */}
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
          {/* Cancel Button */}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreModal);

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
