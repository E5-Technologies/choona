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
  Keyboard,
  TextInput,
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
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';

let status;

function CreatePlayList(props) {
  console.log(props.route?.params, 'these are params');
  const {songItem, previousPlaylistData} = props.route?.params;
  console.log(songItem, 'this is props Item playlist');
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

  console.log(JSON.stringify(playListArary), 'this is playListArray');

  const songListPayload = () => {
    return playListArary?.map(item => {
      return {
        song_uri:
          songItem.registerType === 'spotify'
            ? item.details.preview_url
            : item.details.attributes.previews[0].url,
        original_song_uri:
          songItem.registerType === 'spotify'
            ? item.details.external_urls.spotify
            : item.details.attributes.url,
        song_name: item?.title,
        song_image: item?.image,
        artist_name: item?.title2,
        isrc_code:
          songItem.registerType === 'spotify'
            ? item.details.external_ids.isrc
            : item.details.attributes.isrc,
        album_name:
          songItem.registerType === 'spotify'
            ? item.details.album.name
            : item.details.attributes.albumName,
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

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <SafeAreaView style={{flex: 1}}>
        <HeaderComponent
          firstitemtext={true}
          textone={'CANCEL'}
          title={'PLAYLIST'}
          thirditemtext={false}
          imagetwo={ImagePath.backicon}
          imagetwoStyle={styles.imageTwoStyle}
          onPressFirstItem={() => {
            // props.navigation.goBack();
            setPlayListArray([]);
            props.navigation.popToTop('Create');
            // // props.navigation.goBack();
            // props.navigation.navigate("AddSong", { from: 'AssembleSession', previousPlaylistData: [] })
          }}
          onPressThirdItem={createPost}
        />

        <View style={{flex: 1}}>
          {playListArary && (
            <View style={styles.topContainerStyle}>
              {/* <TextInputField
                backgroundColor={Colors.fadeblack}
                style={{backgroundColor: Colors.fadeblack}}
                autocorrect={false}
                placeholder={'PlayList name'}
                maxLength={50}
                value={playListName}
                tick_visible={playListName ? true : false}
                onChangeText={text => {
                  setPlayListName(text);
                }}
                mainStyle={{
                  borderColor: Colors.white,
                  marginTop: -normalise(22),
                  width: '75%',
                }}
              /> */}
              <TextInput
                style={{
                  color: Colors.white,
                  fontWeight: '400',
                  marginHorizontal: normalise(10),
                  marginBottom: normalise(10),
                  borderColor: Colors.white,
                  // marginTop: -normalise(22),
                  width: '75%',
                  padding: 10,
                }}
                keyboardAppearance="dark"
                scrollEnabled={false}
                multiline={false}
                maxLength={50}
                placeholder={'PlayList name'}
                placeholderTextColor={Colors.darkgrey}
                // onChangeText={text => {
                //   let indexvalue = text.lastIndexOf('@');
                //   let newString = text.substr(text.lastIndexOf('@'));

                //   if (indexvalue !== -1) {
                //     if (newString.length === 1) {
                //       if (
                //         search.substr(indexvalue - 1) === ' ' ||
                //         search.substr(indexvalue - 1) === ''
                //       ) {
                //         setFollowingList([...props.followingData]);
                //         setFollower([...props.followerData]);
                //         props.followingData.length === 0
                //           ? setShowMention(false)
                //           : setShowMention(true);
                //       } else {
                //         setShowMention(false);
                //       }
                //     } else {
                //       let newSubString = newString.substr(1, newString.length - 1);
                //       let newArray = [];
                //       let newFollowArray = [];
                //       if (props.followingData.length !== 0) {
                //         props.followingData.map((item, index) => {
                //           //  console.log("mapItem"+item.full_name)
                //           if (item.username.includes(newSubString)) {
                //             newArray.push(item);
                //           }
                //           if (index === props.followingData.length - 1) {
                //             if (props.followerData.length !== 0) {
                //               props.followerData.map((items, indexs) => {
                //                 if (items.username.includes(newSubString)) {
                //                   newFollowArray.push(items);
                //                 }
                //                 if (indexs === props.followerData.length - 1) {
                //                   newFollowArray.length === 0
                //                     ? setShowMention(false)
                //                     : (setFollowingList(newArray),
                //                       setFollower(newFollowArray),
                //                       setShowMention(true));
                //                 }
                //               });
                //             } else {
                //               setFollowingList(newArray), setShowMention(true);
                //             }
                //           }
                //         });
                //       } else {
                //         props.followerData.map((items, indexs) => {
                //           if (items.username.includes(newSubString)) {
                //             newFollowArray.push(items);
                //           }
                //           if (indexs === props.followerData.length - 1) {
                //             newArray.length === 0
                //               ? setShowMention(false)
                //               : (setFollower(newFollowArray), setShowMention(true));
                //           }
                //         });
                //       }
                //     }
                //   } else {
                //     setShowMention(false);
                //   }
                //   setSearch(text);
                // }}
                onChangeText={text => {
                  setPlayListName(text);
                  // check(text);
                }}
              />
              {/* <Text style={styles.mainTitleStyle} numberOfLines={1}>
                                @ 08 Summer Mix
                            </Text> */}
              <View
                style={[
                  styles.combienBanerWrapper,
                  {
                    width: width / 2.3,
                    height: width / 2.3,
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
                style={[styles.bottomLineStyle, {width: width / 2.3}]}></View>
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
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
            />
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            // onPress={() => props.navigation.navigate("AddSong", { from: 'Playlist' })}
            onPress={() =>
              props.navigation.navigate('AddSong', {
                from: 'Playlist',
                previousPlaylistData: playListArary,
              })
            }
            style={styles.buttonStyle}>
            <Text
              style={{
                color: Colors.white,
                fontSize: normalise(10),
                fontWeight: 'bold',
              }}>
              ADD SONG
            </Text>
          </TouchableOpacity>
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
    marginTop: normalise(15),
    flex: 1,
    marginBottom: normalise(50),
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: normalise(16),
    flex: 1,
    marginHorizontal: 15,
  },
  songListItemImage: {
    borderRadius: normalise(5),
    height: normalise(50),
    width: normalise(50),
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
    position: 'absolute',
    right: 0,
    // bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
    // bottom: 0,
    bottom: Platform.OS === 'ios' ? normalise(24) : normalise(0),
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
