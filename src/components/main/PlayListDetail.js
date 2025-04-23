import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Colors from '../../assests/Colors';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import HeaderComponent from '../../widgets/HeaderComponent';
import ImagePath from '../../assests/ImagePath';
import TextInputField from '../../widgets/TextInputField';
import {connect} from 'react-redux';
import {createPostRequest} from '../../action/PostAction';
import {
  CREATE_POST_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
} from '../../action/TypeConstants';
import {pausePlayerAction} from '../../saga/PlayerSaga';
import MusicPlayerBar from '../../widgets/MusicPlayerBar';
import MusicPlayer from '../../widgets/MusicPlayer';
import {saveSongRequest, saveSongRefReq} from '../../../action/SongAction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

let status;

function PlayListDetail(props) {
  console.log(props.route?.params, 'these are params');
  const {playSong, postArray} = props.route?.params;
  const [playVisible, setPlayVisible] = useState(false);
  //   const {songItem, previousPlaylistData} = props.route?.params;
  const [selectedItem, setItem] = useState({});
  const {width, height} = useWindowDimensions();
  const [playListArary, setPlayListArray] = useState(
    props.route?.params?.songsList?.item?.songs ?? [],
  );
  const [playListName, setPlayListName] = useState('');
  const [visibleminiPlayer, setVisibleMiniPlayer] = useState(true);
  const [timeoutVar, setTimeoutVar] = useState(0);
  // const [postArray, setPostArray] = useState([]);
  const [bool, setBool] = useState(false);

  console.log('postArray h ye', postArray);
  const {top, bottom} = useSafeAreaInsets();

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <SafeAreaView style={{flex: 1}}>
        <HeaderComponent
          firstitemtext={true}
          textone={'BACK'}
          title={'PLAYLIST'}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />

        <View style={{flex: 1}}>
          {playListArary && (
            <View style={styles.topContainerStyle}>
              <Text style={styles.mainTitleStyle} numberOfLines={1}>
                {props.route?.params?.songsList?.item?.playlist_name}
              </Text>
              <View
                style={[
                  styles.combienBanerWrapper,
                  {
                    width: width / 1.9,
                    height: width / 1.9,
                  },
                ]}>
                {playListArary?.map(item => {
                  return (
                    <Image
                      source={{uri: item?.song_image}}
                      style={styles.bannerImageStyle}
                      resizeMode="cover"
                    />
                  );
                })}
                {playListArary?.length > 4 && (
                  <View style={styles.moreTextWrapper}>
                    <Text style={styles.moreText}>
                      +{playListArary?.length - 4}
                    </Text>
                  </View>
                )}
              </View>

              <View style={[styles.bottomLineStyle, {width: width / 2}]}></View>
            </View>
          )}
          <View style={styles.playListItemContainer}>
            <FlatList
              data={playListArary}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.itemWrapper}
                    onPress={() => {
                      setItem(item);
                      // props.route?.params?.playSong
                      playSong(props.route?.params?.songsList, index);
                      setVisibleMiniPlayer(true);

                      // playSong(props.route?.params?.songsList, index)
                      // setVisibleMiniPlayer(true);
                      // setDisabled(true);
                      // if (hasSongLoaded) {
                      //     playing();
                      // }
                      // setTimeout(() => {
                      //     setDisabled(false);
                      // }, 1000);
                      null;
                    }}>
                    {/* <TouchableOpacity
                                            // disabled={disabled}
                                            onPress={() => {
                                                playSong(props.route?.params?.songsList, index)
                                                setVisibleMiniPlayer(true);
                                                // setDisabled(true);
                                                // if (hasSongLoaded) {
                                                //     playing();
                                                // }
                                                // setTimeout(() => {
                                                //     setDisabled(false);
                                                // }, 1000);
                                                null
                                            }} style={styles.playButtonStyle}>
                                            <Image
                                                source={playVisible ? ImagePath.play : ImagePath?.pause}
                                                style={{ height: normalise(25), width: normalise(25) }}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity> */}
                    <Image
                      source={{uri: item?.song_image}}
                      style={styles.songListItemImage}
                      resizeMode="contain"
                    />
                    <View style={styles.listItemHeaderSongText}>
                      <Text
                        style={styles.songlistItemHeaderSongTextTitle}
                        numberOfLines={2}>
                        {item?.song_name}
                      </Text>
                      <Text
                        style={styles.songlistItemHeaderSongTextArtist}
                        numberOfLines={1}>
                        {item?.artist_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
            />
          </View>
        </View>

        {visibleminiPlayer === true ? (
          <View style={{marginBottom: bottom - 50}}>
            <MusicPlayerBar
              //   onPress={() => {
              //     props.navigation.navigate('Player', {
              //       comments: [],
              //       song_title: props.playingSongRef.song_name,
              //       album_name: props.playingSongRef.album_name,
              //       song_pic: props.playingSongRef.song_pic,
              //       username: props.playingSongRef.username,
              //       profile_pic: props.playingSongRef.profile_pic,
              //       uri: props.playingSongRef.uri,
              //       reactions: props.playingSongRef.reactionData,
              //       id: props.playingSongRef.id,
              //       artist: props.playingSongRef.artist,
              //       changePlayer: props.playingSongRef.changePlayer,
              //       originalUri: props.playingSongRef.originalUri,
              //       isrc: props.playingSongRef.isrc,
              //       registerType: props.playingSongRef.regType,
              //       details: props.playingSongRef.details,
              //       showPlaylist: props.playingSongRef.showPlaylist,
              //       comingFromMessage: props.playingSongRef.comingFromMessage,
              //     });
              //   }}
              // onPress={() => null}
              onChangeSong={(data, songIndex) =>
                playSong({item: data}, songIndex)
              }
              // onPressPlayOrPause={() => {
              //     setTimeout(() => {
              //         findPlayingSong(posts);
              //     }, 500);
              // }}
            />
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerStyle: {
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalise(25),
  },
  mainTitleStyle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(14),
    marginBottom: normalise(14),
  },
  combienBanerWrapper: {
    flexDirection: 'row',
    backgroundColor: 'green',
    flexWrap: 'wrap',
    backgroundColor: Colors.fadeblack,
    marginBottom: normalise(10),
    overflow: 'hidden',
  },
  bannerImageStyle: {
    width: '50%',
    height: '50%',
  },
  bottomLineStyle: {
    // marginTop: normalise(20),
    backgroundColor: Colors.white,
    height: 0.5,
    alignSelf: 'center',
    opacity: 0.7,
  },
  playListItemContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: normalise(15),
    flex: 1,
    marginBottom: normalise(62),
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: normalise(16),
    flex: 1,
  },
  songListItemImage: {
    borderRadius: normalise(5),
    height: normalise(56),
    width: normalise(56),
    marginRight: normalise(8),
  },
  listItemHeaderSongText: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(10),
    // maxWidth: normalise(240),
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.fadeblack,
    paddingBottom: normalise(3),
    flex: 1,
    // backgroundColor: 'green',
    justifyContent: 'center',
  },

  songlistItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(13),
    marginBottom: normalise(5),
  },
  songlistItemHeaderSongTextArtist: {
    color: Colors.meta,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
  },
  buttonWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    // bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
    bottom: 0,
  },
  buttonStyle: {
    backgroundColor: Colors.fadeblack,
    padding: 6,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 5,
    width: '75%',
    height: normalise(62),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  playButtonStyle: {
    width: normalise(50),
    height: normalise(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreTextWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  moreText: {
    color: Colors.black,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(12),
  },
  imageTwoStyle: {
    height: normalise(14),
    width: normalise(14),
    transform: [
      {
        rotate: '-180deg',
      },
    ],
  },
});

const mapStateToProps = state => {
  return {
    status: state.PostReducer.status,
    createPostResponse: state.PostReducer.createPostResponse,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPostRequest: payload => {
      dispatch(createPostRequest(payload));
    },
  };
};

// export default play PlayListDetail
export default connect(mapStateToProps, mapDispatchToProps)(PlayListDetail);
