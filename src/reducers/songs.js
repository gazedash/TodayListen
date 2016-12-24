import {INVALIDATE_SONGS, RECEIVE_POPULAR_SONGS, REQUEST_POPULAR_SONGS} from "../actions/songs";

function songs(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
}, action) {
    switch (action.type) {
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
                // items: action.songs,
                lastUpdated: action.receivedAt,
            };
        default:
            return state;
    }
}

export function popularSongs(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_SONGS:
            return {
                ...state,
                didInvalidate: true,
            };
        case RECEIVE_POPULAR_SONGS:
            if (action.songs.length !== 0) {
                return {
                    ...state,
                    [action.artist]: songs(state[action.artist], action),
                };
            }
            return state;
        default:
            return state;
    }
}