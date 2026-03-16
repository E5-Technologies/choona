import React, { useState, useEffect, useContext } from 'react';
import propTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';

import normalise from '../utils/helpers/Dimens';
import Colors from '../assests/Colors';
import ImagePath from '../assests/ImagePath';
import { connect, useSelector } from 'react-redux';
import Loader from './AuthLoader';
import { usePlayFullAppleMusic } from '../hooks/usePlayFullAppleMusic';
import { AppleMusicContext, useMusicPlayer } from '../context/AppleMusicContext';
import { useSessionHosting } from '../hooks/useSessionHosting';
import {
  useIsPlaying,
  useCurrentSong,
  Player,
} from '@lomray/react-native-apple-music';

function MusicPlayerBar(props) {
  const sessionDetailReduxdata = useSelector(state => state.SessionReducer.sessionDetailData?.data);
  const islive = sessionDetailReduxdata?.isLive;
  const userProfileResp = useSelector(state => state.UserReducer.userProfileResp);

  const isInSession = React.useMemo(() => {
    if (!islive || !sessionDetailReduxdata?.users) return false;
    return sessionDetailReduxdata.users.some(
      user => user._id === userProfileResp?._id
    );
  }, [islive, sessionDetailReduxdata?.users, userProfileResp?._id]);

  const [play, setPlay] = useState(false);
  const [bool, setBool] = useState(true);
  const [time, setTime] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const { isPlaying } = useIsPlaying();
  const { song: currentSongData } = useCurrentSong();

  const {
    onToggle,
    checkPlaybackState,
    setPlaybackQueue,
  } = usePlayFullAppleMusic();

  const { progress, duration } = useMusicPlayer();
  const percentage = duration > 0 ? (progress / duration) * 100 : 0;

  const {
    haveAppleMusicSubscription,
  } = useContext(AppleMusicContext);

  const { isHost: isSessionHost, currentSyncStatus } = useSessionHosting({ enablePlaybackSync: false });

  useEffect(() => {
    const handleProgress = async () => {
      const progressState = await checkPlaybackState();
      console.log(JSON.stringify(progressState), 'this is progress state');
    };
    setTime(() => {
      handleProgress();
    }, 1000);
  }, []);

  const ref =
    global.playerReference !== null && global.playerReference !== undefined
      ? global.playerReference
      : null;

  const arrSongs = props.playingSongRef?.details?.songs;
  const currentSongIndex = arrSongs?.findIndex(
    item => item.isrc_code === props.playingSongRef?.isrc,
  );
  const totalSongs = arrSongs?.length;

  useEffect(() => {
    // if (Platform.OS == 'ios') {
    //     onAuth();
    //   }

    getPlatingState();
    getPlayingPosition();
    setTimeout(() => {
      setBool(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (
      haveAppleMusicSubscription &&
      Platform.OS === 'ios' &&
      props.playingSongRef?.regType === 'apple' &&
      currentSongData?.id === props.playingSongRef?.apple_song_id
    ) {
      setPlay(isPlaying);
    }
  }, [isPlaying, props.playingSongRef, currentSongData, haveAppleMusicSubscription]);

  function getPlatingState() {
    setTimeout(() => {
      // console.log(
      //   haveAppleMusicSubscription.toString(),
      //   'its sucnseiiton or not',
      // );
      if (
        haveAppleMusicSubscription &&
        Platform.OS == 'ios' &&
        props.playingSongRef?.regType == 'apple' &&
        currentSongData?.id == props.playingSongRef?.apple_song_id
      ) {
        // Alert.alert(isPlaying.toString())
        setPlay(isPlaying);
      } else {
        // Alert.alert('spotify')
        console.log('spotify');
        if (ref !== null && ref !== undefined) {
          const isActuallyPlaying = ref.isPlaying();
          setPlay(isActuallyPlaying);
        }
      }
    }, 1000);
  }

  function getPlayingPosition() {
    setTimeout(() => {
      if (ref !== null && ref !== undefined) {
        ref.getCurrentTime(seconds => {
          setTime(seconds);
        });
      }
    }, 1000);
  }

  const playOrPause = async () => {
    if (
      haveAppleMusicSubscription &&
      Platform.OS == 'ios' &&
      props.playingSongRef?.regType == 'apple'
    ) {
      if (currentSongData?.id == props.playingSongRef?.apple_song_id) {
        console.log('previousONsg', props.playingSongRef?.apple_song_id, currentSongData?.id)
        onToggle();
        setPlay(!play);
      } else {
        console.log('newsong', props.playingSongRef?.apple_song_id, currentSongData?.id)

        setPlay(true);
        // Await setPlaybackQueue so that the song is fully queued BEFORE we hit play.
        await setPlaybackQueue(props.playingSongRef?.apple_song_id);


        // Once the queue promises completes, we can safely play.
        setTimeout(() => {
          Player.play();
        }, 500);
      }
    } else {
      console.log('previousONsg11')
      const res = ref.isPlaying();
      if (res) {
        ref.pause();
        setPlay(false);
        // console.log('paused');
      } else {
        ref.play(success => {
          if (success) {
            // console.log('Playback End');
            setPlay(false);
          }
        });
        setPlay(true);
      }
    }
  };

  const changeSong = (type = 'next') => {
    if (currentSongIndex < 0) {
      return;
    }

    let nextIndex = currentSongIndex;

    if (type == 'next') {
      if (currentSongIndex + 1 >= totalSongs) {
        return;
      }
      nextIndex = currentSongIndex + 1;
    }

    if (type == 'previous') {
      if (currentSongIndex - 1 < 0) {
        return;
      }
      nextIndex = currentSongIndex - 1;
    }

    props?.onChangeSong &&
      props?.onChangeSong(props.playingSongRef?.details, nextIndex);
  };

  const onPress = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  const onPressPlayOrPause = () => {
    if (props.onPressPlayOrPause) {
      props.onPressPlayOrPause();
    }
  };

  const dynamicStyle = React.useMemo(() => ({
    position: props.position || 'absolute',
    bottom: props.bottom !== undefined ? props.bottom : 0,
  }), [props.position, props.bottom]);

  const currentSessionSong = useSelector(state => state.SessionReducer.currentSessionSong?.data);
  const showPlayer = props.playingSongRef !== '' || islive;

  // Derive target song from session synchronization if live
  const activeSong = React.useMemo(() => {
    if (props.playingSongRef !== '') {
      return props.playingSongRef;
    }
    if (islive) {
      const songs = sessionDetailReduxdata?.session_songs || [];
      const currentIndex = currentSyncStatus?.playIndex;
      if (currentIndex !== null && currentIndex !== undefined && currentIndex >= 0 && currentIndex < songs.length) {
        const target = songs[currentIndex];
        return {
          song_name: target.song_name,
          artist: target.artist_name,
          song_pic: target.song_image,
          regType: 'apple',
          apple_song_id: target.apple_song_id,
        };
      }
      return {
        song_name: currentSessionSong?.song_name || currentSongData?.title || 'Session Live',
        artist: currentSessionSong?.artist_name || currentSongData?.artist || 'Broadcasting',
        song_pic: currentSessionSong?.song_image || currentSongData?.artwork || sessionDetailReduxdata?.session_image,
        regType: 'apple',
        apple_song_id: currentSessionSong?.apple_song_id || currentSongData?.id,
      };
    }
    return null;
  }, [props.playingSongRef, islive, currentSyncStatus, sessionDetailReduxdata, currentSessionSong, currentSongData]);

  return showPlayer ? (
    <View
      style={[styles.container, dynamicStyle]}>
      <Loader visible={bool} />
      {Platform.OS === 'ios' &&
        activeSong?.regType === 'apple' &&
        (currentSongData?.id === activeSong?.apple_song_id || currentSongData?.id === activeSong?.id) &&
        haveAppleMusicSubscription ? (
        <View
          style={[styles.progress, {
            width: `${percentage}%`,
          }]}
        />
      ) : (
        <View
          style={[
            styles.progressSpotify,
            {
              width: `${time * 3.4}%`,
            },
          ]}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          onPress();
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              flex: 1,
            }}>
            {islive && (
              <View
                style={{
                  position: 'absolute',
                  top: normalise(-8),
                  left: normalise(0),
                  backgroundColor: Colors.red,
                  paddingHorizontal: normalise(4),
                  paddingVertical: normalise(1),
                  borderRadius: normalise(4),
                  zIndex: 10,
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(7),
                    fontWeight: 'bold',
                  }}>
                  LIVE
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                onPress();
              }}>
              <Image
                source={
                  activeSong?.song_pic || activeSong?.song_image
                    ? { uri: activeSong.song_pic || activeSong.song_image }
                    : null
                }
                style={{ height: normalise(45), width: normalise(45) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View
              style={{
                marginLeft: normalise(8),
                // width: '75%',
                flex: 1,
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(11),
                  fontFamily: 'ProximaNova-Semibold',
                  // width: '100%',
                }}
                numberOfLines={2}>
                {activeSong?.song_name}
              </Text>
              <Text
                style={{
                  color: Colors.grey_text,
                  fontSize: normalise(10),
                  fontFamily: 'ProximaNovaAW07-Medium',
                  // width: '100%',
                }}
                numberOfLines={1}>
                {activeSong?.artist}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {arrSongs?.length > 1 && (
              <TouchableOpacity
                disabled={disabled || isInSession}
                onPress={() => {
                  setDisabled(true);
                  changeSong('previous');
                  setTimeout(() => {
                    setDisabled(false);
                  }, 1000);
                }}
                style={{
                  height: normalise(32),
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: normalise(32),
                }}>
                <Image
                  source={ImagePath ? ImagePath?.backwardicon : null}
                  style={{
                    height: normalise(16),
                    width: normalise(16),
                    tintColor: currentSongIndex == 0 ? 'grey' : '#fff',
                  }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              disabled={disabled || (islive && !isSessionHost)}
              onPress={() => {
                setDisabled(true);
                playOrPause();
                onPressPlayOrPause();
                setTimeout(() => {
                  setDisabled(false);
                }, 1000);
              }}
              style={{
                height: normalise(44),
                alignItems: 'center',
                justifyContent: 'center',
                width: normalise(44),
              }}>
              <Image
                source={
                  ImagePath ? (play ? ImagePath.pause : ImagePath.play) : null
                }
                style={{ height: normalise(24), width: normalise(24) }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            {arrSongs?.length > 1 && (
              <TouchableOpacity
                disabled={disabled || isInSession}
                onPress={() => {
                  setDisabled(true);
                  changeSong('next');
                  setTimeout(() => {
                    setDisabled(false);
                  }, 1000);
                }}
                style={{
                  height: normalise(32),
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: normalise(32),
                }}>
                <Image
                  source={ImagePath ? ImagePath?.forwardicon : null}
                  style={{
                    height: normalise(16),
                    width: normalise(16),
                    tintColor:
                      currentSongIndex === totalSongs - 1 ? 'grey' : '#fff',
                  }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.fadeblack,
    opacity: 0.9,
  },
  progress: {
    height: normalise(2),
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
  },
  progressSpotify: {
    height: normalise(2),
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
  },

})

MusicPlayerBar.propTypes = {
  onPress: propTypes.func,
  onPressPlayOrPause: propTypes.func,
};

MusicPlayerBar.defaultProps = {
  onPress: null,
  onPressPlayOrPause: null,
};

const mapStateToProps = state => {
  return {
    playingSongRef: state.SongReducer.playingSongRef,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayerBar);
