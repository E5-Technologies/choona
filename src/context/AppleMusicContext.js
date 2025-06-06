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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);  

  const intervalRef = useRef(null);

  const resetProgress = useCallback(() => {
  setProgress(0);
  setDuration(0);
}, []);

  useEffect(() => {
    setIsPlayingSong(isPlaying);
  }, [isPlaying]);


  useEffect(() => {
    if (isPlayingSong) {
      intervalRef.current = setInterval(async () => {
        const state = await Player.getCurrentState();
        console.log(state ,'its player current State>>')
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



  const value = useMemo(
    () => ({
      progress,
      duration,
      resetProgress,
    }),
    [
      progress,
      duration,
      resetProgress
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
