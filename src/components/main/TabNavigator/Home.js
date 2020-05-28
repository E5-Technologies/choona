import React, { useState, useEffect, Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text, TextInput,
  ImageBackground,
  TouchableOpacity, KeyboardAvoidingView,
  Image,
  Modal,
  Platform
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HomeHeaderComponent from '../../../widgets/HomeHeaderComponent';
import _ from 'lodash'
import HomeItemList from '../ListCells/HomeItemList';
import { SwipeListView } from 'react-native-swipe-list-view';
import { normalizeUnits } from 'moment';
import StatusBar from '../../../utils/MyStatusBar';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import MusicPlayerBar from '../../../widgets/MusicPlayerBar';
import {
  USER_PROFILE_REQUEST, USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  HOME_PAGE_REQUEST, HOME_PAGE_SUCCESS,
  HOME_PAGE_FAILURE,
  SAVE_SONGS_REQUEST, SAVE_SONGS_SUCCESS,
  SAVE_SONGS_FAILURE,
  REACTION_ON_POST_SUCCESS
} from '../../../action/TypeConstants';
import { getProfileRequest, homePageReq, reactionOnPostRequest } from '../../../action/UserAction';
import { saveSongRequest } from '../../../action/SongAction';
import { connect } from 'react-redux'
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import Loader from '../../../widgets/AuthLoader';
import constants from '../../../utils/helpers/constants';
import { func } from 'prop-types';


let status = "";
let songStatus = ""

function Home(props) {

  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState("");
  const [modal1Visible, setModal1Visible] = useState(false);
  const [positionInArray, setPositionInArray] = useState();


  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', (payload) => {
      isInternetConnected()
        .then(() => {

          props.getProfileReq(),
            props.homePage()

        })
        .catch(() => {
          toast('Error', 'Please Connect To Internet')
        })
    });

    return () => {
      unsuscribe();
    }
  }, []);

  if (status === "" || props.status !== status) {

    switch (props.status) {

      case USER_PROFILE_REQUEST:
        status = props.status;
        break;

      case USER_PROFILE_SUCCESS:
        status = props.status;
        break;

      case USER_PROFILE_FAILURE:
        status = props.status;
        toast("Oops", "Something Went Wrong, Please Try Again")
        break;

      case HOME_PAGE_REQUEST:
        status = props.status;
        break;

      case HOME_PAGE_SUCCESS:
        status = props.status;
        break;

      case HOME_PAGE_FAILURE:
        status = props.status;
        toast("Oops", "Something Went Wrong, Please Try Again")
        break;

      case REACTION_ON_POST_SUCCESS:
        status = props.status;
        props.homePage()
        break;  
    };
  };

  if (songStatus === "" || props.songStatus !== songStatus) {

    switch (props.songStatus) {

      case SAVE_SONGS_REQUEST:
        songStatus = props.songStatus
        break;

      case SAVE_SONGS_SUCCESS:
        songStatus = props.songStatus
        if (props.savedSongResponse.status === 200)
          toast("Success", props.savedSongResponse.message)
        else
          toast("Success", props.savedSongResponse.message)
        break;

      case SAVE_SONGS_FAILURE:
        songStatus = props.status
        toast("Oops", "Something Went Wrong, Please Try Again")
        break;
    }
  };



  const react = ["🔥", "🕺", "💃", "😳", "❤️"]
  let val = 0

  function hitreact(x) {
    setVisible(true)
    setModalReact(x)
    this.setTimeout(() => {
      setVisible(false)
    }, 2000);
  };

  function hitreact1(modal1Visible) {

    if (modal1Visible == true) {
      setModal1Visible(false)
    }
    else {
      setModal1Visible(true)
    }
  };

  function modal() {

    return (
      val = 1
    )
  };

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
  }

  function renderItem(data) {
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
        onAddReaction={() => {
          hitreact1(modal1Visible)
        }}
        onPressMusicbox={() => {
          props.navigation.navigate('Player', {
            comments: data.item.comments,
            time: data.item.time, title: data.item.title
          })
        }}
        onPressReactionbox={() => {
          props.navigation.navigate('HomeItemReactions', {
            //comments: data.item.comments,
            //time: data.item.time, title: data.item.title
          })
        }}
        onPressCommentbox={() => {
          props.navigation.navigate('HomeItemComments', { index: data.index });
        }}
        onPressSecondImage={() => {
          setPositionInArray(data.index)
          setModalVisible(true)
        }}
        marginBottom={data.index === props.postData.length - 1 ? normalise(20) : 0} />
      // </TouchableOpacity>
    )
  };


  return (

    <View style={{
      flex: 1,
      backgroundColor: Colors.black
    }}>

      <Loader visible={props.status === USER_PROFILE_REQUEST || props.status === HOME_PAGE_REQUEST} />

      <StatusBar />

      <SafeAreaView style={{ flex: 1, position: 'relative' }}>

        {/* { modalVisible ? 
                    <Image source={ImagePath.homelightbg} style={{opacity:0.1,position:'relative'}}/>
                    :null
                }   */}

        <HomeHeaderComponent
          firstitemtext={false}
          marginTop={0}
          imageone={constants.profile_picture_base_url + props.userProfileResp.profile_image}
          staticFirstImage={false}
          imageoneheight={30}
          imageonewidth={30}
          borderRadius={30}
          title={"CHOONA"}
          thirditemtext={false}
          imagetwo={ImagePath.inbox}
          imagetwoheight={25}
          imagetwowidth={25}
          middleImageReq={true}
          onPressFirstItem={() => { props.navigation.navigate("Profile") }}
          onPressThirdItem={() => { props.navigation.navigate("Inbox") }} />


        {_.isEmpty(props.postData) ?

          <View style={{ flex: 1, alignItems: 'center' }}>

            <Image source={ImagePath.noposts} style={{ height: normalise(150), width: normalise(150), marginTop: '28%' }}
              resizeMode='contain' />
            <Text style={{
              marginBottom: '20%',
              marginTop: normalise(10), color: Colors.white,
              fontSize: normalise(14), fontWeight: 'bold'
            }}>NO POSTS YET</Text>


            <TouchableOpacity style={{
              height: normalise(50), width: '80%',
              borderRadius: normalise(25), backgroundColor: Colors.facebookblue, borderWidth: normalise(0.5),
              shadowColor: "#000", shadowOffset: { width: 0, height: 5, },
              shadowOpacity: 0.36, shadowRadius: 6.68, elevation: 11, flexDirection: 'row',
              alignItems: 'center', justifyContent: 'center'
            }} >
              <Image source={ImagePath.facebook}
                style={{ height: normalise(20), width: normalise(20) }}
                resizeMode='contain' />

              <Text style={{
                marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
                fontWeight: 'bold'
              }}>CONNECT WITH FACEBOOK</Text>

            </TouchableOpacity>


            <TouchableOpacity style={{
              marginBottom: normalise(30),
              marginTop: normalise(10), height: normalise(50), width: '80%', alignSelf: 'center',
              borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
              shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
              shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center', borderColor: Colors.grey,
            }}  >

              <Text style={{
                marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
                fontWeight: 'bold'
              }}>CHECK YOUR PHONEBOOK</Text>

            </TouchableOpacity>
          </View>
          :


          <View style={{ flex: 1 }}>

            <SwipeListView
              data={props.postData}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => { index.toString() }}
              disableRightSwipe={true}
              rightOpenValue={-75} />

            <View>
              <MusicPlayerBar onPress={() => { props.navigation.navigate("Player") }} />
            </View>



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
                        song_uri: props.postData[positionInArray].song_uri,
                        song_name: props.postData[positionInArray].song_name,
                        song_image: props.postData[positionInArray].song_image,
                        artist_name: props.postData[positionInArray].artist_name,
                        album_name: props.postData[positionInArray].album_name,
                        post_id: props.postData[positionInArray]._id,
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


                  <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                    <Image source={ImagePath.more_copy} style={{ height: normalise(18), width: normalise(18), }}
                      resizeMode='contain' />
                    <Text style={{
                      color: Colors.white, marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>Copy Link</Text>
                  </TouchableOpacity>


                  <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                    <Image source={ImagePath.more_unfollow} style={{ height: normalise(18), width: normalise(18), }}
                      resizeMode='contain' />
                    <Text style={{
                      color: Colors.white, marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>Unfollow Shimshimmer</Text>
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

          </View>

        }



        {modal1Visible == true ?

          <View style={{
            position: 'absolute',
            margin: 20,
            height: normalise(280),
            width: "92%",
            alignSelf: 'center',
            marginHorizontal: normalise(15),
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 35,
            bottom: 50,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}>


            <EmojiSelector
              category={Categories.history}
              showHistory={true}
              onEmojiSelected={emoji => {
                setVisible(true), setModalReact(emoji),
                  setTimeout(() => {
                    setVisible(false)
                  }, 2000)
              }}
            />

          </View>
          : null}


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
    height: normalise(220),
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
    status: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    postData: state.UserReducer.postData,
    reactionResp: state.UserReducer.reactionResp,
    songStatus: state.SongReducer.status,
    savedSongResponse: state.SongReducer.savedSongResponse
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfileReq: () => {
      dispatch(getProfileRequest())
    },

    homePage: () => {
      dispatch(homePageReq())
    },

    saveSongReq: (payload) => {
      dispatch(saveSongRequest(payload))
    },

    reactionOnPostRequest: (payload) => {
      dispatch(reactionOnPostRequest(payload))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);