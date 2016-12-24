import {INVALIDATE_VIDEO, RECEIVE_VIDEO, REQUEST_VIDEO} from "../actions/videos";
import {REMOVE_POPULAR_SONG} from "../actions/songs";
import _ from 'lodash';

function video(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
}, action) {
    switch (action.type) {
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
            return {
                ...state,
                didInvalidate: true,
            };
        case REMOVE_POPULAR_SONG:
            const songId = action.song;
            return {..._.omitBy(state, (song) => song.song === songId )};
        case RECEIVE_VIDEO:
            if (action.videos.length !== 0) {
                return {
                    ...state,
                    [action.song]: video(state[action.song], action),
                };
            }
            return state;
        default:
            return state;
    }
}