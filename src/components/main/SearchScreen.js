import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import EmptyComponent from '../Empty/EmptyComponent';
import HomeSessionItem from './ListCells/HomeSessionItem';
import {
  createSessionListRequestSearch,
} from '../../action/SessionAction';
import {useDispatch, useSelector} from 'react-redux';
import debounce from 'lodash.debounce';

const SearchScreen = props => {
  const dispatch = useDispatch();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const top50 = [];

  const [searchText, setSearchText] = useState('');

  const userProfileData = useSelector(
    state => state.UserReducer.userProfileResp,
  );

  const sessionData = useSelector(
    state => state.SessionReducer.searchSessionListData,
  );

  // console.log(sessionData, 'thisissessiondatalist');

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

  const handleSearch = useCallback(
    debounce(text => {
      dispatch(createSessionListRequestSearch({searchText: text}));
    }, 500), // 500ms debounce
    [],
  );

  const onChangeText = text => {
    setSearchText(text);
    handleSearch(text);
  };

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
                value={searchText}
                placeholder="Search public sessions"
                placeholderTextColor={Colors.darkgrey}
                onChangeText={text => onChangeText(text)}
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
          {sessionData?.data?.length === 0 ? (
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
                data={sessionData?.data}
                keyExtractor={(item, index) => index?.toString()}
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
