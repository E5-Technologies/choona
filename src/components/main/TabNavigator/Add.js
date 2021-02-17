import React, { useState } from 'react';
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
  TouchableWithoutFeedback,
} from 'react-native';
import Seperator from '../ListCells/Seperator';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import SavedSongsListItem from './../ListCells/SavedSongsListItem';
import _ from 'lodash';
import StatusBar from '../../../utils/MyStatusBar';
import { connect } from 'react-redux';
import {
  SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
  SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
  SEARCH_SONG_REQUEST_FOR_POST_FAILURE,
} from '../../../action/TypeConstants';
import { seachSongsForPostRequest } from '../../../action/PostAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../../utils/helpers/NetInfo';

let status;

function AddSong(props) {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);

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

  function singerList(artists) {
    let names = '';

    artists.map((val, index) => {
      names = names + `${val.name}${artists.length - 1 === index ? '' : ', '}`;
    });

    return names;
  }

  function renderItem(data) {
    return (
      <SavedSongsListItem
        image={
          props.registerType === 'spotify'
            ? data.item.album.images.length > 1
              ? data.item.album.images[0].url
              : 'qwe'
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
          data.index === props.spotifyResponse.length - 1 ? normalise(20) : 0
        }
        change={true}
        image2={ImagePath.addicon}
        onPressSecondImage={() => {
          props.navigation.navigate('CreatePost', {
            image:
              props.registerType === 'spotify'
                ? data.item.album.images[0].url
                : data.item.attributes.artwork.url.replace(
                    '{w}x{h}',
                    '600x600',
                  ),
            title:
              props.registerType === 'spotify'
                ? data.item.name
                : data.item.attributes.name,
            title2:
              props.registerType === 'spotify'
                ? singerList(data.item.artists)
                : data.item.attributes.artistName,
            details: data.item,
            registerType: props.registerType,
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

  function hideKeyboard() {
    if (typingTimeout) {
      clearInterval(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        Keyboard.dismiss();
      }, 1500),
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <StatusBar backgroundColor={Colors.darkerblack} />

      <Loader visible={props.status === SEARCH_SONG_REQUEST_FOR_POST_REQUEST} />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderComponent
            firstitemtext={true}
            textone={''}
            title={'ADD SONG'}
            thirditemtext={true}
            texttwo={''}
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
                backgroundColor: Colors.fadeblack,
                borderRadius: normalise(8),
                marginTop: normalise(16),
                padding: normalise(10),
                color: Colors.white,
                paddingLeft: normalise(30),
              }}
              value={search}
              placeholder={'Search songs...'}
              placeholderTextColor={Colors.darkgrey}
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
                  setSearch(''), setData([]);
                }}
                style={{
                  backgroundColor: Colors.black,
                  padding: 6,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderRadius: 2,
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

          {_.isEmpty(data) ? null : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                alignSelf: 'center',
                marginTop: normalise(5),
              }}>
              <Image
                source={
                  props.registerType === 'spotify'
                    ? ImagePath.spotifyicon
                    : ImagePath.applemusic
                }
                style={{ height: normalise(20), width: normalise(20) }}
              />
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(12),
                  marginLeft: normalise(10),
                  fontWeight: 'bold',
                }}>{` RESULTS (${props.spotifyResponse.length})`}</Text>
            </View>
          )}

          {_.isEmpty(data) ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(13),
                  // fontWeight: 'bold',
                  marginTop: normalise(-50),
                  width: '60%',
                  textAlign: 'center',
                }}>
                Search for the song you want to share above.
              </Text>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: normalise(-50),
                }}>
                <Image
                  source={ImagePath.addPostIllus}
                  style={{ height: normalise(156), width: '100%' }}
                  resizeMode="cover"
                />
              </View>
            </View>
          ) : (
            <FlatList
              style={{ marginTop: normalise(10) }}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={Seperator}
            />
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </View>
  );
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddSong);
