
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
    TextInput
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import ActivityListItem from '../../components/main/ListCells/ActivityListItem';
import StatusBar from '../../utils/MyStatusBar';

const followdata = [
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        picture2: ImagePath.dp2,
        type: 'Following'
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        picture2: ImagePath.dp2,
        type: 'Following'
    },
    {
        picture: ImagePath.dp,
        title: "Annie88jones ",
        type: 'Follow'
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ ",
        type: 'Following'
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        picture2: ImagePath.dp2,
        type: 'Follow'
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        type: 'Follow'
    },
    {
        picture: ImagePath.dp,
        title: "Annie88j",
        type: 'Follow'
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ",
        type: 'Following'
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        type: 'Follow'
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        type: 'Follow'
    },
]

export default function Followers(props) {

    const [followers, setFollowers] = useState(props.route.params.followers)

    function renderFollowersItem(data) {
        return (
            <ActivityListItem image={data.item.picture}
                title={data.item.title} type={true}
                follow={data.item.type === "Follow" ? true : false}
                marginBottom={data.index === followdata.length - 1 ? normalise(20) : 0}
                onPressImage={()=>{props.navigation.navigate("OthersProfile")}} />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1, }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} title={`Followers (${followers})`}
                    thirditemtext={true} texttwo={""}
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
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => { index.toString() }}
                    renderItem={renderFollowersItem} />




            </SafeAreaView>
        </View>
    )
}