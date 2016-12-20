import fetch from "isomorphic-fetch";
import {lastFm} from "../constants/lastfm_api";
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
    console.log('about to fetch songs');
    let songs = yield call(fetchSongs, artist);
    console.log('fetched songs?', songs);
    if (songs) {
        yield songs.map(song => fork(fetchVideo, song));
    }
}

export function* startup() {
    const selectedArtist = yield select(selectedArtistSelector);
    // yield fork(metaSaga, selectedArtist);
    if (selectedArtist !== '') {
        yield fork(mainSaga, selectedArtist);
    }
}

// export function* metaSaga(artist) {
//     yield fork(fetchArtists, artist);
//     const popularSongs = yield call(fetchSongs, artist);
// }

export default function* root() {
    yield fork(startup);
    yield fork(nextArtistChange);
    yield fork(invalidateArtist);
}