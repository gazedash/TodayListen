export const REQUEST_SIMILAR_ARTISTS = 'REQUEST_SIMILAR_ARTISTS';
export const RECEIVE_SIMILAR_ARTISTS = 'RECEIVE_SIMILAR_ARTISTS';
export const SELECT_ARTIST = 'SELECT_ARTIST';
export const INVALIDATE_ARTIST = 'INVALIDATE_ARTIST';
export const NEXT_ARTIST = 'NEXT_ARTIST';

export function selectArtist(artist) {
    return {
        type: SELECT_ARTIST,
        artist,
    }
}

export function nextArtist(artist) {
    return {
        type: NEXT_ARTIST,
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

export function receiveSimilar(artist, {similarartists = {}, ...data}) {
    const {artist: items = [], ...rest} = similarartists;

    return {
        ...data,
        ...rest,
        type: RECEIVE_SIMILAR_ARTISTS,
        artist,
        items,
        receivedAt: Date.now(),
    }
}

