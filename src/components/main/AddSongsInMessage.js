import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  NativeModules,
} from 'react-native';
import Seperator from './ListCells/Seperator';
import normalise from '../../utils/helpers/Dimens';
import normaliseNew from '../../utils/helpers/DimensNew';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import SavedSongsListItem from './ListCells/SavedSongsListItem';
import StatusBar from '../../utils/MyStatusBar';
import _ from 'lodash';
import { seachSongsForPostRequest } from '../../action/PostAction';
import { userSearchRequest } from '../../action/UserAction';
import { createChatTokenRequest } from '../../action/MessageAction';
import {
  SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
  SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
  SEARCH_SONG_REQUEST_FOR_POST_FAILURE,
} from '../../action/TypeConstants';
import { connect } from 'react-redux';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';

import { useRecentlyPlayed } from '../../utils/helpers/RecentlyPlayed';

let status;

function AddSongsInMessage(props) {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const recentlyPlayed = useRecentlyPlayed(
    props.registerType,
    isFetching,
    setIsFetching,
  );

  let post = false;

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      setResult([]);
    });

    return () => {
      unsuscribe();
    };
  });

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case SEARCH_SONG_REQUEST_FOR_POST_REQUEST:
        status = props.status;
        break;

      case SEARCH_SONG_REQUEST_FOR_POST_SUCCESS:
        status = props.status;
        setResult(props.searchResponse);
        break;

      case SEARCH_SONG_REQUEST_FOR_POST_FAILURE:
        status = props.status;
        toast('Error', 'Something Went Wong, Please Try Again');
        break;
    }
  }

  const onRefresh = () => {
    setIsFetching(true);
  };

  function singerList(artists) {
    let names = '';

    artists.map((val, index) => {
      names = names + `${val.name}${artists.length - 1 === index ? '' : ', '}`;
    });

    return names;
  }

  function renderItem(data) {
    if (data.item === null) {
      return false;
    }

    return (
      <SavedSongsListItem
        image={
          props.registerType === 'spotify'
            ? data.item.album.images[0].url
            : data.item.attributes.artwork.url.replace('{w}x{h}', '300x300')
        }
        title={
          props.registerType === 'spotify'
            ? data.item.name
            : data.item.attributes.name
        }
        singer={
          props.registerType === 'spotify'
            ? singerList(data.item.artists)
            : data.item.attributes.artistName
        }
        marginRight={normalise(50)}
        marginBottom={
          data.index === props.searchResponse.length - 1 ? normalise(20) : 0
        }
        change2={true}
        image2={ImagePath.addButtonSmall}
        onPressSecondImage={() => {
          props.navigation.navigate('PlayerScreenSelectUser', {
            item: {
              _id: props.registerType === 'spotify' ? data.item.id : null,
              isrc_code:
                props.registerType === 'spotify'
                  ? data.item.external_ids.isrc
                  : data.item.attributes.isrc,
              // type: 'track',
              song_name:
                props.registerType === 'spotify'
                  ? data.item.name
                  : data.item.attributes.name,
              album_name:
                props.registerType === 'spotify'
                  ? data.item.album.name
                  : data.item.attributes.albumName,
              song_image:
                props.registerType === 'spotify'
                  ? data.item.album.images[0].url
                  : data.item.attributes.artwork.url.replace(
                    '{w}x{h}',
                    '300x300',
                  ),
              original_song_uri:
                props.registerType === 'spotify'
                  ? data.item.external_urls.spotify
                  : data.item.attributes.url,
              song_uri:
                props.registerType === 'spotify'
                  ? data.item.preview_url
                  : data.item.attributes.previews[0].url,
              preview_url: undefined,
              artist_name:
                props.registerType === 'spotify'
                  ? singerList(data.item.artists)
                  : data.item.attributes.artistName,
              registerType: props.registerType,
            },
          });
        }}
        onPressImage={() => {
          props.navigation.navigate('Player', {
            song_title:
              props.registerType === 'spotify'
                ? data.item.name
                : data.item.attributes.name,
            album_name:
              props.registerType === 'spotify'
                ? data.item.album.name
                : data.item.attributes.albumName,
            song_pic:
              props.registerType === 'spotify'
                ? data.item.album.images[0].url
                : data.item.attributes.artwork.url.replace(
                  '{w}x{h}',
                  '300x300',
                ),
            username: '',
            profile_pic: '',
            originalUri:
              props.registerType === 'spotify'
                ? data.item.external_urls.spotify
                : data.item.attributes.url,
            uri:
              props.registerType === 'spotify'
                ? data.item.preview_url
                : data.item.attributes.previews[0].url,
            artist:
              props.registerType === 'spotify'
                ? singerList(data.item.artists)
                : data.item.attributes.artistName,
            changePlayer: true,
            registerType: props.registerType,
            changePlayer2: props.registerType === 'spotify' ? true : false,
            id: props.registerType === 'spotify' ? data.item.id : null,
            showPlaylist: false,
          });
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <Loader visible={props.status === SEARCH_SONG_REQUEST_FOR_POST_REQUEST} />
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={'SELECT SONG TO SEND'}
          thirditemtext={true}
          imagetwo={ImagePath.newmessage}
          imagetwoheight={25}
          imagetwowidth={25}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />
        {/* Search Bar */}
        <View style={{ paddingHorizontal: normalise(12) }}>
          <TextInput
            autoCorrect={false}
            style={{
              height: normalise(35),
              width: '100%',
              backgroundColor: Colors.white,
              borderRadius: normalise(8),
              marginTop: normalise(20),
              padding: normalise(10),
              paddingLeft: normalise(30),
            }}
            value={search}
            keyboardAppearance={'dark'}
            placeholder={'Search'}
            placeholderTextColor={Colors.darkgrey}
            onChangeText={text => {
              setSearch(text);
              if (text.length >= 1) {
                isInternetConnected()
                  .then(() => {
                    props.searchSongReq(text, post);
                  })
                  .catch(() => {
                    toast('Error', 'Please Connect To Internet');
                  });
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
            }}
            resizeMode="contain"
          />
          {search === '' ? null : (
            <TouchableOpacity
              onPress={() => {
                setSearch(''), setResult([]);
              }}
              style={{
                backgroundColor: Colors.fordGray,
                padding: 6,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 5,
                position: 'absolute',
                right: 12,
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
        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: normaliseNew(40),
            alignItems: 'center',
            backgroundColor: Colors.darkerblack,
          }}>
          {_.isEmpty(result) ? (
            <Text
              style={{
                color: Colors.white,
                fontSize: normaliseNew(10),
                marginLeft: normaliseNew(16),
                fontFamily: 'ProximaNova-Bold',
              }}>
              YOUR RECENTLY PLAYED ON{' '}
              {props.registerType === 'spotify' ? 'SPOTIFY' : 'APPLE MUSIC'}
            </Text>
          ) : (
            <Text
              style={{
                color: Colors.white,
                fontSize: normaliseNew(10),
                marginLeft: normaliseNew(16),
                fontFamily: 'ProximaNova-Bold',
              }}>
              {result.length} Results
            </Text>
          )}
        </View>
        {_.isEmpty(result) ? (
          <FlatList
            data={recentlyPlayed}
            onRefresh={() => onRefresh()}
            refreshing={isFetching}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            ItemSeparatorComponent={Seperator}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={result}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={Seperator}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    status: state.PostReducer.status,
    error: state.PostReducer.error,
    searchResponse: state.PostReducer.chooseSongToSend,
    registerType: state.TokenReducer.registerType,
    userStatus: state.UserReducer.status,
    SearchData: state.UserReducer.sendSongUserSearch,
    messageStatus: state.MessageReducer.status,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    searchSongReq: (text, post) => {
      dispatch(seachSongsForPostRequest(text, post));
    },

    userSearchReq: (payload, sendSong) => {
      dispatch(userSearchRequest(payload, sendSong));
    },
    createChatTokenRequest: payload => {
      dispatch(createChatTokenRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSongsInMessage);
