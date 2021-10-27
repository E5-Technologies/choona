import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Linking,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Seperator from '../ListCells/Seperator';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import SavedSongsListItem from '../ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import StatusBar from '../../../utils/MyStatusBar';
import {
  SAVED_SONGS_LIST_REQUEST,
  SAVED_SONGS_LIST_SUCCESS,
  SAVED_SONGS_LIST_FAILURE,
  UNSAVE_SONG_REQUEST,
  UNSAVE_SONG_SUCCESS,
  UNSAVE_SONG_FAILURE,
} from '../../../action/TypeConstants';
import {
  savedSongsListRequset,
  unsaveSongRequest,
} from '../../../action/SongAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import { connect } from 'react-redux';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import _ from 'lodash';
import { getUsersFromHome } from '../../../action/UserAction';
import { getSongFromisrc } from '../../../action/PlayerAction';
import { getSpotifyToken } from '../../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../../utils/helpers/AppleDevToken';
import axios from 'axios';

import EmptyComponent from '../../Empty/EmptyComponent';
import MoreModal from '../../Posts/MoreModal';

let status;

function Contact(props) {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const [bool, setBool] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [noEmpty, setNoEmpty] = useState(false);
  const [allSaveSong, setAllSaveSong] = useState([]);

  var bottomSheetRef;

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      isInternetConnected()
        .then(() => {
          props.getSavedSongs(search);
          setSearch('');
        })
        .catch(() => {
          toast('Oops', 'Please Connect To Internet');
        });
    });

    return () => {
      unsuscribe();
    };
  }, []);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case SAVED_SONGS_LIST_REQUEST:
        status = props.status;
        break;

      case SAVED_SONGS_LIST_SUCCESS:
        setAllSaveSong(props.savedSong);
        setNoEmpty(true);
        status = props.status;
        break;

      case SAVED_SONGS_LIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong');
        break;

      case UNSAVE_SONG_REQUEST:
        status = props.status;
        break;

      case UNSAVE_SONG_SUCCESS:
        status = props.status;
        setIndex(0);
        props.getSavedSongs(search);
        break;

      case UNSAVE_SONG_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong');
        break;
    }
  }

  function renderItem(data) {
    if (data.item === null) {
      return false;
    }
    return (
      <SavedSongsListItem
        image={data.item.song_image}
        title={data.item.song_name}
        singer={data.item.artist_name}
        onPressImage={() => {
          props.navigation.navigate('Player', {
            song_title: data.item.song_name,
            album_name: data.item.album_name,
            song_pic: data.item.song_image,
            uri: data.item.song_uri,
            id: data.item.post_id,
            artist: data.item.artist_name,
            changePlayer: true,
            isrc: data.item.isrc_code,
            registerType: data.item.original_reg_type,
            originalUri: data.item.original_song_uri,
          });
        }}
        onPress={() => {
          setIndex(data.index);
          setModalVisible(true);
        }}
      />
    );
  }

  // GET ISRC CODE
  const callApi = async () => {
    if (props.registerType === 'spotify') {
      const spotifyToken = await getSpotifyToken();

      return await axios.get(
        `https://api.spotify.com/v1/search?q=isrc:${props.savedSong[index].isrc_code}&type=track`,
        {
          headers: {
            Authorization: spotifyToken,
          },
        },
      );
    } else {
      const AppleToken = await getAppleDevToken();

      return await axios.get(
        `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${props.savedSong[index].isrc_code}`,
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

  function filterArray(keyword) {
    let data = _.filter(props.savedSong, item => {
      return (
        item.song_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        // ||
        // item.artist_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );
    });

    // alert("data"+data.length);
    setAllSaveSong([]);
    setNoEmpty(false);
    setBool(true);
    setTimeout(() => {
      //  alert(data.length)
      if (data.length === 0) {
        setNoEmpty(true);
      }
      setAllSaveSong(data);
      setBool(false);
    }, 800);
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <Loader visible={props.status === SAVED_SONGS_LIST_REQUEST} />
      <Loader visible={bool} />
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={true}
          textone={''}
          title={'SAVED SONGS'}
          thirditemtext={true}
          texttwo={''}
        />
        {/* {allSaveSong.length !== 0 && (
          <View
            style={{
              width: '92%',
              alignSelf: 'center',
            }}>
            <TextInput
              style={{
                height: normalise(35),
                width: '100%',
                // backgroundColor: Colors.fadeblack,
                borderRadius: normalise(8),
                marginTop: normalise(20),
                padding: normalise(10),
                // color: Colors.white,

                backgroundColor: Colors.white,
                paddingLeft: normalise(30),
              }}
              autoCorrect={false}
              keyboardAppearance={'dark'}
              value={search}
              placeholder={'Search'}
              placeholderTextColor={Colors.darkgrey}
              onChangeText={text => {
                setSearch(text);
                filterArray(text);
              }}
            />
            <Image
              source={ImagePath ? ImagePath.searchicongrey : null}
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
                  setSearch('');
                  setAllSaveSong(props.savedSong);
                }}
                style={{
                  backgroundColor: Colors.black,
                  padding: 6,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderRadius: 5,
                  backgroundColor: Colors.fordGray,
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
        )} */}
        {allSaveSong.length !== 0 ? (
          <SwipeListView
            data={allSaveSong}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={Seperator}
            keyExtractor={(item, index, rowData) => {
              index.toString();
            }}
            disableRightSwipe={true}
            rightOpenValue={-75}
          />
        ) : (
          <EmptyComponent
            image={ImagePath ? ImagePath.emptySaveSong : null}
            text={
              'When you see a song you love, just click the more menu and save that song. Then you can access it forever from here.'
            }
            title={'No Saved Songs'}
          />
        )}
      </SafeAreaView>
      {modalVisible && (
        <MoreModal
          page={'savedSongs'}
          setBool={setBool}
          bottomSheetRef={bottomSheetRef}
          index={index}
          setIndex={setIndex}
          navigation={props.navigation}
          openInAppleORSpotify={openInAppleORSpotify}
          postData={props.savedSong}
          show={modalVisible}
          setShow={setModalVisible}
        />
      )}
    </View>
  );
}

const mapStateToProps = state => {
  return {
    status: state.SongReducer.status,
    error: state.SongReducer.error,
    savedSong: state.SongReducer.savedSongList,
    userProfileResp: state.UserReducer.userProfileResp,
    userstatus: state.UserReducer.status,
    messageStatus: state.MessageReducer.status,
    registerType: state.TokenReducer.registerType,
    isrcResp: state.PlayerReducer.getSongFromISRC,
  };
};

const mapDistapchToProps = dispatch => {
  return {
    getSavedSongs: search => {
      dispatch(savedSongsListRequset(search));
    },

    unsaveSongReq: id => {
      dispatch(unsaveSongRequest(id));
    },
    getSongFromIsrc: (regType, isrc) => {
      dispatch(getSongFromisrc(regType, isrc));
    },
  };
};

export default connect(mapStateToProps, mapDistapchToProps)(Contact);
