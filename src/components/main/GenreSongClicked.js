
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
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import ActivityListItem from '../../components/main/ListCells/ActivityListItem';
import StatusBar from '../../utils/MyStatusBar';
import HomeItemList from './ListCells/HomeItemList';


let songsdata = [
    {
        image: ImagePath.genretrack3,
        picture: ImagePath.dp1,
        title: 'Lonely',
        singer: "Joel Corry",
        comments: 1,
        name: 'Shimshimmer',
        reactions: 11,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {
        image: ImagePath.genretrack3,
        picture: ImagePath.dp,
        title: 'Lonely',
        singer: "Joel Corry",
        comments: 2,
        name: 'Shimshimmer',
        reactions: 7,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },
    {
        image: ImagePath.genretrack3,
        picture: ImagePath.dp1,
        title: 'Lonely',
        singer: "Joel Corry",
        comments: 1,
        name: 'Shimshimmer',
        reactions: 10,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },

    {
        image: ImagePath.genretrack3,
        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        singer: "Dua Lipa",
        comments: 1,
        name: 'Shimshimmer',
        reactions: 11,
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
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
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
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
        content: 'Absolutely use to love this song,was an unreal banger bck in the day',
        time: 8
    },

];

export default function GenreSongClicked(props) {

    // const [name, setName] = useState(props.route.params.data);
    const [modalVisible, setModalVisible] = useState(false);

    function renderGenreData(data) {
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
            onPressReact1={() => {
                console.log('Coming Soon...')
            }}
            onPressReact2={() => {
                console.log('Coming Soon...')
            }}
            onPressReact3={() => {
                console.log('Coming Soon...')
            }}
            onPressReact4={() => {
                console.log('Coming Soon...')
            }}
            onPressReact5={() => {
                console.log('Coming Soon...')
            }}
            onPressMusicbox={() => {
                props.navigation.navigate('Player', {
                    comments: data.item.comments,
                    time: data.item.time, title: data.item.title
                })
            }}
            onPressReactionbox={() => {
                props.navigation.navigate('HomeItemReactions', {
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
            marginBottom={data.index === songsdata.length - 1 ? normalise(50) : 0} />
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
        )
    };
    //END OF MODAL MORE PRESSED

    return (
        
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} title={"LONELY - JOEL CORRY "}
                    thirditemtext={true} texttwo={""}
                    onPressFirstItem={() => { props.navigation.goBack() }} />


                <FlatList
                    style={{paddingTop: normalise(20)}}
                    data={songsdata}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => { index.toString() }}
                    renderItem={renderGenreData} />

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