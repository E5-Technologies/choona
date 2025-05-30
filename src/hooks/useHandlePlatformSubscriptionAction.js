import {useSelector} from 'react-redux';
import {Alert, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useContext} from 'react';
import {AppleMusicContext} from '../context/AppleMusicContext';

const useHandlePlatformSubscriptionAction = callBack => {
  const userTokenData = useSelector(state => state.TokenReducer);
  const {isAuthorizeToAccessAppleMusic, haveAppleMusicSubscription} =
    useContext(AppleMusicContext);
  const navigation = useNavigation();

  const handleAddSongNavigation = () => {
    if (Platform.OS === 'ios' && userTokenData?.registerType === 'apple') {
      if (isAuthorizeToAccessAppleMusic && haveAppleMusicSubscription) {
        callBack();
      } else {
        Alert.alert(
          "You don't have apple music subscription, To create session Apple music subscription is required!",
        );
        return;
      }
    } else {
      callBack();
      // navigation.navigate('AddSong', {from: 'AssembleSession'});
    }
  };

  return handleAddSongNavigation;
};

export default useHandlePlatformSubscriptionAction;
