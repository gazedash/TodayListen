import _ from "lodash";
import {lastFm} from "../constants/lastfm_api";
import {fetchVideoIfNeeded} from "./videos";

export const REQUEST_POPULAR_SONGS = 'REQUEST_POPULAR_SONGS';
export const RECEIVE_POPULAR_SONGS = 'RECEIVE_POPULAR_SONGS';
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS';

export function invalidateSongs(artist) {
    return {
        type: INVALIDATE_SONGS,
        artist,
    }
}

function requestPopular(artist) {
    return {
        type: REQUEST_POPULAR_SONGS,
        artist,
    }
}

function receivePopular(artist, songs) {
    return {
        type: RECEIVE_POPULAR_SONGS,
        artist,
        songs,
        receivedAt: Date.now(),
    }
}

function fetchSongs(artist) {
    return dispatch => {
        dispatch(requestPopular(artist));
        const getPopular = lastFm.getPopularSongs(artist);
        return fetch(getPopular)
            .then(response => {
                return response.json();
            })
            .then(json => {
                const songs = _.map(_.get(json, 'toptracks.track', []), (song) => {
                    const query = artist + " - " + song.name;
                    dispatch(fetchVideoIfNeeded(query));
                    return query;
                });
                return dispatch(receivePopular(artist, songs));
            })
    }
}

function shouldFetchSongs(state, artist) {
    // TODO: check
    const songs = _.get(state, `suggestedSongs.${artist}`);
    if (!songs && _.isString(artist) && artist) {
        return true;
    } else if (state.isFetching) {
        return false;
    } else {
        return state.didInvalidate;
    }
}

export function fetchSongsIfNeeded(artist) {
    return (dispatch, getState) => {
        if (shouldFetchSongs(getState(), artist)) {
            return dispatch(fetchSongs(artist));
        }
    }
}