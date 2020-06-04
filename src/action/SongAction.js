import {
    SAVE_SONGS_REQUEST,
    SAVED_SONGS_LIST_REQUEST,
    UNSAVE_SONG_REQUEST,
    SAVE_SONG_REFERENCE_REQUEST
} from '../action/TypeConstants';


export const saveSongRequest = (payload) => ({
    type: SAVE_SONGS_REQUEST,
    payload
});

export const savedSongsListRequset = (search) => ({
    type: SAVED_SONGS_LIST_REQUEST,
    search
});

export const unsaveSongRequest = (id) => ({
    type: UNSAVE_SONG_REQUEST,
    id
});

export const saveSongRefReq = (object) => ({
    type: SAVE_SONG_REFERENCE_REQUEST,
    object
});