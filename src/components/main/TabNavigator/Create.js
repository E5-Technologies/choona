import React from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {connect} from 'react-redux';
import {seachSongsForPostRequest} from '../../../action/PostAction';
import {SEARCH_SONG_REQUEST_FOR_POST_REQUEST} from '../../../action/TypeConstants';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';
import StatusBar from '../../../utils/MyStatusBar';
import Loader from '../../../widgets/AuthLoader';
import HeaderComponent from '../../../widgets/HeaderComponent';

const Create = props => {
  const actionList = [
    {
      title: 'POST A SONG',
      action: () => props.navigation.navigate('AddSong', {from: 'CreatePost'}),
    },
    {
      title: 'POST A PLAYLIST',
      // action: () => props.navigation.navigate('CreatePlayList')
      action: () => props.navigation.navigate('AddSong', {from: 'Playlist'}),
    },
    {
      title: 'LAUNCH A SESSION',
      action: () =>
        props.navigation.navigate('AddSong', {from: 'AssembleSession'}),
    },
  ];

  return (
    <View style={styles.containerView}>
      {Platform.OS == 'android' && <StatusBar />}
      <Loader visible={props.status === SEARCH_SONG_REQUEST_FOR_POST_REQUEST} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <HeaderComponent
          firstitemtext={true}
          // textone={'cancel'}
          title={'CREATE'}
          thirditemtext={true}
          texttwo={''}
        />
        <View
          style={{paddingHorizontal: normalise(20), marginTop: normalise(45)}}>
          {actionList?.map(item => {
            return (
              <TouchableOpacity
                style={styles.nameWrapper}
                onPress={() => item?.action()}>
                <Image
                  source={ImagePath.addButton}
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={styles.featureName}>
                  <Text
                    style={styles.listItemHeaderSongTextTitle}
                    numberOfLines={2}>
                    {item?.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {/* <TouchableOpacity style={styles.nameWrapper} >
                        <Image
                            source={ImagePath.addButton}
                            style={styles.imageStyle}
                            resizeMode="contain"
                        />
                        <View style={styles.featureName}>
                            <Text style={styles.listItemHeaderSongTextTitle} numberOfLines={2}>
                                Post
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nameWrapper} >
                        <Image
                            source={ImagePath.addButton}
                            style={styles.imageStyle}
                            resizeMode="contain"
                        />
                        <View style={styles.featureName}>
                            <Text style={styles.listItemHeaderSongTextTitle} numberOfLines={2}>
                                POST A PLAYLIST
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nameWrapper} >
                        <Image
                            source={ImagePath.addButton}
                            style={styles.imageStyle}
                            resizeMode="contain"
                        />
                        <View style={styles.featureName}>
                            <Text style={styles.listItemHeaderSongTextTitle} numberOfLines={2}>
                                LAUNCH A SESSION
                            </Text>
                        </View>
                    </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {flex: 1, backgroundColor: Colors.darkerblack},
  safeAreaContainer: {flex: 1},
  nameWrapper: {
    flexDirection: 'row',
    marginBottom: normalise(18),
  },
  featureName: {
    backgroundColor: Colors.fadeblack,
    borderRadius: normalise(50),
    paddingHorizontal: normalise(20),
    marginLeft: normalise(10),
    height: normalise(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(12),
  },
  imageStyle: {
    width: 35,
    height: 35,
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(Create);
