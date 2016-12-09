import _ from 'lodash';

export const REQUEST_POPULAR_SONGS = 'REQUEST_POPULAR_SONGS';
export const RECEIVE_POPULAR_SONGS = 'RECEIVE_POPULAR_SONGS';
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS';

function requestPopular(artist) {
    return {
        type: REQUEST_POPULAR_SONGS,
        artist
    }
}

function receivePopular(artist, json) {
    return {
        type: RECEIVE_POPULAR_SONGS,
        artist,
        posts: _.get(json, 'similarartists.artist', []),
        receivedAt: Date.now(),
        ...json
    }
}