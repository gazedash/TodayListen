import fetch from "isomorphic-fetch";
import _ from "lodash";
import lastFm from "../api/lastfm_api";
import {take, put, call, fork, select} from "redux-saga/effects";
import * as actions from "../actions/artist";
import {nextArtistSelector, suggestedArtistsSelector, selectedArtistSelector} from "../selectors/index";
import {fetchVideo} from "./videos";
import {fetchSongs} from "./songs";
import Storage from "../utils/storage";

const REQUESTED_ARTISTS = 'REQUESTED_ARTISTS';
const LATEST_ARTIST = 'LATEST_ARTIST';
const FIRST_TIME = 'FIRST_TIME';

function fetchArtistsApi(artist) {
    const getSimilar = lastFm.getSimilarArtists(artist);
    return fetch(getSimilar).then(response => response.json());
}

function* fetchArtists(artist) {
    yield put(actions.requestSimilar(artist));
    const artists = yield call(fetchArtistsApi, artist);
    yield put(actions.receiveSimilar(artist, artists));
    return artists;
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
        const {artist: newArtist} = yield take(actions.SELECT_ARTIST);
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
        const requestedArtists = yield call(Storage.get, REQUESTED_ARTISTS);
        const latestArtist = yield call(Storage.get, LATEST_ARTIST);
        const nextArtist = yield call(fetchOneNewArtist, items, (item) => {
            return item.name && !suggestedArtists[items.name] && !requestedArtists.includes(item.name) && latestArtist !== item.name;
        });
        if (!nextArtist && artist) {
            // TODO: refactor: on nextArtist from ArtistPicker no items
            yield fork(mainSaga, artist);
        }
    }
}

export function* fetchOneNewArtist(items, fn) {
    let nextArtist = null;

    if (!_.isEmpty(items)) {
        items.some((item) => {
            const res = fn(item);
            if (res) nextArtist = item.name;
            return res;
        });
        if (nextArtist) {
            yield fork(mainSaga, nextArtist);
        }
    }

    return nextArtist;
}

export function* fetchFirstSuggested(artist) {
    const {similarartists = {}} = yield call(fetchArtists, artist);
    const {artist: items = []} = similarartists;
    const requestedArtists = yield call(Storage.get, REQUESTED_ARTISTS);
    const latestArtist = yield call(Storage.get, LATEST_ARTIST);
    yield call(fetchOneNewArtist, items, (item) => {
        return item.name && !requestedArtists.includes(item.name) && latestArtist !== item.name;
    });
}

export function* onFetchFailArtist() {
    while (true) {
        const {artist} = yield take(actions.FETCH_FAIL_ARTIST);
        if (artist) {
            yield fork(fetchArtistCorrection, artist);
        }
    }
}

export function* firstTime() {
    const firstTime = !(yield call(Storage.has, FIRST_TIME));
    if (firstTime) {
        yield call(Storage.set, FIRST_TIME, true);
    } else {
        yield call(fetchRecommendedFromCache);
    }
}

export function* fetchRecommendedFromCache() {
    const latestArtist = yield call(Storage.get, LATEST_ARTIST);
    if (latestArtist) {
        yield fork(fetchFirstSuggested, latestArtist);
    }
}

export function* setRequestedArtistToCache(artist) {
    if (artist && _.isString(artist)) {
        let requestedArtists = yield call(Storage.get, REQUESTED_ARTISTS);
        if (requestedArtists) {
            if (Array.isArray(requestedArtists)) {
                const index = requestedArtists.indexOf(artist);
                if (index < 0) {
                    requestedArtists.push(artist);
                } else {
                    // if exists push back
                    requestedArtists.splice(index, 1);
                    requestedArtists.push(artist);
                }
            }
            yield call(Storage.set, REQUESTED_ARTISTS, requestedArtists);
        } else {
            yield call(Storage.set, REQUESTED_ARTISTS, [artist]);
        }
    }
}

export function* setLatestRequestedArtistToCache(artist) {
    if (artist && _.isString(artist)) {
        yield call(Storage.set, LATEST_ARTIST, artist);
    }
}

export function* startup() {
    yield fork(firstTime);
    const {artist: selectedArtist} = yield select(nextArtistSelector);
    if (selectedArtist) {
        yield fork(mainSaga, selectedArtist);
    }
}

function* mainSaga(artist) {
    if (artist) {
        yield put(actions.fetchProgressArtist(artist));
        const songs = yield call(fetchSongs, artist);
        if (songs.length !== 0) {
            yield fork(setRequestedArtistToCache, artist);
            yield fork(setLatestRequestedArtistToCache, artist);
            yield fork(fetchArtists, artist);
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