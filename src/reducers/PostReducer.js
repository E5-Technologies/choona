import {

    SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
    SEARCH_SONG_REQUEST_FOR_POST_FAILURE,

    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE

}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    spotifyResponse: [],
    createPostResponse: {}
}

const PostReducer = (state = initialState, action) => {
    switch (action.type) {

        case SEARCH_SONG_REQUEST_FOR_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SEARCH_SONG_REQUEST_FOR_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                spotifyResponse: action.data,
            };

        case SEARCH_SONG_REQUEST_FOR_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case CREATE_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case CREATE_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                createPostResponse: action.data,
            };

        case CREATE_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        default:
            return state;

    }
}

export default PostReducer;