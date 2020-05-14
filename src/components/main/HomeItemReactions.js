






import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image, Modal,
    Text, TextInput,
    StatusBar, Platform,
    TouchableOpacity,
    FlatList
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ActivityListItem from './ListCells/ActivityListItem';
import ImagePath from '../../assests/ImagePath';
import HomeHeaderComponent from '../../widgets/HomeHeaderComponent';
import nexHeader from '../../widgets/HomeHeaderComponent'

import EmojiSelector, { Categories } from "react-native-emoji-selector";


const react = ["🔥", "🕺", "💃", "😳", "❤️"]
const reaction1 = [
    {

        name: 'Joseph',
        picture: ImagePath.dp,
        title: "Annie88jones started following you",
        type: 'Following'

    },
    {
        name: 'Irfan Khan',
        picture: ImagePath.dp1,
        title: "RonnyJ started following you",
        type: 'Follow'
    },


];

const reaction2 = [

    {
        name: 'Raaidelsyed',
        picture: ImagePath.dp,
        title: "DanVermon98 mentioned you on a track: check out this track @Annie88jones absolutely awesome",
        picture2: ImagePath.dp2,
        type: 'Following'
    },

    {
        name: 'Mochun72',
        picture: ImagePath.dp1,
        title: "Bigbird883 commented you on your track: Ah fucking tune man! OLDSCHOOL",
        picture2: ImagePath.dp2,
        type: 'Follow'
    },
    {
        name: 'Wimwillems',
        picture: ImagePath.dp,
        title: "Annie88jones started following you",
        type: 'Following'
    },
    {
        name: 'John',
        picture: ImagePath.dp1,
        title: "RonnyJ started following you",
        type: 'Follow'
    },

]


const reaction3 = [
    {

        name: 'Joseph',
        picture: ImagePath.dp,
        title: "Annie88jones started following you",
        type: 'Following'

    },
    {
        name: 'Irfan Khan',
        picture: ImagePath.dp1,
        title: "RonnyJ started following you",
        type: 'Follow'
    },


];

const reaction4 = [
    {
        name: 'Wimwillems',
        picture: ImagePath.dp,
        title: "Annie88jones started following you",
        type: 'Following'
    },
    {
        name: 'John',
        picture: ImagePath.dp1,
        title: "RonnyJ started following you",
        type: 'Follow'
    },

];


const reaction5 = [
    {
        name: 'Raaidelsyed',
        picture: ImagePath.dp,
        title: "DanVermon98 mentioned you on a track: check out this track @Annie88jones absolutely awesome",
        picture2: ImagePath.dp2,
        type: 'Following'
    },

    {
        name: 'Mochun72',
        picture: ImagePath.dp1,
        title: "Bigbird883 commented you on your track: Ah fucking tune man! OLDSCHOOL",
        picture2: ImagePath.dp2,
        type: 'Follow'
    },

];
const reaction6 = []
const reaction7 = []


