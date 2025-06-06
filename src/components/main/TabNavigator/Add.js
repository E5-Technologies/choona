import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Image,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from 'react-native';

import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import SavedSongsListItem from './../ListCells/SavedSongsListItem';
import Seperator from '../ListCells/Seperator';
import _ from 'lodash';
import StatusBar from '../../../utils/MyStatusBar';
import {connect} from 'react-redux';
import {
  SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
  SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
  SEARCH_SONG_REQUEST_FOR_POST_FAILURE,
} from '../../../action/TypeConstants';
import {seachSongsForPostRequest} from '../../../action/PostAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../../utils/helpers/NetInfo';

import {useRecentlyPlayed} from '../../../utils/helpers/RecentlyPlayed';
import {RecentlyPlayedHeader} from '../../Headers/RecentlyPlayedHeader';
import {usePlayFullAppleMusic} from '../../../hooks/usePlayFullAppleMusic';
import {useMusicPlayer} from '../../../context/AppleMusicContext';
// import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

let status;

const AddSong = props => {
  const inputRef = React.useRef(null);
  const [search, setSearch] = useState(null);
  const [data, setData] = useState([]);
  const {recentlyPlayed, loading, refetch} = useRecentlyPlayed(
    props.registerType,
  );

  const {resetPlaybackQueue, setPlaybackQueue} = usePlayFullAppleMusic();
  const {resetProgress} = useMusicPlayer();

  // console.log(JSON.stringify(recentlyPlayed[0]), 'thhhhh');
  let post = true;

  if (status === '' || status !== props.status) {
    switch (props.status) {
      case SEARCH_SONG_REQUEST_FOR_POST_REQUEST:
        status = props.status;
        break;

      case SEARCH_SONG_REQUEST_FOR_POST_SUCCESS:
        setData(props.spotifyResponse);
        status = props.status;
        break;

      case SEARCH_SONG_REQUEST_FOR_POST_FAILURE:
        toast('Error', 'Something Went Wong, Please Try Again');
        status = props.status;
        break;
    }
  }

  const handleAddSong = item => {
    console.log(props?.route?.params?.from, 'its from');
    // return
    const songItem = {
      image:
        props.registerType === 'spotify'
          ? item.item.album.images[0].url
          : item.item.attributes.artwork.url.replace('{w}x{h}', '600x600'),
      title:
        props.registerType === 'spotify'
          ? item.item.name
          : item.item.attributes.name,
      title2:
        props.registerType === 'spotify'
          ? singerList(item.item.artists)
          : item.item.attributes.artistName,
      details: item.item,
      registerType: props.registerType,
    };

    console.log(songItem, 'when sent song to session');
    // return;

    switch (props?.route?.params?.from) {
      case 'CreatePost':
        props.navigation.navigate('CreatePost', songItem);
        break;
      case 'Playlist':
        props.navigation.navigate('CreatePlayList', {
          songItem,
          previousPlaylistData: props?.route?.params?.previousPlaylistData,
        });
        break;
      case 'AssembleSession':
        props.navigation.navigate('AssembleSession', {
          songItem,
          previousSessionData: props?.route?.params?.previousSessionData,
        });
        break;
      default:
        props.navigation.navigate('CreatePost', songItem);
        break;
    }

    // props.navigation.navigate(props?.route?.params?.from == "Playlist" ? "CreatePlayList" : 'CreatePost', props?.route?.params?.from == "Playlist" ?
    //   {
    //     songItem: {
    //       image:
    //         props.registerType === 'spotify'
    //           ? item.item.album.images[0].url
    //           : item.item.attributes.artwork.url.replace(
    //             '{w}x{h}',
    //             '600x600',
    //           ),
    //       title:
    //         props.registerType === 'spotify'
    //           ? item.item.name
    //           : item.item.attributes.name,
    //       title2:
    //         props.registerType === 'spotify'
    //           ? singerList(item.item.artists)
    //           : item.item.attributes.artistName,
    //       details: item.item,
    //       registerType: props.registerType,
    //     }
    //   } :
    //   {
    //     image:
    //       props.registerType === 'spotify'
    //         ? item.item.album.images[0].url
    //         : item.item.attributes.artwork.url.replace(
    //           '{w}x{h}',
    //           '600x600',
    //         ),
    //     title:
    //       props.registerType === 'spotify'
    //         ? item.item.name
    //         : item.item.attributes.name,
    //     title2:
    //       props.registerType === 'spotify'
    //         ? singerList(item.item.artists)
    //         : item.item.attributes.artistName,
    //     details: item.item,
    //     registerType: props.registerType,
    //   }
    // );
  };

  function singerList(artists) {
    let names = '';

    artists.map((val, index) => {
      names = names + `${val.name}${artists.length - 1 === index ? '' : ', '}`;
    });

    return names;
  }

  function renderItem(item) {
    // console.log(item, 'its song item h sir');
    return (
      <SavedSongsListItem
        image={
          props.registerType === 'spotify'
            ? item.item.album.images.length > 1
              ? item.item.album.images[0].url
              : 'qwe'
            : item.item.attributes.artwork.url.replace('{w}x{h}', '300x300')
        }
        title={
          props.registerType === 'spotify'
            ? item.item.name
            : item.item.attributes.name
        }
        singer={
          props.registerType === 'spotify'
            ? singerList(item.item.artists)
            : item.item.attributes.artistName
        }
        marginRight={normalise(50)}
        marginBottom={
          item.index === props.spotifyResponse.length - 1 ? normalise(20) : 0
        }
        change2={true}
        image2={ImagePath.addButtonSmall}
        onPressSecondImage={() => handleAddSong(item)}
        onPressImage={async () => {
          await resetPlaybackQueue();
          resetProgress();
          setTimeout(() => {
            props.navigation.navigate('Player', {
              song_title:
                props.registerType === 'spotify'
                  ? item.item.name
                  : item.item.attributes.name,
              album_name:
                props.registerType === 'spotify'
                  ? item.item.album.name
                  : item.item.attributes.albumName,
              song_pic:
                props.registerType === 'spotify'
                  ? item.item.album.images[0].url
                  : item.item.attributes.artwork.url.replace(
                      '{w}x{h}',
                      '300x300',
                    ),
              username: '',
              profile_pic: '',
              originalUri:
                props.registerType === 'spotify'
                  ? item.item.external_urls.spotify
                  : item.item.attributes.url,
              uri:
                props.registerType === 'spotify'
                  ? item.item.preview_url
                  : item.item.attributes.previews[0].url,
              artist:
                props.registerType === 'spotify'
                  ? singerList(item.item.artists)
                  : item.item.attributes.artistName,
              changePlayer: true,
              registerType: props.registerType,
              changePlayer2: props.registerType === 'spotify' ? true : false,
              id:
                props.registerType === 'spotify' ? item.item.id : item.item.id,
              apple_song_id:
                props.registerType === 'spotify' ? item.item.id : item.item.id,
              showPlaylist: false,
            });
          }, 500);
        }}
      />
    );
  }

  const handleCancel = () => {
    // Alert.alert(props?.route?.params?.from);
    // return;
    switch (props?.route?.params?.from) {
      // case 'CreatePost':
      //   props.navigation.navigate('CreatePost', songItem);
      //   break;
      case 'Playlist':
        props.navigation.navigate('CreatePlayList', {
          // songItem,
          previousPlaylistData: props?.route?.params?.previousPlaylistData,
        });
        break;
      case 'AssembleSession':
        props.navigation.navigate('AssembleSession', {
          // songItem,
          previousSessionData: props?.route?.params?.previousSessionData,
        });
        break;
      default:
        // props.navigation.navigate('CreatePost', songItem);
        props.navigation.goBack();
        break;
    }
  };

  return (
    <View style={styles.containerView}>
      {Platform.OS == 'android' && <StatusBar />}
      <Loader visible={props.status === SEARCH_SONG_REQUEST_FOR_POST_REQUEST} />

      <SafeAreaView style={styles.safeAreaContainer}>
        <HeaderComponent
          firstitemtext={true}
          textone={'Cancel'}
          title={'ADD SONG'}
          thirditemtext={true}
          texttwo={''}
          hideBorderBottom={true}
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
            style={{
              height: normalise(35),
              width: '100%',
              // backgroundColor: Colors.fadeblack,
              backgroundColor: Colors.fadeblack,
              borderRadius: normalise(8),
              marginTop: normalise(16),
              padding: normalise(10),
              color: Colors.white,
              // fontSize:normalise(15),
              paddingLeft: normalise(30),
            }}
            value={search}
            placeholder={'Search Spotify for a Song'}
            ref={inputRef}
            returnKeyType={'done'}
            keyboardAppearance={'dark'}
            placeholderTextColor={Colors.darkgrey}
            onSubmitEditing={() => {
              inputRef.current.blur();
              Keyboard.dismiss();
            }}
            onChangeText={text => {
              setSearch(text);
              if (text.length >= 1) {
                isInternetConnected()
                  .then(() => {
                    props.seachSongsForPostRequest(text, post);
                  })
                  .catch(() => {
                    toast('Error', 'Please Connect To Internet');
                  });
              } else if (text.length === 0) {
                setSearch(null);
              }
            }}
          />
          <Image
            source={ImagePath.searchicongrey}
            style={{
              height: normalise(15),
              width: normalise(15),
              bottom: normalise(25),
              paddingLeft: normalise(30),
              transform: [{scaleX: -1}],
            }}
            resizeMode="contain"
          />
          {search === '' || search === null ? null : (
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                setData([]);
              }}
              style={{
                backgroundColor: Colors.darkerblack,
                padding: 10,
                paddingTop: 4,
                paddingBottom: 4,
                position: 'absolute',
                right: 0,
                borderRadius: 5,
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
        {_.isEmpty(data) || search === null || search === '' ? (
          <RecentlyPlayedHeader registerType={props.registerType} />
        ) : (
          <View />
        )}
        {_.isEmpty(data) || search === null || search === '' ? (
          _.isEmpty(recentlyPlayed) ? (
            <KeyboardAvoidingView
              enabled={false}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={ImagePath.searchicongrey}
                  style={{height: normalise(35), width: normalise(35)}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(12),
                    fontWeight: 'bold',
                    marginTop: normalise(20),
                    width: '60%',
                    textAlign: 'center',
                  }}>
                  Search for the song you want to{' '}
                </Text>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(12),
                    fontWeight: 'bold',
                    width: '60%',
                  }}>
                  share above.
                </Text>
                <Image
                  source={ImagePath.addPostIllus}
                  resizeMode="contain"
                  style={{
                    height: undefined,
                    width: '100%',
                    aspectRatio: 1125 / 712,
                    position: 'absolute',
                    bottom: -80,
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          ) : (
            <>
              <FlatList
                data={recentlyPlayed}
                onRefresh={() => refetch()}
                refreshing={loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                  index.toString();
                }}
                ItemSeparatorComponent={Seperator}
                showsVerticalScrollIndicator={false}
              />
            </>
          )
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            ItemSeparatorComponent={Seperator}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {flex: 1, backgroundColor: Colors.darkerblack},
  safeAreaContainer: {flex: 1},
});

const mapStateToProps = state => {
  return {
    status: state.PostReducer.status,
    spotifyResponse: state.PostReducer.spotifyResponse,
    registerType: state.TokenReducer.registerType,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    seachSongsForPostRequest: (text, post) => {
      dispatch(seachSongsForPostRequest(text, post));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSong);
