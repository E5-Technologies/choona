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
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import {useSelector, useDispatch} from 'react-redux';
import constants from '../../utils/helpers/constants';
import {
  crateSessionRequestStatusIdle,
  createSessionRequest,
} from '../../action/SessionAction';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
} from '../../action/TypeConstants';
import toast from '../../utils/helpers/ShowErrorAlert';
import {hitSlop} from '../../widgets/HeaderComponent';

// let status;

function SessionLaunchScreen(props) {
  // console.log(props?.route?.params, 'these are params')
  // const { currentSession } = props?.route?.params
  // console.log(currentSession, 'its current sessionI')
  const {sessionSonglist, songItem} = props?.route?.params ?? {};
  // console.log(JSON.stringify(sessionSonglist), 'its essionlist');
  const {width, height} = useWindowDimensions();
  const [playVisible, setPlayVisible] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [status, setStatus] = useState('');

  // Redux state ++++++++++++++++++++++++++++++++++++++++++++
  const dispatch = useDispatch();
  const userProfileResp = useSelector(
    state => state.UserReducer.userProfileResp,
  );
  const userTokenData = useSelector(state => state.TokenReducer);
  const sessionReduxData = useSelector(state => state.SessionReducer);
  const recentPostSession = useSelector(
    state => state.SessionReducer?.recentPostSession,
  );

  console.log(recentPostSession, 'its session state list h ye111');

  useEffect(() => {
    if (recentPostSession?._id) {
      props.navigation.navigate('bottomTab', {
        screen: 'Home',
        params: {activeTab: 1},
      });

      setTimeout(() => {
        props.navigation.navigate('MySessionDetailScreen', {
          sessionId: recentPostSession?._id,
          autoPlay: true,
        });
      }, 300);
    }
    dispatch(crateSessionRequestStatusIdle({status: '', data: {}}));
  }, [recentPostSession]);

  const handlePostSession = () => {
    const songListPayload = () => {
      return sessionSonglist?.map(item => {
        return {
          song_uri:
            songItem === 'spotify'
              ? item?.details?.preview_url
              : item?.details?.attributes?.previews[0]?.url,
          original_song_uri:
            songItem === 'spotify'
              ? item?.details?.external_urls?.spotify
              : item?.details?.attributes?.url,
          song_name: item?.title,
          song_image: item?.image,
          artist_name: item?.title2,
          isrc_code:
            songItem === 'spotify'
              ? item?.details?.external_ids?.isrc
              : item?.details?.attributes?.isrc,
          album_name:
            songItem === 'spotify'
              ? item?.details?.album?.name
              : item?.details?.attributes?.albumName,
          apple_song_id:
            songItem === 'spotify' ? item?.details?.id : item?.details?.id,
        };
      });
    };

    const requestObj = {
      isPrivate: isPrivate,
      //   hostBy: userProfileResp?.username,
      songs: songListPayload(),
      invited_users: [],
      sessionRegisterType: userTokenData?.registerType,
    };
    console.log(requestObj, 'its request object');
    // return;
    isInternetConnected()
      .then(() => {
        // Alert.alert('incond');
        dispatch(createSessionRequest(requestObj));
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
    // dispatch(createSessionRequest(requestObj));
  };

  const handleNavigation = () => {
    if (status === '' || status !== sessionReduxData.status) {
      switch (sessionReduxData.status) {
        case CREATE_SESSION_REQUEST:
          setStatus(CREATE_SESSION_REQUEST);
          dispatch(crateSessionRequestStatusIdle({status: ''}));
          break;
        case CREATE_SESSION_SUCCESS:
          setStatus(CREATE_SESSION_SUCCESS);
          // Navigate to Home or another screen on success
          // props.navigation.popToTop();
          // props.navigation.replace('bottomTab', {screen: 'Home'}); // Navigate to Home

          // As pre new requirment/feedback we need to redirect user to the session screen where session is hosted means songs play
          // navigation.navigate(
          //   userId == item?.own_user?._id
          //     ? 'MySessionDetailScreen'
          //     : 'SessionDetail',
          //   {sessionId: item?._id},
          // );
          dispatch(crateSessionRequestStatusIdle({status: ''}));
          break;

        case CREATE_SESSION_FAILURE:
          setStatus(CREATE_SESSION_FAILURE);
          toast('Error', 'Something Went Wrong, Please Try Again');
          dispatch(crateSessionRequestStatusIdle({status: ''}));
          break;
        default:
          setStatus('');
          break;
      }
    }
  };

  useEffect(() => {
    handleNavigation();
  }, [sessionReduxData.status]);

  return (
    <LinearGradient
      colors={['#0E402C', '#101119', '#360455']}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <View
        style={{
          flex: 1,
          // backgroundColor: Colors.darkerblack,
        }}>
        <Loader visible={sessionReduxData?.loading} />
        {/* <StatusBar backgroundColor={Colors.darkerblack} /> */}
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.headerStyle}>
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              hitSlop={hitSlop}>
              <Image
                source={ImagePath.backicon}
                style={{width: normalise(16), height: normalise(14)}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[{alignItems: 'center', flexDirection: 'row'}]}
              onPress={
                handlePostSession
                //   props.navigation.navigate('SessionActive')
              }
              hitSlop={hitSlop}>
              <Text
                style={[
                  styles.listItemHeaderSongTextTitle,
                  {
                    marginBottom: normalise(0),
                    fontSize: normalise(10),
                    fontSize: normalise(13),
                  },
                ]}
                numberOfLines={2}>
                Post
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 2.5}}>
              <View style={styles.listItemHeaderSongDetails}>
                <Text style={styles.hostedText} numberOfLines={1}>
                  Hosted by
                </Text>
                <View style={styles.nameWrapper}>
                  <Text
                    style={[
                      styles.listItemHeaderSongTextTitle,
                      {
                        textTransform: 'uppercase',
                        marginBottom: normalise(0),
                        paddingHorizontal: 30,
                      },
                    ]}
                    numberOfLines={1}>
                    {userProfileResp?.username}
                  </Text>
                  {/* <Image
                    source={ImagePath.blueTick}
                    style={{width: 16, height: 16}}
                    resizeMode="contain"
                  /> */}
                </View>
                <Image
                  source={
                    userProfileResp?.profile_image
                      ? {
                          uri:
                            constants.profile_picture_base_url +
                            userProfileResp?.profile_image,
                        }
                      : ImagePath.userPlaceholder
                  }
                  style={styles.listItemHeaderSongTypeIcon}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    styles.listItemHeaderSongTextTitle,
                    {marginTop: normalise(10), marginBottom: 0},
                  ]}
                  numberOfLines={1}>
                  NOW PLAYING
                </Text>
                <View
                  style={[
                    styles.bottomLineStyle,
                    {width: width / 3, marginTop: normalise(6)},
                  ]}></View>
              </View>
              <View style={styles.playListItemContainer}>
                <FlatList
                  data={sessionSonglist}
                  renderItem={({item, index}) => {
                    return (
                      <View style={[styles.itemWrapper]}>
                        <Image
                          source={{uri: item?.image}}
                          style={styles.songListItemImage}
                          resizeMode="cover"
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
                          {/* <View style={[styles.bottomLineStyle, { width: '100%', opacity:0.4, alignSelf:'baseline'}]}>
                                            </View> */}
                        </View>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item?._id}
                />
              </View>
            </View>
            {/* <View style={[styles.listenersContainer, {}]}>
              <View
                style={{ marginBottom: normalise(15), marginTop: normalise(10) }}>
                <View style={{}}>
                  <Text
                    style={[
                      styles.listItemHeaderSongTextTitle,
                      {
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        marginBottom: normalise(0),
                      },
                    ]}
                    numberOfLines={2}>
                    LISTENERS (0)
                  </Text>
                  <TouchableOpacity
                    style={{ marginLeft: 20, position: 'absolute', right: -80 }}
                    onPress={() => setIsPrivate(!isPrivate)}>
                    <Text
                      style={[
                        {
                          textAlign: 'center',
                          color: Colors.meta,
                          fontSize: normalise(12),
                          marginBottom: normalise(3),
                        },
                      ]}
                      numberOfLines={2}>
                      {isPrivate ? 'Private' : 'Public'}
                    </Text>
                    <Image
                      source={
                        isPrivate ? ImagePath.toggleOn : ImagePath.toggleOff
                      }
                      style={{ width: 45 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={[styles.bottomLineStyle, { width: width / 2 }]}></View>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0.6,
                }}>
                <Image
                  source={ImagePath.add_white}
                  style={styles.inviteIcon}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    styles.listItemHeaderSongTextTitle,
                    { marginLeft: normalise(8), fontSize: normalise(13) },
                  ]}
                  numberOfLines={2}>
                  Send Invite
                </Text>
              </TouchableOpacity>
            </View> */}
            <View style={{}}>
              <TouchableOpacity
                style={{
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setIsPrivate(!isPrivate)}>
                <Text
                  style={[
                    {
                      textAlign: 'center',
                      color: Colors.meta,
                      fontSize: normalise(12),
                      marginBottom: normalise(3),
                    },
                  ]}
                  numberOfLines={2}>
                  {isPrivate ? 'Private' : 'Public'}
                </Text>
                <Image
                  source={isPrivate ? ImagePath.toggleOn : ImagePath.toggleOff}
                  style={{width: 45}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </LinearGradient>
  );
}

// const mapStateToProps = state => {
//     return {
//         status: state.UserReducer.status,
//         postStatus: state.PostReducer.status,
//         userProfileResp: state.UserReducer.userProfileResp,
//         countryCode: state.UserReducer.countryCodeOject,
//         header: state.TokenReducer,
//     };
// };

const styles = StyleSheet.create({
  playListItemContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: normalise(15),
    flex: 1,
    // marginLeft: normalise(60),
  },

  itemWrapper: {
    flexDirection: 'row',
    marginBottom: normalise(10),
    flex: 1,
    width: '100%',
    // borderWidth: 1,
    // borderColor: 'green',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  songListItemImage: {
    borderRadius: normalise(5),
    height: normalise(40),
    width: normalise(40),
  },

  listItemHeaderSongDetails: {
    alignItems: 'center',
    // flex: 1,
    // flexDirection: 'row',
  },
  listItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(14),
    marginBottom: normalise(5),
    marginRight: normalise(5),
  },

  listItemHeaderSongTypeIcon: {
    borderRadius: normalise(10),
    height: normalise(90),
    width: normalise(90),
    borderRadius: normalise(80),
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  listItemHeaderSongText: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: normalise(10),
    // width: '100%',
    height: '100%',
    borderBottomWidth: 0.4,
    borderBottomColor: Colors.meta,
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
    // paddingRight: normalise(50),
  },
  songlistItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(12),
  },

  songlistItemHeaderSongTextArtist: {
    color: Colors.darkgrey,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(11),
  },

  bottomLineStyle: {
    marginTop: normalise(10),
    backgroundColor: Colors.white,
    alignSelf: 'center',
    opacity: 0.7,
    height: 0.5,
  },

  nameWrapper: {
    flexDirection: 'row',
    // marginTop: normalise(2),
    marginBottom: normalise(4),
    justifyContent: 'center',
    alignItems: 'center',
  },

  playButtonStyle: {
    width: normalise(50),
    height: normalise(50),
    justifyContent: 'center',
    alignItems: 'center',
  },

  //Footer listners styles
  listenersContainer: {
    alignItems: 'center',
    flex: 1,
  },
  joineeIitemWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    marginHorizontal: normalise(11),
    marginBottom: normalise(7),
  },
  inviteIcon: {
    borderRadius: normalise(5),
    height: normalise(20),
    width: normalise(20),
  },
  headerStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalise(20),
    paddingVertical: normalise(15),
  },
  startSessionIcon: {
    width: 16,
    height: 16,
  },
  hostedText: {
    color: Colors.meta,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
  },
});

export default SessionLaunchScreen;
