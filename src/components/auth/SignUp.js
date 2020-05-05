import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import { tokenRequest } from '../../action/index';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import TextInputField from '../../widgets/TextInputField';
import Button from '../../widgets/ButtonComponent';
import ImagePicker from 'react-native-image-crop-picker';
import toast from '../../utils/helpers/ShowErrorAlert';
import StatusBar from '../../utils/MyStatusBar';

export default function Login(props) {

    const dispatch = useDispatch()

    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [location, setLocation] = useState("");
    const [picture, setPicture] = useState(false);
    const [profilePic, setProfilePic] = useState("")

  
    // IMAGE PICKER OPTIONS
    const showPickerOptions = () => {
        Alert.alert(
            "Choose Profile Image", "Select from where you want to choose the image",
            [
                { text: 'CAMERA', onPress: () => { pickImagewithCamera()} },
                { text: 'GALLERY', onPress: () => { pickImagefromGallery() } }
            ],
            { cancelable: true }
        )
    };


    // IMAGE PICKER FROM GALLERY
    const pickImagefromGallery = () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: true,
            sortOrder: 'none',
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
        })
            .then((image) => {
                console.log(`IMAGE: ${JSON.stringify(image)}`)
                setPicture(true)
                setProfilePic(image.path)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    //IMAGE PICKER FROM CAMERA
    const pickImagewithCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 500,
            includeExif: true,
            mediaType: 'photo'
        })
            .then((image) => {
                setPicture(true)
                setProfilePic(image.path)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

   
    //VIEW BEGINS
    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar barStyle={'light-content'} />

            <SafeAreaView style={{ flex: 1, width: '90%', alignSelf: 'center' }}>

                <ScrollView style={{ height: '90%' }} showsVerticalScrollIndicator={false}>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        marginTop: normalise(20)
                    }}>
                        <TouchableOpacity style={{ left: 10, position: 'absolute' }}
                            onPress={() => { props.navigation.goBack() }}>
                            <Image source={ImagePath.backicon}
                                style={{ height: normalise(15), width: normalise(15) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <Text style={{ color: Colors.white, fontSize: normalise(15), fontWeight: 'bold' }}>CREATE PROFILE</Text>
                    </View>

                    <View style={{
                        height: normalise(120), width: normalise(120), borderRadius: normalise(60),
                        backgroundColor: Colors.fadeblack, alignSelf: 'center', marginTop: normalise(40),
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        {picture ?
                            <Image
                                source={{ uri: profilePic }}
                                style={{ height: normalise(120), width: normalise(120), borderRadius: normalise(60) }}
                                resizeMode='contain' />

                            : <TouchableOpacity onPress={() => { showPickerOptions() }}>
                                <Image source={ImagePath.addicon} style={{
                                    height: normalise(40), width: normalise(40),
                                    borderRadius: normalise(20)
                                }} />
                            </TouchableOpacity>
                        }
                    </View>

                    <TouchableOpacity style={{ marginTop: normalise(10) }} onPress={() => { showPickerOptions() }}>
                    {picture ?
                        <Text style={{
                            color: Colors.white, fontSize: normalise(12),
                            alignSelf: 'center', fontWeight: 'bold', textDecorationLine: 'underline'
                        }}>
                             CHANGE PROFILE PIC
                    </Text>

                       : <Text style={{
                            color: Colors.white, fontSize: normalise(12),
                            alignSelf: 'center', fontWeight: 'bold', textDecorationLine: 'underline'
                        }}>
                             UPLOAD PROFILE PIC
                    </Text> }
                    </TouchableOpacity>

                    <TextInputField text={"CHOOSE USERNAME"}
                        placeholder={"Enter Username"}
                        placeholderTextColor={Colors.grey}
                        marginTop={normalise(30)}
                        onChangeText={(text) => { setUsername(text) }}
                        borderColor={username === "" ? Colors.grey : Colors.white} />

                    <TextInputField text={"FULL NAME"}
                        placeholder={"Enter Name"}
                        placeholderTextColor={Colors.grey}
                        onChangeText={(text) => { setFullname(text) }}
                        borderColor={fullname === "" ? Colors.grey : Colors.white} />

                    <TextInputField text={"ENTER LOCATION"}
                        placeholder={"Type Location"}
                        placeholderTextColor={Colors.grey}
                        onChangeText={(text) => { setLocation(text) }}
                        borderColor={location === "" ? Colors.grey : Colors.white} />


                    <View style={{
                        marginTop: normalize(30), height: normalize(45), borderRadius: normalize(10),
                        borderWidth: normalise(1), borderColor: Colors.grey, flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'center', padding: normalize(5)
                    }}>

                        <Image source={ImagePath.spotifyicon}
                            style={{ height: normalise(22), width: normalise(22), position: 'absolute', left: 20 }}
                            resizeMode="contain" />

                        <Text style={{ color: Colors.white, fontSize: normalise(12), fontWeight: '500' }}>
                            Spotify Username : andy88jones
                </Text>
                    </View>

                    <Button title={"COMPLETE PROFILE"}
                        marginTop={normalise(40)}
                        marginBottom={normalise(40)}
                        onPress={() => { dispatch(tokenRequest('QWERTY')) }} />


                </ScrollView>

            </SafeAreaView>
        </View>
    )
}