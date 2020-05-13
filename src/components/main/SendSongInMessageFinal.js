import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import SavedSongsListItem from './ListCells/SavedSongsListItem';
import _ from 'lodash';
import StatusBar from '../../utils/MyStatusBar';



export default function SendSongInMessageFinal(props) {

    const [search, setSearch] = useState("");
    const [imgsource, setImgSource] = useState(props.route.params.image)
    const [title1, setTitle1] = useState(props.route.params.title)
    const [title2, setTitle2] = useState(props.route.params.title2)





    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={"CANCEL"}
                    title={"SEND SONG"}
                    thirditemtext={true}
                    texttwo={"SEND"}
                    onPressFirstItem={() => { props.navigation.goBack() }}
                    onPressThirdItem={() => props.navigation.replace('InsideaMessage')}
                />

                <View style={{ marginTop: normalise(20), width: '92%', alignSelf: 'center', }}>

                    <TextInput style={{
                        width: '100%',
                        borderRadius: normalise(8), 
                        padding: normalise(10),
                        fontFamily:'ProximaNovaAW07-Medium',
                        color: Colors.white, 
                    }} value={search}
                        multiline={true}
                        placeholder={"Add a comment"}
                        placeholderTextColor={Colors.grey}
                        onChangeText={(text) => { setSearch(text) }} />

                    <View style={{
                        marginTop: normalise(5), backgroundColor: Colors.darkerblack,
                        height: normalise(65), width: '100%', borderRadius: normalise(8), borderColor: Colors.fadeblack,
                        borderWidth: normalise(1), justifyContent: 'center', alignItems: 'center'
                    }}>

                        <View style={{
                            width: '90%', flexDirection: 'row', alignSelf: 'center',
                            justifyContent: 'flex-start', alignItems: 'center',
                        }}>

                            <TouchableOpacity>
                                <Image source={imgsource}
                                    style={{ height: normalise(40), width: normalise(40), borderRadius: normalise(5) }}
                                    resizeMode='contain' />
                            </TouchableOpacity>

                            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text style={{
                                    marginLeft: normalise(20), color: Colors.white,
                                    fontSize: normalise(11)
                                }} numberOfLines={1} >{title1}</Text>

                                <Text style={{
                                    marginLeft: normalise(20), color: Colors.grey,
                                    fontSize: normalise(10)
                                }} numberOfLines={1} >{title2}</Text>
                            </View>


                        </View>
                    </View>

                </View>
                
                <Text
                style={{
                    color:Colors.grey,
                    margin:normalise(15)
                }}
                >Sending song to:</Text>
                <TouchableOpacity style={{
                    marginTop: normalise(10),
                    width: "87%",
                    alignSelf: 'center'
                }}
                    onPress={() => {

                    }}
                >
                    <View style={{ flexDirection: 'row', }}>
                        <Image
                            source={ImagePath.dp}
                            style={{ height: 35, width: 35, borderRadius: normalise(13.5) }}
                        />
                        <View style={{ marginStart: normalise(10) }}>
                            <Text style={{ color: Colors.white }}>Isabelle Frarnandes</Text>
                            <Text style={{ color: Colors.white }}>@IzzyWhite</Text>
                        </View>

                    </View>
                    <View style={{
                        backgroundColor: Colors.grey,
                        height: 0.5,
                        marginTop: normalise(10)
                    }} />
                </TouchableOpacity>



            </SafeAreaView>
        </View>
    )
}