import {
    SAVE_SONGS_REQUEST,
    SAVE_SONGS_SUCCESS,
    SAVE_SONGS_FAILURE
} from '../action/TypeConstants';

const initialState = {
    status: "",
    error: "",
    savedSongResponse: {}
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

          default:
              return state;  

    }
};

export default SongReducer;