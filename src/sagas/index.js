import artistSagas from "../sagas/artist";
import {fork} from "redux-saga/effects";

export default function* root() {
    yield [
        fork(artistSagas),
    ]
}