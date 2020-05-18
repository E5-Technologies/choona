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


function EditProfile(props) {

    const [fullname, setFullname] = useState(props.userProfileResp.full_name);
    const [location, setLocation] = useState(props.userProfileResp.location);
    const [picture, setPicture] = useState(false);
    const [profilePic, setProfilePic] = useState(constants.profile_picture_base_url + props.userProfileResp.profile_image)
    const [imageDetails, setImageDetails] = useState("");

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

        let formdata = new formdata;

        if (picture) {

            let uploadPicture = {
                name: imageDetails.filename,
                type: imageDetails.mime,
                uri: profilePic };
                
            formdata.append("profile_image", uploadPicture);
            formdata.append("full_name", fullname);
            formdata.append("location", location);


        } else {

            formdata.append("full_name", fullname);
            formdata.append("location", location);
        }

    }


    //VIEW BEGINS
    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

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
                        style={{ height: normalise(120), width: normalise(120), borderRadius: normalise(60) }}
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
        getProfileReq: () => {
            dispatch(getProfileRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);