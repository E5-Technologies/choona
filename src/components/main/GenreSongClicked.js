import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import HomeItemList from './ListCells/HomeItemList';
import { connect } from 'react-redux';
import { searchPostReq, deletePostReq } from '../../action/PostAction';
import { saveSongRequest } from '../../action/SongAction';
import { getSpotifyToken } from '../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../utils/helpers/AppleDevToken';
import {
  reactionOnPostRequest,
  userFollowUnfollowRequest,
} from '../../action/UserAction';
import {
  GET_POST_FROM_TOP_50_REQUEST,
  GET_POST_FROM_TOP_50_SUCCESS,
  GET_POST_FROM_TOP_50_FAILURE,
  REACTION_ON_POST_REQUEST,
  REACTION_ON_POST_SUCCESS,
  REACTION_ON_POST_FAILURE,
  HOME_PAGE_SUCCESS,
} from '../../action/TypeConstants';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import _ from 'lodash';

import MoreModal from '../Posts/MoreModal';

import { API_HOST } from '../../config';

import axios from 'axios';
let status;
let userStatus;

function GenreSongClicked(props) {
  let commentList = [];
  commentList = props.getPostFromTop50;

  const [name, setName] = useState(props.route.params.data);

  const [positionInArray, setPositionInArray] = useState(0);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState('');
  const [bool, setBool] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateList, setUpdateList] = useState([]);
  // const [totalReact,setTotalReact] = useState([])

  let flag = false;
  let changePlayer = false;
  var bottomSheetRef;
  const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];

  const getdata = async () => {
    let response = await axios.get(API_HOST + `/api/post/details/${name}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.header.token,
      },
    });
    setName(response.data.data.song_name);
    setIsLoading(false);
    props.searchPost(response.data.data.song_name, flag);
  };

  useEffect(() => {
    props.searchPost(name, flag);
    props.route.params.ptID === 1 ? getdata() : setIsLoading(false);
  }, []);

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
    }
  }
  if (status === '' || status !== props.status) {
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

  // SEND REACTION
  function sendReaction(id, reaction) {
    const myReaction =
      reaction === react[0]
        ? 'A'
        : reaction === react[1]
          ? 'B'
          : reaction === react[2]
            ? 'C'
            : reaction === react[3]
              ? 'D'
              : reaction === react[4]
                ? 'E'
                : 'F';

    let reactionObject = {
      post_id: id,
      text: reaction,
      text_match: myReaction,
    };

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
    setVisible(true);
    setModalReact(x);
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }

  function _onSelectBack(ID, comment) {
    let newarray = commentList;
    newarray.map((item, index) => {
      if (item._id === ID) {
        newarray[index].comment_count = comment;
      }
      if (index === newarray.length - 1) {
        setUpdateList([...newarray]);
        // commentList = ([...newarray])
      }
    });
  }

  function _onReaction(ID, reaction, reactionList) {
    let newarray = commentList;
    // console.log("items"+JSON.stringify(reactionList[0].data[0].text_match))
    newarray.map((item, index) => {
      if (item._id === ID) {
        if (reactionList.length > 0) {
          var found = reactionList.findIndex(element => {
            return element.header === react[0];
          });
          var found_love = reactionList.findIndex(element => {
            return element.header === react[1];
          });
          var found_dance = reactionList.findIndex(element => {
            return element.header === react[2];
          });
          var found_ManDance = reactionList.findIndex(element => {
            return element.header === react[3];
          });
          var found_face = reactionList.findIndex(element => {
            return element.header === react[4];
          });
          var found_thumb = reactionList.findIndex(element => {
            return element.header === react[5];
          });

          //  alert("found"+found + found_love  + found_dance+ found_ManDance + found_face+ found_thumb)
          if (found !== -1) {
            newarray[index].fire_count = reactionList[found].data.length;
          } else {
            newarray[index].fire_count = 0;
          }
          if (found_love !== -1) {
            newarray[index].love_count = reactionList[found_love].data.length;
          } else {
            newarray[index].love_count = 0;
          }
          if (found_dance !== -1) {
            newarray[index].dancer_count =
              reactionList[found_dance].data.length;
          } else {
            newarray[index].dancer_count = 0;
          }
          if (found_ManDance !== -1) {
            newarray[index].man_dancing_count =
              reactionList[found_ManDance].data.length;
          } else {
            newarray[index].man_dancing_count = 0;
          }
          if (found_face !== -1) {
            newarray[index].face_count = reactionList[found_face].data.length;
          } else {
            newarray[index].face_count = 0;
          }
          if (found_thumb !== -1) {
            newarray[index].thumbsup_count =
              reactionList[found_thumb].data.length;
          } else {
            newarray[index].thumbsup_count = 0;
          }

          newarray[index].reaction_count = reaction;
        }
      }

      if (index === newarray.length - 1) {
        setUpdateList([...newarray]);
        commentList = [...newarray];
      }
    });
  }

  // GET ISRC CODE
  const callApi = async () => {
    if (props.registerType === 'spotify') {
      const spotifyToken = await getSpotifyToken();

      return await axios.get(
        `https://api.spotify.com/v1/search?q=isrc:${props.postData[positionInArray].isrc_code}&type=track`,
        {
          headers: {
            Authorization: spotifyToken,
          },
        },
      );
    } else {
      const AppleToken = await getAppleDevToken();

      return await axios.get(
        `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${props.postData[positionInArray].isrc_code}`,
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
              .then(() => {
                Linking.openURL(res.data.tracks.items[0].external_urls.spotify)
                  .then(() => {
                    // console.log('success');
                  })
                  .catch(() => {
                    // console.log('error');
                  });
              })
              .catch(() => {
                // console.log('not supported');
              });
            setBool(false);
          } else {
            // console.log('success - apple');
            // console.log(res.data.data[0].attributes.url);
            Linking.canOpenURL(res.data.data[0].attributes.url)
              .then(() => {
                Linking.openURL(res.data.data[0].attributes.url)
                  .then(() => {
                    // console.log('success');
                  })
                  .catch(() => {
                    // console.log('error');
                  });
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
    return (
      <HomeItemList
        image={data.item.song_image}
        picture={data.item.userDetails.profile_image}
        name={data.item.userDetails.username}
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
        navi={props}
        content={data.item.post_content}
        time={data.item.createdAt}
        title={data.item.song_name}
        singer={data.item.artist_name}
        songUri={data.item.song_uri}
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
            comments: [],
            song_title: data.item.song_name,
            album_name: data.item.album_name,
            song_pic: data.item.song_image,
            username: data.item.userDetails.username,
            profile_pic: data.item.userDetails.profile_image,
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
            registerType: data.item.userDetails.register_type,
            isrc: data.item.isrc_code,
            details: data.item,
          });
        }}
        onPressReactionbox={() => {
          props.navigation.navigate('HomeItemReactions', {
            reactions: data.item.reaction,
            post_id: data.item._id,
            onSelectReaction: (ID, reaction, reactionList) =>
              _onReaction(ID, reaction, reactionList),
          });
        }}
        onPressCommentbox={() => {
          props.navigation.navigate('HomeItemComments', {
            index: data.index,
            type: 'top50',
            comment: data.item.comment,
            image: data.item.song_image,
            username: data.item.userDetails.username,
            userComment: data.item.post_content,
            time: data.item.createdAt,
            id: data.item._id,
            onSelect: (ID, comment) => _onSelectBack(ID, comment),
          });
        }}
        onPressSecondImage={() => {
          setPositionInArray(data.index);
          setModalVisible(true);
        }}
        marginBottom={
          data.index === props.getPostFromTop50.length - 1 ? normalise(50) : 0
        }
      />
    );
  }

  return isLoading ? (
    <View
      style={{ flex: 1, backgroundColor: Colors.darkerblack, paddingTop: '6.7%' }}>
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

        <Loader visible={isLoading} />
      </SafeAreaView>
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
      <StatusBar backgroundColor={Colors.darkerblack} />

      <Loader visible={props.status === GET_POST_FROM_TOP_50_REQUEST} />
      <Loader visible={bool} />
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

        {props.status === GET_POST_FROM_TOP_50_SUCCESS ? (
          _.isEmpty(props.getPostFromTop50) ? (
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
          ) : (
            <FlatList
              data={commentList}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              renderItem={renderGenreData}
            />
          )
        ) : null}

        {modalVisible && (
          <MoreModal
            setBool={setBool}
            bottomSheetRef={bottomSheetRef}
            index={positionInArray}
            setIndex={setPositionInArray}
            navigation={props.navigation}
            openInAppleORSpotify={openInAppleORSpotify}
            postData={props.getPostFromTop50}
            show={modalVisible}
            setShow={setModalVisible}
          />
        )}

        <Modal
          animationType="fade"
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

const mapStateToProps = state => {
  return {
    status: state.PostReducer.status,
    getPostFromTop50: state.PostReducer.getPostFromTop50,
    userStatus: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    messageStatus: state.MessageReducer.status,
    header: state.TokenReducer,
    registerType: state.TokenReducer.registerType,
  };
};

const mapDispatchToProps = dispatch => {
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
    deletePostReq: payload => {
      dispatch(deletePostReq(payload));
    },
  };
};

// export default GenreSongClicked

GenreSongClicked.defaultProps = {
  ptID: 0,
};
export default connect(mapStateToProps, mapDispatchToProps)(GenreSongClicked);
