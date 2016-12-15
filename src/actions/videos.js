import _ from 'lodash';
import {youTube} from "../constants/youtube_api";

export const REQUEST_VIDEO = 'REQUEST_VIDEO';
export const RECEIVE_VIDEO = 'RECEIVE_VIDEO';
export const INVALIDATE_VIDEO = 'INVALIDATE_VIDEO';

export function invalidateVideo(query) {
    return {
        type: INVALIDATE_VIDEO,
        query,
    }
}

function requestVideo(query) {
    return {
        type: REQUEST_VIDEO,
        query,
    }
}

function receiveVideo(query, json) {
    const videos = _.map(_.get(json, "items"), (video) => {
        return _.get(video, ["id", "videoId"]);
    });

    return {
        type: RECEIVE_VIDEO,
        query,
        videos,
        receivedAt: Date.now(),
    }
}

function fetchVideo(query) {
    return dispatch => {
        dispatch(requestVideo(query));
        const getQuery = youTube.search(query);
        return fetch(getQuery)
            .then(response => {
                return response.json();
            })
            .then(json => dispatch(receiveVideo(query, json)));
    }
}

function shouldFetchVideo(state, query) {
    // TODO: check
    const video = _.get(state, ['suggestedVideo', query]);
    if (!video && _.isString(query) && query) {
        return true;
    } else if (state.isFetching) {
        return false;
    } else {
        return state.didInvalidate;
    }
}

export function fetchVideoIfNeeded(query) {
    return (dispatch, getState) => {
        if (shouldFetchVideo(getState(), query)) {
            return dispatch(fetchVideo(query));
        }
    }
}