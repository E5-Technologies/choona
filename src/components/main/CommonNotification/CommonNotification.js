import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import _ from 'lodash';
import {connect} from 'react-redux';
import {
  deleteConversationRequest,
  getChatListRequest,
} from '../../../action/MessageAction';
import {
  DELETE_CONVERSATION_FAILURE,
  DELETE_CONVERSATION_REQUEST,
  DELETE_CONVERSATION_SUCCESS,
  GET_CHAT_LIST_FAILURE,
  GET_CHAT_LIST_REQUEST,
  GET_CHAT_LIST_SUCCESS,
  USER_PROFILE_FAILURE,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
} from '../../../action/TypeConstants';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import HeaderComponent from '../../../widgets/HeaderComponent';
import EmptyComponent from '../../Empty/EmptyComponent';
import Seperator from '../ListCells/Seperator';
import {TabComponent} from './Components/TabComponent';
import Loader from '../../../widgets/AuthLoader';
import constants from '../../../utils/helpers/constants';
import InboxListItem from '../ListCells/InboxItemList';
import Contacts from 'react-native-contacts';
import useSWR from 'swr';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import ActivitySingle from '../../Activity/ActivitySingle';
import normaliseNew from '../../../utils/helpers/DimensNew';
import { useFocusEffect } from '@react-navigation/native';
import Inbox from '../Inbox';

