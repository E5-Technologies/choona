import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  View,
  AppState,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import useSWR from 'swr';
import moment from 'moment';
import _ from 'lodash';

import Colors from '../../../assests/Colors';
import constants from '../../../utils/helpers/constants';
import normaliseNew from '../../../utils/helpers/DimensNew';
import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
} from '../../../action/TypeConstants';

import {useFocusEffect} from '@react-navigation/native';
import StatusBar from '../../../utils/MyStatusBar';
import ActivitySingle from '../../Activity/ActivitySingle';
import Seperator from '../ListCells/Seperator';
import HeaderComponent from '../../../widgets/HeaderComponent';
import ImagePath from '../../../assests/ImagePath';
import {getProfileRequest} from '../../../action/UserAction';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import {
  editProfileRequest,
  userFollowUnfollowRequest,
} from '../../../action/UserAction';
import Contacts from 'react-native-contacts';
import EmptyComponent from '../../Empty/EmptyComponent';
import Loader from '../../../widgets/AuthLoader';
import Avatar from '../../Avatar';

const activityUrl = constants.BASE_URL + '/activity/list';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let status = '';

const Notification = props => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [emptyVisible, setEmpty] = useState(undefined);
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

  const [pageId, setPageId] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const [onScrolled, setOnScrolled] = useState(false);

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

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 50;

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setNotifications([]);
      setPageId(1);
      mutate();
    }, []),
  );

  let previous = [];
  let today = [];
  let time = moment().format('MM-DD-YYYY');
  // console.log({ today });

  const activity = notifications ? notifications : [];

  // console.log({ activity });

  activity.map(item => {
    let postTime = moment(item.createdAt).format('MM-DD-YYYY');

    if (postTime === time) {
      today.push(item);
    } else {
      // console.log(item.id, { item });
      previous.push(item);
    }
  });

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

  if (status === '' || props.status !== status) {
    switch (props.status) {
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

  const AcceptRejectInvite = ({
    title,
    image,
    touchableOpacityDisabled,
    user,
    session_id,
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
                <Text style={[styles.followButtonText, {color: Colors.black}]}>
                  ACCEPT
                </Text>
                {/* )} */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <Loader visible={isLoading} />
      <SafeAreaView style={styles.activityContainer}>
        <HeaderComponent title={'ACTIVITY'} />
        {emptyVisible ? (
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
            {today.length !== 0 && (
              <>
                {console.log(today, 'list of today')}
                <View style={styles.activityHeader}>
                  <Text style={styles.activityHeaderText}>TODAY</Text>
                </View>
                {/* <FlatList
                  data={today}
                  scrollEnabled
                  renderItem={({item}) =>
                  {
                    return (
                      <>
                      {
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
                    // item?.activity_type == 'invitation' && (
                    //   <AcceptRejectInvite
                    //     title={item?.text}
                    //     touchableOpacityDisabled={true}
                    //     image={item?.profile_image}
                    //     user={item?.username}
                    //   />
                    }
                    <View>
                      <Text>
                        hi
                      </Text>
                    </View>
                    </>
                    )
                  }
                  keyExtractor={index => {
                    index.toString();
                  }}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={Seperator}
                /> */}

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
                <FlatList
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
                />
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginRight: normaliseNew(8),
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
    width: normaliseNew(90),
  },
  followButtonText: {
    color: Colors.black,
    fontFamily: 'Kallisto',
    fontSize: normaliseNew(10),
  },
});

const mapStateToProps = state => {
  return {
    header: state.TokenReducer,
    status: state.UserReducer.status,
  };
};

const mapDispatchToProps = dispatch => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
