import fetch from "isomorphic-fetch";
import _ from "lodash";
import {lastFm} from "../api/lastfm_api";
import {take, put, call, fork, select} from "redux-saga/effects";
import * as actions from "../actions/artist";
import {selectedArtistSelector, suggestedArtistsSelector} from "../selectors/index";
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

function fetchArtistCorrectionApi(artist) {
    const getCorrection = lastFm.getCorrection(artist);
    return fetch(getCorrection)
        .then(response => response.json())
        .then(json => {
            // TODO: check on multiple corrections
            return _.get(json, ['corrections', 'correction', 'artist'], {});
        });
}

function* fetchArtistCorrection(artist) {
    yield put(actions.requestArtistCorrection(artist));
    const data = yield call(fetchArtistCorrectionApi, artist);
    const artistCorrectedName = _.get(data, 'name', '');
    if (artistCorrectedName) {
        yield put(actions.receiveArtistCorrection(artistCorrectedName));
        return artistCorrectedName;
    } else {
        yield put(actions.receiveFailArtistCorrection(artist));
        return '';
    }
}

export function* invalidateArtist() {
    while (true) {
        const {artist} = yield take(actions.INVALIDATE_ARTIST);
        yield call(mainSaga, artist);
    }
}

export function* nextArtistChange() {
    while (true) {
        const prevArtist = yield select(selectedArtistSelector);
        yield take(actions.SELECT_ARTIST);
        const newArtist = yield select(selectedArtistSelector);
        const suggestedArtists = yield select(suggestedArtistsSelector);
        if (prevArtist !== newArtist && !suggestedArtists[newArtist]) {
            yield fork(mainSaga, newArtist);
        }
    }
}

export function* nextArtistAuto() {
    while (true) {
        const {artist} = yield take(actions.NEXT_ARTIST);
        const suggestedArtists = yield select(suggestedArtistsSelector);
        const items = _.get(suggestedArtists, [artist, 'items']);
        if (items) {
            let nextArtist = null;
            items.some((item) => {
                const res = item.name && !suggestedArtists[item.name];
                if (res) nextArtist = item.name;
                return res;
            });
            if (nextArtist && nextArtist !== '') {
                yield fork(mainSaga, nextArtist);
            }
        }
    }
}

export function* onFetchFailArtist() {
    while (true) {
        const {artist} = yield take(actions.FETCH_FAIL_ARTIST);
        if (artist) {
            yield fork(fetchArtistCorrection, artist);
        }
    }
}

export function* startup() {
    const selectedArtist = yield select(selectedArtistSelector);
    if (selectedArtist !== '') {
        yield fork(mainSaga, selectedArtist);
    }
}

function* mainSaga(artist) {
    if (artist && artist !== '') {
        yield put(actions.fetchProgressArtist(artist));
        yield fork(fetchArtists, artist);
        const songs = yield call(fetchSongs, artist);
        if (songs.length !== 0) {
            yield songs.map(song => call(fetchVideo, song));
            yield put(actions.fetchFinishArtist(artist));
        } else {
            yield put(actions.fetchFailArtist(artist));
        }
    }
}

export default function* root() {
    yield fork(startup);
    yield fork(nextArtistChange);
    yield fork(nextArtistAuto);
    yield fork(invalidateArtist);
    yield fork(onFetchFailArtist);
}