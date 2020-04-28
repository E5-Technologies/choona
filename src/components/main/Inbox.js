
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    TextInput
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import InboxListItem from '../../components/main/ListCells/InboxItemList';


const followdata = [
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        message: "Remember we use to play this in office ?",
        read: false
        
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        message: "Here's a blast from past?",
        read: false
        
    },
    {
        picture: ImagePath.dp,
        title: "Annie88jones ",
        message: "Here's a blast from past?",
        read: true
        
        
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ ",
        message: "Here's a blast from past?",
        read: true
        
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        message: "Here's a blast from past?",
        read: true
        
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        message: "Here's a blast from past?",
        read: true
        
    },
    {
        picture: ImagePath.dp,
        title: "Annie88j",
        message: "Here's a blast from past?",
        read: true
        
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ",
        message: "Here's a blast from past?",
        read: true
        
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        message: "Here's a blast from past?",
        read: true
        
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        message: "Here's a blast from past?",
        read: true
        
    },
]

export default function Inbox(props) {

    

    function renderInboxItem(data) {
        return (
            <InboxListItem image={data.item.picture}
                title={data.item.title} 
                description={data.item.message}
                read={data.item.read === true ? true : false}
                onPress={()=>props.navigation.navigate('InsideaMessage')}
                marginBottom={data.index === followdata.length - 1 ? normalise(20) : 0}
            />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar barStyle={'light-content'} />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} 
                    title={`Inbox`}
                    thirditemtext={false} 
                    imagetwo={ImagePath.newmessage} 
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

                <View style={{ width: '95%', alignSelf: 'center',}}>

                    <TextInput style={{
                        height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                        color: Colors.white, paddingLeft: normalise(30)
                    }}
                        placeholder={"Search"}
                        placeholderTextColor={Colors.white}
                        onChangeText={(text) => { console.log(text) }} />

                    <Image source={ImagePath.searchicon}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />
                </View>

                <FlatList
                data={followdata}
                renderItem={renderInboxItem}
                keyExtractor={(item , index)=>{index.toString()}}
                showsVerticalScrollIndicator={false} />




            </SafeAreaView>
        </View>
    )
}