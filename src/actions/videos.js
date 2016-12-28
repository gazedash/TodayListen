export const REQUEST_VIDEO = 'REQUEST_VIDEO';
export const RECEIVE_VIDEO = 'RECEIVE_VIDEO';
export const INVALIDATE_VIDEO = 'INVALIDATE_VIDEO';

export function requestVideo(data) {
    return {
        type: REQUEST_VIDEO,
        ...data,
    }
}

export function receiveVideo(data, json) {
    const {items = [], ...rest} = json;
    return {
        type: RECEIVE_VIDEO,
        ...rest,
        ...data,
        videos: items.map((video) => {
            return video.id.videoId;
        }),
        receivedAt: Date.now(),
    }
}
