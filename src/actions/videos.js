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
    const {items = [], ...data} = json;

    return {
        ...data,
        type: RECEIVE_VIDEO,
        query,
        videos: items.map((video) => {
            return video.id.videoId;
        }),
        receivedAt: Date.now(),
    }
}
