import { take, put, call, fork, select } from 'redux-saga/effects';

export default function* root() {
    console.log('Hello Sagas!');
}