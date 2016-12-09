import _ from 'lodash';
import {lastFm} from "../constants/lastfm_api";

export const REQUEST_POPULAR_SONGS = 'REQUEST_POPULAR_SONGS';
export const RECEIVE_POPULAR_SONGS = 'RECEIVE_POPULAR_SONGS';
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS';

export function invalidateSongs(artist) {
    return {
        type: INVALIDATE_SONGS,
        artist
    }
}

function requestPopular(artist) {
    return {
        type: REQUEST_POPULAR_SONGS,
        artist
    }
}

function receivePopular(artist, json) {
    const songs = _.get(json, 'toptracks.track', []);

    return {
        type: RECEIVE_POPULAR_SONGS,
        artist,
        songs: _.get(json, 'toptracks.track', []),
        receivedAt: Date.now(),
        ...json
    }
}

function fetchSongs(artist) {
    return dispatch => {
        dispatch(requestPopular(artist));
        const getPopular = lastFm.getPopularSongs(artist);
        return fetch(getPopular)
            .then(response => {
                console.log("then fetch", response);
                return response.json();
            })
            .then(json => dispatch(receivePopular(artist, json)))
    }
}

function shouldFetchSongs(state, artist) {
    console.log("should?", state);
    const songs = _.get(state, `suggestedSongs.${artist}`);

    if (!songs) {
        return true
    } else if (state.isFetching) {
        return false
    } else {
        return state.didInvalidate
    }
}

export function fetchSongsIfNeeded(artist) {
    return (dispatch, getState) => {
        if (shouldFetchSongs(getState(), artist)) {
            return dispatch(fetchSongs(artist))
        }
    }
}