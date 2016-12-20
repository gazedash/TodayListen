import artistSagas from "../sagas/artist";
import {fork} from "redux-saga/effects";

export default function* root() {
    yield [
        // mainSaga... which calls artist saga
        fork(artistSagas),
        // fork(songsSagas),
        // fork(videoSagas),
    ]
}