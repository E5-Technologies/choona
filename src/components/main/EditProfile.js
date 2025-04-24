import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  Alert,
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import TextInputField from '../../widgets/TextInputField';
import ImagePicker from 'react-native-image-crop-picker';
import toast from '../../utils/helpers/ShowErrorAlert';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import isInternetConnected from '../../utils/helpers/NetInfo';

import {connect} from 'react-redux';
import constants from '../../utils/helpers/constants';
import {
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,
} from '../../action/TypeConstants';
import {getProfileRequest, editProfileRequest} from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import axios from 'axios';
import CountryPicker from 'react-native-country-picker-modal';
import Avatar from '../Avatar';
let status = '';

const EditProfile = props => {
  const [username, setUsername] = useState(props?.userProfileResp?.username);
  const [fullname, setFullname] = useState(props.userProfileResp?.full_name);
  const [phoneNumber, setPhoneNumber] = useState(props.userProfileResp?.phone);
  const [location, setLocation] = useState(props.userProfileResp?.location);
  const [picture, setPicture] = useState(false);
  const [profilePic, setProfilePic] = useState(
    props.userProfileResp?.profile_image
      ? constants.profile_picture_base_url +
          props.userProfileResp?.profile_image
      : null,
  );
  const [imageDetails, setImageDetails] = useState('');
  const [userNameAvailable, setUserNameAvailable] = useState(true);
  const [visible, setVisible] = useState(false);

  const [countryCode, setCountryCode] = useState();
  const [country, setCountry] = useState();

  const onSelect = country => {
    setCountryCode(country.cca2);
    setCountry(country);
    setLocation(country.name);
  };

  if (status === '' || props.status !== status) {
    switch (props.status) {
      case EDIT_PROFILE_REQUEST:
        status = props.status;
        break;

      case EDIT_PROFILE_SUCCESS:
        toast('Oops', 'Profile updated successfully.');
        //props.navigation.goBack()
        status = props.status;
        break;

      case EDIT_PROFILE_FAILURE:
        status = props.status;
        toast('Oops', props.error.message);
        break;
    }
  }

  // IMAGE PICKER OPTIONS
  const showPickerOptions = () => {
    accessPremission();
  };

  const accessPremission = () => {
    Alert.alert(
      'Choose Profile Image',
      'Select from where you want to choose the image.',
      [
        {
          text: 'Camera',
          onPress: () => {
            pickImagewithCamera();
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            pickImagefromGallery();
          },
        },
      ],
      {cancelable: true},
    );
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
      .then(image => {
        console.log(`IMAGE: ${JSON.stringify(image)}`);
        setPicture(true);
        setImageDetails(image);
        setProfilePic(image.path);
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          alert(err);
        }
        console.log(JSON.stringify(err));
      });
  };

  //IMAGE PICKER FROM CAMERA
  const pickImagewithCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      sortOrder: 'none',
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    })
      .then(image => {
        setPicture(true);
        setImageDetails(image);
        setProfilePic(image.path);
      })
      .catch(err => {
        alert(err);
        console.log(err);
      });
  };

  const updateProfile = () => {
    if (username === '') {
      alert('Please enter your username');
    } else if (!userNameAvailable) {
      alert('Please enter a valid username');
    } else if (username.includes(' ')) {
      alert('Username cannot include spaces');
    } else if (fullname === '') {
      alert('Please enter your name');
    } else if (phoneNumber === '') {
      alert('Please enter your phone number');
    } else if (location === '') {
      alert('Please enter your location');
    } else if (profilePic === '') {
      alert('Please upload your profile picture');
    } else {
      let formdata = new FormData();

      if (picture) {
        let uploadPicture = {
          name:
            imageDetails.filename === undefined ||
            imageDetails.filename === null
              ? 'xyz.jpg'
              : imageDetails.filename.replace(/HEIC/g, 'jpg'),
          type: imageDetails.mime,
          uri: profilePic,
        };

        formdata.append('profile_image', uploadPicture);
        formdata.append('full_name', fullname);
        formdata.append('location', location);
        formdata.append('username', username);
        formdata.append('phone', phoneNumber);

        isInternetConnected()
          .then(() => {
            props.editProfileReq(formdata);
          })
          .catch(err => {
            toast('Oops', 'Please Connect To Internet');
          });
      } else {
        formdata.append('full_name', fullname);
        formdata.append('location', location);
        formdata.append('username', username);
        formdata.append('phone', phoneNumber);

        isInternetConnected()
          .then(() => {
            props.editProfileReq(formdata);
          })
          .catch(err => {
            toast('Oops', 'Please Connect To Internet');
          });
      }
    }
  };

  const check = async username => {
    await axios
      .post(
        constants.BASE_URL + '/user/available',
        {username: username},
        {
          headers: {
            Accept: 'application/json',
            contenttype: 'application/json',
          },
        },
      )
      .then(res => {
        setUserNameAvailable(res.data.status === 200);
      })
      .catch(err => {
        setUserNameAvailable(false);
      });
  };

  //VIEW BEGINS
  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: Colors.darkerblack}}
      behavior="height">
      <StatusBar />

      <Loader visible={props.status === EDIT_PROFILE_REQUEST} />

      <SafeAreaView style={{flex: 1, backgroundColor: Colors.darkerblack}}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={'EDIT PROFILE'}
          thirditemtext={true}
          //   texttwo={'SAVE'}
          onPressFirstItem={() => {
            props.getProfileReq();
            props.navigation.goBack();
          }}
          //   onPressThirdItem={() => {
          //     updateProfile();
          //   }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={showPickerOptions}
            style={{
              height: normalise(120),
              width: normalise(120),
              borderRadius: normalise(60),
              backgroundColor: Colors.fadeblack,
              alignSelf: 'center',
              marginTop: normalise(32),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar image={profilePic} height={120} width={120} />
          </Pressable>
          <TouchableOpacity
            style={{marginTop: normalise(10), marginBottom: normalise(20)}}
            onPress={() => {
              showPickerOptions();
            }}>
            {/* <Text
              style={{
                color: Colors.white,
                fontSize: normalise(12),
                alignSelf: 'center',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                marginBottom: normalise(36),
              }}>
              CHANGE PROFILE PIC
            </Text> */}
          </TouchableOpacity>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}>
            <TextInputField
              text={'CHOOSE USERNAME'}
              backgroundColor={Colors.fadeblack}
              style={{backgroundColor: Colors.fadeblack}}
              autocorrect={false}
              placeholder={'Enter Username'}
              tick_req={true}
              value={username}
              userNameAvailable={userNameAvailable}
              tick_visible={username ? true : false}
              onChangeText={text => {
                setUsername(text);
                check(text);
              }}
            />
            <TextInputField
              text={'FULL NAME'}
              placeholder={'Enter Name'}
              maxLength={25}
              value={fullname}
              onChangeText={text => {
                setFullname(text);
              }}
              borderColor={
                fullname === '' ? Colors.activityBorderColor : Colors.white
              }
              marginTop={normalise(20)}
            />
            <Text
              style={{
                fontSize: normalise(10),
                color: Colors.meta,
                fontFamily: 'ProximaNova-SemiBold',
                textTransform: 'uppercase',
              }}>
              Location
            </Text>
            <CountryPicker
              containerButtonStyle={{
                backgroundColor: Colors.fadeblack,
                width: '100%',
                height: normalise(44),
                borderRadius: normalise(6),
                borderWidth: normalise(0.5),
                marginTop: normalise(10),
                padding: normalise(5),
                paddingTop: country ? normalise(6) : normalise(13),
                paddingLeft: normalise(16),
                marginBottom: normalise(16),
              }}
              placeholder={
                <Text
                  style={{
                    fontFamily: 'ProximaNova-Semibold',
                    marginTop: normalise(15),
                    color: Colors.meta,
                  }}>
                  {location ?? 'Select country'}
                </Text>
              }
              {...{
                allowFontScaling: true,
                countryCode: countryCode,
                withFilter: true,
                withFlag: true,
                withCountryNameButton: true,
                withEmoji: true,
                withModal: true,
                withFlagButton: true,
                onSelect,
                preferredCountries: ['GB', 'US'],
                modalProps: {
                  visible,
                },
                onClose: () => setVisible(false),
                onOpen: () => setVisible(true),
              }}
            />
            <TextInputField
              text={'PHONE NUMBER'}
              placeholder={'Enter Phone number'}
              maxLength={15}
              isNumber={true}
              value={phoneNumber}
              onChangeText={text => {
                setPhoneNumber(text);
              }}
            />
            <Text
              style={{
                marginLeft: '5%',
                width: '90%',
                color: Colors.meta,
                textAlign: 'center',
                fontSize: normalise(10),
                fontFamily: 'ProximaNova-Regular',
                marginBottom: normalise(12),
              }}>
              We only ask for your Location and Phone No. so we can help you
              find people you already know on Choona, we never pass your
              information on.
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            marginBottom: normalise(10),
            marginTop: normalise(10),
            height: normalise(44),
            width: '90%',
            alignSelf: 'center',
            borderRadius: normalise(25),
            backgroundColor: Colors.white,
            borderWidth: normalise(0.5),
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.5,
            shadowRadius: 9,
            elevation: 11,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: Colors.white,
          }}
          onPress={updateProfile}>
          <Text
            style={{
              marginLeft: normalise(10),
              color: Colors.darkerblack,
              fontSize: normalise(14),
              fontFamily: 'Kallisto',
            }}>
            UPDATE PROFILE
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = state => {
  return {
    status: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    error: state.UserReducer.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfileReq: () => {
      dispatch(getProfileRequest());
    },
    editProfileReq: payload => {
      dispatch(editProfileRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
