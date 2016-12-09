import fetch from 'isomorphic-fetch'
import _ from 'lodash';
import {API_KEY, API_VERSION, LastFm} from "../constants/lastfm_api";

export const REQUEST_SIMILAR_ARTISTS = 'REQUEST_SIMILAR_ARTISTS';
export const RECEIVE_SIMILAR_ARTISTS = 'RECEIVE_SIMILAR_ARTISTS';
export const SELECT_ARTIST = 'SELECT_ARTIST';
export const INVALIDATE_ARTIST = 'INVALIDATE_ARTIST';

const lastFm = new LastFm({api_key: API_KEY, version: API_VERSION});

export function selectArtist(artist) {
    return {
        type: SELECT_ARTIST,
        artist
    }
}

export function invalidateArtist(artist) {
    return {
        type: INVALIDATE_ARTIST,
        artist
    }
}


function requestSimilar(artist) {
    return {
        type: REQUEST_SIMILAR_ARTISTS,
        artist
    }
}

function receiveSimilar(artist, json) {
    return {
        type: RECEIVE_SIMILAR_ARTISTS,
        artist,
        posts: _.get(json, 'similarartists.artist', []),
        receivedAt: Date.now(),
        ...json
    }
}

function fetchArtists(artist) {
    return dispatch => {
        dispatch(requestSimilar(artist));
        const getSimilar = lastFm.getSimilarArtists(artist);
        return fetch(getSimilar)
            .then(response => {
                console.log("then fetch", response);
                return response.json();
            })
            .then(json => dispatch(receiveSimilar(artist, json)))
    }
}

function shouldFetchArtists(state, artist) {
    const artists = _.get(state, `suggestedArtists.${artist}`);

    if (!artists) {
        return true
    } else if (state.isFetching) {
        return false
    } else {
        return state.didInvalidate
    }
}

export function fetchArtistsIfNeeded(artist) {
    return (dispatch, getState) => {
        if (shouldFetchArtists(getState(), artist)) {
            return dispatch(fetchArtists(artist))
        }
    }
}