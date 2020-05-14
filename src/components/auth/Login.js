
import React, { useEffect, Fragment } from 'react';
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
import constants from '../../utils/helpers/constants'
import { authorize, prefetchConfiguration, refresh } from 'react-native-app-auth';
import { encode as btoa } from 'base-64';

export default function SignUp(props) {

    const config = {
        clientId: constants.spotify_client_id,
        clientSecret: constants.spotify_client_secret,
        redirectUrl: 'com.choona:/oauthredirect',
        scopes: [
            // 'playlist-read-private',
            // 'playlist-modify-public',
            // 'playlist-modify-private',
            // 'user-library-read',
            // 'user-library-modify',
            // 'user-top-read',
            'user-read-email',
            'user-read-private'
        ],
        serviceConfiguration: {
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
            tokenEndpoint: 'https://accounts.spotify.com/api/token',
            response_type: 'code',
            state: '123456'
        },
        //additionalParameters: {  }
    };


    async function authSpotify() {
        try {
            const result = await authorize(config);
            console.log(result)
            
            return result;
            // result includes accessToken, accessTokenExpirationDate and refreshToken
        } catch (error) {
            console.log(JSON.stringify(error));
        }

    }

    async function refreshSpotifyToken() {
        try {
            const result = await refresh(config,{
                refreshToken: "AQBbDnudR_1lx_kcW2rFUp7Svo4IwwEqAWGHZG9UGoUHbyukwhkgJRxjzY4tYIEyyPS6T_ywQn3qAhihgxeSl-Epjg0OdR4uop9qxS4kqe4jblFXIf0YdOPNRCo3i8hInCc"
            });
            console.log(result)
            
            return result;
            // result includes accessToken, accessTokenExpirationDate and refreshToken
        } catch (error) {
            console.log(JSON.stringify(error));
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
                    authSpotify();
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