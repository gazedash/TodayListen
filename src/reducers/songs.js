import {INVALIDATE_SONGS, RECEIVE_POPULAR_SONGS, REQUEST_POPULAR_SONGS, } from "../actions/songs";

function songs(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
}, action) {
    switch (action.type) {
        case INVALIDATE_SONGS:
            return {
                ...state,
                didInvalidate: true,
            };
        case REQUEST_POPULAR_SONGS:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case RECEIVE_POPULAR_SONGS:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                items: action.songs,
                lastUpdated: action.receivedAt,
            };
        default:
            return state;
    }
}

export function popularSongs(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_SONGS:
        case RECEIVE_POPULAR_SONGS:
        case REQUEST_POPULAR_SONGS:
            return {
                ...state,
                [action.artist]: songs(state[action.artist], action),
            };
        default:
            return state;
    }
}