export default function HomeItemReaction(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modalReact, setModalReact] = useState("");


    function hitreact(x) {
        setModalVisible(true)
        setModalReact(x)
        this.setTimeout(() => {
            setModalVisible(false)
        }, 2000);
    }

    function hitreact1() {

        if (modal1Visible == true) {
            setModal1Visible(false)
        }
        else {
            setModal1Visible(true)
        }


        //  setModalReact(x)

    }

    function renderItem(data) {
        return (
            <ActivityListItem image={data.item.picture} title={data.item.name}
                follow={data.item.type === "Follow" ? true : false}
                //  bottom={data.index === reaction1.length - 1 ? true : false} 
                // marginBottom={data.index === reaction1.length - 1 ? normalise(10) : normalise(0)}
                onPressImage={() => { props.navigation.navigate("OthersProfile") }}
                marginBottom={0}
            />
        )
    }




    if (reaction1.length == 0 && reaction2.length == 0 && reaction3.length == 0 && reaction4.legth == 0)
    //if(reaction6.length==0  && reaction7.length==0 )
    {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.black }}>

                <StatusBar barStyle={'light-content'} />

                <SafeAreaView style={{ flex: 1 }}>


                    <HomeHeaderComponent
                        firstitemtext={false}
                        imageone={ImagePath.backicon}
                        //imagesecond={ImagePath.dp}
                        title="10 REACTIONS"
                        thirditemtext={false}
                        marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
                        // imagetwo={ImagePath.newmessage} 
                        imagetwoheight={25}
                        imagetwowidth={25}
                        inner={true}
                        onPressFirstItem={() => { props.navigation.goBack() }} />
                    <View style={{
                        minHeight: normalise(35), height: normalise(15), width: normalise(300),
                        backgroundColor: Colors.fadeblack,
                        flexDirection: 'row', marginLeft: normalise(10),
                        borderRadius: normalise(10), marginTop: normalise(20), paddingLeft: normalise(5),
                        color: Colors.white, paddingLeft: normalise(10)
                    }}>
                        <Image source={ImagePath.searchicon}
                            style={{
                                height: normalise(15), width: normalise(25), marginTop: normalise(10),
                                paddingLeft: normalise(10), justifyContent: 'center'
                            }} resizeMode="contain" />
                        <TextInput multiline style={{
                            width: normalise(210),
                            marginTop: normalise(7),
                            height: normalise(15),
                            minHeight: normalise(30),
                            fontSize: normalise(12),
                            color: Colors.white,
                        }}
                            placeholder={"Search"}
                            placeholderTextColor={Colors.white}
                            onChangeText={(text) => { console.log(text) }} />

                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: normalise(50) }}>
                            <Text style={{ fontSize: normalise(13), color: Colors.white, fontWeight: 'bold' }}>
                                CLEAR
        </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ marginTop: normalise(100), marginHorizontal: normalise(50), alignItems: 'center' }} >
                        <Image source={ImagePath.blankreactionbg}
                            style={{ height: normalise(225), width: normalise(225) }}
                            resizeMode='contain' />
                        <Text style={{ fontSize: normalise(12), color: Colors.white }}>
                            No results found,please try
 </Text>
                        <Text style={{ fontSize: normalise(12), color: Colors.white }}>another name</Text>
                    </View>




                    <View style={{
                        position: 'absolute', marginBottom: normalise(30), alignSelf: 'center', marginHorizontal: normalise(15),
                        marginTop: normalise(575), height: normalise(60), width: '85%', justifyContent: 'space-between',
                        borderRadius: normalise(35), backgroundColor: Colors.white, borderWidth: normalise(0.5),
                        shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                        shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                        borderColor: Colors.grey, paddingHorizontal: normalise(10)
                    }}>
                        <TouchableOpacity onPress={() => {
                            hitreact(react[0])
                        }}>
                            <Text style={{ fontSize: 42 }}>{react[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            hitreact(react[1])
                        }}>
                            <Text style={{ fontSize: 42 }}>{react[1]}</Text>
                        </TouchableOpacity >
                        <TouchableOpacity onPress={() => {
                            hitreact(react[2])
                        }}>
                            <Text style={{ fontSize: 42 }}>{react[2]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            hitreact(react[3])
                        }}>
                            <Text style={{ fontSize: 42 }}>{react[3]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            hitreact1()
                        }}>
                            <Image source={ImagePath.greyplus}
                                style={{
                                    height: normalise(35), width: normalise(35),

                                }} resizeMode="contain" />
                        </TouchableOpacity>


                    </View>

                </SafeAreaView>

            </View>

        )
    }

    else {
        return (

            <View style={{ flex: 1, backgroundColor: Colors.black }}>

                <StatusBar barStyle={'light-content'} />

                <SafeAreaView style={{ flex: 1 }}>


                    <HomeHeaderComponent firstitemtext={false}
                        imageone={ImagePath.backicon}
                        //imagesecond={ImagePath.dp}
                        marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
                        title="10 REACTIONS"
                        thirditemtext={false}
                        // imagetwo={ImagePath.newmessage} 
                        imagetwoheight={25}
                        imagetwowidth={25}
                        onPressFirstItem={() => { props.navigation.goBack() }} />







                    <ScrollView showsVerticalScrollIndicator={false}>





                        <View style={{ width: '92%', alignSelf: 'center', }}>

                            <TextInput style={{
                                height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                                borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                                color: Colors.white, paddingLeft: normalise(30)
                            }}
                                placeholder={"Search"}
                                placeholderTextColor={Colors.grey_text}
                                onChangeText={(text) => { console.log(text) }} />

                            <Image source={ImagePath.searchicongrey}
                                style={{
                                    height: normalise(15), width: normalise(15), bottom: normalise(25),
                                    paddingLeft: normalise(30)
                                }} resizeMode="contain" />
                        </View>



                        <View style={{
                            marginTop: normalise(10),
                            width: '100%',
                            height: normalise(42),
                            justifyContent: 'center',
                            backgroundColor: Colors.fadeblack
                        }}>

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(30), marginLeft: normalise(5),
                                fontWeight: 'bold'
                            }}> {react[0]}</Text>
                        </View>

                        <FlatList
                            data={reaction1}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />



                        <View style={{
                            marginTop: normalise(10), flexDirection: 'row',
                            width: '100%', height: normalise(42), alignItems: 'center', backgroundColor: Colors.fadeblack
                        }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(30), marginLeft: normalise(5),
                                fontWeight: 'bold'
                            }}> {react[1]} </Text>
                        </View>
                        <FlatList
                            data={reaction2}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />


                        <View style={{
                            marginTop: normalise(10), flexDirection: 'row',
                            width: '100%', height: normalise(42), alignItems: 'center', backgroundColor: Colors.fadeblack
                        }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(30), marginLeft: normalise(5),
                                fontWeight: 'bold'
                            }}>{react[2]}</Text>
                        </View>

                        <FlatList
                            data={reaction3}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />

                        <View style={{
                            marginTop: normalise(10), flexDirection: 'row',
                            width: '100%', height: normalise(42), alignItems: 'center', backgroundColor: Colors.fadeblack
                        }}>


                            <Text style={{
                                color: Colors.white, fontSize: normalise(30), marginLeft: normalise(5),
                                fontWeight: 'bold'
                            }}> {react[3]}</Text>
                        </View>
                        <FlatList
                            data={reaction4}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />

                        <View style={{
                            marginTop: normalise(10), flexDirection: 'row',
                            width: '100%', height: normalise(42), alignItems: 'center', backgroundColor: Colors.fadeblack
                        }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(30), marginLeft: normalise(5),
                                fontWeight: 'bold'
                            }}>  {react[4]}</Text>
                        </View>

                        <FlatList
                            data={reaction5}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />

                    </ScrollView>

                    <View style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: normalise(30),
                        height: normalise(60),
                        width: '92%',
                        justifyContent: 'space-between',
                        borderRadius: normalise(35),
                        backgroundColor: Colors.white,
                        borderWidth: normalise(0.5),
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 5, },
                        shadowOpacity: 0.36,
                        shadowRadius: 6.68, elevation: 11,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor: Colors.grey,
                        paddingHorizontal: normalise(10)
                    }}>
                        <TouchableOpacity onPress={() => {
                            hitreact(react[0])
                        }}>
                            <Text style={{ fontSize: 42 }}>{react[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            hitreact(react[1])
                        }}>
                            <Text style={{ fontSize: 42 }}>{react[1]}</Text>
                        </TouchableOpacity >
                        <TouchableOpacity onPress={() => {
                            hitreact(react[2])
                        }}>
                            <Text style={{ fontSize: 42 }}>{react[2]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            hitreact(react[3])
                        }}>
                            <Text style={{ fontSize: 43 }}>{react[3]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            hitreact1()
                        }}>
                            {modal1Visible == true ?
                                <Image source={ImagePath.greycross}
                                    style={{
                                        height: normalise(35), width: normalise(35),

                                    }} resizeMode="contain" />
                                :
                                <Image source={ImagePath.greyplus}
                                    style={{
                                        height: normalise(35), width: normalise(35),

                                    }} resizeMode="contain" />
                            }
                        </TouchableOpacity>


                    </View>





                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            //Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={styles.centeredView}>

                            <Text style={{ fontSize: Platform.OS === 'android' ? normalise(70) : normalise(100) }}>{modalReact}</Text>


                        </View>





                    </Modal>

                    {modal1Visible == true ?

                        <View style={{
                            position: 'absolute',
                            margin: 20,
                            height: normalise(280),
                            width: "92%",
                            alignSelf: 'center',
                            marginHorizontal: normalise(15),
                            backgroundColor: Colors.white,
                            borderRadius: 20,
                            padding: 35,
                            bottom: 110,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5
                        }}>


                            <EmojiSelector
                                category={Categories.history}
                                showHistory={true}
                                onEmojiSelected={emoji => {
                                    setModalVisible(true), setModalReact(emoji),
                                        setTimeout(() => {
                                            setModalVisible(false)
                                        }, 2000)
                                }}
                            />


                        </View>

                        : null}
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.8,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        height: normalise(200),
        width: normalise(280),
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
