import {
    INVALIDATE_ARTIST,
    SELECT_ARTIST,
    RECEIVE_SIMILAR_ARTISTS,
    REQUEST_SIMILAR_ARTISTS,
    NEXT_ARTIST,
    FETCH_FINISH_ARTIST,
    FETCH_PROGRESS_ARTIST,
    FETCH_FAIL_ARTIST,
    RECEIVE_ARTIST_CORRECTION,
    REQUEST_ARTIST_CORRECTION,
    RECEIVE_FAIL_ARTIST_CORRECTION
} from "../actions/artist";

export function selectedArtist(state = '', action) {
    switch (action.type) {
        case NEXT_ARTIST:
            return state;
        case SELECT_ARTIST:
            return action.artist;
        default:
            return state;
    }
}

export function artistCorrection(state = {}, action) {
    switch (action.type) {
        case REQUEST_ARTIST_CORRECTION:
            return {
                ...state,
                isCorrectionFetching: true,
                correctionSuccess: false
            };
        case RECEIVE_ARTIST_CORRECTION:
            return {
                ...state,
                isCorrectionFetching: false,
                correction: action.artist,
                correctionSuccess: true
            };
        case RECEIVE_FAIL_ARTIST_CORRECTION:
            return {
                ...state,
                isCorrectionFetching: false,
                correctionSuccess: false
            };
        default:
            return state;
    }
}

export function fetchArtist(state = {}, action) {
    switch (action.type) {
        case FETCH_PROGRESS_ARTIST:
            return {
                ...state,
                isFetching: true,
                success: false,
            };
        case FETCH_FAIL_ARTIST:
            return {
                ...state,
                isFetching: false,
                success: false,
            };
        case FETCH_FINISH_ARTIST:
            return {
                ...state,
                isFetching: false,
                success: true,
                artist: action.artist,
            };
        default:
            return state;
    }
}

function artists(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
}, action) {
    switch (action.type) {
        case REQUEST_SIMILAR_ARTISTS:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case RECEIVE_SIMILAR_ARTISTS:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                items: action.items,
                lastUpdated: action.receivedAt,
            };
        default:
            return state;
    }
}

export function suggestedArtists(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_ARTIST:
            return {
                ...state,
                didInvalidate: true,
            };
        case RECEIVE_SIMILAR_ARTISTS:
            if (action.items.length !== 0) {
                return {
                    ...state,
                    [action.artist]: artists(state[action.artist], action),
                };
            }
            return state;
        default:
            return state;
    }
}