import fetch from "isomorphic-fetch";
import {youTube} from "../api/youtube_api";
import {put, call} from "redux-saga/effects";
import * as actions from "../actions/videos";

function fetchVideoApi(query) {
    const getQuery = youTube.search(query);
    return fetch(getQuery)
        .then(response => {
            return response.json();
        });
}

export function* fetchVideo(data) {
    yield put(actions.requestVideo(data));
    const video = yield call(fetchVideoApi, data.song);
    yield put(actions.receiveVideo(data, video));
}
