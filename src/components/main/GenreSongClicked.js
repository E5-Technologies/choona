
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
  ImageBackground, Modal,
  TextInput,
  Clipboard
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
import { reactionOnPostRequest } from '../../action/UserAction';
import {
  GET_POST_FROM_TOP_50_REQUEST, GET_POST_FROM_TOP_50_SUCCESS, GET_POST_FROM_TOP_50_FAILURE,
  REACTION_ON_POST_REQUEST, REACTION_ON_POST_SUCCESS, REACTION_ON_POST_FAILURE, HOME_PAGE_SUCCESS
}
  from '../../action/TypeConstants';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import _ from 'lodash';

let status;
let userStatus;

function GenreSongClicked(props) {

  const [name, setName] = useState(props.route.params.data);
  const [positionInArray, setPositionInArray] = useState(0);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState("");

  let flag = false;
  let changePlayer = false;

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', (payload) => {

      isInternetConnected()
        .then(() => {
          props.searchPost(name, flag)
        })
        .catch(() => {
          toast('Opps', 'Please Connect To Internet')
        })
    });

    return () => {
      unsuscribe();
    }
  });


  if (userStatus === "" || props.userStatus !== userStatus) {

    switch (props.userStatus) {

      case REACTION_ON_POST_REQUEST:
        userStatus = props.userStatus
        break;

      case REACTION_ON_POST_SUCCESS:
        userStatus = props.userStatus
        props.searchPost(name, flag)
        break;

      case REACTION_ON_POST_FAILURE:
        userStatus = props.userStatus
        break;

      case HOME_PAGE_SUCCESS:
        userStatus = props.userStatus
        props.searchPost(name, flag)
        break;

    }
  };

  if (status === "" || status !== props.status) {
    switch (props.status) {

      case GET_POST_FROM_TOP_50_REQUEST:
        status = props.status
        break;

      case GET_POST_FROM_TOP_50_SUCCESS:
        status = props.status
        break;

      case GET_POST_FROM_TOP_50_FAILURE:
        status = props.status
        toast('Error', 'Something Went Wrong, Please Try Again');
        break;
    }
  }



  // SEND REACTION
  function sendReaction(id, reaction) {
    let reactionObject = {
      post_id: id,
      text: reaction
    };
    isInternetConnected()
      .then(() => {
        props.reactionOnPostRequest(reactionObject)
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet')
      })
  };



  // HIT REACT
  function hitreact(x) {
    setVisible(true)
    setModalReact(x)
    setTimeout(() => {
      setVisible(false)
    }, 2000);
  };



  // SHOW REACTION MODAL
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={() => {
      //Alert.alert("Modal has been closed.");
    }}
  >
    <View style={{
      flex: 1,
      backgroundColor: '#000000',
      opacity: 0.9,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? normalise(70) : normalise(100) }}>{modalReact}</Text>
    </View>
  </Modal>



  // FLATLIST RENDER FUNCTION
  function renderGenreData(data) {
    return (
      <HomeItemList
        image={data.item.song_image}
        picture={data.item.userDetails.profile_image}
        name={data.item.userDetails.username}
        comments={data.item.comment}
        reactions={data.item.reaction}
        content={data.item.post_content}
        time={data.item.createdAt}
        title={data.item.song_name}
        singer={data.item.artist_name}
        modalVisible={modal1Visible}
        postType={data.item.social_type === "spotify"}
        onReactionPress={(reaction) => {
          hitreact(reaction),
            sendReaction(data.item._id, reaction);
        }}
        onPressImage={() => {
          if (props.userProfileResp._id === data.item.user_id) {
            props.navigation.navigate("Profile")
          }
          else {
            props.navigation.navigate("OthersProfile",
              { id: data.item.user_id })
          }
        }}

        onAddReaction={() => {
          hitreact1(modal1Visible)
        }}
        onPressMusicbox={() => {
          props.navigation.navigate('Player', {
            comments: data.item.comment,
            song_title: data.item.song_name,
            album_name: data.item.album_name,
            song_pic: data.item.song_image,
            username: data.item.userDetails.username,
            profile_pic: data.item.userDetails.profile_image,
            time: data.item.time, title: data.item.title,
            uri: data.item.song_uri,
            reactions: data.item.reaction,
            id: data.item._id,
            artist: data.item.artist_name,
            changePlayer: changePlayer,
            originalUri: data.item.original_song_uri !== "" ? data.item.original_song_uri : undefined,
            registerType: data.item.userDetails.register_type

          })
        }}
        onPressReactionbox={() => {
          props.navigation.navigate('HomeItemReactions', { reactions: data.item.reaction, post_id: data.item._id })
        }}
        onPressCommentbox={() => {
          props.navigation.navigate('HomeItemComments', { index: data.index, type: 'top50' });
        }}
        onPressSecondImage={() => {
          setPositionInArray(data.index)
          setModalVisible(true)
        }}
        marginBottom={data.index === props.getPostFromTop50.length - 1 ? normalise(50) : 0} />
    )
  };



  //MODAL MORE PRESSED
  const MorePressed = () => {
    return (

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
        }}
      >
        <ImageBackground
          source={ImagePath.page_gradient}
          style={styles.centeredView}
        >

          <View
            style={styles.modalView}
          >
            <Text style={{
              color: Colors.white,
              fontSize: normalise(12),
              fontFamily: 'ProximaNova-Semibold',
            }}>MORE</Text>

            <View style={{
              backgroundColor: Colors.activityBorderColor,
              height: 0.5,
              marginTop: normalise(12),
              marginBottom: normalise(12)
            }} />

            <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(10) }}
              onPress={() => {
                let saveSongObject = {
                  song_uri: props.getPostFromTop50[positionInArray].song_uri,
                  song_name: props.getPostFromTop50[positionInArray].song_name,
                  song_image: props.getPostFromTop50[positionInArray].song_image,
                  artist_name: props.getPostFromTop50[positionInArray].artist_name,
                  album_name: props.getPostFromTop50[positionInArray].album_name,
                  post_id: props.getPostFromTop50[positionInArray]._id,
                };

                props.saveSongReq(saveSongObject);
                setModalVisible(!modalVisible)
              }}>
              <Image source={ImagePath.boxicon} style={{ height: normalise(18), width: normalise(18), }}
                resizeMode='contain' />
              <Text style={{
                color: Colors.white, marginLeft: normalise(15),
                fontSize: normalise(13),
                fontFamily: 'ProximaNova-Semibold',
              }}>Save Song</Text>
            </TouchableOpacity>


            <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
              <Image source={ImagePath.sendicon} style={{ height: normalise(18), width: normalise(18), }}
                resizeMode='contain' />
              <Text style={{
                color: Colors.white,
                fontSize: normalise(13), marginLeft: normalise(15),
                fontFamily: 'ProximaNova-Semibold',
              }}>Send Song</Text>
            </TouchableOpacity>


            <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
              onPress={() => {
                Clipboard.setString(props.getPostFromTop50[positionInArray].song_uri);
                setModalVisible(!modalVisible);

                setTimeout(() => {
                  toast("Success", "Song copied to clipboard.")
                }, 1000);
              }}>
              <Image source={ImagePath.more_copy} style={{ height: normalise(18), width: normalise(18), }}
                resizeMode='contain' />
              <Text style={{
                color: Colors.white, marginLeft: normalise(15),
                fontSize: normalise(13),
                fontFamily: 'ProximaNova-Semibold',
              }}>Copy Link</Text>
            </TouchableOpacity>

          </View>


          <TouchableOpacity onPress={() => {
            setModalVisible(!modalVisible);
          }}

            style={{
              marginStart: normalise(20),
              marginEnd: normalise(20),
              marginBottom: normalise(20),
              height: normalise(50),
              width: "95%",
              backgroundColor: Colors.darkerblack,
              opacity: 10,
              borderRadius: 20,
              // padding: 35,
              alignItems: "center",
              justifyContent: 'center',


            }}>


            <Text style={{
              fontSize: normalise(12),
              fontFamily: 'ProximaNova-Bold',
              color: Colors.white
            }}>CANCEL</Text>

          </TouchableOpacity>
        </ImageBackground>
      </Modal>
    )
  };
  //END OF MODAL MORE PRESSED


  return (

    <View style={{ flex: 1, backgroundColor: Colors.black }}>

      <StatusBar />

      <Loader visible={props.status === GET_POST_FROM_TOP_50_REQUEST} />

      <SafeAreaView style={{ flex: 1, }}>

        <HeaderComponent firstitemtext={false}
          imageone={ImagePath.backicon} title={'POSTS'}
          thirditemtext={true} texttwo={""}
          onPressFirstItem={() => { props.navigation.goBack() }} />

        {props.status === GET_POST_FROM_TOP_50_SUCCESS ?

          _.isEmpty(props.getPostFromTop50) ?

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: normalise(12), color: Colors.white }}>NO POSTS</Text>
            </View>
            :
            <FlatList
              style={{ paddingTop: normalise(20) }}
              data={props.getPostFromTop50}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => { index.toString() }}
              renderItem={renderGenreData} /> : null}

        {MorePressed()}

      </SafeAreaView>
    </View>
  )
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",

  },
  modalView: {
    marginBottom: normalise(10),
    height: normalise(190),
    width: "95%",
    backgroundColor: Colors.darkerblack,
    borderRadius: 20,
    padding: 20,
    paddingTop: normalise(20)

  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,

  }
});


const mapStateToProps = (state) => {
  return {
    status: state.PostReducer.status,
    getPostFromTop50: state.PostReducer.getPostFromTop50,
    userStatus: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {

    searchPost: (text, flag) => {
      dispatch(searchPostReq(text, flag))
    },

    reactionOnPostRequest: (payload) => {
      dispatch(reactionOnPostRequest(payload))
    },

    saveSongReq: (payload) => {
      dispatch(saveSongRequest(payload))
    },

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GenreSongClicked)