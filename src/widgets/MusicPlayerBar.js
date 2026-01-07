import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import normalise from '../utils/helpers/Dimens';
import Colors from '../assests/Colors';
import ImagePath from '../assests/ImagePath';
import { connect } from 'react-redux';
import Loader from './AuthLoader';

function MusicPlayerBar(props) {
  const navigation = useNavigation();
  const [play, setPlay] = useState(false);
  const [bool, setBool] = useState(true);
  const [time, setTime] = useState(0);

  const ref =
    global.playerReference !== null && global.playerReference !== undefined
      ? global.playerReference
      : null;

  useEffect(() => {
    getPlatingState();
    getPlayingPosition();
    setTimeout(() => {
      setBool(false);
    }, 1000);
  }, [play]);

  function getPlatingState() {
    setInterval(() => {
      const ref =
        global.playerReference !== null && global.playerReference !== undefined
          ? global.playerReference
          : null;
      if (ref !== null && ref !== undefined) {
        const isPlaying = ref.isPlaying();

        setPlay(isPlaying);
      }
    }, 1000);
  }

  function getPlayingPosition() {
    setInterval(() => {
      const ref =
        global.playerReference !== null && global.playerReference !== undefined
          ? global.playerReference
          : null;
      if (ref !== null && ref !== undefined) {
        ref.getCurrentTime(seconds => {
          setTime(seconds);
        });
      }
    }, 1000);
  }

  const playOrPause = () => {
    const res = ref.isPlaying();
    if (res) {
      ref.pause();
      // console.log('paused');
    } else {
      ref.play(success => {
        if (success) {
          // console.log('Playback End');
        }
      });
    }
  };

  const onPress = () => {
    if (props.onPress) {
      props.onPress();
    } else {
      // default: navigate to Player with current playing song
      if (props.playingSongRef && props.playingSongRef !== '') {
        navigation.navigate('Player', {
          uri: props.playingSongRef.uri || props.playingSongRef.originalUri,
          song_title: props.playingSongRef.song_name,
          album_name: props.playingSongRef.album_name,
          artist: props.playingSongRef.artist,
          song_pic: props.playingSongRef.song_pic,
          username: props.playingSongRef.username,
          profile_pic: props.playingSongRef.profile_pic,
          isrc: props.playingSongRef.isrc,
          details: props.playingSongRef.details,
          id: props.playingSongRef.id,
          changePlayer: false,
        });
      }
    }
  };

  const onPressPlayOrPause = () => {
    if (props.onPressPlayOrPause) {
      props.onPressPlayOrPause();
    }
  };

  return props.playingSongRef !== '' ? (
    <View
      // source={ImagePath.gradientbar}
      style={{
        width: '100%',
        height: normalise(45),
        backgroundColor: Colors.fadeblack,
        opacity: 0.9,
        position: 'absolute',
        bottom: 0,
      }}>
      <Loader visible={bool} />
      <View
        style={{
          height: normalise(2),
          width: `${time * 3.4}%`,
          alignSelf: 'flex-start',
          backgroundColor: Colors.white,
        }}
      />
      <TouchableOpacity
        onPress={() => {
          onPress();
        }}>
        <View
          style={{
            width: '100%',
            paddingRight: normalise(13),
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                onPress();
              }}>
              <View>
                <Image
                  source={
                    props?.playingSongRef?.song_pic
                      ? { uri: props.playingSongRef.song_pic }
                      : null
                  }
                  style={{ height: normalise(45), width: normalise(45) }}
                  resizeMode="contain"
                />
                {props.liveSessionMinimized ? (
                  <View
                    style={{
                      position: 'absolute',
                      right: -normalise(4),
                      top: -normalise(6),
                      backgroundColor: Colors.red,
                      paddingHorizontal: normalise(6),
                      paddingVertical: normalise(2),
                      borderRadius: normalise(10),
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: normalise(8),
                        fontFamily: 'ProximaNova-Semibold',
                      }}>
                      Live
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginLeft: normalise(8),
                width: '75%',
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(11),
                  fontFamily: 'ProximaNova-Semibold',
                  width: '100%',
                }}
                numberOfLines={1}>
                {props.playingSongRef.song_name}
              </Text>
              <Text
                style={{
                  color: Colors.grey_text,
                  fontSize: normalise(10),
                  fontFamily: 'ProximaNovaAW07-Medium',
                  width: '100%',
                }}
                numberOfLines={1}>
                {props.playingSongRef.artist}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              playOrPause(), onPressPlayOrPause();
            }}>
            <Image
              source={
                ImagePath ? (play ? ImagePath.pause : ImagePath.play) : null
              }
              style={{ height: normalise(25), width: normalise(25) }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
}

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
    liveSessionMinimized: state.PlayerReducer.liveSessionMinimized,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayerBar);