let status;
const activityUrl = constants.BASE_URL + '/activity/list';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const CommonNotification = props => {
  const dispatch = useDispatch();
  const [bool, setBool] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [nonEmpty, setNonEmpty] = useState(false);
  const [mesageList, setMessageList] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pageId, setPageId] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const [onScrolled, setOnScrolled] = useState(false);
  const [emptyVisible, setEmpty] = useState(undefined);

  let previous = [];
  let today = [];
  let time = moment().format('MM-DD-YYYY');
  // console.log({ today });

  const activity = notifications ? notifications : [];

  activity.map(item => {
    let postTime = moment(item.createdAt).format('MM-DD-YYYY');

    if (postTime === time) {
      today.push(item);
    } else {
      // console.log(item.id, { item });
      previous.push(item);
    }
  });

  //Effects******************************
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

  useEffect(() => {
    if (isLoading) {
      let formdata = new FormData();
      formdata.append('badge_count', 0);
      formdata.append('isActivity', false);

      isInternetConnected()
        .then(() => {
          dispatch(editProfileRequest(formdata));
        })
        .catch(err => {
          toast('Oops', 'Please Connect To Internet');
        });
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (props.status === 'EDIT_PROFILE_SUCCESS') {
      props.getProfileReq();
    }
  }, [props.status, props.getProfileReq]);

  useFocusEffect(
    React.useCallback(() => {
      setNotifications([]);
      setPageId(1);
      mutate();
    }, []),
  );

  //handle state on behalf of status*************

  console.log(props.chatList,'THisischdjfk')

  if (props.status === '' || props.status !== status) {
    switch (props.status) {
      case GET_CHAT_LIST_REQUEST:
        status = props.status;
        break;

      case GET_CHAT_LIST_SUCCESS:
        status = props.status;
        setNonEmpty(true);
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
      case USER_PROFILE_REQUEST:
        status = props.status;
        break;

      case USER_PROFILE_SUCCESS:
        status = props.status;
        break;

      case USER_PROFILE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  // Helpers **********************************
  //Inbox functions*****
  function sortArray(value) {
    setMessageList(value);
    setNonEmpty(true);
  }

  function filterArray(keyword) {
    let data = _.filter(props.chatList, item => {
      return (
        item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
        item.full_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );
    });

    setMessageList([]);
    setNonEmpty(false);
    setBool(true);
    setTimeout(() => {
      if (data.length === 0) {
        setNonEmpty(true);
      }
      setMessageList(data);
      setBool(false);
    }, 800);
  }

  const getContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        //  console.log(err);
      } else {
        let contactsArray = contacts;
        let finalArray = [];
        setIsLoading(false);
        //// console.log(JSON.stringify(contacts));
        contactsArray.map(item => {
          item.phoneNumbers.map(item => {
            let number = item.number.replace(/[- )(]/g, '');
            let check = number.charAt(0);
            let number1 = parseInt(number);
            if (check === 0) {
              finalArray.push(number1);
            } else {
              const converToString = number1.toString();
              const myVar = number1.toString().substring(0, 2);
              const threeDigitVar = number1.toString().substring(0, 3);

              if (threeDigitVar === '440') {
                let backToInt = converToString.replace(threeDigitVar, '0');
                finalArray.push(backToInt);
              } else {
                if (myVar === '44' || myVar === '91') {
                  let backToInt = converToString.replace(myVar, '0');
                  finalArray.push(backToInt);
                } else {
                  let updatednumber = `0${number1}`;
                  finalArray.push(updatednumber);
                }
              }
            }
          });
        });

        // console.log(finalArray);
        props.navigation.navigate('UsersFromContacts', {data: finalArray});
      }
    });
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 50;

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const onReached = async () => {
    setOnScrolled(true);
    const response = await axios.get(`${activityUrl}?page=${pageId + 1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });
    if (response.data.data.length === 0) {
      setOnScrolled(false);
    } else {
      setPageId(pageId + 1);
    }

    previous = [...previous, ...response.data.data];
  };

  const key = `${activityUrl}?page=${pageId}`;

  const {mutate} = useSWR(key, () => getActivities(pageId), {
    onSuccess: data => {
      setIsLoading(false);
      if (data.data.length === 0) {
        setEmpty(true);
      } else {
        setEmpty(false);
      }
      if (pageId === 1) {
        setNotifications(data.data);
      } else {
        const newArray = [...notifications, ...data.data];
        setNotifications(newArray);
      }
    },
  });

  const getActivities = async pageId => {
    setIsLoading(true);
    const response = await axios.get(`${activityUrl}?page=${pageId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });

    return await response.data;
  };
  //Components**********************************

  function renderInboxItem(data) {
    return (
      <InboxListItem
        image={constants?.profile_picture_base_url + data?.item?.profile_image}
        title={data?.item?.username}
        description={
          data?.item?.message?.[data?.item?.message?.length - 1]?.text
        }
        read={
          data.item.user_id === data?.item?.receiver_id
            ? true
            : data?.item?.read
        }
        onPress={() =>
          props.navigation.navigate('InsideaMessage', {index: data?.index})
        }
        onPressImage={() => {
          props.navigation.navigate('OthersProfile', {id: data?.item?.user_id});
        }}
        onPressDelete={() =>
          Alert.alert('Do you want to delete this conversation?', '', [
            {text: 'No'},

            {
              text: 'Delete',
              onPress: () => {
                props.deleteConversationRequest({
                  chat_token: data?.item?.chat_token,
                });
              },
              style: 'destructive',
            },
          ])
        }
      />
    );
  }

  console.log(mesageList, props.chatList, 'fdhjkfhdj');

  const InboxComponent = () => {
    return (
      <View style={{flex: 1}}>
        {_.isEmpty(mesageList) ? (
          !isKeyboardVisible && (
            <EmptyComponent
              buttonPress={() => {
                props.navigation.navigate('AddSongsInMessage');
                // props.navigation.navigate('Inbox');
              }}
              buttonText={'Send a song to someone'}
              image={ImagePath ? ImagePath.emptyInbox : null}
              text={
                'You haven’t started sending music to people, click the button below to send your first song.'
              }
              title={'Your Inbox is empty'}
            />
          )
        ) : (
          <FlatList
            // data={Array(5).fill({'': ''})}
            data={mesageList ?? []}
            renderItem={renderInboxItem}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={Seperator}
          />
        )}
      </View>
    );
  };

  const AcceptRejectInvite = ({
    title,
    image,
    touchableOpacityDisabled,
    user,
    session_id,
    showButton = true,
  }) => {
    return (
      <View style={styles.container1}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsInfo}>
            <TouchableOpacity
              onPress={() => {
                null;
                // onPressImage();
              }}
              style={{marginRight: normaliseNew(8)}}>
              <Avatar
                image={
                  image !== 'https://api.choona.co/uploads/user/thumb/'
                    ? image
                    : null
                }
                height={26}
                width={26}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
              disabled={touchableOpacityDisabled}
              onPress={() => null}>
              <Text style={styles.detailsText} numberOfLines={2}>
                <>
                  <Text style={styles.detailsTextBold}>{user} </Text>
                  {title}
                </>
              </Text>
            </TouchableOpacity>
            {showButton && (
              <View>
                <TouchableOpacity
                  style={[styles.followButton, {backgroundColor: Colors.white}]}
                  onPress={() =>
                    props.navigation.navigate('SessionDetail', {
                      sessionId: session_id,
                      fromScreen: 'notificionScreen',
                    })
                  }>
                  {/* {follow ? (
              <Text style={[styles.followButtonText, {}]}>FOLLOW</Text>
            ) : ( */}
                  <Text
                    style={[styles.followButtonText, {color: Colors.black}]}>
                    JOIN
                  </Text>
                  {/* )} */}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const NotificationComponent = () => {
    return (
      <View style={{flex: 1}}>
        {_.isEmpty(notifications) ? (
          !isKeyboardVisible && (
            <EmptyComponent
              buttonPress={() => {
                setIsLoading(true);
                getContacts();
              }}
              buttonText={'Search Phonebook'}
              image={ImagePath ? ImagePath.emptyNotify : null}
              text={
                'You haven’t recieved any notifications yet. Choona is more fun with more people, search your phonebook below.'
              }
              title={'No Notifcations Yet...'}
            />
          )
        ) : (
          <ScrollView
            onMomentumScrollEnd={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                onReached();
              }
            }}
            scrollEventThrottle={400}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  mutate();
                  wait(1000).then(() => setRefreshing(false));
                }}
              />
            }>
            {today?.length !== 0 && (
              <>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityHeaderText}>TODAY</Text>
                </View>
                <FlatList
                  data={today}
                  scrollEnabled
                  renderItem={({item, index}) => {
                    let activity_type = item?.activity_type;

                    const content =
                      item.post_id !== null ? (
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('SingleSongClick', {
                              data: item.post_id,
                            });
                          }}>
                          <ActivitySingle item={item} props={props} />
                        </TouchableOpacity>
                      ) : (
                        <ActivitySingle item={item} props={props} />
                      );
                    return (
                      <>
                        {activity_type == 'invitation' ? (
                          <AcceptRejectInvite
                            title={item?.text}
                            touchableOpacityDisabled={true}
                            image={item?.profile_image}
                            user={item?.username}
                            session_id={item?.session_id}
                          />
                        ) : (
                          <View key={index}>{content}</View>
                        )}
                      </>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={Seperator}
                />
              </>
            )}
            {previous.length !== 0 && (
              <>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityHeaderText}>PREVIOUSLY</Text>
                </View>
                {/* <FlatList
                  data={previous}
                  renderItem={({item}) =>
                    item.post_id !== null ? (
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.navigate('SingleSongClick', {
                            data: item.post_id,
                          });
                        }}>
                        <ActivitySingle item={item} props={props} />
                      </TouchableOpacity>
                    ) : (
                      <ActivitySingle item={item} props={props} />
                    )
                  }
                  keyExtractor={index => {
                    index.toString();
                  }}
                  ItemSeparatorComponent={Seperator}
                  ListFooterComponent={
                    onScrolled === true && notifications.length > 0 ? (
                      <ActivityIndicator
                        size={'small'}
                        color="white"
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    ) : null
                  }
                /> */}

                <FlatList
                  data={previous}
                  scrollEnabled
                  renderItem={({item, index}) => {
                    let activity_type = item?.activity_type;

                    const content =
                      item.post_id !== null ? (
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('SingleSongClick', {
                              data: item.post_id,
                            });
                          }}>
                          <ActivitySingle item={item} props={props} />
                        </TouchableOpacity>
                      ) : (
                        <ActivitySingle item={item} props={props} />
                      );
                    return (
                      <>
                        {activity_type == 'invitation' ? (
                          <AcceptRejectInvite
                            title={item?.text}
                            touchableOpacityDisabled={true}
                            image={item?.profile_image}
                            user={item?.username}
                            session_id={item?.session_id}
                            showButton={false}
                          />
                        ) : (
                          <View key={index}>{content}</View>
                        )}
                      </>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={Seperator}
                />
              </>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.darkerblack,
      }}>
      {/* <Loader
        visible={props.status === GET_CHAT_LIST_REQUEST || bool || isLoading}
      /> */}
      <StatusBar
        barStyle="light-content" // 👈 Makes iOS status bar text white
        backgroundColor={Platform.OS === 'android' ? '#000' : undefined}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.darkerblack}}>
        <HeaderComponent
          firstitemtext={false}
          title={'EXPLORE'}
          thirditemtext={true}
          texttwo={''}
          hideBorderBottom={true}
          imageone={ImagePath.backicon}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
          imageOneStyle={{width: 20, height: 20}}
        />
        <TabComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        <View style={{flex: 1}}>
          {activeTab === 0 ? <InboxComponent /> : <NotificationComponent />}

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapperStyle: {
    backgroundColor: Colors.darkerblack,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: normalise(40),
    marginHorizontal: normalise(50),
    // borderBottomColor: Colors.fadeblack,
    // borderBottomWidth: 1,
  },
  tabBarButtonStyle: {
    width: '50%',
    height: normalise(40),
    alignItems: 'center',
    justifyContent: 'center',
    // borderRightWidth: normalise(1),
    // borderRightColor: Colors.darkerblack,
  },
  tabBarTextStyle: {
    fontSize: normalise(10),
    textTransform: 'uppercase',
    fontFamily: 'ProximaNova-Bold',
  },
  ActiveTabBar: {
    width: '100%',
    height: normalise(3),
    position: 'absolute',
    bottom: 0,
  },

  container: {flex: 1, backgroundColor: Colors.darkerblack},
  emptyWrapper: {flex: 1, alignItems: 'center'},
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  emptyContainerText: {
    color: Colors.white,
    fontSize: normaliseNew(15),
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
  emptyContainerText2: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: normaliseNew(17),
    textAlign: 'center',
    fontFamily: 'ProximaNova-Bold',
    marginBottom: '4%',
  },
  emptyImage: {
    height: 2 * normaliseNew(110),
    marginBottom: normaliseNew(30),
    marginTop: normaliseNew(30),
    width: 2 * normaliseNew(110),
  },
  activityContainer: {flex: 1},
  activityHeader: {
    flexDirection: 'row',
    width: '100%',
    height: normaliseNew(40),
    alignItems: 'center',
    backgroundColor: Colors.darkerblack,
  },
  activityHeaderText: {
    color: Colors.white,
    fontSize: normaliseNew(10),
    marginLeft: normaliseNew(16),
    fontFamily: 'ProximaNova-Bold',
  },

  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    // marginRight: normaliseNew(8),
  },
  detailsAvatar: {
    borderRadius: normaliseNew(16),
    height: normaliseNew(32),
    marginRight: normaliseNew(8),
    width: normaliseNew(32),
  },
  detailsText: {
    color: Colors.white,
    flexWrap: 'wrap',
    fontSize: normaliseNew(12),
    lineHeight: normaliseNew(15),
    flex: 1,
    textAlign: 'left',
  },
  detailsTextBold: {
    fontFamily: 'ProximaNova-Bold',
  },
  container1: {
    flex: 1,
    marginHorizontal: normaliseNew(16),
    paddingVertical: normaliseNew(16),
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: normaliseNew(16),
    height: normaliseNew(32),
    justifyContent: 'center',
    width: normaliseNew(85),
    marginLeft: normaliseNew(5),
  },
  followButtonText: {
    color: Colors.black,
    fontFamily: 'Kallisto',
    fontSize: normaliseNew(10),
  },
});

const mapStateToProps = state => {
  return {
    status: state.MessageReducer.status,
    chatList: state.MessageReducer.chatList,
    error: state.MessageReducer.error,
    header: state.TokenReducer,
    status: state.UserReducer.status,
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
    followReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },
    editProfileReq: payload => {
      dispatch(editProfileRequest(payload));
    },
    getProfileReq: () => {
      dispatch(getProfileRequest());
    },
  };
};

// export default CommonNotification;

export default connect(mapStateToProps, mapDispatchToProps)(CommonNotification);
