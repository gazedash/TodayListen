import fetch from "isomorphic-fetch";
import {lastFm} from "../api/lastfm_api";
import {take, put, call, fork, select} from "redux-saga/effects";
import {takeEvery} from "redux-saga";
import * as actions from "../actions/artist";
import * as songs from "../actions/songs";
import {selectedArtistSelector, suggestedArtistSelector} from "../selectors/index";
import {fetchVideo} from "./videos";
import {fetchSongs} from "./songs";

function fetchArtistsApi(artist) {
    const getSimilar = lastFm.getSimilarArtists(artist);
    return fetch(getSimilar).then(response => response.json());
}

function* fetchArtists(artist) {
    yield put(actions.requestSimilar(artist));
    const artists = yield call(fetchArtistsApi, artist);
    yield put(actions.receiveSimilar(artist, artists));
}

export function* invalidateArtist() {
    yield takeEvery(actions.INVALIDATE_ARTIST, fetchArtists);
}

export function* nextArtistChange() {
    while (true) {
        const prevArtist = yield select(selectedArtistSelector);
        yield take(actions.SELECT_ARTIST);

        const newArtist = yield select(selectedArtistSelector);
        const suggestedArtists = yield select(suggestedArtistSelector);
        if (prevArtist !== newArtist && !suggestedArtists[newArtist]) {
            yield fork(mainSaga, newArtist);
        }
    }
}

function* mainSaga(artist) {
    yield fork(fetchArtists, artist);
    let songs = yield call(fetchSongs, artist);
    if (songs) {
        yield songs.map(song => fork(fetchVideo, song));
    }
}

export function* startup() {
    const selectedArtist = yield select(selectedArtistSelector);
    if (selectedArtist !== '') {
        yield fork(mainSaga, selectedArtist);
    }
}

export default function* root() {
    yield fork(startup);
    yield fork(nextArtistChange);
    yield fork(invalidateArtist);
}