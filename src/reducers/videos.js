import {INVALIDATE_VIDEO, RECEIVE_VIDEO, REQUEST_VIDEO} from "../actions/videos";

function video(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
}, action) {
    switch (action.type) {
        case INVALIDATE_VIDEO:
            return {
                ...state,
                didInvalidate: true,
            };
        case REQUEST_VIDEO:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case RECEIVE_VIDEO:
            return {
                ...state,
                artist: action.artist,
                song: action.song,
                isFetching: false,
                didInvalidate: false,
                items: action.videos,
                lastUpdated: action.receivedAt,
            };
        default:
            return state;
    }
}

export function suggestedVideos(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_VIDEO:
        case RECEIVE_VIDEO:
        case REQUEST_VIDEO:
            return {
                ...state,
                [action.song]: video(state[action.song], action),
            };
        default:
            return state;
    }
}