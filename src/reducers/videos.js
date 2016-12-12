import {INVALIDATE_VIDEO, RECEIVE_VIDEO, REQUEST_VIDEO} from "../actions/videos";

function videos(state = {
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
                query: action.query,
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
                //     TODO: deal with spaces...
                ...state,
                [action.query]: videos(state[action.query], action),
            };
        // return newVersion;
        default:
            return state;
    }
}