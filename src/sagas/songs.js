import fetch from "isomorphic-fetch";
import _ from "lodash";
import {lastFm} from "../api/lastfm_api";
import {take, put, call, fork, select} from "redux-saga/effects";
import * as actions from "../actions/songs";
import {selectedArtistSelector, popularSongsSelector} from "../selectors/index";
import {takeEvery} from "redux-saga";

function fetchSongsApi(artist) {
    const getPopular = lastFm.getPopularSongs(artist);
    return fetch(getPopular)
        .then(response => response.json())
        .then(json => {
            const songs = _.get(json, ['toptracks', 'track'], []);
            return _.map(songs, (song) => `${artist} - ${song.name}`);
        });
}

export function* fetchSongs(artist) {
    yield put(actions.requestPopular(artist));
    const songs = yield call(fetchSongsApi, artist);
    yield put(actions.receivePopular(artist, songs));
    return songs;
}

export function* invalidateSongs() {
    yield takeEvery(actions.INVALIDATE_SONGS, fetchSongs);
}

export function* nextSongsChange() {
    while(true) {
        const prevArtist = yield select(selectedArtistSelector);
        yield take(actions.INVALIDATE_SONGS);

        const newArtist = yield select(selectedArtistSelector);
        const popularSongs = yield select(popularSongsSelector);
        if (prevArtist !== newArtist && !popularSongs[newArtist]) {
            yield fork(fetchSongs, newArtist)
        }
    }
}

export function* startup() {
    const artist = yield select(selectedArtistSelector);
    if (artist !== '') {
        yield fork(fetchSongs, artist);
    }
}

export default function* root() {
    yield fork(startup);
    yield fork(nextSongsChange);
    yield fork(invalidateSongs);
}