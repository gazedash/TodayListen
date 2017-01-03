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

function fetchTopAlbumsApi(artist) {
    const getPopular = lastFm.getTopAlbums(artist);
    return fetch(getPopular)
        .then(response => response.json())
        .then(json => {
            return _.get(json, ['topalbums', 'album'], []);
        });
}

function fetchAlbumTracksApi(artist, album) {
    const getTracks = lastFm.getAlbumTracks(artist, album);
    return fetch(getTracks)
        .then(response => response.json())
        .then(json => {
            const songs = _.get(json, ['album', 'tracks', 'track'], []);
            return songs.map((song) => ({artist: artist, song: `${artist} - ${song.name}`}));
        });
}

export function* fetchSongs(artist) {
    yield put(actions.requestPopular(artist));
    const songs = yield call(fetchSongsApi, artist);
    yield put(actions.receivePopular(artist, songs));
    return songs;
}

export function* fetchTopAlbums(artist) {
    yield put(actions.requestTopAlbums(artist));
    const songs = yield call(fetchTopAlbumsApi, artist);
    yield put(actions.receiveTopAlbums(artist, songs));
    return songs;
}

export function* fetchAlbumTracks(artist, album) {
    yield put(actions.requestAlbumTracks(artist, album));
    const songs = yield call(fetchAlbumTracksApi, artist, album);
    yield put(actions.receiveAlbumTracks(artist, album, songs));
    return songs;
}