import fetch from 'isomorphic-fetch'
import _ from 'lodash';
import {lastFm} from "../constants/lastfm_api";

function fetchArtistsApi(artist) {
    const getSimilar = lastFm.getSimilarArtists(artist);
    return fetch(getSimilar)
        .then(response => {
            return response.json();
        })
        .then(json => dispatch(receiveSimilar(artist, json)));
}

function fetchArtists(artist) {
    return dispatch => {
        dispatch(requestSimilar(artist));
        const getSimilar = lastFm.getSimilarArtists(artist);
        return fetch(getSimilar)
            .then(response => {
                return response.json();
            })
            .then(json => dispatch(receiveSimilar(artist, json)));
    }
}

function shouldFetchArtists(state, artist) {
    // TODO: check
    const artists = _.get(state, ['suggestedArtists', artist]);
    if (!artists && _.isString(artist) && artist) {
        return true;
    } else if (state.isFetching) {
        return false;
    } else {
        return state.didInvalidate;
    }
}

export function fetchArtistsIfNeeded(artist) {
    return (dispatch, getState) => {
        if (shouldFetchArtists(getState(), artist)) {
            return dispatch(fetchArtists(artist));
        }
    }
}