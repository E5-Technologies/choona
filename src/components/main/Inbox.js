import React, { useEffect, Fragment, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Image,
  ImageBackground,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';



import Seperator from './ListCells/Seperator';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import InboxListItem from '../../components/main/ListCells/InboxItemList';
import StatusBar from '../../utils/MyStatusBar';
import database from '@react-native-firebase/database';
import moment from 'moment';
import { connect } from 'react-redux';

const FIREBASE_REF_MESSAGES = database().ref('chatMessages');

import {
  GET_CHAT_LIST_REQUEST,
  GET_CHAT_LIST_SUCCESS,
  GET_CHAT_LIST_FAILURE,
  DELETE_CONVERSATION_REQUEST,
  DELETE_CONVERSATION_SUCCESS,
  DELETE_CONVERSATION_FAILURE,
} from '../../action/TypeConstants';
import {
  getChatListRequest,
  deleteConversationRequest,
} from '../../action/MessageAction';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from 'lodash';

let status;

function Inbox(props) {
  const [search, setSearch] = useState('');
  const [mesageList, setMessageList] = useState('');
  const [bool, setBool] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const[newarr,setnewarr]=([])
  const[nonEmpty,setNonEmpty]=useState(false)

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      isInternetConnected()
        .then(() => {
          props.getChatListReq();
        })
        .catch(err => {
          toast('Error', 'Please Connect To Internet');
        });

      return () => {
        unsuscribe();
      };
    });
  });

  if (props.status === '' || props.status !== status) {
    switch (props.status) {
      case GET_CHAT_LIST_REQUEST:
        status = props.status;
        break;

      case GET_CHAT_LIST_SUCCESS:
        status = props.status;
        setNonEmpty(true)
        sortArray(props.chatList);
        break;

      case GET_CHAT_LIST_FAILURE:
        status = props.status;
        toast('Error', 'Something Went Wrong, Please Try Again');
        break;

      case DELETE_CONVERSATION_REQUEST:
        status = props.status;
        break;

      case DELETE_CONVERSATION_SUCCESS:
        status = props.status;

        isInternetConnected()
          .then(() => {
            props.getChatListReq();
          })
          .catch(err => {
            toast('Error', 'Please Connect To Internet');
          });
        break;

      case DELETE_CONVERSATION_FAILURE:
        status = props.status;
        toast('Error', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  function sortArray(value) {
    // const sortedMessages = [];
    // .concat(value)
    // .sort((a, b) => (new Date(a.time) < new Date(b.time) ? 1 : -1));
    
    setMessageList(value);
    setNonEmpty(true)
  }

  function filterArray(keyword) {
    let data = _.filter(props.chatList, item => {
      return (
        item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
        item.full_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );
    });

    // console.log(data);
    setMessageList([]);
    setNonEmpty(false)
    setBool(true);
    setTimeout(() => {
      if(data.length===0) setNonEmpty(true)
      setMessageList(data);
      setBool(false);
    }, 800);
  }

  function renderInboxItem(data) {
    return (
      <InboxListItem
        image={constants.profile_picture_base_url + data.item.profile_image}
        title={data.item.username}
        description={data.item.message[data.item.message.length - 1].text}
        read={
          data.item.user_id == data.item.receiver_id ? true : data.item.read
        }
        onPress={() =>


          props.navigation.navigate('InsideaMessage', { index: data.index })
        }
        marginBottom={
          data.index === props.chatList.length - 1 ? normalise(20) : 0
        }
        onPressImage={() => {
          props.navigation.navigate('OthersProfile', { id: data.item.user_id });
        }}
        onPressDelete={() =>
          Alert.alert('Do you want to delete this conversation?', '', [
            { text: 'No' },

            {
              text: 'Delete',
              onPress: () => {
                props.deleteConversationRequest({
                  chat_token: data.item.chat_token,
                });
              },
              style: 'destructive',
            },
          ])
        }
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

      <Loader visible={props.status === GET_CHAT_LIST_REQUEST} />
      <Loader visible={bool} />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderComponent
            firstitemtext={false}
            imageone={ImagePath.backicon}
            title={`INBOX`}
            thirditemtext={false}
            imagetwo={ImagePath.newmessage}
            imagetwoheight={25}
            imagetwowidth={25}
            onPressFirstItem={() => {
              props.navigation.goBack();
            }}
            onPressThirdItem={() => {
              props.navigation.navigate('AddSongsInMessage');
            }}
          />

{_.isEmpty(props.chatList) ? null :(

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
                backgroundColor: Colors.white,
                borderRadius: normalise(8),
                marginTop: normalise(16),
                padding: normalise(10),
                // color: Colors.white,
                paddingLeft: normalise(30),
                paddingRight: normalise(50),
              }}
              value={search}
              placeholder={'Search'}
              placeholderTextColor={Colors.darkgrey}
              onChangeText={text => {
                setSearch(text), filterArray(text);
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
                  setSearch(''), filterArray('');
                }}
                style={{
                  backgroundColor: Colors.fordGray,
                  padding: 6,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderRadius: 5,
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

)}

          {_.isEmpty(props.chatList)&& nonEmpty? (
              <View
              style={{
                flex: 1,
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Text style={{ color: Colors.white, fontSize: normalise(15) }}>
                No Messages
              </Text> */}

              <Image
                  source={ImagePath.emptyInbox}
                  style={{ height: 3*normalise(85), width: 3*normalise(85),marginTop:'6%',alignSelf:'center' }}
                  resizeMode="cover"
                  
                />

                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(15),
                    fontWeight: '500',
                    marginTop: normalise(3),
                    width: '68%',
                    textAlign: 'center',
                    alignSelf:'center',
                    fontFamily: 'ProximaNova-Bold',
                  }}>
                 Your Inbox is Empty
                </Text>
                <Text
                  style={{
                    color: Colors.fordGray,
                    fontSize: normalise(12),
                    fontWeight: '100',
                    marginTop: normalise(10),
                    width: '65%',
                    textAlign: 'center',
                    alignSelf:'center',
                    fontFamily: 'ProximaNova-Regular',
                  
                  }}>
                    You haven’t started sending music to people, click the button below to send your first song.
                </Text>
                <TouchableOpacity
                  style={{
                    marginBottom: normalise(30),
                    marginTop: normalise(50),
                    height: normalise(48),
                    width: '80%',
                    alignSelf: 'center',
                    borderRadius: normalise(25),
                    backgroundColor: Colors.white,
                    borderWidth: normalise(0.5),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 9,
                    elevation: 11,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: Colors.white,
                  
                  }}
                  onPress={() => {
                    props.navigation.navigate('AddSongsInMessage');
                  }}>
                  <Text
                    style={{
                      marginLeft: normalise(10),
                      color: Colors.darkerblack,
                      fontSize: normalise(12),
                      fontWeight: 'bold',
                    }}>
                   SEND A SONG TO SOMEONE
                  </Text>
                </TouchableOpacity>
            </View>
        
          ) : (
            <FlatList
              data={mesageList}
              renderItem={renderInboxItem}
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
    status: state.MessageReducer.status,
    chatList: state.MessageReducer.chatList,
    error: state.MessageReducer.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getChatListReq: () => {
      dispatch(getChatListRequest());
    },
    deleteConversationRequest: payload => {
      dispatch(deleteConversationRequest(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Inbox);
