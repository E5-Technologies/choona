import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ActivityListItem from '../ListCells/ActivityListItem';
import ImagePath from '../../../assests/ImagePath';
import StatusBar from '../../../utils/MyStatusBar';


const today = [
    {
        picture: ImagePath.dp,
        title: "Annie88jones started following you",
        type: 'Following'
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ started following you",
        type: 'Follow'
    },


];

const previous = [

    {
        picture: ImagePath.dp,
        title: "DanVermon98 mentioned you on a track: check out this track @Annie88jones absolutely awesome",
        picture2: ImagePath.dp2,
        type: 'Mention'
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883 commented you on your track: Ah fucking tune man! OLDSCHOOL",
        picture2: ImagePath.dp2,
        type: 'Comment'
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98 started following you",
        picture2: ImagePath.dp2,
        type: 'Following'
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ started following you",
        picture2: ImagePath.dp2,
        type: 'Follow'
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98 mentioned you on a track: check out this track @Annie88jones absolutely awesome",
        picture2: ImagePath.dp2,
        type: 'Mention'
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883 commented you on your track: Ah fucking tune man! OLDSCHOOL",
        picture2: ImagePath.dp2,
        type: 'Comment'
    },
]

export default function Notification(props) {


    function renderTodayitem(data) {
        return (
            <ActivityListItem image={data.item.picture} title={data.item.title}
                follow={data.item.type === "Follow" ? true : false}
                bottom={data.index === today.length - 1 ? true : false}
                marginBottom={data.index === today.length - 1 ? normalise(10) : normalise(0)}
                onPressImage={() => { props.navigation.navigate("OthersProfile") }}
            />
        )
    }

    function renderPreviousItem(data) {
        return (
            <ActivityListItem image={data.item.picture} title={data.item.title}
                bottom={data.index === previous.length - 1 ? true : false}
                follow={data.item.type === "Follow" ? true : false}
                marginBottom={data.index === previous.length - 1 ? normalise(20) : normalise(0)}
                type={data.item.type === 'Comment' || data.item.type === 'Mention' ? false : true}
                image2={data.item.picture2}
                onPressImage={() => { props.navigation.navigate("OthersProfile") }}
            />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView showsVerticalScrollIndicator={false}>


                    <Text style={{
                        fontSize: normalise(15),
                        fontFamily:('ProximaNova-Black'),
                        color: Colors.white,
                        marginTop: normalise(10),
                        alignSelf: 'center'
                    }}> ACTIVITY</Text>

                    <View style={{
                        marginTop: normalise(10), flexDirection: 'row',
                        width: '100%', height: normalise(40), alignItems: 'center', backgroundColor: Colors.fadeblack
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(12), marginLeft: normalise(20),
                            fontFamily:'ProximaNova-Regular',fontWeight:'bold',
                        }}>TODAY</Text>
                    </View>

                    <FlatList
                        data={today}
                        renderItem={renderTodayitem}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                    />




                    <View style={{
                        marginTop: normalise(10), flexDirection: 'row',
                        width: '100%', height: normalise(40), alignItems: 'center', backgroundColor: Colors.fadeblack
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(12), marginLeft: normalise(20),
                            fontFamily:'ProximaNova-Regular',fontWeight:'bold',
                        }}>PREVIOUSLY</Text>
                    </View>

                    <FlatList
                        data={previous}
                        renderItem={renderPreviousItem}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                    />




                </ScrollView>
            </SafeAreaView>
        </View>
    )
}