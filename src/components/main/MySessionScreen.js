import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import {connect} from 'react-redux';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import EmptyComponent from '../Empty/EmptyComponent';
import {SwipeListView} from 'react-native-swipe-list-view';
import {
  mySessionDeleteRequest,
  mySessionListRequest,
} from '../../action/SessionAction';
import HeaderComponent from '../../widgets/HeaderComponent';
import HomeSessionItem from './ListCells/HomeSessionItem';

let status = '';
let songStatus = '';
let postStatus = '';

const MySessionScreen = props => {
  const token = props.header.token;
  const postsUrl = constants.BASE_URL + '/post/list?page=';
  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   handleNavigation();
  // }, [props.sessionReducerData.status]);

  useEffect(() => {
    props.fetchMySessionList();
  }, []);

  //helpers************************************************************

  // const handleNavigation = () => {
  //   if (
  //     sessionListStatus === '' ||
  //     sessionListStatus !== props.sessionReducerData.status
  //   ) {
  //     switch (props.sessionReducerData.status) {
  //       case CREATE_SESSION_LIST_REQUEST:
  //         setSessionListStatus(CREATE_SESSION_LIST_REQUEST);
  //         props.fetchSessionListRequestStatusIdleHandle({status: ''}); //to set status back to idle
  //         break;
  //       case CREATE_SESSION_LIST_SUCCESS:
  //         setSessionListStatus(CREATE_SESSION_LIST_SUCCESS);
  //         props.fetchSessionListRequestStatusIdleHandle({status: ''});
  //         break;
  //       case CREATE_SESSION_LIST_FAILURE:
  //         setSessionListStatus(CREATE_SESSION_LIST_FAILURE);
  //         toast('Error', 'Something Went Wrong, Please Try Again');
  //         props.fetchSessionListRequestStatusIdleHandle({status: ''});
  //         break;
  //       default:
  //         setSessionListStatus('');
  //         break;
  //     }
  //   }
  // };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    props.fetchMySessionList();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const fetchNextPage = () => {
    if (
      props.mySessionListData?.page < props.mySessionListData?.totalPages &&
      !props.isRequestLoader
    ) {
      props.fetchMySessionList({page: props.mySessionListData?.page + 1});
    }
  };

  const renderHiddenItem = ({item}) => {
    console.log(item, 'its data h');
    return (
      <View style={styles.hiddenRow}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => props.handleMySessionDelete({sessionId: item?._id})}>
          <Image
            source={ImagePath.deleteIcon}
            style={styles.deleteIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            {
              borderLeftColor: Colors.fadeblack,
              borderLeftWidth: normalise(1),
            },
          ]}
          onPress={() =>
            props.navigation.navigate('MySessionDetailScreen', {
              sessionId: item?._id,
              isforEdit: true,
            })
          }>
          <Image
            source={ImagePath.editIcon}
            style={[styles.deleteIcon, {tintColor: Colors.white}]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.darkerblack,
      }}>
      {Platform.OS == 'android' && (
        <StatusBar backgroundColor={Colors.darkerblack} />
      )}
      <Loader visible={props.isRequestLoader} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.darkerblack}}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={'MY SESSIONS'}
          thirditemtext={true}
          //   texttwo={'SAVE'}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
          //   onPressThirdItem={() => {
          //     updateProfile();
          //   }}
          imageOneStyle={styles.imageOneStyle}
        />
        <View style={{flex: 1}}>
          {_.isEmpty(props.mySessionListData?.data) ? (
            <EmptyComponent
              image={ImagePath ? ImagePath.emptyPost : null}
              // text={
              //   'You don’t follow anyone yet, check your phonebook below to see if anyone you know is already on Choona.'
              // }
              title={'No Session Found'}
            />
          ) : (
            // <FlatList
            //   // data={Array(10).fill('')}
            //   data={props.mySessionListData?.data}
            //   renderItem={({item}) => {
            //     return (
            //       <HomeSessionItem
            //         item={item}
            //         userId={props.userProfileResp?._id}
            //       />
            //     );
            //   }}
            //   showsVerticalScrollIndicator={false}
            //   keyExtractor={item => item?._id}
            //   onEndReached={() => fetchNextPage()}
            //   onEndReachedThreshold={0.5}
            //   refreshControl={
            //     <RefreshControl
            //       refreshing={refreshing}
            //       onRefresh={onRefresh}
            //       colors={[Colors.black]}
            //       progressBackgroundColor={Colors.white}
            //       title={'Refreshing...'}
            //       titleColor={Colors.white}
            //     />
            //   }
            // />

            <SwipeListView
              data={props.mySessionListData?.data}
              renderItem={({item}) => {
                return (
                  <HomeSessionItem
                    item={item}
                    userId={props.userProfileResp?._id}
                  />
                );
              }}
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={0}
              rightOpenValue={-140}
              disableRightSwipe
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item?._id}
              onEndReached={() => fetchNextPage()}
              onEndReachedThreshold={0.2}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.black]}
                  progressBackgroundColor={Colors.white}
                  title={'Refreshing...'}
                  titleColor={Colors.white}
                />
              }
            />
          )}
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
  },
  tabBarButtonStyle: {
    width: '50%',
    height: normalise(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarTextStyle: {
    fontFamily: 'Kallisto',
    fontSize: normalise(10),
    textTransform: 'uppercase',
  },
  ActiveTabBar: {
    width: '100%',
    height: normalise(3),
    position: 'absolute',
    bottom: 0,
  },
  imageOneStyle: {
    width: normalise(15),
    height: normalise(15),
  },

  hiddenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteButton: {
    width: normalise(65),
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 0.5,
    // borderColor: Colors.meta,
    height: '100%',
  },
  deleteIcon: {
    height: normalise(20),
    width: normalise(20),
    resizeMode: 'contain',
    // marginRight: 25,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalise(100),
  },
  emptyImage: {
    width: normalise(120),
    height: normalise(120),
    resizeMode: 'contain',
    marginBottom: normalise(20),
  },
  emptyText: {
    fontSize: normalise(14),
    color: Colors.gray,
  },
});

const mapStateToProps = state => {
  return {
    // status: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    // postData: state.UserReducer.postData,
    // reactionResp: state.UserReducer.reactionResp,
    // songStatus: state.SongReducer.status,
    // savedSongResponse: state.SongReducer.savedSongResponse,
    // playingSongRef: state.SongReducer.playingSongRef,
    // chatList: state.MessageReducer.chatList,
    // messageStatus: state.MessageReducer.status,
    // postStatus: state.PostReducer.status,
    // userSearchFromHome: state.UserReducer.userSearchFromHome,
    // registerType: state.TokenReducer.registerType,
    // currentPage: state.UserReducer.currentPage,
    // SuccessToken: state.TokenReducer.token,
    // loadData: state.UserReducer.loadData,
    header: state.TokenReducer,
    mySessionListData: state.SessionReducer.mySessionListData,
    isRequestLoader: state.SessionReducer.isRequestLoader,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMySessionList: payload => {
      dispatch(mySessionListRequest(payload));
    },
    handleMySessionDelete: payload => {
      dispatch(mySessionDeleteRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MySessionScreen);
