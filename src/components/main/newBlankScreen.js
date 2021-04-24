import React, { useEffect, Fragment, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  TextInput,
  Clipboard,
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import HomeItemList from './ListCells/HomeItemList';
import { connect } from 'react-redux';
import { searchPostReq } from '../../action/PostAction';
import { saveSongRequest } from '../../action/SongAction';
import {
  reactionOnPostRequest,
  getUsersFromHome,
} from '../../action/UserAction';
import {
  GET_POST_FROM_TOP_50_REQUEST,
  GET_POST_FROM_TOP_50_SUCCESS,
  GET_POST_FROM_TOP_50_FAILURE,
  REACTION_ON_POST_REQUEST,
  REACTION_ON_POST_SUCCESS,
  REACTION_ON_POST_FAILURE,
  HOME_PAGE_SUCCESS,
  GET_USER_FROM_HOME_REQUEST,
  GET_USER_FROM_HOME_SUCCESS,
  GET_USER_FROM_HOME_FAILURE,
  CREATE_CHAT_TOKEN_REQUEST,
  CREATE_CHAT_TOKEN_SUCCESS,
  CREATE_CHAT_TOKEN_FAILURE,
} from '../../action/TypeConstants';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import _ from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';
import { createChatTokenRequest } from '../../action/MessageAction';
import constants from '../../utils/helpers/constants';
import axios from 'axios';

function BlankScreen(props) {

    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>
          <StatusBar backgroundColor={Colors.darkerblack} />
    
          <Loader visible={props.status === GET_POST_FROM_TOP_50_REQUEST} />
    
          <SafeAreaView style={{ flex: 1 }}>
            <HeaderComponent
              firstitemtext={false}
              imageone={ImagePath.backicon}
              title={'POSTS'}
              thirditemtext={true}
              texttwo={''}
              onPressFirstItem={() => {
                 props.navigation.goBack();
    // alert("hello")
               
              }}
            />
<Text style={{color:'white'}}> Blank screen</Text>
          </SafeAreaView>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 35,
        alignItems: 'center',
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
    
    const mapStateToProps = state => {
      console.log("statetoprops")
      return {
        status: state.PostReducer.status,
        getPostFromTop50: state.PostReducer.getPostFromTop50,
        userStatus: state.UserReducer.status,
        userProfileResp: state.UserReducer.userProfileResp,
        userSearchFromHome: state.UserReducer.userSearchFromHome,
        messageStatus: state.MessageReducer.status,
        header: state.TokenReducer,
      };
    };
    
    const mapDispatchToProps = dispatch => {
      console.log("mapdispath")
      return {
        searchPost: (text, flag) => {
          dispatch(searchPostReq(text, flag));
        },
    
        reactionOnPostRequest: payload => {
          dispatch(reactionOnPostRequest(payload));
        },
    
        saveSongReq: payload => {
          dispatch(saveSongRequest(payload));
        },
    
        getusersFromHome: payload => {
          dispatch(getUsersFromHome(payload));
        },
    
        createChatTokenRequest: payload => {
          dispatch(createChatTokenRequest(payload));
        },
      };
    };
    
   
    
    export default connect(
      mapStateToProps,
      mapDispatchToProps,
    )(BlankScreen);
    

