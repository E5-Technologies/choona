import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  View,
  AppState,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import useSWR from 'swr';
import moment from 'moment';
import _ from 'lodash';

import Colors from '../../../assests/Colors';
import constants from '../../../utils/helpers/constants';
import normaliseNew from '../../../utils/helpers/DimensNew';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../../widgets/AuthLoader';
import StatusBar from '../../../utils/MyStatusBar';
import ActivitySingle from '../../Activity/ActivitySingle';
import Seperator from '../ListCells/Seperator';
import HeaderComponent from '../../../widgets/HeaderComponent';
import ImagePath from '../../../assests/ImagePath';
import { getProfileRequest } from '../../../action/UserAction';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import {
  editProfileRequest,
  userFollowUnfollowRequest,
} from '../../../action/UserAction';


var isLoading = true;
const activityUrl = constants.BASE_URL + '/activity/list';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

function Notification(props) {
  const [isloadings, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([]);
  const getActivities = async pageId => {

    notifications.length == 0 ? setIsLoading(true) : setIsLoading(false)
    const response = await axios.get(`${activityUrl}?page=${pageId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });

    isLoading = false
    setIsLoading(false)

    return await response.data;

  };


  const [pageId, setPageId] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const [onScrolled, setOnScrolled] = useState(false);

  const key = `${activityUrl}?page=${pageId}`;
  const { mutate } = useSWR(key, () => getActivities(pageId), {
    onSuccess: data => {
      if (pageId === 1) {

        setNotifications(data.data);

      } else {

        const newArray = [...notifications, ...data.data];
        setNotifications(newArray);

      }
    },
  });

  const onReached = async () => {
    console.log("start")
    setOnScrolled(true)
    const response = await axios.get(`${activityUrl}?page=${pageId + 1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });
    console.log("pageId"+pageId)
    console.log("response" + response.data.data.length)
    if (response.data.data.length == 0) {
      setOnScrolled(false)
    }else{
      setPageId(pageId + 1)

    }

    previous = [...previous, ...response.data.data]
    // setOnScrolled(true)
    // alert("res"+JSON.stringify(response.data.data))
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 50;

    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  useFocusEffect(
    React.useCallback(() => {

      setNotifications([]);
      setPageId(1);
      mutate();
 
      AppState.addEventListener('change', updateProfile());
      const unsuscribe = props.navigation.addListener('focus', () => {
        isInternetConnected()
          .then(() => {
            // alert("focus");
            updateProfile();
            // setNotifications([]);
            // setPageId(1);
            // mutate();
          })
          .catch(() => {
            toast('Error', 'Please Connect To Internet');
          });

      });
      AppState.removeEventListener('change', updateProfile())
      return () => {
        unsuscribe()

      };
    }, [])
  );


  const updateProfile = () => {
    let formdata = new FormData();

    formdata.append('isActivity', false);

    isInternetConnected()
      .then(() => {
        props.editProfileReq(formdata),
          setTimeout(() => {
            props.getProfileReq();
          }, 1000);
      })
      .catch(err => {
        console.log(err);
        toast('Oops', 'Please Connect To Internet');
      });
  };

  let previous = [];
  let today = [];
  let time = moment().format('MM-DD-YYYY');
  // console.log({ today });

  const activity = notifications ? notifications : [];

  // console.log({ activity });

  activity.map((item, index) => {
    let postTime = moment(item.createdAt).format('MM-DD-YYYY');

    if (postTime === time) {
      today.push(item);
    } else {
      // console.log(item.id, { item });
      previous.push(item);
    }

  });


  return (

    isloadings ?
      (<View style={{ flex: 1, backgroundColor: '#000000' }}>

        <ActivityIndicator color='#ffffff' size='large' style={{ marginTop: 4 * normaliseNew(90) }}></ActivityIndicator>
      </View>)
      :
      <View style={styles.container}>

        <StatusBar />

        <SafeAreaView style={styles.activityContainer}>
          <HeaderComponent title={'ACTIVITY'} />
          {notifications ? (
            <ScrollView
              onScroll={({ nativeEvent }) => {
         
                if (isCloseToBottom(nativeEvent)) {

                  onReached()
                }

              }}
              scrollEventThrottle={400}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    mutate();
                    wait(1000).then(() => setRefreshing(false));
                  }}
                />
              }
          
            >


              {_.isEmpty(today) ? null : (
                <View style={styles.activityHeader}>
                  <Text style={styles.activityHeaderText}>TODAY</Text>
                </View>
              )}

              <FlatList
                data={today}
                scrollEnabled
                renderItem={({ item }) => (
                  item.post_id != null ?
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('SingleSongClick', {
                          data: item.post_id,
                         
                        });
                      }}
                    >
                      <ActivitySingle item={item} props={props} />
                    </TouchableOpacity>
                    :
                    <ActivitySingle item={item} props={props} />

                )}
                keyExtractor={index => {
                  index.toString();
                }}

                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={Seperator}

              />
              {_.isEmpty(previous) ? null : (
                <View style={styles.activityHeader}>
                  <Text style={styles.activityHeaderText}>PREVIOUSLY</Text>
                </View>
              )}

              <FlatList
                data={previous}
                renderItem={({ item }) => (
                  item.post_id != null ?
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('SingleSongClick', {
                          data: item.post_id,
                        
                        });
                      }}
                    >
                      <ActivitySingle item={item} props={props} />
                    </TouchableOpacity>
                    :
                    <ActivitySingle item={item} props={props} />

                )}
                keyExtractor={index => {
                  index.toString();
                }}
                ItemSeparatorComponent={Seperator}
                // onEndReached={()=>
                //   // setPageId(pageId + 1);
                //   //  alert('pageId')
                //    onReached()
                // }
                // onEndReachedThreshold={2}
                //  initialNumToRender={7}
                // onMomentumScrollBegin={() => {
                //   setOnScrolled(true);
                // }}
                // ListEmptyComponent={()=>{
                //   return(
                //   <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:'80%'}}>
                //     <Text style={{color:'white',fontSize:20}}>No Activity</Text>
                //   </View>
                //   )
                // }}
                ListFooterComponent={
                  onScrolled === true && notifications.length > 0 ? (
                    <ActivityIndicator
                      size={'small'}
                      color='white'
                      style={{
                        alignSelf: 'center',
                        // marginBottom: normalise(50),
                        // marginTop: normalise(-40),
                      }}
                    />
                  ) : null
                }
              />
            </ScrollView>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyWrapper}>
              <View style={styles.emptyContainer}>
                <Image
                  source={ImagePath.emptyActivity}
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.emptyContainerText}>
                  You haven’t recieved any notifications yet. Don’t worry, follow
                  more people to make Choona more fun.
              </Text>
              </View>
            </View>
          ) : (
            <View />
          )}
        </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  emptyWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: normaliseNew(260),
  },
  emptyContainerText: {
    color: Colors.white,
    fontSize: normaliseNew(15),
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
  emptyImage: {
    height: normaliseNew(92),
    marginBottom: normaliseNew(20),
    width: normaliseNew(92),
  },
  activityContainer: { flex: 1 },
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
});

const mapStateToProps = state => {
  return {
    header: state.TokenReducer,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notification);