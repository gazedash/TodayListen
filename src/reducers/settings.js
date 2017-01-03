import {SWITCH_ALBUMS_TO_TOP_TRACKS} from "../actions/settings";

export function settings(state = {}, action) {
    switch (action.type) {
        case SWITCH_ALBUMS_TO_TOP_TRACKS:
            return {
                ...state,
                preferAlbums: action.preferAlbums,
            };
        default:
            return state;
    }
}