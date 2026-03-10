import { useDispatch, useSelector } from 'react-redux';
import { Platform, Alert } from 'react-native';
import { Player } from '@lomray/react-native-apple-music';
import { extractSongIdFromUrl } from '../utils/helpers/CommonFunctions';
import { usePlayFullAppleMusic } from './usePlayFullAppleMusic';
import { MusicPlayer } from '../widgets/MusicPlayer';
import { saveSongRefReq } from '../action/SongAction';
import { dummyRequest } from '../action/UserAction';
import { useContext } from 'react';
import { AppleMusicContext } from '../context/AppleMusicContext';

export const useGlobalMusicPlayer = () => {
    const dispatch = useDispatch();
    const playingSongRef = useSelector(state => state.SongReducer.playingSongRef);
    const registerType = useSelector(state => state.TokenReducer.registerType);

    const {
        setPlaybackQueue,
        onToggle,
    } = usePlayFullAppleMusic();

    const {
        haveAppleMusicSubscription
    } = useContext(AppleMusicContext);

    const playSong = async (data, songIndex = null) => {
        const selectedSongIndex = songIndex ?? 0;
        const songItem = data?.item?.songs[selectedSongIndex];

        if (!songItem) return;

        // 1. Handle Apple Music Playback
        if (
            haveAppleMusicSubscription &&
            data?.item?.social_type === 'apple' &&
            Platform.OS === 'ios' &&
            registerType === 'apple'
        ) {
            const songId = extractSongIdFromUrl(songItem?.original_song_uri);

            if (!songId) {
                console.log('ERROR: Failed to extract Apple Music Song ID');
                Alert.alert('Error', 'Failed to extract Apple Music Song ID from the provided URL.');
                return;
            }

            // Update Redux State
            const songData = {
                uri: songItem?.song_uri,
                apple_song_id: songId,
                song_name: songItem?.song_name,
                album_name: songItem?.album_name,
                song_pic: songItem?.song_image,
                username: data.item.userDetails?.username,
                profile_pic: data.item.userDetails?.profile_image,
                commentData: data.item.comment,
                reactionData: data.item.reaction,
                id: data.item?._id,
                artist: songItem?.artist_name,
                originalUri: data.item.original_song_uri || undefined,
                isrc: songItem?.isrc_code,
                regType: data.item.userDetails?.register_type,
                details: data.item,
                showPlaylist: true,
            };

            dispatch(saveSongRefReq(songData));
            dispatch(dummyRequest());

            if (playingSongRef?.apple_song_id !== songId) {
                await setPlaybackQueue(songId);
                setTimeout(() => {
                    Player.play();
                }, 500);
            } else {
                setTimeout(() => {
                    onToggle();
                }, 500);
            }
        }
        // 2. Handle Preview/Generic Playback
        else {
            // If there was an active Apple Music player, stop it
            if (Platform.OS === 'ios') {
                Player.pause();
            }

            MusicPlayer(songItem?.song_uri, true)
                .then(() => {
                    const songData = {
                        uri: songItem?.song_uri,
                        song_name: songItem?.song_name,
                        album_name: songItem?.album_name,
                        song_pic: songItem?.song_image,
                        username: data.item.userDetails?.username,
                        profile_pic: data.item.userDetails?.profile_image,
                        commentData: data.item.comment,
                        reactionData: data.item.reaction,
                        id: data.item?._id,
                        artist: songItem?.artist_name,
                        originalUri: data.item.original_song_uri || undefined,
                        isrc: songItem?.isrc_code,
                        regType: data.item.userDetails?.register_type,
                        details: data.item,
                        showPlaylist: true,
                    };

                    dispatch(saveSongRefReq(songData));
                    dispatch(dummyRequest());
                })
                .catch(err => {
                    console.log('Error while playing music..' + JSON.stringify(err));
                });
        }
    };

    return { playSong };
};
