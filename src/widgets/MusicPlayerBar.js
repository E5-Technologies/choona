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
import { connect } from 'react-redux';
import Loader from './AuthLoader';
import { usePlayFullAppleMusic } from '../hooks/usePlayFullAppleMusic';
import { AppleMusicContext, useMusicPlayer } from '../context/AppleMusicContext';
import {
  useIsPlaying,
  useCurrentSong,
  Player,
} from '@lomray/react-native-apple-music';

function MusicPlayerBar(props) {
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
          const isPlaying = ref.isPlaying();
          setPlay(isPlaying);
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

  return props.playingSongRef !== '' ? (
    <View
      style={[styles.container, dynamicStyle]}>
      <Loader visible={bool} />
      {Platform.OS === 'ios' &&
        props.playingSongRef?.regType == 'apple' &&
        currentSongData?.id == props.playingSongRef?.apple_song_id &&
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
            <TouchableOpacity
              onPress={() => {
                onPress();
              }}>
              <Image
                source={
                  props?.playingSongRef?.song_pic
                    ? { uri: props.playingSongRef.song_pic }
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
                {props.playingSongRef.song_name}
              </Text>
              <Text
                style={{
                  color: Colors.grey_text,
                  fontSize: normalise(10),
                  fontFamily: 'ProximaNovaAW07-Medium',
                  // width: '100%',
                }}
                numberOfLines={1}>
                {props.playingSongRef.artist}
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
                disabled={disabled}
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
              disabled={disabled}
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
                disabled={disabled}
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
                      currentSongIndex >= totalSongs - 1 ? 'grey' : '#fff',
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
