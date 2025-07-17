import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import toast from '../../utils/helpers/ShowErrorAlert';
import StatusBar from '../../utils/MyStatusBar';
import HeaderComponent, { hitSlop } from '../../widgets/HeaderComponent';
import GradientButton from '../common/GradientButton';

function AssembleSession(props) {
  const {songItem, previousSessionData} = props?.route?.params ?? {};
  const {width, height} = useWindowDimensions();
  const [sessionList, setSessionList] = useState([]);

  //redux state and dispatch ************************************
  const dispatch = useDispatch();

  useEffect(() => {
    if (previousSessionData?.length) {
      setSessionList(previousSessionData);
    }
  }, []);

  useEffect(() => {
    // const newArray = previousSessionData
    //   ? [...previousSessionData, songItem]
    //   : [...sessionList, songItem];
    // // console.log(newArray, 'its new array');
    // setSessionList(newArray);

    if (!songItem) return;
    setSessionList(prevList => {
      const isAlreadyPresent = prevList.some(
        item => item?.details?.id === songItem?.details?.id,
      );
      if (!isAlreadyPresent) {
        return [...prevList, songItem];
      } else {
      }
      return prevList;
    });
  }, [songItem]);

  //Functions********************************************************

  const handleRemoveItemtoList = itemId => {
    let currentLength = sessionList?.length;

    const filteredArray = sessionList?.filter(
      item => item.details.id !== itemId,
    );
    setSessionList(filteredArray);
    if (currentLength == 1) {
      props.navigation.navigate('AddSong', {
        from: 'AssembleSession',
        previousSessionData: [],
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      {Platform.OS == 'android' && (
        <StatusBar backgroundColor={Colors.darkerblack} />
      )}
      <SafeAreaView style={{flex: 1}}>
        <HeaderComponent
          firstitemtext={true}
          textone={'CANCEL'}
          title={'SESSION'}
          thirditemtext={false}
          onPressFirstItem={() => {
            setSessionList([]);
            props.navigation.popToTop('Create');
          }}
        />
        <View style={{flex: 1}}>
          {sessionList && (
            <View style={styles.topContainerStyle}>
              <View
                style={[
                  styles.combienBanerWrapper,
                  {
                    width: width / 2.4,
                    height: width / 2.4,
                  },
                ]}>
                {sessionList?.map(item => {
                  return (
                    <Image
                      source={{uri: item?.image}}
                      style={styles.bannerImageStyle}
                      resizeMode="cover"
                    />
                  );
                })}
              </View>
              <View style={[styles.bottomLineStyle, {width: width / 2.4}]}></View>
            </View>
          )}
          <View style={styles.playListItemContainer}>
            <FlatList
              data={sessionList}
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
              keyExtractor={item => item?._id}
            />
            <View style={styles.buttonWrapper}>
              <GradientButton
                title={'ADD SONG'}
                containerStyle={{
                  marginBottom: normalise(10),
                }}
                showRightIcon={false}
                onPress={() =>
                  props.navigation.navigate('AddSong', {
                    from: 'AssembleSession',
                    previousSessionData: sessionList,
                  })
                }
              />
              <GradientButton
                title={'CONTINUE'}
                containerStyle={{
                  marginBottom: normalise(10),
                }}
                showRightIcon={false}
                onPress={() => {
                  if (sessionList?.length < 4) {
                    toast('Error', 'Please add atleast 4 songs!');
                    return;
                  }
                  props.navigation.navigate('SessionLaunchScreen', {
                    sessionSonglist: sessionList,
                    songItem: songItem?.registerType,
                  });
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerStyle: {
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
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: normalise(8),
    flex: 1,
    marginHorizontal: normalise(20),
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
    marginLeft: normalise(8),
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.fadeblack,
    paddingBottom: normalise(3),
    flex: 1,
    justifyContent: 'center',
  },

  songlistItemHeaderSongTextTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: normalise(12),
  },
  songlistItemHeaderSongTextArtist: {
    color: Colors.meta,
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalise(11),
  },
  buttonWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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

export default AssembleSession;
