import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Linking,
  Dimensions,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import _ from 'lodash';
import StatusBar from '../../utils/MyStatusBar';
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import { WebView } from 'react-native-webview';
import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
} from '../../action/TypeConstants';
import {
  getProfileRequest,
  userLogoutReq,
  getCountryCodeRequest,
} from '../../action/UserAction';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';

import axios from 'axios';

import ProfileHeader from '../Profile/ProfileHeader';
import ProfileHeaderFeatured from '../Profile/ProfileHeaderFeatured';
import EmptyComponent from '../Empty/EmptyComponent';

import HeaderStyles from '../../styles/header';

let status = '';
let postStatus = '';
let totalCount = '0';

const postsUrl = constants.BASE_URL + '/user/posts';

function Profile(props) {
  const getProfileReq = props.getProfileReq;
  const token = props.header.token;

  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPrivacy, setModalPrivacy] = useState(false);
  const [modaltandcs, setModaltandcs] = useState(false);
  const [activity] = useState(props.route.params.fromAct);
  const [nonempty, setNonEmpty] = useState(false);

  const [pageId, setPageId] = useState(1);

  const [profilePosts, setProfilePosts] = useState([]);

  const onEndReached = async () => {
    setPageId(pageId + 1);
    const response = await axios.get(`${postsUrl}?page=${pageId + 1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });
    setIsLoading(false);
    setProfilePosts([...profilePosts, ...response.data.data]);
    setNonEmpty(true);
  };

  const getProfilePosts = useCallback(async () => {
    const response = await axios.get(`${postsUrl}?page=${1}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });
    setIsLoading(false);
    if (response) {
      setProfilePosts(response.data.data);
      response.data.data.length === 0
        ? (totalCount = totalCount)
        : (totalCount = response.data.postCount);
      // profilePosts.length === 0 ? setNonEmpty(true) : null;
    }
  }, [token]);

  useEffect(() => {
    isInternetConnected()
      .then(async () => {
        getProfileReq();
      })
      .catch(() => {
        // toast('Error', 'Please Connect To Internet');
      });
  }, [getProfileReq]);

  if (postStatus === '' || props.postStatus !== postStatus) {
    switch (props.postStatus) {
      case DELETE_POST_REQUEST:
        postStatus = props.postStatus;
        break;

      case DELETE_POST_SUCCESS:
        postStatus = props.postStatus;
        getProfilePosts();
        break;

      case DELETE_POST_FAILURE:
        postStatus = props.postStatus;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  useEffect(() => {
    getProfilePosts();
  }, [getProfilePosts]);

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case USER_PROFILE_REQUEST:
        status = props.status;
        break;

      case USER_PROFILE_SUCCESS:
        status = props.status;
        if (activity) {
          getIndex();
        }
        break;

      case USER_PROFILE_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  function getIndex() {
    let index = profilePosts.findIndex(
      obj => obj._id === props.route.params.postId,
    );
    if (index !== -1) {
      props.navigation.replace('PostListForUser', {
        profile_name: props.userProfileResp.full_name,
        posts: profilePosts,
        index: index,
      });
    } else {
      toast('Oops', 'Post not found');
    }
  }

  function renderProfileData(data) {
    let array = [];
    array.push(data.item);
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('PostListForUser', {
            profile_name: props.userProfileResp?.full_name,
            posts: array,
            index: '0',
          });
        }}
        style={{
          margin: normalise(4),
          marginBottom:
            data.index === profilePosts.length - 1
              ? normalise(30)
              : normalise(4),
        }}>
        <Image
          source={{
            uri:
              props.userProfileResp?.register_type === 'spotify'
                ? data.item.song_image
                : data.item.song_image,
          }}
          style={{
            width: Math.floor(Dimensions.get('window').width / 2.1),
            height: Math.floor(Dimensions.get('window').width / 2.1),
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
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
              onPress={() => {
                Linking.openURL('mailto:contact@choona.com');
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(13),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Email support with a bug/feature
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                setModalPrivacy(true);
              }}
              style={{ marginTop: normalise(18) }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(13),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                setModaltandcs(true);
              }}
              style={{ marginTop: normalise(18) }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(13),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Terms of Usage
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: normalise(18) }}
              onPress={() => {
                setModalVisible(!modalVisible);
                setModaltandcs(true);
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(13),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Terms &amp; Conditions
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                            style={{ marginTop: normalise(18) }}>
                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Change Password</Text>
                        </TouchableOpacity> */}

            <TouchableOpacity
              style={{ marginTop: normalise(18) }}
              onPress={() => {
                setModalVisible(!modalVisible);
                props.logoutReq();
              }}>
              <Text
                style={{
                  color: Colors.red,
                  fontSize: normalise(13),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Logout
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: normalise(18),
                color: Colors.grey,
                fontSize: normalise(13),
                fontFamily: 'ProximaNova-Semibold',
              }}>
              Version{' '}
              <Text style={{ fontSize: normalise(12) }}>
                {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
              </Text>
            </Text>

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

  const policyModel = () => {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalPrivacy}
        presentationStyle={'pageSheet'}
        onRequestClose={() => {
          setModalPrivacy(false);
        }}>
        <View style={{ flex: 1, backgroundColor: '#0D1E25' }}>
          <View style={{ marginTop: '10%' }}>
            <TouchableOpacity
              style={{ marginLeft: normalise(15), top: normalise(-15) }}
              onPress={() => {
                setModalPrivacy(false);
              }}>
              <Image
                source={ImagePath ? ImagePath.backicon : null}
                style={{ height: normalise(15), width: normalise(15) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <WebView source={{ uri: 'https://www.choona.com/privacy' }} />
        </View>
      </Modal>
    );
  };

  const tandcsModel = () => {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={modaltandcs}
        presentationStyle={'pageSheet'}
        onRequestClose={() => {
          setModaltandcs(false);
        }}>
        <View style={{ flex: 1, backgroundColor: '#0D1E25' }}>
          <View style={{ marginTop: '10%' }}>
            <TouchableOpacity
              style={{ marginLeft: normalise(15), top: normalise(-15) }}
              onPress={() => {
                setModaltandcs(false);
              }}>
              <Image
                source={ImagePath ? ImagePath.backicon : null}
                style={{ height: normalise(15), width: normalise(15) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <WebView source={{ uri: 'https://www.choona.com/terms' }} />
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <StatusBar backgroundColor={Colors.darkerblack} />
      {/* <Loader visible={props.status === USER_PROFILE_REQUEST} /> */}
      <SafeAreaView style={{ flex: 1 }}>
        <View style={HeaderStyles.headerContainer}>
          <View style={HeaderStyles.leftItem}>
            <TouchableOpacity
              style={{ marginRight: normalise(10) }}
              onPress={() => {
                totalCount = 0;
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
            {props.userProfileResp?.full_name}
          </Text>
          <View
            style={[
              HeaderStyles.rightItem,
              {
                flexDirection: 'row',
              },
            ]}>
            <TouchableOpacity
              style={{ marginRight: normalise(10) }}
              onPress={() => {
                props.navigation.navigate('EditProfile');
              }}>
              <Image
                source={ImagePath ? ImagePath.settings : null}
                style={{ height: normalise(20), width: normalise(20) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
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
        {props.userProfileResp && (
          <ProfileHeader
            navigation={props.navigation}
            profile={props.userProfileResp}
            totalCount={totalCount}
            user={true}
          />
        )}
        {props.userProfileResp && (
          <ProfileHeaderFeatured
            navigation={props.navigation}
            profile={props.userProfileResp}
            user={true}
          />
        )}
        {console.log({ profilePosts }, { nonempty })}
        {isLoading ? (
          <View>
            <ActivityIndicator
              color="#ffffff"
              size="large"
              style={{ marginTop: normalise(25) }}
            />
          </View>
        ) : _.isEmpty(profilePosts) && !nonempty ? (
          <EmptyComponent
            buttonPress={() =>
              props.navigation.replace('bottomTab', { screen: 'Add' })
            }
            buttonText={'Add your first post'}
            image={ImagePath ? ImagePath.emptyPost : null}
            text={
              'You haven’t uploaded any songs to Choona yet, click the button below to add your first song.'
            }
            title={'Your Profile is Empty'}
          />
        ) : (
          <FlatList
            data={profilePosts}
            renderItem={renderProfileData}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            onEndReached={() => {
              onEndReached();
            }}
            onEndReachedThreshold={1}
          />
        )}
        {renderModal()}
        {policyModel()}
        {tandcsModel()}
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    postStatus: state.PostReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    countryCode: state.UserReducer.countryCodeOject,
    header: state.TokenReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfileReq: () => {
      dispatch(getProfileRequest());
    },

    logoutReq: () => {
      dispatch(userLogoutReq());
    },

    getCountryCode: () => {
      dispatch(getCountryCodeRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
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
