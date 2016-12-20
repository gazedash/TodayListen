import fetch from "isomorphic-fetch";
import _ from "lodash";
import {youTube} from "../api/youtube_api";
import {take, put, call, fork, select} from "redux-saga/effects";
import * as actions from "../actions/videos";
import {popularSongsSelector, suggestedVideosSelector, selectedArtistSelector} from "../selectors/index";
import {takeEvery} from "redux-saga";

function fetchVideoApi(query) {
    const getQuery = youTube.search(query);
    return fetch(getQuery)
        .then(response => {
            return response.json();
        });
}

export function* fetchVideo(query) {
    yield put(actions.requestVideo(query));
    const video = yield call(fetchVideoApi, query);
    yield put(actions.receiveVideo(query, video));
}

export function* fetchVideosList (videos) {
    yield videos.map((video) => {
        return call(fetchVideo, video)
    });
}

export function* invalidateVideos() {
    yield takeEvery(actions.INVALIDATE_VIDEO, fetchVideosList);
}

export function* nextVideosChange() {
    while(true) {
        const prevVideos = yield select(suggestedVideosSelector);
        const artist = yield select(selectedArtistSelector);
        const newVideos = yield select(suggestedVideosSelector);
        if(prevVideos !== newVideos && !newVideos[artist])
            yield fork(fetchVideosList, newVideos)
    }
}

export function* startup() {
    const songs = yield select(popularSongsSelector);
    if (!_.isEmpty(songs)) {
        yield fork(fetchVideosList, songs);
    }
}

export default function* root() {
    yield fork(startup);
    yield fork(nextVideosChange);
    yield fork(invalidateVideos);
}