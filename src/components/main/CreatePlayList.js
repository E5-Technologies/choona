import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {createPostRequest} from '../../action/PostAction';
import {
  CREATE_POST_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
} from '../../action/TypeConstants';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import StatusBar from '../../utils/MyStatusBar';
import Loader from '../../widgets/AuthLoader';
import HeaderComponent, {hitSlop} from '../../widgets/HeaderComponent';
import GradientButton from '../common/GradientButton';

let status;
const deviceWidth = Dimensions.get('window').width;

function CreatePlayList(props) {
  const buttonLineWidth = deviceWidth * 0.8;
  console.log(props.route?.params, 'these are params');
  const {songItem, previousPlaylistData} = props.route?.params;
  console.log(songItem, previousPlaylistData, 'this is props Item playlist');
  const {width, height} = useWindowDimensions();
  const [playListArary, setPlayListArray] = useState([]);
  const [playListName, setPlayListName] = useState('');
  const [bool, setBool] = useState(false);
  const imagArray = [
    {url: 'https://picsum.photos/200/300'},
    {url: 'https://picsum.photos/200/300'},
    {url: 'https://picsum.photos/200/300'},
    {url: 'https://picsum.photos/200/300'},
    {url: 'https://picsum.photos/200/300'},
    {url: 'https://picsum.photos/200/300'},
    {url: 'https://picsum.photos/200/300'},
    {url: 'https://picsum.photos/200/300'},
  ];

  useEffect(() => {
    const newArray = previousPlaylistData
      ? [...previousPlaylistData, songItem]
      : [...playListArary, songItem];
    setPlayListArray(newArray);
  }, [songItem]);

  const songListPayload = () => {
    return playListArary?.map(item => {
      return {
        song_uri:
          songItem.registerType === 'spotify'
            ? item.details.preview_url
            : item?.details?.attributes?.previews[0]?.url,
        original_song_uri:
          songItem.registerType === 'spotify'
            ? item.details.external_urls.spotify
            : item?.details?.attributes?.url,
        song_name: item?.title,
        song_image: item?.image,
        artist_name: item?.title2,
        isrc_code:
          songItem.registerType === 'spotify'
            ? item.details.external_ids.isrc
            : item?.details?.attributes?.isrc,
        album_name:
          songItem.registerType === 'spotify'
            ? item.details.album.name
            : item?.details?.attributes?.albumName,
      };
    });
  };
  console.log(songListPayload(), 'its data>>>>');
  // return;
  const createPost = async () => {
    if (playListArary?.length < 4) {
      toast('Error', 'Please add atleast 4 songs!');
      return;
    }
    if (playListName?.trim() == '') {
      toast('Error', 'Please add playlist name!');
      return;
    }

    setBool(true);
    // let tapUser = [];
    // await props.followingData.map((item, index) => {
    //   if (search.search(item.username) !== -1) {
    //     tagFriend.map(items => {
    //       if (items === item.username) {
    //         tapUser.push(item.username);
    //       }
    //     });
    //   }
    //   if (index === props.followingData.length - 1) {
    //     setTagFriend([]);
    //   }
    // });
    setTimeout(() => {
      var payload = {
        //   tag: tapUser,
        post_content: playListName,
        playlist_name: playListName,
        social_type: songItem.registerType === 'spotify' ? 'spotify' : 'apple',
        songs: songListPayload(),
      };
      console.log(payload, 'this is plalist paload');
      // return
      isInternetConnected()
        .then(async () => {
          // Alert.alert('incond');
          await props.createPostRequest(payload);
          setBool(false);
          Keyboard.dismiss();
        })
        .catch(() => {
          setBool(false);
          toast('Error', 'Please Connect To Internet');
        });
    }, 200);
    // props.createPostRequest(payload);
  };

  if (status === '' || status !== props.status) {
    switch (props.status) {
      case CREATE_POST_REQUEST:
        status = props.status;
        break;

      case CREATE_POST_SUCCESS:
        props.navigation.popToTop();
        props.navigation.replace('bottomTab', {screen: 'Home'});
        status = props.status;
        break;

      case CREATE_POST_FAILURE:
        toast('Error', 'Something Went Wong, Please Try Again');
        status = props.status;
        break;
    }
  }

  const handleRemoveItemtoList = itemId => {
    let currentLength = playListArary?.length;

    const filteredArray = playListArary?.filter(
      item => item?.details?.id !== itemId,
    );
    setPlayListArray(filteredArray);
    if (currentLength == 1) {
      props.navigation.navigate('AddSong', {
        from: 'AssembleSession',
        previousPlaylistData: [],
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <SafeAreaView style={{flex: 1}}>
        <HeaderComponent
          firstitemtext={true}
          textone={'CANCEL'}
          title={'PLAYLIST'}
          thirditemtext={false}
          onPressFirstItem={() => {
            // props.navigation.goBack();
            setPlayListArray([]);
            props.navigation.popToTop('Create');
            // // props.navigation.goBack();
            // props.navigation.navigate("AddSong", { from: 'AssembleSession', previousPlaylistData: [] })
          }}
        />

        <View style={{flex: 1}}>
          {playListArary && (
            <View style={styles.topContainerStyle}>
              <TextInput
                style={{
                  color: Colors.white,
                  fontFamily: 'ProximaNova-regular',
                  marginHorizontal: normalise(10),
                  marginBottom: normalise(10),
                  borderColor: Colors.white,
                  // marginTop: -normalise(22),
                  // width: '75%',
                  width: width / 2,
                  // padding: 10,
                  textAlign: 'center',
                }}
                keyboardAppearance="dark"
                scrollEnabled={false}
                multiline={false}
                maxLength={50}
                placeholder={'PlayList name'}
                placeholderTextColor={Colors.darkgrey}
                onChangeText={text => {
                  setPlayListName(text);
                }}
              />
              <View
                style={[
                  styles.combienBanerWrapper,
                  {
                    width: width / 2.4,
                    height: width / 2.4,
                  },
                ]}>
                {playListArary?.map(item => {
                  return (
                    <Image
                      source={{uri: item?.image}}
                      style={styles.bannerImageStyle}
                      resizeMode="cover"
                    />
                  );
                })}
              </View>
              <View
                style={[styles.bottomLineStyle, {width: width / 2.4}]}></View>
            </View>
          )}
          <View style={styles.playListItemContainer}>
            <FlatList
              data={playListArary}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.itemWrapper}>
                    <Image
                      source={{uri: item?.image}}
                      style={styles.songListItemImage}
                      resizeMode="contain"
                    />
                    <View style={styles.listItemHeaderSongText}>
                      <Text
                        style={styles.songlistItemHeaderSongTextTitle}
                        numberOfLines={1}>
                        {item?.title}
                      </Text>
                      <Text
                        style={styles.songlistItemHeaderSongTextArtist}
                        numberOfLines={1}>
                        {item?.title2}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveItemtoList(item?.details?.id)}
                      hitSlop={hitSlop}
                      style={{alignSelf: 'center', marginLeft: 15}}>
                      <Image
                        source={ImagePath.greycross}
                        style={{
                          width: normalise(16),
                          height: normalise(17),
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
            />
            <View style={styles.buttonWrapper}>
              <View
                style={[
                  styles.bottomLineStyle,
                  {width: buttonLineWidth, marginBottom: 11, opacity: 0.3},
                ]}></View>
              <GradientButton
                title={'ADD SONG'}
                containerStyle={{
                  marginBottom: normalise(10),
                }}
                showRightIcon={false}
                onPress={() =>
                  props.navigation.navigate('AddSong', {
                    from: 'Playlist',
                    previousPlaylistData: playListArary,
                  })
                }
              />
              <GradientButton
                title={'CONTINUE'}
                containerStyle={{
                  marginBottom: normalise(10),
                }}
                showRightIcon={true}
                onPress={createPost}
                rightIconStyle={{
                  transform: [{rotate: '180deg'}],
                  width: 16,
                  height: 16,
                }}
                leftIconName={true}
                leftImageIcon="no"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Loader visible={bool} />
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerStyle: {
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalise(15),
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
    width: '100%',
    alignSelf: 'center',
    marginTop: normalise(8),
    flex: 1,
    // marginBottom: normalise(50),
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: normalise(8),
    // flex: 1,
    marginHorizontal: 15,
  },
  songListItemImage: {
    borderRadius: normalise(5),
    height: normalise(40),
    width: normalise(40),
    marginRight: normalise(8),
  },
  listItemHeaderSongText: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(7),
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
    marginBottom: normalise(0),
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
    // position: 'absolute',
    // right: 0,
    // backgroundColor:'red',
    // bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
    // bottom: 0,
    // bottom: Platform.OS === 'ios' ? normalise(24) : normalise(0),
  },
  buttonStyle: {
    backgroundColor: Colors.fadeblack,
    padding: 6,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 5,
    width: '75%',
    height: normalise(45),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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

// export default CreatePlayList
export default connect(mapStateToProps, mapDispatchToProps)(CreatePlayList);
