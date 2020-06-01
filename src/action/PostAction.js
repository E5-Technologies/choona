import {
    SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    CREATE_POST_REQUEST
}
    from './TypeConstants';

export const seachSongsForPostRequest = (text, post) => ({
    type: SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    text,
    post
});

export const createPostRequest = (payload) => ({
    type: CREATE_POST_REQUEST,
    payload
});


