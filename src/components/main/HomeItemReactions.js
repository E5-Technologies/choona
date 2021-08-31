import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Modal,
  Text,
  TextInput,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';

import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ActivityListItem from './ListCells/ActivityListItem';
import ImagePath from '../../assests/ImagePath';
import _ from 'lodash';
import constants from '../../utils/helpers/constants';
import { connect } from 'react-redux';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import {
  reactionOnPostRequest,
  userFollowUnfollowRequest,
} from '../../action/UserAction';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import Seperator from './ListCells/Seperator';
import Loader from '../../widgets/AuthLoader';

import { fetchReactionsOnPost } from '../../helpers/post';
import HeaderComponentComments from '../../widgets/HeaderComponentComments';

const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];
let reaction_count = 0;
let recList = [];
function HomeItemReaction(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modal1Visible] = useState(false);
  const [modalReact, setModalReact] = useState('');
  const [search, setSearch] = useState('');
  const [postId] = useState(props.route.params.post_id);
  const [reactionsRes, setReactionsRes] = useState([]);
  const [reactionList, setReactionList] = useState([]);
  const [reactionsLoading, setReactionsLoading] = useState(true);

  useEffect(() => {
    fetchReactionsOnPost(props.route.params.post_id, props.header.token)
      .then(res => {
        setReactionsLoading(false);
        console.log('data' + JSON.stringify(res));
        if (res) {
          setReactionList(editArray(res));
          reaction_count = res.length;
          recList = editArray(res);
          setReactionsRes(res);
          // alert(JSON.stringify(res))
        }
      })
      .catch(err => {
        toast('Error', err);
      });

    BackHandler.addEventListener('hardwareBackPress', _onBackHandlerPress);
  }, [props.header.token, props.route.params.post_id]);

  let userId = props.userProfileResp._id;

  function editArray(array) {
    var editedList = [];

    array.map(item => {
      let reactionObject = {};

      reactionObject.header = item.text;
      reactionObject.data = _.filter(array, { text: item.text });

      editedList.push(reactionObject);

      editedList = Array.from(new Set(editedList.map(JSON.stringify))).map(
        JSON.parse,
      );
    });

    return editedList;
  }

  function getFilteredData(keyword) {
    let filterdData = _.filter(reactionsRes, function (item) {
      return item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    });
    setReactionList(editArray(filterdData));
  }

  function addOrChangeReaction(reaction) {
    let reactions = reactionsRes;

    console.log('REACTIONS: ' + reaction);

    let index = _.findIndex(reactions, function (item) {
      return item.user_id === userId && item.text === reaction;
    });

    if (index !== -1) {
      reactions.splice(index, 1);
      setReactionList(editArray(reactions));
      recList = editArray(reactions);
      reaction_count = reaction_count - 1;
    } else {
      reactions.push({
        user_id: userId,
        text: reaction,
        profile_image: props.userProfileResp.profile_image,
        username: props.userProfileResp.username,
      });
      recList = editArray(reactions);
      reaction_count = reaction_count + 1;
      setReactionList(editArray(reactions));
      // console.log("editarr"+ JSON.stringify(editArray(reactions)))
    }
  }

  const reactionOnPost = (reaction, id) => {
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
  };

  function hitreact(x) {
    if (!_.isEmpty(reactionList)) {
      const present = reactionList.some(
        obj =>
          obj.header.includes(x) &&
          obj.data.some(obj1 => obj1.user_id === userId),
      );
      console.log(present);
      if (present) {
        // console.log('nooo');
        addOrChangeReaction(x);
        reactionOnPost(x, postId);
      } else {
        addOrChangeReaction(x);
        reactionOnPost(x, postId);
        setModalVisible(true);
        setModalReact(x);
        setTimeout(() => {
          setModalVisible(false);
        }, 2000);
      }
    } else {
      addOrChangeReaction(x);
      reactionOnPost(x, postId);
      setModalVisible(true);
      setModalReact(x);
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
  }

  // function hitreact1() {
  //   if (modal1Visible === true) {
  //     setModal1Visible(false);
  //   } else {
  //     setModal1Visible(true);
  //   }

  //   //  setModalReact(x)
  // }

  const _onBackPress = () => {
    let ID = props.route.params.post_id;
    let Comment = reaction_count;
    let ReactionList = reactionList;
    // console.log('hhh', JSON.stringify(ReactionList));
    const { navigation, route } = props;
    route.params.onSelectReaction(ID, Comment, ReactionList);
    navigation.goBack();
  };

  const _onBackHandlerPress = () => {
    let ID = props.route.params.post_id;
    let Comment = reaction_count;
    let ReactionList = recList;
    const { navigation, route } = props;
    console.log(ID + ':' + Comment);
    route.params.onSelectReaction(ID, Comment, ReactionList);
    navigation.goBack();
    return true;
  };

  function renderItem(data, test) {
    // if (props.userProfileResp._id === data.item.user_id) {
    //   return (
    //     <ActivityListItem
    //       image={constants.profile_picture_base_url + data.item.profile_image}
    //       user={data.item.username}

    //       type={false}
    //       image2={'123'}
    //       onPressImage={() => {
    //         props.navigation.navigate('Profile', { fromAct: false });
    //       }}
    //       TouchableOpacityDisabled={false}
    //     />
    //   );
    // } else {
    return (
      <ActivityListItem
        image={constants.profile_picture_base_url + data.item.profile_image}
        user={data.item.username}
        userId={data.item.user_id}
        follow={!data.item.isFollowing}
        loginUserId={props.userProfileResp._id}
        onPress={() => {
          props.followReq({ follower_id: data.item.user_id });
        }}
        onPressImage={() => {
          props.navigation.navigate('OthersProfile', {
            id: data.item.user_id,
          });
        }}
        TouchableOpacityDisabled={false}
      />
    );
    // }
  }

  function renderItemWithHeader(data) {
    // console.log(data);
    return (
      <View
        style={{
          marginBottom:
            data.index === reactionList.length - 1
              ? normalise(120)
              : normalise(0),
        }}>
        <View
          style={{
            // marginTop: normalise(10),
            width: '100%',
            height: normalise(42),
            justifyContent: 'center',
            backgroundColor: Colors.darkerblack,
          }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: normalise(30),
              marginLeft: normalise(5),
              fontWeight: 'bold',
            }}>
            {' '}
            {data.item.header}
          </Text>
        </View>
        {
          //  alert('login'+JSON.stringify(props.userProfileResp._id))
        }
        <FlatList
          data={data.item.data}
          test={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            index.toString();
          }}
          listKey={(item, index) => {
            item.toString();
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={Seperator}
        />
      </View>
    );
  }

  console.log(props);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
      <Loader visible={reactionsLoading} />
      <StatusBar />
      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}> */}
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
        <HeaderComponentComments
          firstitemtext={false}
          imageone={ImagePath.backicon}
          headerTop={true}
          //imagesecond={ImagePath.dp}
          // marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
          title={
            props.route.params.reactionCount > 0
              ? props.route.params.reactionCount === 1
                ? '1 REACTION'
                : `${props.route.params.reactionCount} REACTIONS`
              : 'REACTIONS'
          }
          thirditemtext={false}
          onPressFirstItem={() => {
            // props.navigation.goBack();
            _onBackPress();
          }}
        />
        <View style={{ flex: 1, backgroundColor: Colors.black }}>
          <View style={{ width: '92%', alignSelf: 'center' }}>
            <TextInput
              autoCorrect={false}
              keyboardAppearance={'dark'}
              style={{
                height: normalise(35),
                width: '100%',
                backgroundColor: Colors.fadeblack,
                borderRadius: normalise(8),
                marginTop: normalise(20),
                padding: normalise(10),
                color: Colors.white,
                paddingLeft: normalise(30),
              }}
              placeholder={'Search'}
              placeholderTextColor={Colors.grey_text}
              value={search}
              onChangeText={text => {
                setSearch(text);
                getFilteredData(text);
              }}
            />

            <Image
              source={ImagePath ? ImagePath.searchicongrey : null}
              style={{
                height: normalise(15),
                width: normalise(15),
                bottom: normalise(25),
                paddingLeft: normalise(30),
              }}
              resizeMode="contain"
            />

            {search === '' ? null : (
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                  getFilteredData('');
                }}
                style={{
                  backgroundColor: Colors.black,
                  padding: 6,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderRadius: 2,
                  position: 'absolute',
                  right: 0,
                  bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
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

          {reactionList.length > 0 ? (
            <FlatList
              data={reactionList}
              renderItem={renderItemWithHeader}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : !reactionsLoading ? (
            <View
              style={{
                marginTop: normalise(100),
                marginHorizontal: normalise(50),
                alignItems: 'center',
              }}>
              <Image
                source={ImagePath ? ImagePath.blankreactionbg : null}
                style={{ height: normalise(225), width: normalise(225) }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: normalise(12), color: Colors.white }}>
                No results found, please try again later.
              </Text>
              {/* <Text style={{ fontSize: normalise(12), color: Colors.white }}>another name</Text> */}
            </View>
          ) : (
            <View />
          )}

          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              bottom: normalise(30),
              height: normalise(60),
              width: '92%',
              justifyContent: 'space-between',
              borderRadius: normalise(35),
              backgroundColor: Colors.white,
              borderWidth: normalise(0.5),
              // shadowColor: Colors.red,
              // shadowOffset: {width: 0, height: 5},
              // shadowOpacity: 0.36,
              // shadowRadius: 6.68,
              // elevation: 11,
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: Colors.white,
              paddingHorizontal: normalise(10),
            }}>
            <TouchableOpacity
              onPress={() => {
                hitreact(react[0]);
              }}>
              <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>
                {react[0]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hitreact(react[1]);
              }}>
              <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>
                {react[1]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hitreact(react[2]);
              }}>
              <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>
                {react[2]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hitreact(react[3]);
              }}>
              <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>
                {react[3]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hitreact(react[4]);
              }}>
              <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>
                {react[4]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hitreact(react[5]);
              }}>
              <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>
                {react[5]}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              //Alert.alert("Modal has been closed.");
            }}>
            <View style={styles.centeredView}>
              <Text
                style={{
                  fontSize:
                    Platform.OS === 'android' ? normalise(70) : normalise(100),
                }}>
                {modalReact}
              </Text>
            </View>
          </Modal>
          {modal1Visible === true ? (
            <View
              style={{
                position: 'absolute',
                margin: 20,
                height: normalise(280),
                width: '92%',
                alignSelf: 'center',
                marginHorizontal: normalise(15),
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 35,
                bottom: 110,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <EmojiSelector
                category={Categories.history}
                showHistory={true}
                onEmojiSelected={emoji => {
                  setModalVisible(true);
                  setModalReact(emoji);
                  setTimeout(() => {
                    setModalVisible(false);
                  }, 2000);
                }}
              />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: '#000000',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    height: normalise(200),
    width: normalise(280),
    backgroundColor: Colors.fadeblack,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 35,
    // alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  return {
    status: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    header: state.TokenReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reactionOnPostRequest: payload => {
      dispatch(reactionOnPostRequest(payload));
    },

    followReq: payload => {
      dispatch(userFollowUnfollowRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeItemReaction);
