import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    Platform
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
import {
    USER_SIGNUP_REQUEST, USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAILURE,
    USER_LOGIN_FAILURE
} from '../../action/TypeConstants';
import { signupRequest } from '../../action/UserAction';
import { connect } from 'react-redux';
import { register } from 'react-native-app-auth';


let status = ""

function Login(props) {

    if (status === "" || props.status !== status) {
        switch (props.status) {
            case USER_SIGNUP_REQUEST:
                status = props.status
                break;

            case USER_SIGNUP_SUCCESS:
                status = props.status
                break;

            case USER_LOGIN_FAILURE:
                status = props.status
                break;
        }
    };

    const dispatch = useDispatch()

    const [username, setUsername] = useState(props.route.params.loginType === 'Spotify' ?
        props.route.params.userDetails.display_name : props.route.params.userDetails.fullName.givenName);

    const [fullname, setFullname] = useState(props.route.params.loginType === 'Spotify' ?
        "" : `${props.route.params.userDetails.fullName.givenName} ${props.route.params.userDetails.fullName.familyName}`);

    const [imageDetails, setImageDetails] = useState({});

    const [location, setLocation] = useState(props.route.params.loginType === 'Spotify' ?
        props.route.params.userDetails.country : "");

    const [picture, setPicture] = useState(false);
    const [profilePic, setProfilePic] = useState("")


    const [userDetails, setUserDetails] = useState(props.route.params.userDetails)

    console.log('DETAILS' + JSON.stringify(userDetails))

    // IMAGE PICKER OPTIONS
    const showPickerOptions = () => {
        Alert.alert(
            "Choose Profile Image", "Select from where you want to choose the image",
            [
                { text: 'CAMERA', onPress: () => { pickImagewithCamera() } },
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
                setImageDetails(image)
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
                setImageDetails(image)
                setPicture(true)
                setProfilePic(image.path)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const register = () => {

        if (username === "") {
            alert("Please enter your user name")
        }
        else if (fullname === "") {
            alert("Please enter your name")
        }
        else if (location === "") {
            alert("Please enter your location")
        }
        else if (profilePic === "") {
            alert("Please upload your profile picture")
        }

        else {

            let profileImage = {
                name: imageDetails.filename === undefined ? 'xyz.jpg' : imageDetails.filename,
                type: imageDetails.mime,
                uri: Platform.OS === "android" ? profilePic : profilePic.replace("file://", "")
            }

            let formdata = new FormData;

            formdata.append("full_name", fullname);

            formdata.append("profile_image", profileImage);

            formdata.append("username", username);

            formdata.append("location", location);

            props.route.params.loginType === 'Spotify' ?
                formdata.append("social_username", userDetails.display_name) :
                formdata.append("social_username", userDetails.fullName.givenName);

            formdata.append("email", userDetails.email);

            formdata.append("deviceToken", "123456");
            
            formdata.append("deviceType", Platform.OS);

            props.route.params.loginType === 'Spotify' ?
                formdata.append("social_id", userDetails.id) :
                formdata.append("social_id", userDetails.user);

            props.route.params.loginType === 'Spotify' ?
                formdata.append("register_type", 'spotify') :
                formdata.append("register_type", 'apple');

            console.log(formdata)
            props.signUpRequest(formdata);
        }
    }


    //VIEW BEGINS
    return (

        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.black, }}
            behavior="height"
        >

            <StatusBar barStyle={'light-content'} />

            <SafeAreaView style={{ flex: 1, width: '90%', alignSelf: 'center' }}>

                <ScrollView style={{ height: '90%' }} showsVerticalScrollIndicator={false}>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        marginTop: normalise(25)
                    }}>
                        <TouchableOpacity style={{ left: normalise(-2), position: 'absolute' }}
                            onPress={() => { props.navigation.goBack() }}>
                            <Image source={ImagePath.backicon}
                                style={{ height: normalise(15), width: normalise(15) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <Text style={{
                            color: Colors.white,
                            fontSize: normalise(15),
                            fontFamily: 'ProximaNova-Black'
                        }}>CREATE PROFILE</Text>
                    </View>

                    <View style={{
                        height: normalise(120),
                        width: normalise(120),
                        borderRadius: normalise(60),
                        backgroundColor: Colors.fadeblack, alignSelf: 'center', marginTop: normalise(40),
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        {picture ?
                            <Image
                                source={{ uri: profilePic }}
                                style={{
                                    height: normalise(120),
                                    width: normalise(120),
                                    borderRadius: normalise(55)
                                }}
                                resizeMode='contain' />

                            : <TouchableOpacity onPress={() => { showPickerOptions() }}>
                                <Image source={ImagePath.add_white} style={{
                                    height: normalise(40), width: normalise(40),
                                    borderRadius: normalise(20)
                                }} />
                            </TouchableOpacity>
                        }
                    </View>

                    <TouchableOpacity style={{ marginTop: normalise(10) }}
                        onPress={() => { showPickerOptions() }}>
                        {picture ?
                            <Text style={{
                                color: Colors.white, fontSize: normalise(14),
                                alignSelf: 'center',
                                fontFamily: 'ProximaNova-Bold',
                                textDecorationLine: 'underline'
                            }}>
                                CHANGE PROFILE PIC
                            </Text>

                            : <Text style={{
                                color: Colors.white, fontSize: normalise(14),
                                alignSelf: 'center',
                                fontFamily: 'ProximaNova-Bold',
                                textDecorationLine: 'underline',

                            }}>
                                UPLOAD PROFILE PIC
                    </Text>}
                    </TouchableOpacity>

                    <TextInputField text={"CHOOSE USERNAME"}
                        placeholder={"Enter Username"}
                        placeholderTextColor={Colors.grey}
                        marginTop={normalise(30)}
                        tick_req={true}
                        value={username}
                        tick_visible={username}
                        onChangeText={(text) => { setUsername(text) }}
                    />

                    <TextInputField text={"FULL NAME"}
                        placeholder={"Enter Name"}
                        placeholderTextColor={Colors.grey}
                        maxLength={25}
                        value={fullname}
                        onChangeText={(text) => { setFullname(text) }} />

                    <TextInputField text={"ENTER LOCATION"}
                        placeholder={"Type Location"}
                        placeholderTextColor={Colors.grey}
                        value={location}
                        onChangeText={(text) => { setLocation(text) }} />


                    {props.route.params.loginType === "Spotify" ?
                        <View style={{
                            marginTop: normalize(30), height: normalize(45), borderRadius: normalize(10),
                            borderWidth: normalise(1), borderColor: Colors.grey, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'center', padding: normalize(5)
                        }}>

                            <Image source={ImagePath.spotifyicon}
                                style={{ height: normalise(22), width: normalise(22), position: 'absolute', left: 20 }}
                                resizeMode="contain" />

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(12),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>
                                {`Spotify Username: ${userDetails.display_name}`}
                            </Text>
                        </View> : null}


                    <Button title={"COMPLETE PROFILE"}
                        marginTop={normalise(40)}
                        marginBottom={normalise(40)}
                        fontSize={normalise(15)}
                        onPress={() => { register() }} />


                </ScrollView>

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        signupResponse: state.UserReducer.signupResponse
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUpRequest: (payload) => {
            dispatch(signupRequest(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)