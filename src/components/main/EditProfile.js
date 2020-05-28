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
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import { EDIT_PROFILE_REQUEST, EDIT_PROFILE_SUCCESS, EDIT_PROFILE_FAILURE } from '../../action/TypeConstants';
import { editProfileRequest } from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';



let status = "";
function EditProfile(props) {

    const [fullname, setFullname] = useState(props.userProfileResp.full_name);
    const [location, setLocation] = useState(props.userProfileResp.location);
    const [picture, setPicture] = useState(false);
    const [profilePic, setProfilePic] = useState(constants.profile_picture_base_url + props.userProfileResp.profile_image)
    const [imageDetails, setImageDetails] = useState("");


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case EDIT_PROFILE_REQUEST:
                status = props.status
                break;

            case EDIT_PROFILE_SUCCESS:
                props.navigation.goBack()
                status = props.status
                break;

            case EDIT_PROFILE_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;
        }
    };


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
                setPicture(true)
                setImageDetails(image)
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
                setImageDetails(image)
                setProfilePic(image.path)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const updateProfile = () => {

        let formdata = new FormData;

        if (picture) {

            let uploadPicture = {
                name: imageDetails.filename === undefined ? 'xyz.jpg' : imageDetails.filename,
                type: imageDetails.mime,
                uri: profilePic
            };

            formdata.append("profile_image", uploadPicture);
            formdata.append("full_name", fullname);
            formdata.append("location", location);

            isInternetConnected()
                .then(() => {
                    props.editProfileReq(formdata)
                })
                .catch((err) => {
                    toast("Oops", "Please Connect To Internet")
                })


        } else {

            formdata.append("full_name", fullname);
            formdata.append("location", location);

            isInternetConnected()
                .then(() => {
                    props.editProfileReq(formdata)
                })
                .catch((err) => {
                    toast("Oops", "Please Connect To Internet")
                })
        }

    };


    //VIEW BEGINS
    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === EDIT_PROFILE_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent
                    firstitemtext={false}
                    imageone={ImagePath.backicon}
                    title={"EDIT PROFILE"}
                    thirditemtext={true}
                    texttwo={"SAVE"}
                    onPressFirstItem={() => { props.navigation.goBack() }}
                    onPressThirdItem={() => { updateProfile() }}
                />


                <View style={{
                    height: normalise(120), width: normalise(120), borderRadius: normalise(60),
                    backgroundColor: Colors.fadeblack, alignSelf: 'center', marginTop: normalise(40),
                    justifyContent: 'center', alignItems: 'center'
                }}>

                    <Image
                        source={{ uri: profilePic }}
                        style={{
                            height: normalise(120), width: normalise(120),
                            borderRadius: normalise(60)
                        }}
                        resizeMode='contain' />



                </View>

                <TouchableOpacity style={{ marginTop: normalise(10) }} onPress={() => { showPickerOptions() }}>

                    <Text style={{
                        color: Colors.white, fontSize: normalise(12),
                        alignSelf: 'center', fontWeight: 'bold', textDecorationLine: 'underline'
                    }}>
                        CHANGE PROFILE PIC
                    </Text>

                </TouchableOpacity>


                <View style={{ width: '90%', alignSelf: 'center' }}>

                    <TextInputField text={"FULL NAME"}
                        placeholder={"Enter Name"}
                        maxLength={25}
                        value={fullname}
                        placeholderTextColor={Colors.grey}
                        onChangeText={(text) => { setFullname(text) }}
                        borderColor={fullname === "" ? Colors.grey : Colors.white}
                        marginTop={normalise(20)} />

                    <TextInputField text={"ENTER LOCATION"}
                        placeholder={"Type Location"}
                        value={location}
                        placeholderTextColor={Colors.grey}
                        onChangeText={(text) => { setLocation(text) }}
                        borderColor={location === "" ? Colors.grey : Colors.white} />

                </View>

            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userProfileResp: state.UserReducer.userProfileResp
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        editProfileReq: (payload) => {
            dispatch(editProfileRequest(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);