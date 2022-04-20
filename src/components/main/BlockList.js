import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import Seperator from './ListCells/Seperator';
import normalise from '../../utils/helpers/Dimens';
import normaliseNew from '../../utils/helpers/DimensNew';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import {
  USER_BLOCKLIST_REQUEST,
  USER_BLOCKLIST_SUCCESS,
  USER_BLOCKLIST_FAILURE,
  USER_UNBLOCK_REQUEST,
  USER_UNBLOCK_SUCCESS,
  USER_UNBLOCK_FAILURE,
} from '../../action/TypeConstants';
import {
  userBlockListRequest,
  userUnBlockRequest
} from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux';
import _ from 'lodash';

import EmptyComponent from '../Empty/EmptyComponent';
import Avatar from '../Avatar';

let status;

const BlockList = props => {

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      isInternetConnected()
        .then(() => {
          props.userBlockListRequest(false);
        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet');
        });
    });

    return () => {
      unsuscribe();
    };
  }, []);



  if (status === '' || props.status !== status) {
    switch (props.status) {
      case USER_BLOCKLIST_REQUEST:
        status = props.status;
        break;

      case USER_BLOCKLIST_SUCCESS:
        status = props.status;
        break;

      case USER_BLOCKLIST_FAILURE:
        status = props.status;
        toast('Oops', 'Something Went Wrong, Please Try Again');
        break;

      case USER_UNBLOCK_REQUEST:
        status = props.status;
        break;

      case USER_UNBLOCK_SUCCESS:
        props.userBlockListRequest();
        status = props.status;
        break;

      case USER_UNBLOCK_FAILURE:
        status = props.status;
        break;

     
    }
  }



  function renderBlockedUsersItem(data) {
   
      return (
        <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsInfo}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.push('OthersProfile', {
                      id: data.item._id,
                      following: data.item.isFollowing,
                    });
            }}
            style={{ marginRight: normaliseNew(8) }}>
            <Avatar
              image={
                (constants.profile_picture_base_url + data.item.profile_image) !== 'https://api.choona.co/uploads/user/thumb/'
                  ? constants.profile_picture_base_url + data.item.profile_image
                  : null
              }
              height={26}
              width={26}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              props.navigation.push('OthersProfile', {
                id: data.item._id,
                following: data.item.isFollowing,
              });
            }}>
            <Text style={styles.detailsText} numberOfLines={2}>
              {data.item.username && (
                <>
                  <Text style={styles.detailsTextBold}>{data.item.username} </Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
          {/* <View > */}
          <TouchableOpacity
              style={[
                styles.unBlockButton,
                { backgroundColor: Colors.red},
              ]}
              onPress={() => {
                props.unBlockReq({targetId:data.item._id});
              }}>
            <Text
              style={[
                styles.unBlockButtonText,
                {
                  color:Colors.white,
                },
              ]}>
              {"Unblock"}
            </Text>
          </TouchableOpacity>
        {/* </View>  */}
        </View>
      </View>
    </View>
      );
  }



  return (
    <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
      <StatusBar backgroundColor={Colors.darkerblack} />

      <Loader visible={props.status === USER_BLOCKLIST_REQUEST} />
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={`BLOCKED USERS`}
          thirditemtext={true}
          texttwo={''}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />
        <View
          style={{
            marginHorizontal: normalise(12),
            paddingTop: normalise(12),
          }}>
        </View>
        {_.isEmpty(props.blockedList) ? (
            <>
              <EmptyComponent
                text={
                  "Blocked users  are not found"
                }
                title={"You have not blocked anyone"}
              />
            </>
        ) : (
          <FlatList
            data={props.blockedList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={renderBlockedUsersItem}
            ItemSeparatorComponent={Seperator}
          />
        )}
        
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    blockedList: state.UserReducer.blockedList,
    userProfileResp: state.UserReducer.userProfileResp,
    
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userBlockListRequest: (onlyId) => {
      dispatch(userBlockListRequest(onlyId));
    },

    unBlockReq:payload =>{
      dispatch(userUnBlockRequest(payload));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockList);




    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginHorizontal: normaliseNew(16),
        paddingVertical: normaliseNew(16),
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
      detailsText: {
        color: Colors.white,
        flexWrap: 'wrap',
        fontSize: normaliseNew(12),
        lineHeight: normaliseNew(15),
        flex: 1,
        textAlign: 'left'
      },
      detailsTextBold: {
        fontFamily: 'ProximaNova-Bold',
      },
      unBlockButton: {
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: normaliseNew(16),
        height: normaliseNew(32),
        justifyContent: 'center',
        width: normaliseNew(90),
      },
      unBlockButtonText: {
        color: Colors.black,
        fontFamily: 'Kallisto',
        fontSize: normaliseNew(10),
      },
    });