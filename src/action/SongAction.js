import {
    SAVE_SONGS_REQUEST,
    SAVED_SONGS_LIST_REQUEST,
    UNSAVE_SONG_REQUEST
} from '../action/TypeConstants';


export const saveSongRequest = (payload) => ({
    type: SAVE_SONGS_REQUEST,
    payload
});

export const savedSongsListRequset = () => ({
    type: SAVED_SONGS_LIST_REQUEST
});

export const unsaveSongRequest = () => ({
    type: UNSAVE_SONG_REQUEST
});