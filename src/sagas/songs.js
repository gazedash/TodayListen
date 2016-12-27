import fetch from "isomorphic-fetch";
import _ from "lodash";
import lastFm from "../api/lastfm_api";
import {put, call} from "redux-saga/effects";
import * as actions from "../actions/songs";

function fetchSongsApi(artist) {
    const getPopular = lastFm.getPopularSongs(artist);
    return fetch(getPopular)
        .then(response => response.json())
        .then(json => {
            const songs = _.get(json, ['toptracks', 'track'], []);
            return songs.map((song) => ({artist: artist, song: `${artist} - ${song.name}`}));
        });
}

export function* fetchSongs(artist) {
    yield put(actions.requestPopular(artist));
    const songs = yield call(fetchSongsApi, artist);
    yield put(actions.receivePopular(artist, songs));
    return songs;
}