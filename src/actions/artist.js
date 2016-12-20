import _ from 'lodash';

export const REQUEST_SIMILAR_ARTISTS = 'REQUEST_SIMILAR_ARTISTS';
export const RECEIVE_SIMILAR_ARTISTS = 'RECEIVE_SIMILAR_ARTISTS';
export const SELECT_ARTIST = 'SELECT_ARTIST';
export const INVALIDATE_ARTIST = 'INVALIDATE_ARTIST';

export function selectArtist(artist) {
    return {
        type: SELECT_ARTIST,
        artist,
    }
}

export function invalidateArtist(artist) {
    return {
        type: INVALIDATE_ARTIST,
        artist,
    }
}


export function requestSimilar(artist) {
    return {
        type: REQUEST_SIMILAR_ARTISTS,
        artist,
    }
}

export function receiveSimilar(artist, json) {
    const {similarartists, ...data} = json;

    return {
        ...data,
        type: RECEIVE_SIMILAR_ARTISTS,
        artist,
        items: _.get(similarartists, ['artist'], []),
        receivedAt: Date.now(),
    }
}

