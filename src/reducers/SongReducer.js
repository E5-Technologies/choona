import {
    SAVE_SONGS_REQUEST,
    SAVE_SONGS_SUCCESS,
    SAVE_SONGS_FAILURE,

    SAVED_SONGS_LIST_REQUEST,
    SAVED_SONGS_LIST_SUCCESS,
    SAVED_SONGS_LIST_FAILURE,

    UNSAVE_SONG_REQUEST,
    UNSAVE_SONG_SUCCESS,
    UNSAVE_SONG_FAILURE

} from '../action/TypeConstants';

const initialState = {
    status: "",
    error: "",
    savedSongResponse: {},
    savedSongList: [],
    unsaveSongResp: {}
};

const SongReducer = (state = initialState, action) => {
    switch (action.type) {

        case SAVE_SONGS_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SAVE_SONGS_SUCCESS:
            return {
                ...state,
                status: action.type,
                savedSongResponse: action.data
            };

        case SAVE_SONGS_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case SAVED_SONGS_LIST_REQUEST:
            return {
                ...state,
                status: action.type,
                savedSongList: []
            };

        case SAVED_SONGS_LIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                savedSongList: action.data
            };

        case SAVED_SONGS_LIST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case UNSAVE_SONG_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case UNSAVE_SONG_SUCCESS:
            return {
                ...state,
                status: action.type,
                unsaveSongResp: action.data
            };

        case UNSAVE_SONG_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        default:
            return state;

    }
};

export default SongReducer;