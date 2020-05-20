import constants from './constants'
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import {getAppleDevelopersToken} from './ApiRequest';

export const getAppleDevToken = async () => {
    try {
        const creds = await AsyncStorage.getItem(constants.APPLE)
        
        if(creds === null){
            
            const token = await getAppleDevelopersToken(constants.appleGetTokenApi)

            await AsyncStorage.setItem(constants.APPLE, JSON.stringify({token: token.token, token_exp: token.token_exp}))

            return token.token
        } 
        else{

            const devToken = JSON.parse(creds).token
            const tokenexp = JSON.parse(creds).token_exp
            const currentTime = moment().utc().format(`YYYY-MM-DDTHH:mm:sssZ`);

            console.log(creds)
            if(currentTime > tokenexp){

            const token = await getAppleDevelopersToken(constants.appleGetTokenApi)
            await AsyncStorage.setItem(constants.APPLE, JSON.stringify({token: token.token, token_exp: token.token_exp}))
            return token.token ;
            }
            else{
            return  devToken
            }
        }

    } catch (error) {
        return error
    }
}