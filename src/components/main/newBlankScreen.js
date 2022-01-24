import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import { connect } from 'react-redux';
import { searchPostReq } from '../../action/PostAction';
import { saveSongRequest } from '../../action/SongAction';
import {
  reactionOnPostRequest,
  getUsersFromHome,
} from '../../action/UserAction';
import { GET_POST_FROM_TOP_50_REQUEST } from '../../action/TypeConstants';
import Loader from '../../widgets/AuthLoader';
import { createChatTokenRequest } from '../../action/MessageAction';

function BlankScreen(props) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.newDarkBlack }}>
      <StatusBar backgroundColor={Colors.newDarkBlack} />

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
        <Text style={{ color: 'white' }}> Blank screen</Text>
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = state => {
  console.log('statetoprops');
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
  console.log('mapdispath');
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

export default connect(mapStateToProps, mapDispatchToProps)(BlankScreen);
