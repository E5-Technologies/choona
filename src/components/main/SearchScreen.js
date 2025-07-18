import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import EmptyComponent from '../Empty/EmptyComponent';
import HomeSessionItem from './ListCells/HomeSessionItem';

const SearchScreen = props => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const top50 = [];

  const userProfileData = useSelector(
    state => state.UserReducer.userProfileResp,
  );


  console.log(userProfileData,'jkfhdkff')

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: Colors.darkerblack}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <SafeAreaView style={{flex: 1, marginHorizontal: normalise(12)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: normalise(16),
            }}>
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
              }}>
              <TextInput
                style={{
                  height: normalise(35),
                  borderRadius: normalise(8),
                  padding: normalise(10),
                  color: Colors.white,
                  marginRight: normalise(12),
                  backgroundColor: Colors.fadeblack,
                  paddingLeft: normalise(35),
                }}
                keyboardAppearance="dark"
                autoCorrect={false}
                //   value={usersSearch ? usersSearchText : songSearchText}
                placeholder="Search public sessions"
                placeholderTextColor={Colors.darkgrey}
                //   onChangeText={text => {
                //     search(text);
                //     usersSearch ? setUsersSearchText(text) : setSongSearchText(text);
                //   }}
              />
              <Image
                source={ImagePath.searchicongrey}
                style={{
                  position: 'absolute',
                  height: normalise(15),
                  width: normalise(15),
                  bottom: normalise(10),
                  marginHorizontal: normalise(12),
                  transform: [{scaleX: -1}],
                }}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={{paddingVertical: normalise(5)}}>
              <Image
                source={ImagePath.crossIcon}
                style={{
                  height: normalise(18),
                  paddingLeft: normalise(10),
                  transform: [{scaleX: -1}],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {top50?.length === 0 ? (
            !isKeyboardVisible && (
              <EmptyComponent
                image={ImagePath.emptyPost}
                text={'No Session found'}
                title={'Sessions'}
              />
            )
          ) : (
            <>
              <FlatList
                data={top50}
                keyExtractor={(item, index) => index?.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  return (
                    <HomeSessionItem
                      item={item}
                      userId={userProfileData?._id}
                    />
                  );
                }}
              />
            </>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SearchScreen;
