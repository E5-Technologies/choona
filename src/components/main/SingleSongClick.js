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
  Linking,
  ActivityIndicator
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import HomeItemList from './ListCells/HomeItemList';
import { connect, useSelector } from 'react-redux';
import { searchPostReq ,deletePostReq } from '../../action/PostAction';
import { saveSongRequest } from '../../action/SongAction';
import { getSpotifyToken } from '../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../utils/helpers/AppleDevToken';
import {
  reactionOnPostRequest,
  getUsersFromHome,
  userFollowUnfollowRequest,
  getProfileRequest,
  homePageReq,
  dummyRequest,
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
let status;
let userStatus;
let messageStatus;

function SingleSongClick(props) {

  const[updateData,setUpdateData]=useState([])
  // let commentList = []
  // commentList=updateData
  const [name, setName] = useState(props.route.params.data);
 const [positionInArray, setPositionInArray] = useState(0);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState('');
  const [bool, setBool] = useState(false);
  const [isLoading,setIsLoading]=useState(true)
  const [updateList,setUpdateList]=useState([])
  const[totalReact,setTotalReact]=useState([])
  // const [totalReact,setTotalReact] = useState([])

 

  // SEND SONG VARIABLES
  const [userClicked, setUserClicked] = useState(false);
  const [userSeach, setUserSeach] = useState('');
  const [userSearchData, setUserSearchData] = useState([]);
  const [usersToSEndSong, setUsersToSEndSong] = useState([]);
  

  let flag = 'single';
  let changePlayer = false;
  var bottomSheetRef;
  const postsUrl = constants.BASE_URL + '/post/details/:';
  const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];

// console.log("topsong50"+JSON.stringify(props.getPostFromTop50))
  const getdata=async()=>{
 let  response=  await axios.get(`https://api.choona.co/api/post/details/${name}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    })
    console.log("response"+JSON.stringify(response))
    if(response.data.data.length!=0){
    let newarray = []
    newarray.push(response.data.data)
    setUpdateData(newarray)
  
  let reactArray=[]
    newarray.map((item,index)=>{
      let newObject = {"id":item._id,'react':[item.fire_count,item.love_count,item.dancer_count,item.man_dancing_count,item.face_count,item.thumbsup_count]}
      reactArray.push(newObject)
      if(newarray.length-1 === index){
      setTotalReact(reactArray)
   
    }
    })

      
   
 
    // alert("idresponse"+JSON.stringify(response.data.data))
    // setName(response.data.data.song_name)
    setIsLoading(false)
    // props.searchPost(response.data.data.song_name, flag),
       
          //   setUserSearchData([]);
          // sesUsersToSEndSong([]);
          // setUserSeach('');
      
          
    console.log("responseaaa"+JSON.stringify(response))
  }else  setIsLoading(false)
    
  }
  useEffect(() => {
  
    // const unsuscribe = props.navigation.addListener('focus', payload => {
    //   isInternetConnected()
   //     .then(() => {
    
        //    props.searchPost(name, flag),
          setUserSearchData([]);
          setUsersToSEndSong([]);
          setUserSeach('');
         
          getdata()
               
              
    //     })
    //     .catch(() => {
    //       toast('Opps', 'Please Connect To Internet');
    //     });
    // });
    // return () => {
    //    unsuscribe();
    // };
  },[]);


  

  if (userStatus === '' || props.userStatus !== userStatus) {
    switch (props.userStatus) {
      case REACTION_ON_POST_REQUEST:
        userStatus = props.userStatus;
        break;

      case REACTION_ON_POST_SUCCESS:
        userStatus = props.userStatus;
        props.searchPost(name, flag);
        break;

      case REACTION_ON_POST_FAILURE:
        userStatus = props.userStatus;
        break;

      case HOME_PAGE_SUCCESS:
        userStatus = props.userStatus;
        props.searchPost(name, flag);
        break;

      case GET_USER_FROM_HOME_REQUEST:
        userStatus = props.userStatus;
        break;

      case GET_USER_FROM_HOME_SUCCESS:
        userStatus = props.userStatus;
        setUserSearchData(props.userSearchFromHome);
        break;

      case GET_USER_FROM_HOME_FAILURE:
        userStatus = props.userStatus;
        break;
    }
  }

  if (status === '' || status !== props.status) {
    console.log("status"+props.status)
    switch (props.status) {
      case GET_POST_FROM_TOP_50_REQUEST:
        status = props.status;
        break;

      case GET_POST_FROM_TOP_50_SUCCESS:
        status = props.status;
        break;

      case GET_POST_FROM_TOP_50_FAILURE:
        status = props.status;
        toast('Error', 'Something Went Wrong, Please Try Again');
        break;
    }
  }

  if (messageStatus === '' || props.messageStatus !== messageStatus) {
    switch (props.messageStatus) {
      case CREATE_CHAT_TOKEN_REQUEST:
        messageStatus = props.messageStatus;
        break;

      case CREATE_CHAT_TOKEN_SUCCESS:
        messageStatus = props.messageStatus;
        // console.log('top50 page');
        setUserSearchData([]);
        setUsersToSEndSong([]);
        setUserSeach('');
        props.navigation.navigate('SendSongInMessageFinal', {
          image: updateData[positionInArray].song_image,
          title: updateData[positionInArray].song_name,
          title2:updateData[positionInArray].artist_name,
          users: usersToSEndSong,
          details:updateData[positionInArray],
          registerType: props.userProfileResp.registerType,
          fromAddAnotherSong: false,
          index: 0,
          fromHome: true,
          details: updateData[positionInArray],
        });
        break;

      case CREATE_CHAT_TOKEN_FAILURE:
        messageStatus = props.messageStatus;
        toast('Error', 'Something Went Wong, Please Try Again');
        break;
    }
  }

  // SEND REACTION
  function sendReaction(id, reaction) {
    const myReaction =
      reaction == react[0]
        ? 'A'
        : reaction == react[1]
        ? 'B'
        : reaction == react[2]
        ? 'C'
        : reaction == react[3]
        ? 'D'
        : reaction == react[4]
        ? 'E'
        : 'F';

    let reactionObject = {
      post_id: id,
      text: reaction,
      text_match: myReaction,
    };
   console.log("totalReactaa"+totalReact)
    updateData.map((item,index)=>{
    
      if(id===item._id)
    
    if(myReaction==='A'){
      if(updateData[index].fire_count===totalReact[index].react[0]){
        updateData[index].fire_count=updateData[index].fire_count+1
        updateData[index].reaction_count=updateData[index].reaction_count+1
        
      }
      else{
        if(updateData[index].fire_count!=0){
          updateData[index].fire_count=updateData[index].fire_count-1
          updateData[index].reaction_count=updateData[index].reaction_count-1
        }
      }
    }
    else if(myReaction==='B'){
      if(updateData[index].love_count===totalReact[index].react[1]){
        updateData[index].love_count=updateData[index].love_count+1
        updateData[index].reaction_count=updateData[index].reaction_count+1
        
      }
      else{
        if(updateData[index].love_count!=0){
          updateData[index].love_count=updateData[index].love_count-1
          updateData[index].reaction_count=updateData[index].reaction_count-1
        }
      }
    }
    else if(myReaction==='C'){
      if(updateData[index].dancer_count===totalReact[index].react[2]){
        updateData[index].dancer_count=updateData[index].dancer_count+1
        updateData[index].reaction_count=updateData[index].reaction_count+1
      }
      else{
        if(updateData[index].dancer_count!=0){
          updateData[index].dancer_count=updateData[index].dancer_count-1
          updateData[index].reaction_count=updateData[index].reaction_count-1
        }

      }
    }
    else if(myReaction==='D'){
      if(updateData[index].man_dancing_count===totalReact[index].react[3]){
        updateData[index].man_dancing_count=updateData[index].man_dancing_count+1
        updateData[index].reaction_count=updateData[index].reaction_count+1
        
      }
      else{
        if(updateData[index].man_dancing_count!=0){
          updateData[index].man_dancing_count=updateData[index].man_dancing_count-1
          updateData[index].reaction_count=updateData[index].reaction_count-1
        }
      }
    }
    else if(myReaction==='E'){
      if(updateData[index].face_count===totalReact[index].react[4]){
        updateData[index].face_count=updateData[index].face_count+1
        updateData[index].reaction_count=updateData[index].reaction_count+1
        
      }
      else{
        if(updateData[index].face_count!=0){
          updateData[index].face_count=updateData[index].face_count-1
          updateData[index].reaction_count=updateData[index].reaction_count-1  
      }

      }
    }
    else{
      if(updateData[index].thumbsup_count===totalReact[index].react[5]){
        updateData[index].thumbsup_count=updateData[index].thumbsup_count+1
        updateData[index].reaction_count=updateData[index].reaction_count+1
        
      }
      else{
        if(updateData[index].thumbsup_count!=0){
          updateData[index].thumbsup_count=updateData[index].thumbsup_count-1
          updateData[index].reaction_count=updateData[index].reaction_count-1  
      }
      }
    }
    }
  )

    isInternetConnected()
      .then(() => {
        props.reactionOnPostRequest(reactionObject);

      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
  }

  // HIT REACT
  function hitreact(x, rindex) {
    // alert("res"+ x + rindex +"sdd" +JSON.stringify(props.getPostFromTop50))

    // console.log("rs"+JSON.stringify(props.getPostFromTop50[rindex].reaction))
    
    // if (!_.isEmpty(props.getPostFromTop50[rindex].reaction)) {
      // console.log('here');

      // const present = props.getPostFromTop50[rindex].reaction.some(
      //   obj =>
      //     obj.user_id.includes(props.userProfileResp._id) &&
      //     obj.text.includes(x),
        
      // );
      //  alert('nooo'+present)

      // if (present) {
      // } else {
        setVisible(true);
        setModalReact(x);
        setTimeout(() => {
          setVisible(false);
        }, 2000);
            
      // }
    // } else {
    //   setVisible(true);
    //   setModalReact(x);
    //   setTimeout(() => {
    //     setVisible(false);
    //   }, 2000);
    //  }
  }

  function _onSelectBack(ID,comment){
  
    let newarray = updateData
    newarray.map((item,index)=>{
    
     if(item._id === ID){
  
      newarray[index].comment_count = comment

     }
    if(index=== newarray.length-1){
       setUpdateData([...newarray])
      // commentList = ([...newarray])

    }
      })
      
    }



    function _onReaction(ID,reaction,reactionList){

      let newarray = updateData
      // console.log("items"+JSON.stringify(reactionList[0].data[0].text_match))
        newarray.map((item,index)=>{
       
       if(item._id === ID){
    
    if(reactionList.length>0){
    var found = reactionList.findIndex((element)=>{ return element.header===react[0]});
    var found_love = reactionList.findIndex((element)=> {return element.header===react[1]});
    var found_dance = reactionList.findIndex((element)=>{return element.header===react[2] });
    var found_ManDance = reactionList.findIndex((element)=>{return element.header===react[3]});
    var found_face = reactionList.findIndex((element)=>{return element.header=== react[4]});
    var found_thumb = reactionList.findIndex((element)=>{return element.header===react[5]});
    
    //  alert("found"+found + found_love  + found_dance+ found_ManDance + found_face+ found_thumb)
    if(found!=-1){
      newarray[index].fire_count=reactionList[found].data.length
         }else{
           newarray[index].fire_count=0
         }
         if(found_love!=-1){
      newarray[index].love_count=reactionList[found_love].data.length
         }
         else{
           newarray[index].love_count=0
         }
         if(found_dance !=-1){
      newarray[index].dancer_count=reactionList[found_dance].data.length
         }
         else{
           newarray[index].dancer_count=0
         }
         if(found_ManDance !=-1){
      newarray[index].man_dancing_count=reactionList[found_ManDance].data.length
         }
         else{
           newarray[index].man_dancing_count=0
         }
         if(found_face != -1){
      newarray[index].face_count=reactionList[found_face].data.length
         }
         else{
           newarray[index].face_count=0
         }
         if(found_thumb != -1){
      newarray[index].thumbsup_count=reactionList[found_thumb].data.length
         }
         else{
           newarray[index].thumbsup_count=0
         }
    
         newarray[index].reaction_count= reaction
        }
            }
          
       if(index===newarray.length-1){
     
         setUpdateList([...newarray])
        // commentList = ([...newarray])

      }
         })
      } 

  // function _onReaction(ID,reaction){
  //   let newarray = commentList
  //   newarray.map((item,index)=>{
    
  //    if(item._id === ID){
  
  //     newarray[index].reaction_count = reaction

  //    }
  //   if(index=== newarray.length-1){
  //     setCommentList([...newarray])

  //   }
  //     })
  // }

// GET ISRC CODE
const callApi = async () => {
  if (props.registerType === 'spotify') {
    const spotifyToken = await getSpotifyToken();

    return await axios.get(
      `https://api.spotify.com/v1/search?q=isrc:${
        props.postData[positionInArray].isrc_code
      }&type=track`,
      {
        headers: {
          Authorization: spotifyToken,
        },
      },
    );
  } else {
    const AppleToken = await getAppleDevToken();

    return await axios.get(
      `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${
        props.postData[positionInArray].isrc_code
      }`,
      {
        headers: {
          Authorization: AppleToken,
        },
      },
    );
  }
};

 //OPEN IN APPLE / SPOTIFY
 const openInAppleORSpotify = async () => {
   console.log("props.registr"+props.registerType)
  try {
    const res = await callApi();
    // console.log(res);

    if (res.status === 200) {
      if (
        !_.isEmpty(
          props.registerType === 'spotify'
            ? res.data.tracks.items
            : res.data.data,
        )
      ) {
        if (props.userProfileResp.register_type === 'spotify') {
          // console.log('success - spotify');
          // console.log(res.data.tracks.items[0].external_urls.spotify);
          Linking.canOpenURL(res.data.tracks.items[0].external_urls.spotify)
            .then(supported => {
              if (supported) {
                Linking.openURL(
                  res.data.tracks.items[0].external_urls.spotify,
                )
                  .then(() => {
                    // console.log('success');
                  })
                  .catch(() => {
                    // console.log('error');
                  });
              }
            })
            .catch(() => {
              // console.log('not supported');
            });
          setBool(false);
        } else {
          // console.log('success - apple');
          // console.log(res.data.data[0].attributes.url);
          Linking.canOpenURL(res.data.data[0].attributes.url)
            .then(supported => {
              if (supported) {
                Linking.openURL(res.data.data[0].attributes.url)
                  .then(() => {
                    // console.log('success');
                  })
                  .catch(() => {
                    // console.log('error');
                  });
              }
            })
            .catch(() => {
              // console.log('not supported');
            });
          setBool(false);
        }
      } else {
        setBool(false);
        toast('', 'No Song Found');
      }
    } else {
      setBool(false);
      toast('Oops', 'Something Went Wrong');
    }
  } catch (error) {
    setBool(false);
    // console.log(error);
  }
};


  // FLATLIST RENDER FUNCTION
  function renderGenreData(data) {
    console.log("data"+JSON.stringify(props.userProfileRes))
    return (
      <HomeItemList
        image={data.item.song_image}
          picture={props.userProfileResp.profile_image}
          name={props.userProfileResp.username}
        comment_count={data.item.comment_count ? data.item.comment_count : 0}
        reaction_count={data.item.reaction_count ? data.item.reaction_count : 0}
        reactions={{
          fire_count: data.item.fire_count,
          love_count: data.item.love_count,
          dancer_count: data.item.dancer_count,
          man_dancing_count: data.item.man_dancing_count,
          face_count: data.item.face_count,
          thumbsup_count: data.item.thumbsup_count,
        }}
        content={data.item.post_content}
        time={data.item.createdAt}
        title={data.item.song_name}
        singer={data.item.artist_name}
        modalVisible={modal1Visible}
        postType={data.item.social_type === 'spotify'}
        onReactionPress={reaction => {
           hitreact(reaction, data.index), sendReaction(data.item._id, reaction);
        }}
        onPressImage={() => {
          if (props.userProfileResp._id === data.item.user_id) {
            props.navigation.navigate('Profile', { fromAct: false });
          } else {
            props.navigation.navigate('OthersProfile', {
              id: data.item.user_id,
            });
          }
        }}
        onAddReaction={() => {
          hitreact1(modal1Visible);
        }}
        onPressMusicbox={() => {
          props.navigation.navigate('Player', {
            comments:[],
            song_title: data.item.song_name,
            album_name: data.item.album_name,
            song_pic: data.item.song_image,
             username: props.userProfileResp.username,
              profile_pic: props.userProfileResp.profile_image,
            time: data.item.time,
            title: data.item.title,
            uri: data.item.song_uri,
            reactions: data.item.reaction,
            id: data.item._id,
            artist: data.item.artist_name,
            changePlayer: changePlayer,
            originalUri:
              data.item.original_song_uri !== ''
                ? data.item.original_song_uri
                : undefined,
            registerType: props.userProfileResp.register_type,
            isrc: data.item.isrc_code,
            details: data.item,
          });
        }}
        onPressReactionbox={() => {
          props.navigation.navigate('HomeItemReactions', {
            reactions: data.item.reaction,
            post_id: data.item._id,
            onSelectReaction: (ID,reaction,reactionList)=>_onReaction(ID,reaction,reactionList) ,


          });
        }}
        onPressCommentbox={() => {
          props.navigation.navigate('HomeItemComments', {
            index: data.index,
            type: 'top50',
            comment: data.item.comment,
            image: data.item.song_image,
             username: props.userProfileResp.username,
            userComment: data.item.post_content,
            time: data.item.createdAt,
            id: data.item._id,
             onSelect: (ID,comment)=>_onSelectBack(ID,comment) ,

          });
        }}
        onPressSecondImage={() => {
          setPositionInArray(data.index);
          setModalVisible(true);
        }}
        marginBottom={
          data.index === updateData.length - 1 ? normalise(50) : 0
        }
      />
    );
  }

  //MODAL MORE PRESSED
  const MorePressed = () => {
    return (


      <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      presentationStyle={'pageSheet'}
      onRequestClose={() => {
        //Alert.alert("Modal has been closed.");
      }}>
      <ImageBackground
        source={ImagePath.page_gradient}
        style={styles.centeredView}>
     
     {/* <View style={[styles.centeredView,{}]}> */}
          <View style={styles.modalView}>
            <Text
              style={{
                color: Colors.white,
                fontSize: normalise(12),
                fontFamily: 'ProximaNova-Semibold',
              }}>
              MORE
            </Text>

            <View
              style={{
                backgroundColor: Colors.activityBorderColor,
                height: 0.5,
                marginTop: normalise(12),
                marginBottom: normalise(12),
              }}
            />
{
  // console.log("props.getpost"+JSON.stringify( props.getPostFromTop50[positionInArray].original_song_uri))
}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: normalise(10),
                alignItems: 'center',
              }}
              onPress={() => {
                let saveSongObject = {
                  song_uri: updateData[positionInArray].song_uri,
                  song_name: updateData[positionInArray].song_name,
                  song_image:
                    updateData[positionInArray].song_image,
                  artist_name:
                    updateData[positionInArray].artist_name,
                  album_name:
                    updateData[positionInArray].album_name,
                  post_id: updateData[positionInArray]._id,
                  isrc_code: updateData[positionInArray].isrc_code,
                  original_song_uri:
                   updateData[positionInArray].original_song_uri,
                  original_reg_type:
                   props.userProfileResp.register_type,
                };

                props.saveSongReq(saveSongObject);
                setModalVisible(!modalVisible);
              }}>
              <Image
                source={ImagePath.boxicon}
                style={{ height: normalise(18), width: normalise(18) }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: Colors.white,
                  marginLeft: normalise(15),
                  fontSize: normalise(13),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Save Song
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: normalise(18),
                alignItems: 'center',
              }}
              onPress={() => {
                if (bottomSheetRef) {
                  setModalVisible(false), bottomSheetRef.open();
                }
              }}>
              <Image
                source={ImagePath.sendicon}
                style={{ height: normalise(18), width: normalise(18) }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(13),
                  marginLeft: normalise(15),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Send Song
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: normalise(18),
                alignItems: 'center',
              }}
              onPress={() => {
                Clipboard.setString(
                  updateData[positionInArray].song_uri,
                );
                setModalVisible(!modalVisible);

                setTimeout(() => {
                  toast('Success', 'Song copied to clipboard.');
                }, 1000);
              }}>
              <Image
                source={ImagePath.more_copy}
                style={{ height: normalise(18), width: normalise(18) }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: Colors.white,
                  marginLeft: normalise(15),
                  fontSize: normalise(13),
                  fontFamily: 'ProximaNova-Semibold',
                }}>
                Copy Link
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      marginTop: normalise(18),
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);

                      props.userProfileResp._id !==
                      updateData[positionInArray].user_id // USER - FOLLOW/UNFOLLOW
                        ? props.followUnfollowReq({
                            follower_id:
                            props.userProfileResp._id,
                          }) // USER - FOLLOW/UNFOLLOW
                        : props.deletePostReq(
                          updateData[positionInArray]._id,
                          ); //  DELETE POST
                    }}>
                    <Image
                      source={ImagePath.more_unfollow}
                      style={{ height: normalise(18), width: normalise(18) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: Colors.white,
                        marginLeft: normalise(15),
                        fontSize: normalise(13),
                        fontFamily: 'ProximaNova-Regular',
                      }}>
                      {/* {!_.isEmpty(props.userProfileResp)
                        ? props.userProfileResp._id ===
                        props.getPostFromTop50[positionInArray].user_id
                          ? 'Delete Post'
                          : `Unfollow ${
                            props.getPostFromTop50[positionInArray].userDetails
                                .username
                            }`
                        : ''} */}
                        Delete Post
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      marginTop: normalise(18),
                      alignItems: 'center',
                    }}
                    onPress={() => {
                    
                      if (
                        props.userProfileResp.register_type === props.registerType
                      ) {
                        // console.log('same reg type');
                        setModalVisible(false);
                         setBool(true),
                          Linking.canOpenURL(
                           updateData[positionInArray].original_song_uri,
                          )
                            .then(() => {
                              Linking.openURL(
                                updateData[positionInArray]
                                  .original_song_uri,
                              )
                                .then(() => {
                                  // console.log('success');
                                  setBool(false);
                                })
                                .catch(() => {
                                  // console.log('error');
                                });
                            })
                            .catch(err => {
                              // console.log('unsupported');
                            });
                      } else {
                         console.log('diffirent reg type');
                        setModalVisible(false);
                        setBool(true),
                          isInternetConnected()
                            .then(() => {
                              openInAppleORSpotify();
                            })
                            .catch(() => {
                              toast('', 'Please Connect To Internet');
                            });
                      }
                    }}>
                    <Image
                      source={
                        !_.isEmpty(props.userProfileResp)
                          ? props.userProfileResp.register_type === 'spotify'
                            ? ImagePath.spotifyicon
                            : ImagePath.applemusic
                          : ''
                      }
                      style={{
                        height: normalise(18),
                        width: normalise(18),
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: Colors.white,
                        marginLeft: normalise(15),
                        fontSize: normalise(13),
                        fontFamily: 'ProximaNova-Regular',
                      }}>
                      {!_.isEmpty(props.userProfileResp)
                        ? props.userProfileResp.register_type === 'spotify'
                          ? 'Open on Spotify'
                          : 'Open on Apple'
                        : ''}
                    </Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      marginTop: normalise(18),
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      if (props.userProfileResp.register_type === 'spotify')
                        props.navigation.navigate('AddToPlayListScreen', {
                          originalUri:
                          updateData[positionInArray].original_song_uri,
                          registerType:
                          updateData[positionInArray].social_type,
                          isrc: updateData[positionInArray].isrc_code,
                        });
                      else {
                        // setTimeout(() => {
                        //   toast("Oops", "Only, Spotify users can add to their playlist now.")
                        // }, 1000)
                        props.navigation.navigate('AddToPlayListScreen', {
                          isrc: updateData[positionInArray].isrc_code,
                        });
                      }
                    }}>
                    <Image
                      source={ImagePath.addicon}
                      style={{
                        height: normalise(18),
                        width: normalise(18),
                        // borderRadius: normalise(9),
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: Colors.white,
                        marginLeft: normalise(15),
                        fontSize: normalise(13),
                        fontFamily: 'ProximaNova-Regular',
                      }}>
                      Add to Playlist
                    </Text>
                  </TouchableOpacity>


          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={{
              // marginStart: normalise(20),
              // marginEnd: normalise(20),
              // marginBottom: normalise(20),
              marginTop:normalise(30),
              height: normalise(40),
              // width: '95%',
              backgroundColor: Colors.darkerblack,
              opacity: 10,
              borderRadius: 6,
              // padding: 35,
              alignItems: 'center',
              justifyContent: 'center',
              
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

        {/* </View> */}
     
      </ImageBackground>
    </Modal>



   );
  };
  //END OF MODAL MORE PRESSED

  const searchUser = text => {
    if (text.length >= 1) {
      props.getusersFromHome({ keyword: text });
    }
  };

  function sendMessagesToUsers() {
    var userIds = [];
    usersToSEndSong.map(users => {
      userIds.push(users._id);
    });
    props.createChatTokenRequest(userIds);
  }

  // RENDER USER SEARCH FLATLIST DATA
  function renderAddUsersToMessageItem(data) {
    return (
      <TouchableOpacity
        style={{
          marginTop: normalise(10),
          width: '87%',
          alignSelf: 'center',
        }}
        onPress={() => {
          if (usersToSEndSong.length > 0) {
            // let idArray = [];

            // usersToSEndSong.map((item, index) => {

            //   idArray.push(item._id)

            // });
            // if (idArray.includes(data.item._id)) {
            //   // console.log('Already Exists');
            // }
            // else {
            //   let array = [...usersToSEndSong]
            //   array.push(data.item)
            //   sesUsersToSEndSong(array);
            // };

            toast('Error', 'You can select one user at a time');
          } else {
            let array = [...usersToSEndSong];
            array.push(data.item);
            setUsersToSEndSong(array);
          }
        }}>
        <View
          style={{
            flexDirection: 'row',
            borderColor: Colors.activityBorderColor,
            borderBottomWidth: normalise(0.5),
            paddingBottom: normalise(10),
          }}>
          <Image
            source={{
              uri: constants.profile_picture_base_url + data.item.profile_image,
            }}
            style={{ height: 35, width: 35, borderRadius: normalise(13.5) }}
          />
          <View style={{ marginStart: normalise(10) }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'ProximaNova-Semibold',
              }}>
              {data.item.full_name}
            </Text>

            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'ProximaNova-Semibold',
              }}>
              {data.item.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // RENDER ADD TO FLATLIST DATA
  function renderUsersToSendSongItem(data) {
    return (
      <TouchableOpacity
        style={{
          height: normalize(30),
          paddingHorizontal: normalise(18),
          marginStart: normalise(20),
          marginTop: normalise(5),
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          marginEnd:
            data.index === usersToSEndSong.length - 1 ? normalise(20) : 0,
        }}>
        <Text style={{ color: Colors.black, fontWeight: 'bold' }}>
          {data.item.username}
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            top: -4,
            height: 25,
            width: 25,
            borderRadius: 12,
          }}
          onPress={() => {
            let popArray = [...usersToSEndSong];
            popArray.splice(data.index, 1);
            setUsersToSEndSong(popArray);
          }}>
          <Image
            source={ImagePath.crossIcon}
            style={{
              marginTop: normalise(-1.5),
              marginStart: normalise(8.5),
              height: 25,
              width: 25,
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // BOTTOM SHEET FOR SELECTING USERS
  const renderAddToUsers = () => {
    return (
      <RBSheet
        ref={ref => {
          if (ref) {
            bottomSheetRef = ref;
          }
        }}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={() => {
          //sesUsersToSEndSong([])
        }}
        nestedScrollEnabled={true}
        keyboardAvoidingViewEnabled={true}
        height={normalize(500)}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: Colors.black,
            borderTopEndRadius: normalise(8),
            borderTopStartRadius: normalise(8),
          },
          // wrapper: {
          //     backgroundColor: 'rgba(87,97,145,0.5)'

          // },
          draggableIcon: {
            backgroundColor: Colors.grey,
            width: normalise(70),
            height: normalise(3),
          },
        }}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View
              style={{
                flexDirection: 'row',
                width: '75%',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalise(14),
                  fontWeight: 'bold',
                  marginTop: normalise(10),
                  textAlign: 'right',
                }}>
                SELECT USER TO SEND TO
              </Text>

              {userClicked ? (
                <Text
                  style={{
                    color: Colors.white,
                    marginTop: normalise(10),
                    fontSize: normalise(14),
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  (1)
                </Text>
              ) : null}
            </View>

            {usersToSEndSong.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.close(), sendMessagesToUsers();
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(12),
                    fontWeight: 'bold',
                    marginTop: normalise(10),
                    marginEnd: normalise(15),
                  }}>
                  {`NEXT`}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View
            style={{
              //  width: '90%',
              // flex:0.8,
              // alignSelf: 'center',
               height: normalise(35),
              marginTop: normalise(20),
              borderRadius: normalise(8),
              backgroundColor: Colors.fadeblack,
              flexDirection:'row',
              borderWidth:1,
            alignItems:'center',
            marginHorizontal:'5%'
            }}>
              <View style={{
                flex:1,
                // backgroundColor:"red",
                height:normalise(35),
                flexDirection:'row',
                alignItems:'center',
                paddingLeft:"2%"

              }}>
                 <Image
              source={ImagePath.searchicongrey}
              style={{
                height: normalise(15),
                width: normalise(15),
                // bottom: normalise(25),
                // paddingLeft: normalise(30),
              }}
              resizeMode="contain"
            />
            <TextInput
              autoCorrect={false}
              keyboardAppearance={'dark'}
              style={{
                // height: normalise(35),
                 width: '90%',
                padding: normalise(10),
                color: Colors.white,
                // paddingLeft: normalise(30),
              }}
              value={userSeach}
              placeholder={'Search'}
              placeholderTextColor={Colors.grey_text}
              onChangeText={text => {
                setUserSeach(text), searchUser(text);
              }}
            />
</View>
         

            {userSeach === '' ? null : (
              <TouchableOpacity
                onPress={() => {
                  setUserSeach(''), setUserSearchData([]);
                }}
                style={{
                  // backgroundColor: Colors.black,
                  // padding: 6,
                  // paddingTop: 4,
                  // paddingBottom: 4,
                  borderRadius: 2,
                  // position: 'absolute',
                  // borderWidth:1,
                  right: 0,
                  // bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
                  marginRight: normalise(10),
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalise(10),
                    fontWeight: 'bold',
                  }}>
                  CLEAR
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {usersToSEndSong.length > 0 ? ( // ADD TO ARRAY FLATLIST
            <FlatList
              style={{
                marginTop: normalise(10),
                maxHeight: normalise(50),
              }}
              horizontal={true}
              data={usersToSEndSong}
              renderItem={renderUsersToSendSongItem}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              showsHorizontalScrollIndicator={false}
            />
          ) : null}

          <FlatList // USER SEARCH FLATLIST
            style={{
              height: '65%',
              marginTop: usersToSEndSong.length > 0 ? 0 : normalise(5),
            }}
            data={userSearchData}
            renderItem={renderAddUsersToMessageItem}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </RBSheet>
    );
  };

  return (

    isLoading?(
      <View style={{ flex: 1, backgroundColor: Colors.black,paddingTop:'6.7%' }}>
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
        
   <Loader visible={isLoading}></Loader>
   </SafeAreaView>
   </View>
      )
    :

    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <StatusBar backgroundColor={Colors.darkerblack} />

      
{/* <Loader visible={bool} />  */}
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
        {
          console.log('asss'+JSON.stringify(updateData.length))
        }
   
   {
     updateData.length===0?
     <View
     style={{
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
     }}>
     <Text style={{ fontSize: normalise(12), color: Colors.white }}>
       NO POSTS
     </Text>
    
   </View>
   :

            <FlatList
              style={{ marginTop: normalise(10) }}
              data={updateData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              renderItem={renderGenreData}
            />
            }
        {MorePressed()}
        {renderAddToUsers()}

        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            //Alert.alert("Modal has been closed.");
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000',
              opacity: 0.9,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize:
                  Platform.OS === 'android' ? normalise(70) : normalise(100),
              }}>
              {modalReact}
            </Text>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
      justifyContent: 'flex-end',
    //  alignItems: 'center',
    // marginTop: normalise(40),
  
 
   

  },
  modalView: {
    //  margin: 20,
    

    backgroundColor: '#000000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
     paddingVertical: 35,
     paddingHorizontal:30
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    // borderWidth:1,
    // borderColor:'white',
  //  position:'absolute',
  //  bottom:0

 
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
  // console.log("state to props",JSON.stringify(state.UserReducer.userProfileResp))
  return {
    status: state.PostReducer.status,
    getPostFromTop50: state.PostReducer.getPostFromTop50,
    userStatus: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
    messageStatus: state.MessageReducer.status,
    header: state.TokenReducer,
    registerType: state.TokenReducer.registerType,
   
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
    followUnfollowReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },
    saveSongReq: payload => {
      dispatch(saveSongRequest(payload));
    },

    getusersFromHome: payload => {
      dispatch(getUsersFromHome(payload));
    },
    deletePostReq: payload => {
      dispatch(deletePostReq(payload));
    },

    createChatTokenRequest: payload => {
      dispatch(createChatTokenRequest(payload));
    },
  };
};

// export default GenreSongClicked

SingleSongClick.defaultProps= {
ptID:0,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleSongClick);


