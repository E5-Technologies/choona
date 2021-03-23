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

const activityUrl = constants.BASE_URL + '/activity/list';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

function Notification(props) {
  const getActivities = async pageId => {
    const response = await axios.get(`${activityUrl}?page=${pageId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });
    return await response.data;
  };

  const [notifications, setNotifications] = useState([]);
  const [pageId, setPageId] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

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

  // useEffect(() => {
  //   const unsuscribe = props.navigation.addListener('focus', () => {
  //     isInternetConnected()
  //       .then(() => {
  //         updateProfile();
  //         // setNotifications([]);
  //         // setPageId(1);
  //         // mutate();
  //       })
  //       .catch(() => {
  //         toast('Error', 'Please Connect To Internet');
  //       });
  //   });

  //   return () => {
  //     unsuscribe();
  //   };
  // });

 useFocusEffect(
    React.useCallback(() => {
      // alert("focus1111");
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

      return () => unsuscribe();
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

  activity.map(item => {
    let postTime = moment(item.createdAt).format('MM-DD-YYYY');

    if (postTime === time) {
      today.push(item);
    } else {
      // console.log(item.id, { item });
      previous.push(item);
    }
  });

  // const isCloseToBottom = ({
  //   layoutMeasurement,
  //   contentOffset,
  //   contentSize,
  // }) => {
  //   const paddingToBottom = 20;
  //   return (
  //     layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom
  //   );
  // };

  // console.log({ pageId });

  return (
    <View style={styles.container}>
      <StatusBar />
      <Loader visible={!notifications.length > 0} />
      <SafeAreaView style={styles.activityContainer}>
        <HeaderComponent title={'ACTIVITY'} />
        {notifications ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
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
            // onScroll={({ nativeEvent }) => {
            //   if (isCloseToBottom(nativeEvent)) {
            //     setPageId(pageId + 1);
            //   }
            // }}
            // scrollEventThrottle={400}
          >
            {_.isEmpty(today) ? null : (
              <View style={styles.activityHeader}>
                <Text style={styles.activityHeaderText}>TODAY</Text>
              </View>
            )}
            <FlatList
              data={today}
              renderItem={({ item }) => (
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
                <ActivitySingle item={item} props={props} />
              )}
              keyExtractor={index => {
                index.toString();
              }}
              ItemSeparatorComponent={Seperator}
              onEndReached={() => {
                setPageId(pageId + 1);
                console.log(pageId);
              }}
              onEndReachedThreshold={0.2}
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