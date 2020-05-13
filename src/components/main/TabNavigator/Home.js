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

const flatlistdata1 = []



const flatlistdata = [
  {
    image: ImagePath.profiletrack1,
    picture: ImagePath.dp1,
    title: 'This Girl',
    singer: "Kungs Vs Cookins 3 burners",
    comments: 1,
    name: 'Shimshimmer',
    reactions: 11,
    content: 'Absolutely use to love this song,was an unreal banger back in the day',
    time: 8
  },
  {
    image: ImagePath.profiletrack4,
    picture: ImagePath.dp,
    title: 'Paradise',
    singer: "Cold Play",
    comments: 2,
    name: 'Shimshimmer',
    reactions: 7,
    content: 'Absolutely use to love this song,was an unreal banger back in the day',
    time: 8
  },
  {
    image: ImagePath.profiletrack2,
    picture: ImagePath.dp1,
    title: 'Naked feat. Justin Suissa',
    singer: "Kygo",
    comments: 1,
    name: 'Shimshimmer',
    reactions: 10,
    content: 'Absolutely use to love this song,was an unreal banger back in the day',
    time: 8
  },

  {
    image: ImagePath.profiletrack1,
    picture: ImagePath.dp,
    title: 'Naked feat. Justin Suissa',
    singer: "Dua Lipa",
    comments: 1,
    name: 'Shimshimmer',
    reactions: 11,
    content: 'Absolutely use to love this song,was an unreal banger back in the day',
    time: 8
  },
  {
    image: ImagePath.profiletrack3,
    picture: ImagePath.dp1,
    title: 'Naked feat. Justin Suissa',
    singer: "Kygo",
    comments: 3,
    name: 'Shimshimmer',
    reactions: 9,
    content: 'Absolutely use to love this song,was an unreal banger back in the day',
    time: 8
  },
  {
    image: ImagePath.profiletrack4,
    picture: ImagePath.dp,
    title: 'Naked feat. Justin Suissa',
    singer: "Above & Beyond",
    comments: 2,
    name: 'Shimshimmer',
    reactions: 11,
    content: 'Absolutely use to love this song,was an unreal banger back in the day',
    time: 8
  },

]
export default function Home(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState("");
  const [modal1Visible, setModal1Visible] = useState(false);

  const react = ["🔥", "🕺", "💃", "😳", "❤️"]
  let val = 0

  function hitreact(x) {
    setVisible(true)
    setModalReact(x)
    this.setTimeout(() => {
      setVisible(false)
    }, 2000);
  }
  function hitreact1(modal1Visible) {

    if (modal1Visible == true) {
      setModal1Visible(false)
    }
    else {
      setModal1Visible(true)
    }

  }

  function modal() {

    return (
      val = 1
    )
  }

  function renderItem(data) {
    return (

      <HomeItemList
        image={data.item.image}
        picture={data.item.picture}
        name={data.item.name}
        comments={data.item.comments}
        reactions={data.item.reactions}
        content={data.item.content}
        time={data.item.time}
        title={data.item.title}
        singer={data.item.singer}
        modalVisible={modal1Visible}
        onPressReact1={() => {
          hitreact(react[0])
        }}
        onPressReact2={() => {
          hitreact(react[1])
        }}
        onPressReact3={() => {
          hitreact(react[2])
        }}
        onPressReact4={() => {
          hitreact(react[3])
        }}
        onPressReact5={() => {
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
          props.navigation.navigate('HomeItemComments', {
            comments: data.item.comments,
            time: data.item.time, title: data.item.title
          })
        }}
        onPressSecondImage={() => {
          setModalVisible(true)
        }}
        marginBottom={data.index === flatlistdata.length - 1 ? normalise(20) : 0} />
      // </TouchableOpacity>
    )
  }

  return (

    <View style={{
      flex: 1,
      backgroundColor: Colors.black
    }}>


      <StatusBar />

      <SafeAreaView style={{ flex: 1, position: 'relative' }}>

        {/* { modalVisible ? 
                    <Image source={ImagePath.homelightbg} style={{opacity:0.1,position:'relative'}}/>
                    :null
                }   */}

        <HomeHeaderComponent
          firstitemtext={false}
          marginTop={0}
          imageone={ImagePath.dp}
          imageoneheight={30}
          imageonewidth={30}
          title={"CHOONA"}
          thirditemtext={false}
          imagetwo={ImagePath.inbox}
          imagetwoheight={25}
          imagetwowidth={25}
          middleImageReq={true}
          onPressFirstItem={() => { props.navigation.navigate("Profile") }}
          onPressThirdItem={() => { props.navigation.navigate("Inbox") }} />


        {_.isEmpty(flatlistdata) ?

          <View style={{ flex: 1, position: 'absolute' }}>
            <View style={{ height: '60%', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Image source={ImagePath.noposts} style={{ height: normalise(150), width: normalise(150) }}
                resizeMode='contain' />
              <Text style={{
                marginTop: normalise(10), color: Colors.white,
                fontSize: normalise(14), fontWeight: 'bold'
              }}>NO POSTS YET</Text>
            </View>

            <View style={{ marginTop: normalise(10), height: '40%', alignItems: 'center', justifyContent: 'flex-end' }}>

              <TouchableOpacity style={{
                height: normalise(50), width: '80%', alignSelf: 'center',
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
          </View> :


          <View style={{ flex: 1 }}>

            <SwipeListView
              data={flatlistdata}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => { index.toString() }}
              disableRightSwipe={true}
              rightOpenValue={-75} />

            {/* <View>
              <MusicPlayerBar onPress={() => { props.navigation.navigate("Player") }} />
            </View> */}



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

                  <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(10) }}>
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
}

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
