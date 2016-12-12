import {
    INVALIDATE_ARTIST,
    SELECT_ARTIST,
    RECEIVE_SIMILAR_ARTISTS,
    REQUEST_SIMILAR_ARTISTS
} from '../actions/artist';

export function selectedArtist(state = 'Mono', action) {
    switch (action.type) {
        case SELECT_ARTIST:
            return action.artist;
        default:
            return state;
    }
}

function songs(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
}, action) {
    switch (action.type) {
        case INVALIDATE_ARTIST:
            return {...state,
                didInvalidate: true,
            };
        case REQUEST_SIMILAR_ARTISTS:
            return {...state,
                isFetching: true,
                didInvalidate: false,
            };
        case RECEIVE_SIMILAR_ARTISTS:
            return {...state,
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt,
            };
        default:
            return state;
    }
}

export function suggestedArtists(state = { }, action) {
    switch (action.type) {
        case INVALIDATE_ARTIST:
        case RECEIVE_SIMILAR_ARTISTS:
        case REQUEST_SIMILAR_ARTISTS:
            return {
                ...state,
                [action.artist]: songs(state[action.artist], action),
            };
        default:
            return state;
    }
}