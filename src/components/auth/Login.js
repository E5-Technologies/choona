
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Image,
    Platform,
    Alert
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import ImagePath from '../../assests/ImagePath';
import Colors from '../../assests/Colors';
import MyStatusBar from '../../utils/MyStatusBar';
import { loginWithSpotify, getSpotifyToken } from '../../utils/helpers/SpotifyLogin'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE
} from '../../action/TypeConstants'
import { loginRequest } from '../../action/UserAction'
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux';

let status = "";
function SignUp(props) {

    const [userDetails, setUserDetails] = useState({})


    function spotifyLogin() {

        loginWithSpotify().then((value) => {

            console.log(value);
            setUserDetails(value)

            let payload = {
                social_id: value.id,
                social_type: 'spotify',
                deviceToken: '123456',
                deviceType: Platform.OS
            }

            props.loginRequest(payload);


        }).catch((error) => { console.log(error) })

    }


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case USER_LOGIN_REQUEST:
                status = props.status
                break;

            case USER_LOGIN_SUCCESS:
                status = props.status
                break;

            case USER_LOGIN_FAILURE:
                status = props.status

                if (props.error.status === 201) {
                    props.navigation.navigate("SignUp", { userDetails: userDetails })
                } else {
                    alert(props.error.message)
                }

                break;
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            {Platform.OS === 'android' ? <MyStatusBar /> : <StatusBar barStyle={'light-content'} />}

            <View style={{ height: '50%' }}>
                <Image
                    source={ImagePath.albumsPic}

                    style={{ height: '90%', width: '100%', alignItems: "center", justifyContent: 'center', }}
                />

                <Image source={ImagePath.applogo}
                    style={{ height: normalise(60), width: '60%', alignSelf: 'center', }}
                    resizeMode='contain' />
            </View>


            <View style={{
                height: '50%', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'flex-end'
            }}>

                <TouchableOpacity style={{
                    height: normalise(50), width: '80%', alignSelf: 'center',
                    borderRadius: normalise(25),
                    backgroundColor: Colors.darkerblack,
                    borderWidth: normalise(0.5),
                    borderColor: Colors.grey,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5, },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,
                    elevation: 11,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onPress={() => {
                    spotifyLogin()
                }}  >

                    <Image source={ImagePath.spotifyicon}
                        style={{ height: normalise(22), width: normalise(22) }}
                        resizeMode='contain' />

                    <Text style={{
                        marginLeft: normalise(10),
                        color: Colors.white,
                        fontSize: normalise(12),
                        fontFamily: 'ProximaNova-Extrabld',
                    }}>LOGIN WITH SPOTIFY</Text>

                </TouchableOpacity>


                <TouchableOpacity style={{
                    marginBottom: normalise(40),
                    marginTop: normalise(20), height: normalise(50), width: '80%', alignSelf: 'center',
                    borderRadius: normalise(25), backgroundColor: Colors.white, borderWidth: normalise(0.5),
                    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }} onPress={() => { props.navigation.navigate("SignUp") }}   >

                    <Image source={ImagePath.applemusic}
                        style={{ height: normalise(25), width: normalise(25) }}
                        resizeMode='contain' />

                    <Text style={{
                        marginLeft: normalise(10),
                        color: Colors.black,
                        fontSize: normalise(12),
                        fontFamily: 'ProximaNova-Extrabld',
                    }}>LOGIN WITH APPLE MUSIC</Text>

                </TouchableOpacity>
            </View>

        </View>
    )
}


const mapStateToProps = (state) => {
    return {

        status: state.UserReducer.status,
        error: state.UserReducer.error,
        loginResponse: state.UserReducer.loginResponse,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (payload) => {
            dispatch(loginRequest(payload))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);