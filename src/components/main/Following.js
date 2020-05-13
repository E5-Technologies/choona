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
        type: 'Following'
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
        type: 'Following'
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        type: 'Following'
    },
    {
        picture: ImagePath.dp,
        title: "Annie88j",
        type: 'Following'
    },
    {
        picture: ImagePath.dp1,
        title: "RonnyJ",
        type: 'Following'
    },
    {
        picture: ImagePath.dp,
        title: "DanVermon98",
        type: 'Following'
    },

    {
        picture: ImagePath.dp1,
        title: "Bigbird883",
        type: 'Following'
    },
]

export default function Following(props) {

    const [following, setFollowing] = useState(props.route.params.following)
    const [search, setSearch] = useState("")

    function renderFollowersItem(data) {
        return (
            <ActivityListItem image={data.item.picture}
                title={data.item.title} type={true}
                follow={data.item.type === "Follow" ? true : false}
                marginBottom={data.index === followdata.length - 1 ? normalise(20) : 0}
                onPressImage={() => { props.navigation.navigate("OthersProfile") }}
            />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={false}
                    imageone={ImagePath.backicon} title={`FOLLOWING (${following})`}
                    thirditemtext={true} texttwo={""}
                    onPressFirstItem={() => { props.navigation.goBack() }} />


                <View style={{
                    width: '92%',
                    alignSelf: 'center',
                }}>

                    <TextInput style={{
                        height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                        borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                        color: Colors.white, paddingLeft: normalise(30),
                    }} value={search}
                        placeholder={"Search"}
                        placeholderTextColor={Colors.darkgrey}
                        onChangeText={(text) => { setSearch(text) }} />

                    <Image source={ImagePath.searchicongrey}
                        style={{
                            height: normalise(15), width: normalise(15), bottom: normalise(25),
                            paddingLeft: normalise(30)
                        }} resizeMode="contain" />

                    {search === "" ? null :
                        <TouchableOpacity onPress={() => { setSearch("") }}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: Platform.OS === 'ios' ? normalise(26) : normalise(25),
                                paddingRight: normalise(10)
                            }}>
                            <Text style={{
                                color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                            }}>CLEAR</Text>

                        </TouchableOpacity>}

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