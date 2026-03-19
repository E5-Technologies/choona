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
import toast from '../utils/helpers/ShowErrorAlert';

export const useGlobalMusicPlayer = () => {
    const dispatch = useDispatch();
    const playingSongRef = useSelector(state => state.SongReducer.playingSongRef);
    const registerType = useSelector(state => state.TokenReducer.registerType);
    const sessionDetailData = useSelector(state => state.SessionReducer.sessionDetailData?.data);
    const userProfileResp = useSelector(state => state.UserReducer.userProfileResp);

    const {
        setPlaybackQueue,
        onToggle,
        isPlaying,
    } = usePlayFullAppleMusic();

    const {
        haveAppleMusicSubscription,
    } = useContext(AppleMusicContext);

    const checkActiveSession = () => {
        const isLive = sessionDetailData?.isLive ?? false;
        const isHost = userProfileResp?._id === sessionDetailData?.own_user?._id;
        let isJoinee = false;

        if (isLive && !isHost && sessionDetailData?.users?.length > 0) {
            isJoinee = sessionDetailData.users.some(
                user => (user?._id || user) === userProfileResp?._id,
            );
        }

        if (isLive && (isHost || isJoinee)) {

            toast('Alert', 'You cannot play another song while in a live session.');
            return true;
        }
        return false;
    };

    const playSong = async (data, songIndex = null) => {
        if (checkActiveSession()) {
            return;
        }

        const selectedSongIndex = songIndex ?? 0;
        const songItem = data?.item?.songs[selectedSongIndex];
        // console.log(songItem, 'thisiSOngItem')

        if (!songItem) {
            return;
        }

        // 1. Handle Apple Music Playback
        if (
            haveAppleMusicSubscription &&
            data?.item?.social_type === 'apple' &&
            Platform.OS === 'ios' &&
            registerType === 'apple'
        ) {
            const songId = songItem?.apple_song_id || extractSongIdFromUrl(songItem?.original_song_uri);

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

    const playGenericSong = async (payload) => {
        if (checkActiveSession()) {
            return;
        }
        if (!payload) {
            return;
        }

        const songId = payload?.apple_song_id || extractSongIdFromUrl(payload?.originalUri);
        // if (!songId) {
        //     console.log('ERROR: Failed to extract Apple Music Song ID');
        //     Alert.alert('Error', 'Failed to extract Apple Music Song ID from the provided URL.');
        //     return;
        // }

        // Update Redux State
        const songData = {
            uri: payload.uri,
            apple_song_id: songId,
            song_name: payload.song_title,
            album_name: payload.album_name,
            song_pic: payload.song_pic,
            username: payload.username,
            profile_pic: payload.profile_pic,
            commentData: payload.comments || [],
            reactionData: payload.reactions || [],
            id: payload.id,
            artist: payload.artist,
            originalUri: payload.originalUri || undefined,
            isrc: payload.isrc,
            regType: payload.registerType,
            details: payload.details,
            showPlaylist: payload.showPlaylist || false,
        };

        console.log(songData, 'songData')

        // 1. Handle Apple Music Playback
        if (
            haveAppleMusicSubscription &&
            payload.registerType === 'apple' &&
            Platform.OS === 'ios' &&
            registerType === 'apple'
        ) {
            dispatch(saveSongRefReq(songData));
            dispatch(dummyRequest());
            console.log('111songData12');
            const genericSongId = payload.apple_song_id || payload.id;
            if (playingSongRef?.apple_song_id !== genericSongId) {
                console.log('111songData22');
                await setPlaybackQueue(genericSongId);
                setTimeout(() => {
                    Player.play();
                }, 500);
            } else {
                console.log('111songData33');
                setTimeout(() => {
                    onToggle();
                }, 500);
            }
        }
        // 2. Handle Preview/Generic Playback
        else {
            console.log('111songData');
            // If there was an active Apple Music player, stop it
            if (Platform.OS === 'ios') {
                Player.pause();
            }

            MusicPlayer(payload.uri, true)
                .then(() => {
                    dispatch(saveSongRefReq(songData));
                    dispatch(dummyRequest());
                })
                .catch(err => {
                    console.log('Error while playing music..' + JSON.stringify(err));
                });
        }

    };

    return { playSong, playGenericSong, isPlaying, onToggle };
};
