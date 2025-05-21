// // PlayerContext.js
// import React, {createContext, useState, useEffect} from 'react';
// // import Player from '@lomray/react-native-apple-music';

// import {
//   Auth,
//   Player,
//   MusicKit,
//   useCurrentSong,
//   useIsPlaying,
// } from '@lomray/react-native-apple-music';
// import {Alert} from 'react-native';

// export const PlayerContext = createContext();

// export const PlayerProvider = ({children}) => {
//   const [currentSong, setCurrentSong] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     // Check initial authorization
//     const checkAuth = async () => {
//       try {
//         const status = await Auth.authorize();
//         console.log(status, 'its status hhh');
//         if (status == 'authorized') {
//           setIsAuthorized(true);
//         }
//       } catch (error) {
//         console.error('Authorization check failed:', error);
//       }
//     };

//     checkAuth();

//     // // Set up event listeners
//     // const playbackListener = Player.addListener(
//     //   'playbackStateDidChange',
//     //   state => {
//     //     setIsPlaying(state.isPlaying);
//     //     setCurrentSong(state.songId);
//     //   },
//     // );

//     // return () => {
//     //   playbackListener.remove();
//     // };
//   }, []);

//   const requestAuthorization = async () => {
//     try {
//       const status = await Player.requestAuthorization();
//       const authorized = status === Player.AUTHORIZED;
//       setIsAuthorized(authorized);
//       console.log('Authorization failed:', authorized);
//       return authorized;
//     } catch (error) {
//       console.error('Authorization failed:', error);
//       return false;
//     }
//   };

//   const playSong = async songId => {
//     Alert.alert('yes');
//     if (!isAuthorized) {
//       Alert.alert('inside');
//       const authorized = await requestAuthorization();
//       if (!authorized) throw new Error('Not authorized');
//     }

//     try {
//       Alert.alert('after auth');
//       await Player.playSong(songId);
//     } catch (error) {
//       console.error('Playback error:', error);
//       throw error;
//     }
//   };

//   const togglePlayback = async () => {
//     if (!currentSong) return;

//     try {
//       if (isPlaying) {
//         await Player.pause();
//       } else {
//         await Player.resume();
//       }
//     } catch (error) {
//       console.error('Playback toggle error:', error);
//       throw error;
//     }
//   };

//   return (
//     <PlayerContext.Provider
//       value={{
//         currentSong,
//         isPlaying,
//         isAuthorized,
//         playSong,
//         togglePlayback,
//         requestAuthorization,
//       }}>
//       {children}
//     </PlayerContext.Provider>
//   );
// };

// PlayerContext.js
import React, {createContext, useState, useEffect} from 'react';
import {Auth, Player} from '@lomray/react-native-apple-music';
import {Alert} from 'react-native';

export const PlayerContext = createContext();

export const PlayerProvider = ({children}) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // 1. First check authorization
        const authStatus = await Auth.getAuthorizationStatus();
        setIsAuthorized(authStatus === Auth.AUTHORIZED);

        // 2. Set up player if authorized
        if (authStatus === Auth.AUTHORIZED) {
          await Player.setupPlayer();
        }

        // 3. Set up event listeners
        const subscription = Player.addPlaybackListener(state => {
          setIsPlaying(state.isPlaying);
          setCurrentSong(state.nowPlayingItem?.id || null);
        });

        return () => subscription.remove();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, []);

  const requestAuthorization = async () => {
    try {
      // setIsLoading(true);
      const status = await Auth.authorize();
      const authorized = status === Auth.AUTHORIZED;
      setIsAuthorized(authorized);

      if (authorized) {
        await Player.setupPlayer();
      }

      return authorized;
    } catch (error) {
      console.error('Authorization error:', error);
      Alert.alert('Authorization Failed', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const playMedia = async songId => {
    try {
      // setIsLoading(true);
      if (!isAuthorized) {
        Alert.alert(songId);
        const authorized = await requestAuthorization();
        if (!authorized) return;
      }
      Alert.alert('h');
      // CORRECT: Using setQueue instead of non-existent playSong
      await Player.setQueue({
        items: [
          {
            id: songId,
            type: 'song',
          },
        ],
      });
      Alert.alert(songId);
      await Player.play();
      setCurrentSong(songId);
    } catch (error) {
      console.error('Playback error:', error);
      handlePlaybackError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaybackError = error => {
    let message = 'Could not play the song';

    if (error.message.includes('subscription')) {
      message = 'Apple Music subscription required';
    } else if (error.message.includes('authorization')) {
      message = 'Please grant Apple Music access';
    }

    Alert.alert('Playback Error', message);
  };

  const togglePlayback = async () => {
    try {
      setIsLoading(true);
      if (isPlaying) {
        await Player.pause();
      } else {
        await Player.play();
      }
    } catch (error) {
      console.error('Playback toggle error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isAuthorized,
        isLoading,
        playMedia,
        togglePlayback,
        requestAuthorization,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};
