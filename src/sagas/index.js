import artistSagas from "../sagas/artist";
import songsSagas from "../sagas/songs";
import videoSagas from "../sagas/videos";
import {fork} from "redux-saga/effects";

export default function* root() {
    yield [
        fork(artistSagas),
        // fork(songsSagas),
        // fork(videoSagas),
    ]
}