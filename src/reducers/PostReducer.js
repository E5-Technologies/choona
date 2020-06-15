import {

    SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
    SEARCH_SONG_REQUEST_FOR_POST_FAILURE,

    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE,

    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAILURE,

    SEARCH_POST_REQUEST,
    SEARCH_POST_SUCCESS,
    SEARCH_POST_FAILURE
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    spotifyResponse: [],
    createPostResponse: {},
    chooseSongToSend: [],
    deletePostResp: {},
    searchPost: []
}

const PostReducer = (state = initialState, action) => {
    switch (action.type) {

        case SEARCH_SONG_REQUEST_FOR_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SEARCH_SONG_REQUEST_FOR_POST_SUCCESS:

            if (action.post) {
                return {
                    ...state,
                    status: action.type,
                    spotifyResponse: action.data,
                };
            } else {
                return {
                    ...state,
                    status: action.type,
                    chooseSongToSend: action.data,
                };
            }


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

        case DELETE_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case DELETE_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                deletePostResp: action.data,
            };

        case DELETE_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case SEARCH_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SEARCH_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                searchPost: action.data,
            };

        case SEARCH_POST_FAILURE:
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