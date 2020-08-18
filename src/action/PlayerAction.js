import {
    GET_CURRENT_PLAYER_POSITION_REQUEST,
    RESUME_PLAYER_REQUEST,
    PAUSE_PLAYER_REQUEST,
    PLAYER_SEEK_TO_REQUEST,
    GET_SONG_FROM_ISRC_REQUEST
}
    from './TypeConstants';

export const getCurrentPlayerPostionAction = () => ({
    type: GET_CURRENT_PLAYER_POSITION_REQUEST,
});

export const playerResumeRequest = () => ({
    type: RESUME_PLAYER_REQUEST,
});

export const playerPauseRequest = () => ({
    type: PAUSE_PLAYER_REQUEST,
});

export const playerSeekToRequest = (seekTo) => ({
    type: PLAYER_SEEK_TO_REQUEST,
    seekTo
});

export const getSongFromisrc = (regType, isrc) => ({
    type: GET_SONG_FROM_ISRC_REQUEST,
    regType,
    isrc
});

