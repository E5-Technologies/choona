import React from 'react';
import {
  Alert,
  Dimensions,
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
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';
import StatusBar from '../../../utils/MyStatusBar';
import HeaderComponent from '../../../widgets/HeaderComponent';
import useHandlePlatformSubscriptionAction from '../../../hooks/useHandlePlatformSubscriptionAction';
import GradientButton from '../../common/GradientButton';

const {width} = Dimensions.get('window');
const Create = props => {
  const handleAddSongNavigation = useHandlePlatformSubscriptionAction(() =>
    props.navigation.navigate('AddSong', {from: 'AssembleSession'}),
  );

  const actionList = [
    {
      title: 'POST A SONG',
      action: () => props.navigation.navigate('AddSong', {from: 'CreatePost'}),
    },
    {
      title: 'POST A PLAYLIST',
      action: () => props.navigation.navigate('AddSong', {from: 'Playlist'}),
    },
    {
      title: 'LAUNCH A SESSION',
      action: () => {
        handleAddSongNavigation();
      },
    },
  ];

  return (
    <View style={styles.containerView}>
      {Platform.OS == 'android' && <StatusBar />}
      <SafeAreaView style={styles.safeAreaContainer}>
        <HeaderComponent
          firstitemtext={true}
          title={'CREATE'}
          thirditemtext={true}
          texttwo={''}
        />
        <View style={styles.headPhoneImageWrapper}>
          <Image
            source={ImagePath.headPhoneImage}
            style={styles.headPhoneImage}
            resizeMode="contain"
          />
        </View>
        <View
          style={{paddingHorizontal: normalise(20), marginTop: normalise(45)}}>
          {actionList?.map(item => {
            return (
              // <TouchableOpacity
              //   style={styles.nameWrapper}
              //   onPress={() => item?.action()}>
              //   <Image
              //     source={ImagePath.addButton}
              //     style={styles.imageStyle}
              //     resizeMode="contain"
              //   />
              //   <View style={styles.featureName}>
              //     <Text
              //       style={styles.listItemHeaderSongTextTitle}
              //       numberOfLines={2}>
              //       {item?.title}
              //     </Text>
              //   </View>
              // </TouchableOpacity>
              <GradientButton
                title={item?.title}
                containerStyle={{marginBottom: 25}}
                rightIconStyle={{
                  transform: [{rotate: '180deg'}],
                  width: 17,
                  height: 17,
                }}
                onPress={() => item?.action()}
              />
            );
          })}
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
  headPhoneImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalise(50),
    marginBottom: normalise(30),
  },
  headPhoneImage: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
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
