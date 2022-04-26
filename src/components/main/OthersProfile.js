import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
  Modal
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import StatusBar from '../../utils/MyStatusBar';
import HeaderStyles from '../../styles/header';
import {
  OTHERS_PROFILE_REQUEST,
  OTHERS_PROFILE_SUCCESS,
  OTHERS_PROFILE_FAILURE,
  REPORT_REQUEST,
  REPORT_SUCCESS,
  REPORT_FAILURE
} from '../../action/TypeConstants';
import {
  othersProfileRequest,
  userFollowUnfollowRequest,
  userBlockRequest,
  userUnBlockRequest,
  ReportRequest
  // getCountryCodeRequest,
} from '../../action/UserAction';
import constants from '../../utils/helpers/constants';
import { connect } from 'react-redux';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from 'lodash';
import ReportModal from '../Posts/ReportModal'
import axios from 'axios';

import ProfileHeader from '../Profile/ProfileHeader';
import ProfileHeaderButtons from '../Profile/ProfileHeaderButtons';
import ProfileHeaderFeatured from '../Profile/ProfileHeaderFeatured';

import normalise from '../../utils/helpers/Dimens';
import EmptyComponent from '../Empty/EmptyComponent';

let status;
// let changePlayer = true;

const OthersProfile = props => {
  const othersProfileReq = props.othersProfileReq;
  const token = props.header.token;

  const [id] = useState(props.route.params.id);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [pageId, setPageId] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePosts, setProfilePosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const postsUrl = constants.BASE_URL + `/user/posts/${id}`;

  const onEndReached = async () => {
    setPageId(pageId + 1);
    const response = await axios.get(`${postsUrl}?page=${pageId + 1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });
    setIsLoading(false);
    setProfilePosts([...profilePosts, ...response.data.data]);
  };

  const getProfilePosts = useCallback(async () => {
    const response = await axios.get(`${postsUrl}?page=${1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });
    if (response) {
      setIsLoading(false);
      setProfilePosts(response.data.data);
      setTotalCount(response.data?.postCount ?? 0);
    }
  }, [postsUrl, token]);

  useEffect(() => {
    getProfilePosts();
  }, [getProfilePosts]);

  const isFocused = useIsFocused();
  useEffect(() => {
    othersProfileReq(id);
  }, [getProfilePosts, id, isFocused, othersProfileReq]);

  useEffect(() => {
    isInternetConnected()
      .then(async () => {
        othersProfileReq(id);
      })
      .catch(() => {
        toast('Error', 'Please Connect to Internet');
      });
  }, [id, othersProfileReq]);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case OTHERS_PROFILE_REQUEST:
        status = props.status;
        break;

      case OTHERS_PROFILE_SUCCESS:
        setIsFollowing(props.othersProfileresp.isFollowing);
        setIsBlocked(props.othersProfileresp.isBlocked);
        status = props.status;
        break;

      case OTHERS_PROFILE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case REPORT_REQUEST:
          status = props.status;
          break;
  
      case REPORT_SUCCESS:
          status = props.status;
          setReportModal(true);
          break;
  
      case REPORT_FAILURE:
          status = props.status;
          toast('Oops', 'Something Went Wrong, Please Try Again');
          break;
    }
  }

  const renderModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        presentationStyle={'overFullScreen'}>
        <ImageBackground
          source={ImagePath ? ImagePath.page_gradient : null}
          style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ marginTop: normalise(18) }}
              onPress={() => {
                setModalVisible(!modalVisible);
                setIsBlocked(!isBlocked);
                if(isBlocked){
                  props.unBlockReq({targetId:id})
                }else{
                  props.blockReq({targetId:id})
                }
              }}>
              <View style={styles.modalContentView}>
                <Image
                source={isBlocked ? ImagePath.closeIcon :  ImagePath.redCloseIcon}
                style={{width:normalise(23),height:normalise(23),marginRight:10}}
                resizeMode="contain"
              />
              <Text 
                style={{
                  color: isBlocked ? Colors.white :  Colors.red ,
                  fontSize: normalise(14)
                }}>
                {isBlocked ? "Unblock User" :  "Block User" }
              </Text>
                  
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: normalise(18) }}
              onPress={() => {
                setModalVisible(!modalVisible);
                props.Report({title:"unusual activity of user.",description:`${props.othersProfileresp.full_name ? props.othersProfileresp.full_name : ""} was reported because of inappropriate activities. Please kindly pay attention.`})
              }}>
              <View style={styles.modalContentView}>
                <Image
                source={ImagePath.alert}
                style={{width:normalise(23),height:normalise(23),marginRight:10}}
                resizeMode="contain"
              />
             <Text 
                style={{
                  color:Colors.white,
                  fontSize: normalise(14)
                }}>
                Report User
              </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={{
                // marginStart: normalise(20),
                // marginEnd: normalise(20),
                marginBottom: normalise(20),
                height: normalise(40),
                // width: '95%',
                backgroundColor: Colors.fadeblack,
                opacity: 10,
                borderRadius: 6,
                // padding: 35,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: normalise(24),
              }}>
              <Text
                style={{
                  fontSize: normalise(12),
                  fontFamily: 'ProximaNova-Bold',
                  color: Colors.white,
                }}>
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>
    );
  };


  function renderProfileData(data) {
    let array = [];
    array.push(data.item);
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('PostListForUser', {
            profile_name: props.othersProfileresp.full_name,
            posts: array,
            index: '0',
          });
        }}
        style={{
          margin: 0,
          marginBottom:
            data.index === profilePosts.length - 1
              ? normalise(30)
              : normalise(0),
        }}>
        <Image
          source={{
            uri:
              props.othersProfileresp.register_type === 'spotify'
                ? data.item.song_image
                : data.item.song_image.replace(
                  '100x100bb.jpg',
                  '500x500bb.jpg',
                ),
          }}
          style={{
            width: Math.floor(Dimensions.get('window').width / 2),
            height: Math.floor(Dimensions.get('window').width / 2),
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.othersProfileContainer}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      <SafeAreaView style={{ flex: 1 }}>
      <View style={HeaderStyles.headerContainer}>
          <View style={HeaderStyles.leftItem}>
            <TouchableOpacity
              style={{ marginRight: normalise(10) }}
              onPress={() => {
                setTotalCount(0);
                props.navigation.goBack();
              }}>
              <Image
                source={ImagePath ? ImagePath.backicon : null}
                style={{ height: normalise(15), width: normalise(15) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text style={HeaderStyles.headerText}>
            {props.othersProfileresp.full_name}
          </Text>
          <View
            style={[
              HeaderStyles.rightItem,
              {
                flexDirection: 'row',
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Image
                source={ImagePath ? ImagePath.iconmenu : null}
                style={{ height: normalise(20), width: normalise(20) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <ProfileHeader
          navigation={props.navigation}
          profile={props.othersProfileresp}
          isBlocked={isBlocked}
          totalCount={totalCount}
        />
        <ProfileHeaderButtons
          followReq={props.followReq}
          unBlockReq={props.unBlockReq}
          id={id}
          isFollowing={isFollowing}
          isBlocked={isBlocked}
          navigation={props.navigation}
          othersProfileresp={props.othersProfileresp}
          setIsFollowing={setIsFollowing}
          setIsBlocked={setIsBlocked}
        />
       {!isBlocked &&  <ProfileHeaderFeatured
          navigation={props.navigation}
          profile={props.othersProfileresp}
        /> }
        {isLoading && !isBlocked ? (
          <View>
            <ActivityIndicator
              color="#ffffff"
              size="large"
              style={{ marginTop: normalise(25) }}
            />
          </View>
        ) : _.isEmpty(profilePosts) ? (
          <EmptyComponent
            image={ImagePath ? ImagePath.emptyPost : null}
            text={`${props.othersProfileresp.username
                ? props.othersProfileresp.username
                : 'User'
              } has not posted any songs yet`}
            title={`${props.othersProfileresp.username
                ? props.othersProfileresp.username
                : 'User'
              }'s Profile is empty`}
          />
        ) : !isBlocked ? ( <FlatList
              data={profilePosts}
              renderItem={renderProfileData}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              onEndReached={() => onEndReached()}
              onEndReachedThreshold={0.5}
            />) : (
            <View  style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
            <EmptyComponent
            image={ImagePath ? ImagePath.emptyPost : null}
            text={`Unblock ${props.othersProfileresp.username ? props.othersProfileresp.username : 'User'} to view posts.`}
            title={`You blocked ${props.othersProfileresp.username ? props.othersProfileresp.username : 'User'}.`}
          />
            </View>)
           
        }
        {renderModal()}
      </SafeAreaView>
          <ReportModal reportModal={reportModal} setReportModal={setReportModal} contentType="User" />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    othersProfileresp: state.UserReducer.othersProfileresp,
    // countryCode: state.UserReducer.countryCodeOject,
    header: state.TokenReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    othersProfileReq: id => {
      dispatch(othersProfileRequest(id));
    },
    followReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },
    blockReq:payload =>{
      dispatch(userBlockRequest(payload));
    },
    unBlockReq:payload =>{
      dispatch(userUnBlockRequest(payload));
    },
    Report:payload =>{
      dispatch(ReportRequest(payload));
    }
    // getCountryCode: () => {
    //   dispatch(getCountryCodeRequest());
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfile);

const styles = StyleSheet.create({
  othersProfileContainer: { flex: 1, backgroundColor: Colors.darkerblack },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    // marginBottom: normalise(10),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: Colors.darkerblack,
    // margin: 20,
    padding: 20,
    paddingTop: normalise(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentView:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
});
