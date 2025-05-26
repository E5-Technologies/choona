import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  Auth,
  MusicKit,
  Player,
  useIsPlaying,
} from '@lomray/react-native-apple-music';
import {AppState} from 'react-native';
import toast from '../utils/helpers/ShowErrorAlert';
import {play} from 'react-native-track-player/lib/src/trackPlayer';

export const AppleMusicContext = createContext(null);
const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({children}) => {
  const {isPlaying} = useIsPlaying();
  const [isPlayingSong, setIsPlayingSong] = useState(isPlaying);
  console.log(isPlayingSong, 'thi is sthe playing>>>>>');
  //     const [isSubscribed, setIsSubscribed]=useState(false)
  //   const [isAuthorized, setIsAuthorized] = useState(false);
  //   const [isPlayingAppleSong, setIsPlaying] = useState(false);
  //   const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    setIsPlayingSong(isPlaying);
  }, [isPlaying]);

  //   // Authorize once
  //   const authorize = useCallback(async () => {
  //     const status = await AppleMusic.requestAuthorization();
  //     setIsAuthorized(status === 'authorized');
  //   }, []);

  //   const onAuthAppleSong = async () => {
  //       try {
  //         const status = await Auth.authorize();
  //         // Alert.alert('Authorization Status', `Status: ${status}`);

  //         if (status === 'authorized') {
  //           setIsAuthorized(true);
  //           await onCheckSubs();
  //         } else {
  //           toast('Error', "You don't have permission to access Apple Music");
  //         }
  //       } catch (error) {
  //         console.error('Authorization error:', error);
  //         toast('Error', 'Failed to access Apple Music');
  //       }
  //     };

  //      const onCheckSubs = async () => {
  //         try {
  //           const subscriptionInfo = await Auth.checkSubscription();
  //           console.log('Subscription Info:', subscriptionInfo);

  //           // Key checks for active subscription
  //           if (subscriptionInfo.canPlayCatalogContent) {
  //             // User has an active Apple Music subscription
  //             console.log('User has Apple Music subscription');
  //             setIsSubscribed(true);
  //             // return true;
  //           }
  //           // else if (subscriptionInfo.isMusicCatalogSubscriptionEligible) {
  //           //   // User is eligible but not currently subscribed
  //           //   Alert.alert(
  //           //     'Subscription Required',
  //           //     'You need to activate your Apple Music subscription to play full songs',
  //           //     [
  //           //       { text: 'Cancel' },
  //           //       { text: 'Subscribe', onPress: () => Linking.openURL('https://music.apple.com') }
  //           //     ]
  //           //   );
  //           //   return false;
  //           // }
  //           else {
  //             // User is not eligible (might be in unsupported region)
  //             Alert.alert(
  //               'Not Available',
  //               'Apple Music subscription is not available for your account',
  //             );
  //             setIsSubscribed(false);
  //             // return false;
  //           }
  //         } catch (error) {
  //           console.error('Subscription check error:', error);
  //           Alert.alert('Error', 'Could not verify Apple Music subscription status');
  //           // return false;
  //         }
  //       };

  //   // Set music queue
  //   const setQueueAppleSong = useCallback(async itemId => {
  //     await MusicKit.setPlaybackQueue(itemId, 'song');
  //     setCurrentTrack(await Player.getCurrentState());
  //   }, []);

  //   const playAppleSong = async () => {
  //     await Player.play();
  //     setIsPlaying(true);
  //   }

  //   const pauseAppleSong = async () => {
  //     await Player.pause();
  //     setIsPlaying(false);
  //   }

  //    const togglePlayAppleSong = async () => {
  //     const state = await Player.getCurrentState();
  //     console.log( state, 'this is the')
  //     if (state?.playbackStatus == 'playing') {
  //       pause();
  //     } else {
  //       play();
  //     }
  //   }

  // Track progress manually
  useEffect(() => {
    if (isPlayingSong) {
      intervalRef.current = setInterval(async () => {
        const state = await Player.getCurrentState();
        // console.log(state ,'its player current State>>')
        if (state) {
          setProgress(state?.playbackTime ?? 0);
          setDuration(state?.currentSong?.duration ?? 0);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlayingSong]);

  // Auto-authorize on mount
  //   useEffect(() => {
  //     onAuthAppleSong();
  //   }, []);

  const value = useMemo(
    () => ({
      //   isAuthorized,
      //   isSubscribed,
      //   currentTrack,
      //   isPlayingAppleSong,
      //   playAppleSong,
      //   pauseAppleSong,
      //   togglePlayAppleSong,
      //   setQueueAppleSong,
      //   seekTo,
      progress,
      duration,
    }),
    [
      //   isAuthorized,
      //   isSubscribed,
      //   currentTrack,
      //   isPlayingAppleSong,
      //   playAppleSong,
      //   pauseAppleSong,
      //   togglePlayAppleSong,
      //   setQueueAppleSong,
      //   seekTo,
      progress,
      duration,
    ],
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  }
  return context;
};
