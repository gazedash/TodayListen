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

export function requestVideo(query) {
    return {
        type: REQUEST_VIDEO,
        query,
    }
}

export function receiveVideo(query, json) {
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
