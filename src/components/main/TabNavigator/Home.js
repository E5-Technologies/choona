import React, {useState, useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,TextInput,
    StatusBar,ImageBackground,
    TouchableOpacity,TouchableHighlight,
    Image,
    Modal
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';

import _ from 'lodash'
import HomeItemList from '../ListCells/HomeItemList';
import { SwipeListView } from 'react-native-swipe-list-view';
import { normalizeUnits } from 'moment';
 const flatlistdata1 = []



const flatlistdata = [
    {
        image: ImagePath.profiletrack1,
        picture: ImagePath.dp1,
        title: 'This girl',
        singer: "Kungs Vs Cookins 3 burners",
        comments:1,
        name:'Shimshimmer',
        reactions:11,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
    {
        image: ImagePath.profiletrack4,
        picture: ImagePath.dp,
        title: 'Paradise',
        singer: "Cold Play",
        comments:2,
        name:'Shimshimmer',
        reactions:7,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
    {
        image: ImagePath.profiletrack2,
        picture: ImagePath.dp1,
        title: 'Naked feat. Justin Suissa',
        singer: "Kygo",
        comments:1,
        name:'Shimshimmer',
        reactions:10,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
 
    {
        image:ImagePath.profiletrack1,
        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        singer: "Dua Lipa",
        comments:1,
        name:'Shimshimmer',
        reactions:11,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
    {
        image:  ImagePath.profiletrack3,
        picture: ImagePath.dp1,
        title: 'Naked feat. Justin Suissa',
        singer: "Kygo",
        comments:3,
        name:'Shimshimmer',
        reactions:9,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
    {
        image: ImagePath.profiletrack4,
        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        singer: "Above & Beyond",
        comments:2,
        name:'Shimshimmer',
        reactions:11,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
  
]
export default function Home(props) {
    const [modalVisible, setModalVisible] = useState(false);
let  val=0

    function modal(){

return(
    val= 1
)
    }
    
    function renderItem(data) {
        return(
            // <TouchableOpacity  onPress={() => {
            //     setModalVisible(true);
            //   }}>
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
            onPressReactionbox={() => {
              props.navigation.navigate('HomeItemReactions',{comments:data.item.comments,
                time:data.item.time,title:data.item.title})}}
            onPressCommentbox={() => {
              props.navigation.navigate('HomeItemComments',{comments:data.item.comments,
                time:data.item.time,title:data.item.title})}}
            onPressSecondImage={() => {
              setModalVisible(true)}}
            marginBottom={data.index === flatlistdata.length -1 ? normalise(20) : 0} />
            // </TouchableOpacity>
        )
    }
   
    return (
     
        <View style={{ flex: 1, 
        backgroundColor: Colors.black }}>

 
            <StatusBar barStyle={'light-content'} />

            <SafeAreaView style={{ flex: 1 ,position:'relative'}}>
            
    { modalVisible ? 
                    <Image source={ImagePath.homelightbg} style={{opacity:0.1,position:'relative'}}/>
                    :null
                }  
   
                <HeaderComponent
                    firstitemtext={false}
                    imageone={ImagePath.dp}
                    imageoneheight={25}
                    imageonewidth={25}
                    title={"CHOONA"}
                    thirditemtext={false}
                    imagetwo={ImagePath.inbox}
                    imagetwoheight={25}
                    imagetwowidth={25}
                   
                    onPressFirstItem={() => { props.navigation.navigate("Profile") }}
                    onPressThirdItem={()=>{props.navigation.navigate("Inbox")}} />
 

                {_.isEmpty(flatlistdata) ? 
                
                <View style={{ flex: 1,position:'absolute'}}>
                    <View style={{ height: '60%', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Image source={ImagePath.noposts} style={{ height: normalise(150), width: normalise(150) }}
                            resizeMode='contain' />
                        <Text style={{
                            marginTop: normalise(10), color: Colors.white,
                            fontSize: normalise(14), fontWeight: 'bold'
                        }}>NO POSTS YET</Text>
                    </View>

                    <View style={{marginTop:normalise(10),height: '40%', alignItems: 'center', justifyContent:'flex-end' }}>

                        <TouchableOpacity style={{
                             height: normalise(50), width: '80%', alignSelf: 'center',
                            borderRadius: normalise(25), backgroundColor: Colors.facebookblue, borderWidth: normalise(0.5),
                         shadowColor: "#000", shadowOffset: { width: 0, height: 5, },
                             shadowOpacity: 0.36,shadowRadius: 6.68, elevation: 11, flexDirection: 'row', 
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
                            justifyContent: 'center',borderColor: Colors.grey,
                        }}  >

                            <Text style={{
                                marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
                                fontWeight: 'bold'
                            }}>CHECK YOUR PHONEBOOK</Text>

                        </TouchableOpacity>
                    </View>
                </View> : 
                

                <View style={{ flex: 1}}>
             

            
                
       
    
                    <SwipeListView
                    data={flatlistdata}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    // renderHiddenItem={ (rowData, rowMap) => (
                        
                    //     <TouchableOpacity style={{backgroundColor:Colors.red, flexDirection:'column', 
                    //     alignItems:'center', justifyContent:"space-evenly", height:normalise(39), width:normalise(44),
                    //      marginTop:normalise(15), position:'absolute', right:21}}
                    //      onPress={ () => { rowMap[rowData.item.key].closeRow() }}>
                            
                    //         <Image source={ImagePath.unsaved} style={{height:normalise(18), width:normalise(18),}} 
                    //         resizeMode='contain' />
                    //         <Text style={{fontSize:normalise(8), color:Colors.white,
                    //         fontWeight:'bold'}}>UNSAVE</Text>
    
                    //     </TouchableOpacity>
                    // )}
    
                    keyExtractor={(item , index)=>{index.toString()}}
                   disableRightSwipe={true}
                rightOpenValue={-75} />
    



    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{color:Colors.white,fontSize:normalise(15),fontWeight:'bold'}}>More</Text>
            <View style={{backgroundColor: Colors.grey, height: 1, }} />
  <View style={{flexDirection:'row',marginTop:normalise(10)}}>
  <Image source={ImagePath.boxicon} style={{height:normalise(18), width:normalise(18),}} 
                            resizeMode='contain' />
                            <Text style={{color:Colors.white,marginLeft:normalise(15),
                                fontSize:normalise(16),fontWeight:'bold'}}>Save Song</Text>
  </View>
  <View style={{flexDirection:'row',marginTop:normalise(10)}}>
  <Image source={ImagePath.sendicon} style={{height:normalise(18), width:normalise(18),}} 
                            resizeMode='contain' />
                            <Text style={{color:Colors.white,fontSize:normalise(16),marginLeft:normalise(15),
                                fontWeight:'bold'}}>Send Song</Text>
  </View>
  <View style={{flexDirection:'row',marginTop:normalise(10)}}>
  <Image source={ImagePath.sendicon} style={{height:normalise(18), width:normalise(18),}} 
                            resizeMode='contain' />
                            <Text style={{color:Colors.white,marginLeft:normalise(15),
                                fontSize:normalise(16),fontWeight:'bold'}}>Copy Link</Text>
  </View>
  <View style={{flexDirection:'row',marginTop:normalise(10)}}>
  <Image source={ImagePath.sendicon} style={{height:normalise(18), width:normalise(18),}} 
                            resizeMode='contain' />
                            <Text style={{color:Colors.white,marginLeft:normalise(15),
                                fontSize:normalise(16),fontWeight:'bold'}}>Unfollow Shimshimmer</Text>
  </View>
            {/* <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight> */}
          </View>
        </View>





        <View style={{
      justifyContent: "center",
      alignItems: "center",
      }}>
          <TouchableOpacity  onPress={() => {
                setModalVisible(!modalVisible);
              }}
          
          style={{  margin: 20,
      height:normalise(50),
      width:normalise(280),
      backgroundColor: Colors.fadeblack,
      borderRadius: 20,
     // padding: 35,
      alignItems: "center",
      justifyContent:'center',
  
      shadowRadius: 3.84,
      elevation: 5,
      }}>
       
           
              <Text style={{fontSize:normalise(15),color:Colors.white}}>Cancel</Text>
           
          </TouchableOpacity>
        </View>
      </Modal>

      
      {/* <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </TouchableHighlight> */}
           
            </View>
                
               }


            </SafeAreaView>

          
        </View>
    
            

        
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      height:normalise(200),
      width:normalise(280),
      backgroundColor: Colors.fadeblack,
      borderRadius: 20,
      padding: 35,
     // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
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
    //   textAlign: "center"
    }
  });
