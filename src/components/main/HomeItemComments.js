
import React, { useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import CommentList from '../main/ListCells/CommentList';
import { SwipeListView } from 'react-native-swipe-list-view';
import { normalizeUnits } from 'moment';



const flatlistdata = [
    {
       
        picture: ImagePath.dp1,
        title: 'This girl',
        name: "andy88Jones",
        comments:1,
     
        reactions:11,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
    {
     
        picture: ImagePath.dp,
        title: 'Paradise',
        singer: "Cold Play",
        name: "andy88Jones",
 
        reactions:7,
        content:' Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        time:8
    },
    {
     
        picture: ImagePath.dp1,
        title: 'Naked feat. Justin Suissa',
        name: "andy88Jones",
        comments:1,

        reactions:10,
        content:'Absolutely use to love this song,was an unreal banger bck in the day',
        time:8
    },
 
    {
        
        picture: ImagePath.dp,
        title: 'Naked feat. Justin Suissa',
        name: "andy88Jones",
        comments:1,
    
        reactions:11,
        content:'   Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        time:8
    },
  
  
]

export default function HomeItemComments(props) {

        function renderItem(data) {
            return(
                <CommentList 
                image={data.item.picture}
                title={data.item.title}
                name={data.item.name}
                comment={data.item.content}
           time={data.item.time}
                marginBottom={data.index === flatlistdata.length -1 ? normalise(20) : 0} />
            )
        }

        function renderHiddenItem(data) {
            return(
                <TouchableOpacity style={{flexDirection:'column', alignItems:'center', 
                justifyContent:'center'}}>

                    <Image source={ImagePath.boxactive}
                    style={{height:normalise(20), width:normalise(20)}} />

                    <Text>Unsave</Text>
                </TouchableOpacity>
            )
        }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black, }}>
            <SafeAreaView style={{ flex: 1 }}>

             

       <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} 
                   //imagesecond={ImagePath.dp}
                   
                    title="4 COMMENTS"
                    thirditemtext={false} 
                   // imagetwo={ImagePath.newmessage} 
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

<View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom }}>

<View style={{
    flexDirection: 'row', 
 
}}>

    <TouchableOpacity onPress={() => { onPressImage() }}  style={{justifyContent:'center'}}>
        <Image source={ ImagePath.profiletrack1}
            style={{ height: normalise(60), width: normalise(60), }}
            resizeMode="contain" />

            <Image source={ImagePath.play} 
            style={{height:normalise(20), width:normalise(20), position:'absolute',
            alignSelf:'center'
           }} />
    </TouchableOpacity>
 <View style={{marginLeft:normalise(10),}}>
    <View  style={{flexDirection:'row'}}>

     <Text style={{width:normalise(150),color:Colors.white,fontSize:14}}>
          Shimshimmer
      </Text>
      <Text style={{width:normalise(70),color:Colors.white,fontSize:12}}>
         8 minutes ago
      </Text>
      </View>
      <View>
      <Text style={{width:normalise(220),color:Colors.white,fontSize:12,marginTop:normalise(8)}}>
      Absolutely use to love this song,was an unreal banger bck in the day
       
      </Text>
      </View>
 </View>

</View>

<View style={{
    marginTop: normalise(10), borderBottomWidth: normalise(1),
    borderBottomColor: Colors.grey
}} />

</View>


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



<View style={{  minHeight: normalise(40),height: 'auto', width: '95%',
                backgroundColor: Colors.fadeblack,
                borderColor:Colors.darkgrey,borderWidth:1,flexDirection:'row',marginLeft:normalise(10),
                borderRadius: normalise(25), marginTop: normalise(20), paddingLeft: normalise(15),
                color: Colors.white, paddingLeft: normalise(20)
             }}>

 <TextInput multiline style={{
  width: '80%',
  marginTop:normalise(7),
    height: 'auto',
    minHeight:normalise(30),
    fontSize:normalise(12), 
    color: Colors.white, 
}}
    placeholder={"Add a comment..."}
    placeholderTextColor={Colors.white}
    onChangeText={(text) => { console.log(text) }} /> 

    <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:normalise(13),color:Colors.white,fontWeight:'bold'}}>
            POST
        </Text>
    </TouchableOpacity>

</View>

            </SafeAreaView>


        </View>
    )
}
